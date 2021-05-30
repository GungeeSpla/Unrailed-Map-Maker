import * as C from './constants.js';
import * as U from './utilities.js';
import I from './instances.js';
import map from './map.js';
import Cell from './Cell.js';
import filer from './filer.js';
import train from './train.js';
import logger from './logger.js';
import storage from './storage.js';
import toaster from './toaster.js';
import highlight from './highlight.js';
import tempstate from './tempstate.js';


(() => {


	/** my_modal_window
	 */
	const my_modal_window = {

		/** .close()
		 */
		close(callback) {
			I.main_window.classList.remove('blur');
			I.modal_window.classList.add('hidden');
			I.modal_window.innerHTML = '';
		},

		/** .open(type)
		 */
		open(type) {
			this.open_func[type].call(this);
		},

		/** .open_func
		 */
		open_func: {

			/** .common({ title, classname, set_contents, onclose })
			 */
			common(opt) {
				// モーダルウィンドウを開く
				I.main_window.classList.add('blur');
				I.modal_window.classList.remove('hidden');

				// 中身を作成する(クリックしてもその下のウィンドウにイベントが伝搬しないようにする)
				const container = U.create_elm('div.modal-container');
				if (opt.classname) {
					container.classList.add(opt.classname);
				}
				container.on('click', (e) => { e.stopPropagation() });

				// タイトルを作成する
				if (opt && opt.title) {
					U.create_elm('h4').text(opt.title).appendTo(container);
				}

				// コンテンツとフッターのブロックを作って挿入
				const content_div = U.create_elm('div');
				const footer_div = U.create_elm('div');
				container.append(content_div, footer_div);

				if (opt && opt.set_contents) {
					opt.set_contents(container, content_div, footer_div);
				}

				// 閉じるボタンを作成
				const close_button = U.create_elm('button.close').text( U.get_lang('toolbar-close') ).appendTo(footer_div);
				const close_cross = U.create_elm('div.cross').appendTo(footer_div);
				close_button.on('click', () => {
					if (opt.onclose) opt.onclose();
					this.close();
				});
				close_cross.on('click', () => {
					if (opt.onclose) opt.onclose();
					this.close();
				});

				// 作成した中身をモーダルウィンドウに追加する
				I.modal_window.append(container);
			},

			/** .help()
			 */
			help() {
				this.open_func.common.call(this, {
					set_contents: (container, content_div, footer_div) => {
						container.classList.add('help');
						const help = U.get_elm('#help-' + I.lang_key);
						content_div.innerHTML = help.innerHTML;
					},
				});
			},

			/** .share()
			 */
			share() {

				// マップを文字列化する
				const data = map.to_str();

				// 共有URL
				const share_url = location.href.split('?')[0] + '?share=' + data;

				this.open_func.common.call(this, {
					title: U.get_lang('toolbar-share'),
					set_contents: (container, content_div, footer_div) => {

						// 共有URLと埋め込み用のタグのブロックを作る
						// 内容はほとんど共通しているのでforEachでまとめる
						['share-url', 'embed-tag'].forEach((id, i) => {
							const sub_container = U.create_elm(`div.textarea-container.${id}`).appendTo(content_div);
							const h5 = U.create_elm('h5').text(U.get_lang(`toolbar-${id}`));
							const input = U.create_elm(`textarea#${id}`);
							const button = U.create_elm('button.copy').text(U.get_lang('toolbar-copy'));
							sub_container.append(h5, input, button);

							// コピーイベントをセット
							button.on('click', (e) => {
								const ret = U.copy_str_to_clipboard(input.value);
								if (ret) {
									input.select();
									toaster.success( U.get_lang('toaster-success-copy') );
								}
							});

							// 共有URLの場合
							if (id === 'share-url') {
								input.textContent = share_url;
								sub_container.append(U.create_elm('hr'));
							}
						});

						// 埋め込み用のタグを更新する関数
						function update_embed_tag() {
							const x_num = I.map_cell[0].length;
							const y_num = I.map_cell.length;
							let cell_size;
							let embed_width;
							let embed_height;
							let embed_url;
							if (I.save_data.embed_option.embed_size === 'cell-size') {
								// セルサイズを固定する設定の場合
								cell_size = Math.max(1, I.save_data.embed_option.cell_size);
								embed_width = x_num * cell_size;
								embed_height = y_num * cell_size;
								embed_url = location.href.split('?')[0] + 'emb.html?cellsize='+cell_size+'&share=' + data;
							} else {
								// セルサイズではなく全体のマップサイズを固定する設定の場合
								embed_width = Math.max(1, Math.ceil(I.save_data.embed_option.map_size));
								embed_height = Math.max(1, Math.ceil(I.save_data.embed_option.map_size * y_num / x_num));
								embed_url = location.href.split('?')[0] + 'emb.html?share=' + data;
							}
							// <iframe>タグのouterHTMLを作成して中身を変える
							const embed_tag = `<iframe frameborder="0" width="${embed_width}" height="${embed_height}" src="${embed_url}"></iframe>`;
							container.querySelector('#embed-tag').value = embed_tag;
						}

						// オプションの追加
						{
							// ラジオボタンの追加
							// 選択肢1. マスの大きさを指定する
							const opt1 = U.create_elm('div.radio-container').appendTo(content_div);
							opt1.innerHTML = '<input type="radio" name="embed-size" id="embed-size-1" key="cell-size"><label for="embed-size-1"><span>マスの大きさを指定する</span>(<input type="text" id="embed-cell-size">px)</label>'
							// 選択肢2. マップの大きさを指定する
							const opt2 = U.create_elm('div.radio-container').appendTo(content_div);
							opt2.innerHTML = '<input type="radio" name="embed-size" id="embed-size-2" key="map-size"><label for="embed-size-2"><span>マップの横幅を指定する</span>(<input type="text" id="embed-map-size">px)</label>'
							// セーブデータからチェックが入っているほうの要素を特定、念のためif文の中でチェックを入れる
							const check_target = content_div.querySelector(`[name=embed-size][key=${I.save_data.embed_option.embed_size}]`);
							if (check_target) {
								check_target.checked = true;
							}
							// ラジオボタンが変更されたときにその内容を保存して埋め込み用タグを書き換える
							content_div.querySelectorAll('[name=embed-size]').forEach((elm) => {
								elm.on('change', (e) => {
									I.save_data.embed_option.embed_size = elm.getAttribute('key');
									storage.save();
									update_embed_tag();
								});
							});
							// マスの大きさを指定する場合のマスのサイズを<input type="text">で指定できるようにする
							const text1 = content_div.querySelector('#embed-cell-size');
							text1.value = I.save_data.embed_option.cell_size;
							text1.on('input', (e) => {
								const num = parseInt(text1.value);
								if (!isNaN(num)) {
									I.save_data.embed_option.cell_size = num;
									storage.save();
									update_embed_tag();
								}
							});
							// マップの大きさを指定する場合のマスのサイズを<input type="text">で指定できるようにする
							const text2 = content_div.querySelector('#embed-map-size');
							text2.value = I.save_data.embed_option.map_size;
							text2.on('input', (e) => {
								const num = parseInt(text2.value);
								if (!isNaN(num)) {
									I.save_data.embed_option.map_size = num;
									storage.save();
									update_embed_tag();
								}
							});
						}
						update_embed_tag();
					},
				});
			},

			/** .open()
			 */
			open() {
					this.open_func.common.call(this, {
					title: U.get_lang('toolbar-open'),
					set_contents: (container, content_div, footer_div) => {
						const keys = Object.keys(I.save_data.file).sort().reverse();
						const list = [];
						if (I.save_data.file['autosave']) {
							list.push(I.save_data.file['autosave']);
						}
						keys.forEach((key) => {
							if (key !== 'autosave') {
								list.push(I.save_data.file[key]);
							}
						});
						const table = U.create_elm('table.load').appendTo(content_div);
						const tr = U.create_elm('tr');
						U.create_elm('th').text( U.get_lang('open-table-title') ).appendTo(tr);
						U.create_elm('th').text( U.get_lang('open-table-created') ).appendTo(tr);
						U.create_elm('th').text( U.get_lang('open-table-modified') ).appendTo(tr);
						U.create_elm('th').text( U.get_lang('open-table-open') ).appendTo(tr);
						U.create_elm('th').text( U.get_lang('open-table-delete') ).appendTo(tr);
						table.append(tr);
						list.forEach((file) => {
							const tr = U.create_elm('tr');
							const b1 = U.create_elm('button.delete').text( U.get_lang('toolbar-open') );
							const b2 = U.create_elm('button.delete').text( U.get_lang('toolbar-delete') );
							b1.on('click', (e) => {
								filer.load(file.created);
								toaster.success( U.get_lang('toaster-success-load') );
								this.close();
							});
							b2.on('click', (e) => {
								if (confirm( U.get_lang('confirm-delete').replace('{name}', file.title) )) {
									delete I.save_data.file[ file.created ];
									if (I.save_data.last_file_key === file.created) {
										I.save_data.last_file_key = null;
									}
									if (I.current_file_key === file.created) {
										I.current_file_key = null;
									}
									tr.classList.add('delete');
									storage.save();
									setTimeout(() => {
										tr.remove();
									}, 300);
								}
							});
							if (file.created === 'autosave') b2.style.setProperty('display', 'none');
							U.create_elm('td.title').text(file.title).appendTo(tr).on('click', (e) => {
								filer.load(file.created);
								toaster.success( U.get_lang('toaster-success-load') );
								this.close();
							});
							U.create_elm('td.created').text((file.created !== 'autosave') ? U.unix_to_str(file.created) : '-').appendTo(tr);
							U.create_elm('td.modified').text(U.unix_to_str(file.modified)).appendTo(tr);
							U.create_elm('td.load').appendTo(tr).append(b1);
							U.create_elm('td.delete').appendTo(tr).append(b2);
							table.append(tr);
						});
					},
				});
			},

			/** .save()
			 */
			save() {
				this.open_func.common.call(this, {
					title: U.get_lang('toolbar-save-as'),
					set_contents: (container, content_div, footer_div) => {
						container.on('keyup', (e) => { e.stopPropagation() });
						container.on('keydown', (e) => { e.stopPropagation() });
						container.on('click', (e) => { e.stopPropagation() });
						const input = U.create_elm('input[type=text]').val('Untitled!').appendTo(content_div);
						const button = U.create_elm('button.save').text( U.get_lang('toolbar-save') ).appendTo(content_div);
						button.on('click', (e) => {
							const title = input.value;
							filer.save_as(title);
							toaster.success( U.get_lang('toaster-success-save') );
							close();
						});
					},
				});
			},

			/** .train()
			 */
			train() {
				this.open_func.common.call(this, {
					title: U.get_lang('toolbar-train'),
					classname: 'train',
					onclose: () => {
						const names = [];
						U.get_elms('ul.train li[wagon]').forEach((elm) => {
							const name = elm.attr('wagon');
							names.push(name);
						});
						names.reverse();
						train.update_wagons(names);
						map.onchange();
					},
					set_contents: (container, content_div, footer_div) => {
						let select_wagon = null;
						let replace_wagon = null;
						
						// 列車
						const train_ul = U.create_elm('ul.train').appendTo(content_div);
						
						// ゴミ箱
						const trash = U.create_elm('li.trash');
						trash.css('background-image', 'url(./assets/img/wagon/trash-close.png)');
						trash.on('mouseenter', () => {
							if (select_wagon) {
								trash.css('background-image', 'url(./assets/img/wagon/trash-open.png)');
							}
						});
						trash.on('mouseleave', () => {
							trash.css('background-image', 'url(./assets/img/wagon/trash-close.png)');
						});
						trash.on('mouseup', () => {
							if (select_wagon) {
								select_wagon.remove();
								trash.css('background-image', 'url(./assets/img/wagon/trash-close.png)');
							}
						});
						train_ul.append(trash);
						
						// ワゴン追加関数
						function add(name) {
							const li = U.create_elm('li[wagon='+name+']');
							li.css('background-image', 'url(./assets/img/wagon/'+name+'.png)');
							li.on('mousedown', () => {
								select_wagon = li;
								select_wagon.css('opacity', 0.5);
								container.classList.add('dragging');
							}).on('mousemove', (e) => {
								if (select_wagon) {
									const list = train_ul.querySelectorAll('li');
									const num_a = Array.prototype.indexOf.call(list, select_wagon);
									const num_b = Array.prototype.indexOf.call(list, li);
									const rect = li.getBoundingClientRect();
									li.css('border-left-color', 'transparent');
									li.css('border-right-color', 'transparent');
									if ((e.clientX - rect.left) < (li.clientWidth / 2)) {
										if (num_a !== num_b && num_a !== num_b - 1) {
											li.css('border-left-color', '#2196f3');
											li.css('border-right-color', 'transparent');
										}
									} else {
										if (num_a !== num_b && num_a !== num_b + 1) {
											li.css('border-left-color', 'transparent');
											li.css('border-right-color', '#2196f3');
										}
									}
								}
							}).on('mouseenter', (e) => {
								if (replace_wagon) {
									const name = replace_wagon.attr('wagon');
									li.css('background-image', 'url(./assets/img/wagon/'+name+'.png)');
									li.css('opacity', 0.5);
								}
							}).on('mouseleave', () => {
								if (select_wagon) {
									li.css('border-left-color', 'transparent');
									li.css('border-right-color', 'transparent');
								} else if (replace_wagon) {
									const name = li.attr('wagon');
									li.css('background-image', 'url(./assets/img/wagon/'+name+'.png)');
									li.css('opacity', 1);
								}
							}).on('mouseup', (e) => {
								if (select_wagon) {
									const rect = li.getBoundingClientRect();
									if ((e.clientX - rect.left) < (li.clientWidth / 2)) {
										li.parentNode.insertBefore(select_wagon, li);
									} else {
										li.parentNode.insertBefore(select_wagon, li.nextSibling);
									}
									li.css('border-left-color', 'transparent');
									li.css('border-right-color', 'transparent');
									select_wagon.css('opacity', 1);
									select_wagon = null;
									e.stopPropagation();
								} else if (replace_wagon) {
									const name = replace_wagon.attr('wagon');
									li.css('background-image', 'url(./assets/img/wagon/'+name+'.png)');
									li.css('opacity', 1);
									li.attr('wagon', name);
									replace_wagon.css('opacity', 1);
									replace_wagon = null;
								}
							});
							train_ul.insertBefore(li, trash.nextSibling);
						}
						
						// コンテナにイベントをセット
						container.on('mouseleave mouseup', (e) => {
							if (select_wagon) {
								select_wagon.remove();
								select_wagon = null;
							}
							if (replace_wagon) {
								replace_wagon.css('opacity', 1);
								replace_wagon = null;
							}
							container.classList.remove('dragging');
						});
						
						// 初期ワゴン追加
						train.wagon_names.forEach((name) => {
							add(name);
						});
						
						// パレット
						const palette_ul = U.create_elm('ul.wagon-palette').appendTo(content_div);
						let t1, t2;
						C.WAGON_NAMES.forEach((name) => {
							const li = U.create_elm('li[wagon='+name+']');
							li.css('background-image', 'url(./assets/img/wagon/'+name+'.png)');
							li.on('click', () => {
								t2 = new Date().getTime();
								if (t2 - t1 < 100) {
									add(name);
								}
							}).on('mousedown', () => {
								t1 = new Date().getTime();
								li.css('opacity', 0.5);
								replace_wagon = li;
								container.classList.add('dragging');
							}).on('mouseup', () => {
								li.css('opacity', 1);
								replace_wagon = null;
							});
							palette_ul.append(li);
						});
						
						const desc_ul = U.create_elm('ul.description').appendTo(content_div);
						U.create_elm('li').text( U.get_lang('train-edit-description-1') ).appendTo(desc_ul);
						U.create_elm('li').text( U.get_lang('train-edit-description-2') ).appendTo(desc_ul);
						U.create_elm('li').text( U.get_lang('train-edit-description-3') ).appendTo(desc_ul);
						U.create_elm('li').text( U.get_lang('train-edit-description-4') ).appendTo(desc_ul);
						
						// セーブデータ
						/*
						const save_h5 = U.create_elm('h5').text('プリセット(直近5件)').appendTo(content_div);
						const save_button = U.create_elm('button').text('現在の列車を保存').appendTo(content_div).on('click', (e) => {
						});
						const save_ul = U.create_elm('ul.save-palette').appendTo(content_div);
						[
							'abbbaba',
							'abbabab',
							'abbbaba',
							'abbabab',
							'abbbaba',
						].forEach((str) => {
							const li = U.create_elm('li');
							for (let i = 0; i < str.length; i++) {
								const num = str[i].toNumber();
								const name = C.WAGON_NAMES[num];
								const div = U.create_elm('div');
								div.css('background-image', 'url(./assets/img/wagon/'+name+'.png)');
								li.append(div);
							}
							li.on('click', () => {
							});
							save_ul.append(li);
						});
						*/
					},
				});
			},
		}
	};


	/** create_toolbar()
	 * ツールバーを作成します。
	 */
	function create_toolbar() {

		const toolbar = U.create_elm('div#toolbar-wapper');

		/** ファイルメニュー
		 -------------------------------*/
		{
			const wrapper = U.create_elm('div.tool-container.file-tool');
			const h4 = U.create_elm('h4').text( U.get_lang('toolbar-file') ).appendTo(wrapper);
			const input = U.create_elm('input#file-name[type=text]');
			input.on('click', (e) => {
			});
			wrapper.append(input);
			const button_save = U.create_elm('button#file-save.main-button').text( U.get_lang('toolbar-save') ).appendTo(wrapper);
			button_save.on('click', (e) => {
				if (button_save.classList.contains('enabled')) {
					filer.save();
					toaster.success( U.get_lang('toaster-success-save') );
				}
			});
			U.create_elm('button#file-save-as.main-button').text( U.get_lang('toolbar-save-as') ).appendTo(wrapper).on('click', (e) => {
				my_modal_window.open('save');
			});
			U.create_elm('button#file-load.main-button').text( U.get_lang('toolbar-open') ).appendTo(wrapper).on('click', (e) => {
				my_modal_window.open('open');
			});
			U.create_elm('button#file-new.main-button').text( U.get_lang('toolbar-new') ).appendTo(wrapper).on('click', (e) => {
				map.create_new();
			});
			U.create_elm('button.main-button').text( U.get_lang('toolbar-share') ).appendTo(wrapper).on('click', (e) => {
				my_modal_window.open('share');
			});
			U.create_elm('button.main-button').text( U.get_lang('toolbar-download-image') ).appendTo(wrapper).on('click', (e) => {
				map.download_as_image();
			});
			U.create_elm('button.main-button').text( U.get_lang('toolbar-help') ).appendTo(wrapper).on('click', (e) => {
				my_modal_window.open('help');
			});
			U.create_elm('button.main-button').text( U.get_lang('toolbar-undo') ).appendTo(wrapper).on('click', (e) => {
				tempstate.undo();
			});
			U.create_elm('button.main-button').text( U.get_lang('toolbar-redo') ).appendTo(wrapper).on('click', (e) => {
				tempstate.redo();
			});
			wrapper.append(U.create_elm('div.split'));
			toolbar.append(wrapper);
		}
		/** マップサイズ
		 -------------------------------*/
		{
			const wrapper = U.create_elm('div.tool-container');
			const h4 = U.create_elm('h4').text( U.get_lang('toolbar-map-size') ).appendTo(wrapper);
			['x', 'y'].forEach((dir) => {
				const div = U.create_elm(`div.map-size-container[dir=${dir}]`);
				const input = U.create_elm('input.map-size[type=text]');
				input.value = (dir === 'x') ? C.DEFAULT_WIDTH : C.DEFAULT_HEIGHT;
				input.on('keydown', (e) => {
					if (e.key === 'Enter') {
						input.blur();
					}
				});
				input.on('change', (e) => {
					let val = parseInt(input.value);
					val = Math.max(1, Math.min(99, val));
					input.value = val;
					map.change_map_size();
				});
				const button_1 = U.create_elm('button.input-side-button.map-size-button-1').text('-');
				button_1.on('click', (e) => {
					let val = parseInt(input.value);
					val = Math.max(1, Math.min(99, val - 1));
					input.value = val;
					map.change_map_size();
				});
				const button_2 = U.create_elm('button.input-side-button.map-size-button-2').text('+');
				button_2.on('click', (e) => {
					let val = parseInt(input.value);
					val = Math.max(1, Math.min(99, val + 1));
					input.value = val;
					map.change_map_size();
				});
				div.append(input, button_1, button_2);
				wrapper.append(div);
			});
			wrapper.append(U.create_elm('div.split'));
			toolbar.append(wrapper);
		}
		/** グリッド
		 -------------------------------*/
		{
			const wrapper = U.create_elm('div.tool-container');
			{
				const input = U.create_elm('input[type=checkbox][id=input-grid]');
				input.on('change', (e) => {
					if (input.checked) {
						I.save_data.option.is_enabled_grid = true;
						I.main_window.classList.add('grid');
					} else {
						I.save_data.option.is_enabled_grid = false;
						I.main_window.classList.remove('grid');	
					}
					storage.save();
				});
				if (I.save_data.option.is_enabled_grid) {
					input.checked = true;
					input.trigger('change');
				}
				const label = U.create_elm('label[for=input-grid]').text( U.get_lang('toolbar-grid') );
				wrapper.append(input, label);
			}
			wrapper.append(U.create_elm('div.split'));
			{
				const input = U.create_elm('input[type=checkbox][id=input-count]');
				input.on('change', (e) => {
					if (input.checked) {
						I.save_data.option.is_enabled_count = true;
						I.count_wrapper.classList.remove('hidden');	
					} else {
						I.save_data.option.is_enabled_count = false;
						I.count_wrapper.classList.add('hidden');	
					}
					storage.save();
				});
				if (I.save_data.option.is_enabled_count) {
					input.checked = true;
					input.trigger('change');
				}
				const label = U.create_elm('label[for=input-count]').text( U.get_lang('toolbar-count') );
				wrapper.append(input, label);
			}
			wrapper.append(U.create_elm('div.split'));
			toolbar.append(wrapper);
			toolbar.append(U.create_elm('br'));
		}
		/** 地形パレット
		 -------------------------------*/
		{
			const wrapper = U.create_elm('div.tool-container.palette');
			const h4 = U.create_elm('h4').text( U.get_lang('toolbar-grounds') ).appendTo(wrapper);
			const ul = U.create_elm('ul');
			[
				C.LAND_NONE,
				C.LAND_PLAIN,
				C.LAND_WATER,
				C.LAND_BRIDGE,
				C.LAND_TREE,
				C.LAND_IRON,
				C.LAND_ROCK,
				// C.LAND_STEAM,
				// C.LAND_THORN,
				C.LAND_STATION_L,
				C.LAND_STATION_F,
				C.LAND_COLOR_1,
			].forEach((land_type) => {

				const li = U.create_elm(`li.palette-item[land-type=${land_type}]`);
				li.setAttribute('title', U.get_lang('palette-' + land_type));

				// クリック時の動作
				li.on('click', (e) => {
					U.get_elms('.selected-item').forEach((elm) => {
						elm.classList.remove('selected-item');
					});
					li.classList.add('selected-item');
					if (land_type === C.LAND_COLOR_1) {
						I.mouse_state.current_palette_item = C.LAND_COLOR_1.replace('1', li.getAttribute('color-id'));
					} else {
						I.mouse_state.current_palette_item = land_type;
					}
					I.mouse_state.current_palette_type = C.PALETTE_SELECT_LAND;
				});

				// サブメニューの作成
				switch (land_type) {
				case C.LAND_COLOR_1:
				{
					// 記号
					li.setAttribute('color-id', 1);
					li.on('mouseenter', (e) => {
						li.classList.add('hover');
					});
					li.on('mouseleave', (e) => {
						li.classList.remove('hover');
					});
					li.style.setProperty('background-image', `url(./assets/img/color/1.png)`);
					const sub_ul = U.create_elm('ul');
					sub_ul.style.setProperty('--count-x', '1');
					sub_ul.style.setProperty('--count-y', '10');
					//sub_ul.style.setProperty('left', 'initial');
					//sub_ul.style.setProperty('right', '-26px');
					for (let j = 1; j <= 10; j++) {
						const sub_li = U.create_elm('li');
						sub_li.style.setProperty('background-image', `url(./assets/img/color/${j}.png)`);
						sub_li.on('click', (e) => {
							U.get_elms('.selected-wrapper').forEach((elm) => {
								elm.classList.remove('selected-wrapper');
							});
							li.classList.add('selected-wrapper');
							li.classList.remove('hover');
							li.style.setProperty('background-image', `url(./assets/img/color/${j}.png)`);
							li.setAttribute('color-id', j);
						});
						sub_ul.append(sub_li);
					}
					li.append(sub_ul);
					break;
				}}

				ul.append(li);
			});
			wrapper.append(ul);
			wrapper.append(U.create_elm('div.split'));
			toolbar.append(wrapper);
		}
		/** 物資パレット
		 -------------------------------*/
		{
			const wrapper = U.create_elm('div.tool-container.palette');
			const h4 = U.create_elm('h4').text( U.get_lang('toolbar-items') ).appendTo(wrapper);
			const ul = U.create_elm('ul');
			[
				C.RESOURCE_ERASER,
				C.RESOURCE_C_RAIL,
				C.RESOURCE_WOOD,
				C.RESOURCE_IRON,
				C.RESOURCE_RAIL,
				C.RESOURCE_AXE,
				C.RESOURCE_PICKAXE,
				C.RESOURCE_BACKET,
				C.RESOURCE_DYNAMITE_1,
				C.RESOURCE_BOLT,
				/*C.RESOURCE_FACE,*/
			].forEach((resource_type, i) => {

				const dir = (1 <= i && i <= 4) ? 'plains' : 'common';
				const li = U.create_elm('li.palette-item');
				li.setAttribute('title', U.get_lang('palette-' + resource_type));
				const file = resource_type + ((resource_type.includes('rail')) ? '-rl' : '');
				li.style.setProperty('background-image', `url(./assets/img/${dir}/${file}.png)`);

				// クリック時の動作
				li.on('click', (e) => {
					U.get_elms('.selected-item').forEach((elm) => {
						elm.classList.remove('selected-item');
					});
					li.classList.add('selected-item');
					I.mouse_state.current_palette_type = C.PALETTE_SELECT_RESOURCE;
					switch (resource_type) {
					case C.RESOURCE_BACKET:
						I.mouse_state.current_palette_item = li.getAttribute('backet-state');
						break;
					case C.RESOURCE_DYNAMITE_1:
						I.mouse_state.current_palette_item = C.RESOURCE_DYNAMITE_1.replace('1', li.getAttribute('dynamite-level'));
						break;
					default:
						I.mouse_state.current_palette_item = resource_type;
						break;
					}
				});

				// サブメニューの作成
				switch (resource_type) {
				case C.RESOURCE_BACKET:
				{
					// バケツ
					li.setAttribute('backet-state', C.RESOURCE_BACKET);
					li.on('mouseenter', (e) => {
						li.classList.add('hover');
					});
					li.on('mouseleave', (e) => {
						li.classList.remove('hover');
					});
					li.style.setProperty('background-image', `url(./assets/img/common/resource-backet.png)`);
					const sub_ul = U.create_elm('ul');
					sub_ul.style.setProperty('--count-y', '2');
					[
						C.RESOURCE_BACKET,
						C.RESOURCE_BACKET_EMPTY
					].forEach((type) => {
						const sub_li = U.create_elm('li');
						sub_li.style.setProperty('background-image', `url(./assets/img/common/${type}.png)`);
						sub_li.on('click', (e) => {
							U.get_elms('.selected-wrapper').forEach((elm) => {
								elm.classList.remove('selected-wrapper');
							});
							li.classList.add('selected-wrapper');
							li.classList.remove('hover');
							li.style.setProperty('background-image', `url(./assets/img/common/${type}.png)`);
							li.setAttribute('backet-state', type);
							li.setAttribute('title', U.get_lang('palette-' + type));
						});
						sub_ul.append(sub_li);
					});
					li.append(sub_ul);
					break;
				}
				case C.RESOURCE_DYNAMITE_1:
				{
					// ダイナマイト
					li.setAttribute('dynamite-level', 1);
					li.setAttribute('id', 'resource-dynamite');
					li.on('mouseenter', (e) => {
						li.classList.add('hover');
					});
					li.on('mouseleave', (e) => {
						li.classList.remove('hover');
					});
					li.style.setProperty('background-image', `url(./assets/img/common/dynamite-1.png)`);
					const sub_ul = U.create_elm('ul');
					sub_ul.style.setProperty('--count-y', '9');
					for (let j = 1; j <= 9; j++) {
						const sub_li = U.create_elm('li');
						sub_li.style.setProperty('background-image', `url(./assets/img/common/dynamite-${j}.png)`);
						sub_li.setAttribute('title', U.get_lang('palette-resource-dynamite-' + j));
						sub_li.on('click', (e) => {
							U.get_elms('.selected-wrapper').forEach((elm) => {
								elm.classList.remove('selected-wrapper');
							});
							li.classList.add('selected-wrapper');
							li.classList.remove('hover');
							li.style.setProperty('background-image', `url(./assets/img/common/dynamite-${j}.png)`);
							li.setAttribute('dynamite-level', j);
							li.setAttribute('title', U.get_lang('palette-' + C.RESOURCE_DYNAMITE_1.replace('1', j)));
						});
						sub_ul.append(sub_li);
					}
					li.append(sub_ul);
					break;
				}
				case C.RESOURCE_FACE:
				{
					// 顔
					li.setAttribute('id', 'palette-face');
					li.setAttribute('face-id', 13);
					li.on('mouseenter', (e) => {
						li.classList.add('hover');
					});
					li.on('mouseleave', (e) => {
						li.classList.remove('hover');
					});
					li.style.setProperty('background-image', `url(./assets/img/face/face-13.png)`);
					const sub_ul = U.create_elm('ul');
					sub_ul.style.setProperty('--count-x', '8');
					sub_ul.style.setProperty('--count-y', '6');
					sub_ul.style.setProperty('left', 'initial');
					sub_ul.style.setProperty('right', '-29px');
					for (let j = 1; j <= 41; j++) {
						const sub_li = U.create_elm('li');
						sub_li.style.setProperty('background-image', `url(./assets/img/face/face-${j}.png)`);
						sub_li.on('click', (e) => {
							U.get_elms('.selected-wrapper').forEach((elm) => {
								elm.classList.remove('selected-wrapper');
							});
							li.classList.add('selected-wrapper');
							li.classList.remove('hover');
							li.style.setProperty('background-image', `url(./assets/img/face/face-${j}.png)`);
							li.setAttribute('face-id', j);
						});
						sub_ul.append(sub_li);
					}
					li.append(sub_ul);
					break;
				}}
				ul.append(li);
			});
			wrapper.append(ul);
			wrapper.append(U.create_elm('div.split'));
			toolbar.append(wrapper);
		}
		/** 記号パレット
		 -------------------------------*/
		{
			const wrapper = U.create_elm('div.tool-container.palette');
			const h4 = U.create_elm('h4').text( U.get_lang('toolbar-symbols') ).appendTo(wrapper);
			const ul = U.create_elm('ul');
			[
				C.SYMBOL_ERASER,
				C.SYMBOL_SYMBOL,
				C.SYMBOL_FACE,
			].forEach((resource_type, i) => {
				const li = U.create_elm('li.palette-item');
				li.setAttribute('title', U.get_lang('palette-' + resource_type));
				li.style.setProperty('background-image', `url(./assets/img/common/${resource_type}.png)`);

				// クリック時の動作
				li.on('click', (e) => {
					U.get_elms('.selected-item').forEach((elm) => {
						elm.classList.remove('selected-item');
					});
					li.classList.add('selected-item');
					I.mouse_state.current_palette_type = C.PALETTE_SELECT_SYMBOL;
					switch (resource_type) {
					case C.RESOURCE_BACKET:
						I.mouse_state.current_palette_item = li.getAttribute('backet-state');
						break;
					case C.RESOURCE_DYNAMITE_1:
						I.mouse_state.current_palette_item = C.RESOURCE_DYNAMITE_1.replace('1', li.getAttribute('dynamite-level'));
						break;
					default:
						I.mouse_state.current_palette_item = resource_type;
						break;
					}
				});

				// サブメニューの作成
				switch (resource_type) {
				case C.SYMBOL_SYMBOL:
				{
					li.setAttribute('id', 'palette-symbol');
					li.setAttribute('symbol-id', 10);
					li.on('mouseenter', (e) => {
						li.classList.add('hover');
					});
					li.on('mouseleave', (e) => {
						li.classList.remove('hover');
					});
					li.style.setProperty('background-image', `url(./assets/img/symbol/10.png)`);
					const sub_ul = U.create_elm('ul');
					sub_ul.style.setProperty('--count-x', '10');
					sub_ul.style.setProperty('--count-y', '5');
					sub_ul.style.setProperty('left', 'initial');
					sub_ul.style.setProperty('right', '-31px');
					for (let j = 0; j <= 49; j++) {
						const sub_li = U.create_elm('li');
						sub_li.style.setProperty('background-image', `url(./assets/img/symbol/${j}.png)`);
						sub_li.on('click', (e) => {
							U.get_elms('.selected-wrapper').forEach((elm) => {
								elm.classList.remove('selected-wrapper');
							});
							li.classList.add('selected-wrapper');
							li.classList.remove('hover');
							li.style.setProperty('background-image', `url(./assets/img/symbol/${j}.png)`);
							li.setAttribute('symbol-id', j);
						});
						sub_ul.append(sub_li);
					}
					li.append(sub_ul);
					break;
				}
				case C.SYMBOL_FACE:
				{
					li.setAttribute('id', 'palette-symbol-face');
					li.setAttribute('face-id', 13);
					li.on('mouseenter', (e) => {
						li.classList.add('hover');
					});
					li.on('mouseleave', (e) => {
						li.classList.remove('hover');
					});
					li.style.setProperty('background-image', `url(./assets/img/face/face-13.png)`);
					const sub_ul = U.create_elm('ul');
					sub_ul.style.setProperty('--count-x', '8');
					sub_ul.style.setProperty('--count-y', '6');
					sub_ul.style.setProperty('left', 'initial');
					sub_ul.style.setProperty('right', '-29px');
					for (let j = 1; j <= 41; j++) {
						const sub_li = U.create_elm('li');
						sub_li.style.setProperty('background-image', `url(./assets/img/face/face-${j}.png)`);
						sub_li.on('click', (e) => {
							U.get_elms('.selected-wrapper').forEach((elm) => {
								elm.classList.remove('selected-wrapper');
							});
							li.classList.add('selected-wrapper');
							li.classList.remove('hover');
							li.style.setProperty('background-image', `url(./assets/img/face/face-${j}.png)`);
							li.setAttribute('face-id', j);
						});
						sub_ul.append(sub_li);
					}
					li.append(sub_ul);
					break;
				}}
				ul.append(li);
			});
			wrapper.append(ul);
			wrapper.append(U.create_elm('div.split'));
			toolbar.append(wrapper);
		}
		/** 採掘パレット
		 -------------------------------*/
		{
			const wrapper = U.create_elm('div.tool-container.palette.mine-palette-wrapper');
			const h4 = U.create_elm('h4').text( U.get_lang('toolbar-mine-tools') ).appendTo(wrapper);
			const ul = U.create_elm('ul');
			[
				C.MINE_AXE,
				C.MINE_DYNAMITE,
			].forEach((type, i) => {
				const li = U.create_elm('li.palette-item');
				li.setAttribute('title', U.get_lang('palette-' + type));
				li.setAttribute('resource-type', type);
				li.style.setProperty('background-image', `url(./assets/img/common/${type}.png)`);
				li.on('click', (e) => {
					U.get_elms('.selected-item').forEach((elm) => {
						elm.classList.remove('selected-item');
					});
					li.classList.add('selected-item');
					I.mouse_state.current_palette_item = type;
					I.mouse_state.current_palette_type = C.PALETTE_SELECT_MINE;
				});
				if (type === C.MINE_DYNAMITE) {
					li.setAttribute('dynamite-level', 1);
					li.setAttribute('id', 'mine-dynamite');
					li.on('mouseenter', (e) => {
						li.classList.add('hover');
					});
					li.on('mouseleave', (e) => {
						li.classList.remove('hover');
					});
					li.style.setProperty('background-image', `url(./assets/img/common/dynamite-1.png)`);
					const sub_ul = U.create_elm('ul');
					for (let j = 1; j <= 9; j++) {
						const sub_li = U.create_elm('li');
						sub_li.style.setProperty('background-image', `url(./assets/img/common/dynamite-${j}.png)`);
						sub_li.on('click', (e) => {
							U.get_elms('.selected-wrapper').forEach((elm) => {
								elm.classList.remove('selected-wrapper');
							});
							li.classList.add('selected-wrapper');
							li.classList.remove('hover');
							li.style.setProperty('background-image', `url(./assets/img/common/dynamite-${j}.png)`);
							li.setAttribute('dynamite-level', j);
						});
						sub_ul.append(sub_li);
					}
					li.append(sub_ul);
				}
				ul.append(li);
			});
			wrapper.append(ul);
			wrapper.append(U.create_elm('div.split'));
			toolbar.append(wrapper);
		}
		/** 列車パレット
		 -------------------------------*/
		{
			const wrapper = U.create_elm('div.tool-container.palette.train-tool');
			const h4 = U.create_elm('h4').text( U.get_lang('toolbar-train') ).appendTo(wrapper);
			const ul = U.create_elm('ul');
			const li = U.create_elm('li.palette-item');
			li.setAttribute('title', U.get_lang('palette-train'));
			li.style.setProperty('background-image', `url(./assets/img/common/train.png)`);
			li.on('click', (e) => {
				U.get_elms('.selected-item').forEach((elm) => {
					elm.classList.remove('selected-item');
				});
				li.classList.add('selected-item');
				I.mouse_state.current_palette_item = 'train';
				I.mouse_state.current_palette_type = C.PALETTE_SELECT_TRAIN;
			});
			ul.append(li);
			wrapper.append(ul);
			let t1, t2, t3, t4;
			const u1 = 1;
			const u2 = 0.05;
			const d = 33;
			U.create_elm('button.main-button').text('≪').appendTo(wrapper).on('mousedown', (e) => {
				const unit = -u1;
				train.step(unit);
				t1 = setTimeout(() => {
					t1 = setInterval(() => { train.step(unit); }, d);
				}, 100);
			}).on('mouseup mouseleave', (e) => {
				clearInterval(t1);
				map.onchange();
			});
			U.create_elm('button.main-button').css('margin-left', '0').text('＜').appendTo(wrapper).on('mousedown', (e) => {
				const unit = -u2;
				train.step(unit);
				t2 = setTimeout(() => {
					t2 = setInterval(() => { train.step(unit); }, d);
				}, 100);
			}).on('mouseup mouseleave', (e) => {
				clearInterval(t2);
				map.onchange();
			});
			U.create_elm('button.main-button').css('margin-left', '0').text('＞').appendTo(wrapper).on('mousedown', (e) => {
				const unit = u2;
				train.step(unit);
				t3 = setTimeout(() => {
					t3 = setInterval(() => { train.step(unit); }, d);
				}, 100);
			}).on('mouseup mouseleave', (e) => {
				clearInterval(t3);
				map.onchange();
			});
			U.create_elm('button.main-button').css('margin-left', '0').text('≫').appendTo(wrapper).on('mousedown', (e) => {
				const unit = u1;
				train.step(unit);
				t4 = setTimeout(() => {
					t4 = setInterval(() => { train.step(unit); }, d);
				}, 100);
			}).on('mouseup mouseleave', (e) => {
				clearInterval(t4);
				map.onchange();
			});
			U.create_elm('button.main-button').text( U.get_lang('toolbar-train-reverse') ).appendTo(wrapper).on('click', (e) => {
				train.reverse();
				map.onchange();
			});
			U.create_elm('button.main-button').text( U.get_lang('toolbar-train-edit') ).appendTo(wrapper).on('click', (e) => {
				my_modal_window.open('train');
			});
			U.create_elm('button.main-button').text( U.get_lang('toolbar-train-remove') ).appendTo(wrapper).on('click', (e) => {
				train.remove();
				map.onchange();
			});
			wrapper.append(U.create_elm('div.split'));
			toolbar.append(wrapper);
		}
		I.main_window.append(toolbar);

	}


	/** window <keydown>
	 */
	window.addEventListener('keydown', (e) => {

		// シフトキーが押されたならば
		if (e.key === 'Shift' && !I.key_state[e.key]) {
			// ルートハイライト(直線)
			highlight.route(false);
		}

		// オルトキーが押されたならば
		if (e.key === 'Alt' && !I.key_state[e.key]) {
			// ルートハイライト(経路)
			highlight.route(true);
		}

		if (e.key.match(/^F\d$/) && !I.key_state[e.key]) {
			const num = parseInt(e.key.replace('F', ''));
			if (num <= 4) {
				if	(e.shiftKey) {
					tempstate.save(num);
				} else {
					tempstate.load(num);
				}
				// ブラウザの挙動をキャンセルする
				e.preventDefault();
			}
		}

		// I.key_stateの更新
		I.key_state[e.key] = true;

	}, { passive: false });


	/** window <keyup>
	 */
	window.addEventListener('keyup', (e) => {

		// シフトキーが離されたならば
		if (e.key === 'Shift') {

			// ハイライトのリセット
			highlight.reset();
			I.last_highlight_cell = null;
			highlight.mouse();

		}

		// オルトキーが離されたならば
		if (e.key === 'Alt') {

			// ハイライトのリセット
			I.last_highlight_cell = null;
			highlight.reset();
			highlight.mouse();

			// ブラウザの挙動をキャンセルする
			e.preventDefault();

		}

		// I.key_stateの更新
		I.key_state[e.key] = false;

	}, { passive: false });


	/** window <mouseup>
	 */
	window.addEventListener('mouseup', (e) => {
		if (I.mouse_state.changed) {
			tempstate.push_undo_stack();
		}
		I.mouse_state.is_down = false;
		I.mouse_state.changed = false;
	});


	/** window <DOMContentLoaded>
	 */
	window.addEventListener('DOMContentLoaded', (e) => {

		logger.log('Unrailed Map Maker Ver.' + C.VERSION);
		logger.log('Thanks, Unrailed!');

		try {

			// 翻訳対象の要素を翻訳する
			U.get_elms('[trans-key]').forEach((elm) => {
				const key = elm.getAttribute('trans-key');
				const text = U.get_lang(key);
				elm.textContent = text;
			});

			// バージョンが表記される予定の要素にバージョンを書く
			U.get_elms('.version').forEach((elm) => {
				elm.textContent = C.VERSION;
			});

			// トースターの初期化
			toaster.init();

			// ローカルストレージの初期化
			// storage.init();

			// ローカルストレージの読み取り
			storage.load();

			// メインウィンドウとモーダルウィンドウの参照を取得
			I.main_window         = U.get_elm('#main-window');
			I.modal_window        = U.get_elm('#modal-window');
			I.count_wrapper       = U.get_elm('#count-wrapper');
			I.count_elm['wood']   = U.get_elm('#count-wood');
			I.count_elm['iron']   = U.get_elm('#count-iron');
			I.count_elm['r-wood'] = U.get_elm('#count-r-wood');
			I.count_elm['r-iron'] = U.get_elm('#count-r-iron');
			I.count_elm['r-rail'] = U.get_elm('#count-r-rail');
			I.count_elm['c-rail'] = U.get_elm('#count-c-rail');
			I.count_elm['bridge'] = U.get_elm('#count-bridge');

			// モーダルウィンドウのアウターをクリックしたときにモーダルウィンドウを閉じる
			// I.modal_window.addEventListener('click', (e) => {
			// 	I.main_window.classList.remove('blur');
			// 	I.modal_window.classList.add('hidden');
			// 	I.modal_window.innerHTML = '';
			// });

			// ツールバーを作成する
			create_toolbar();

			// マップのラッパー要素を作成してメインウィンドウに挿入する
			I.map_wrapper = U.create_elm('div#map-table-wrapper.hidden').appendTo(I.main_window);

			// マップのラッパー要素をフェードイン
			setTimeout(() => {
				I.map_wrapper.classList.remove('hidden');
			}, 200);

			// マップの初期化処理の条件分岐
			if (I.url_queries.share) {
				// URLクエリパラメータにshareが指定されているならそれを読み込む
				map.open_str(I.url_queries.share);
				toaster.success( U.get_lang('toaster-load-share-url') );
				logger.hr();
				logger.log('Loaded the URL query paramater.');
				logger.hr();
				put_train();
			} else if (I.save_data.last_file_key) {
				// 最後に扱ったファイルが存在すればそれを読み込む
				filer.load(I.save_data.last_file_key);
				toaster.gray( U.get_lang('toaster-init').replace('{num}', C.VERSION), 4000 );
				logger.hr();
				logger.log('Loaded the save data.');
				logger.hr();
			} else {
				// 存在しなければまっさらなマップを読み込む
				map.make_table(C.BIOME_PLAINS, C.DEFAULT_WIDTH, C.DEFAULT_HEIGHT, false);
				toaster.gray( U.get_lang('toaster-init').replace('{num}', C.VERSION), 4000 );
				logger.hr();
				logger.log('Initialized the map table.');
				logger.hr();
			}

		} catch (e) {
			// なんか初期化エラー
			logger.error('An error occurred during initialization.');
			console.error(e);
		}
	});

	/** END
	 */
})();