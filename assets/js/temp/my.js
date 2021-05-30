import * as U from './utilities.js';
import * as C from './constants.js';
import I from './instances.js';
import Cell from './Cell.js';


/** storage
 */
export const storage = {

	/** init()
	 */
	init() {
		if (confirm('ローカルストレージを初期化します。よろしいですか？')) {
			localStorage.removeItem('Unrailed-Map-Maker');
		}
	},

	/** save()
	 */
	save() {
		const json_str = JSON.stringify(I.save_data);
		localStorage.setItem('Unrailed-Map-Maker', json_str);
	},

	/** load()
	 */
	load() {
		const json_str = localStorage.getItem('Unrailed-Map-Maker');
		if (json_str) {
			const json = JSON.parse(json_str);
			Object.keys(json).forEach((key) => {
				I.save_data[key] = json[key];
			});
		}
	},
}

/** temp_state
 */
export const temp_state = {

	/** .undo_stack
	 */
	undo_stack: [],

	/** .redo_stack
	 */
	redo_stack: [],

	/** .redo()
	 */
	redo() {
	},

	/** .undo()
	 */
	undo() {
	},

	/** .push_undo_stack()
	 */
	push_undo_stack() {
	},

	/** .state_arr
	 */
	state_arr: [],

	/** .state_load(slot)
	 */
	state_load(slot) {
	},

	/** .state_save(slot)
	 */
	state_save(slot) {
	},
}


/** highlight
 */
export const highlight = {

	/** reset()
	 */
	reset() {
		U.get_elms('.highlight-frame').forEach((elm) => {
			elm.classList.remove('highlight-frame');
			elm.classList.remove('highlight-circle');
			I.route_highlight_cells = [];
		});
	},

	/** mouse()
	 */
	mouse(alt_flag) {
		if (I.last_highlight_cell === I.mouse_state.last_move_cell) {
			return;
		}
		this.reset();
		const target = I.mouse_state.last_move_cell;
		target.td.classList.add('highlight-frame');
		if (I.mouse_state.current_palette_item === C.LAND_STATION_L) {
			const right = target.right();
			if (right) {
				right.td.classList.add('highlight-frame');
			}
		}
	},

	/** dynamite(level)
	 */
	dynamite(level) {
		if (!I.mouse_state.last_move_cell) {
			return;
		}
		if (I.last_highlight_cell === I.mouse_state.last_move_cell) {
			return;
		}
		if (isNaN(level)) {
			level = 1;
		}
		this.reset();
		const targets = U.get_dynamite_targets(I.mouse_state.last_move_cell, level);
		if (targets && targets.length) {
			targets.forEach((target, i) => {
				if (target.power > 0) {
					target.cell.td.classList.add('highlight-frame');
					I.route_highlight_cells.push(target.cell);
					if (target.cell === I.mouse_state.last_move_cell) {
						target.cell.td.classList.add('highlight-circle');
					}
				}
			});
			I.last_highlight_cell = I.mouse_state.last_move_cell;
		}
	},


	/** route()
	 */
	route(alt_flag) {
		if (!I.mouse_state.last_put_cell || !I.mouse_state.last_move_cell) {
			return;
		}
		if (!I.mouse_state.last_put_cell || !I.mouse_state.last_move_cell) {
			return;
		}
		if (I.mouse_state.last_put_cell === I.mouse_state.last_move_cell) {
			return;
		}
		if (I.last_highlight_cell === I.mouse_state.last_move_cell) {
			return;
		}
		this.reset();
		let cells;
		if (alt_flag) {
			cells = U.get_dijkstra_route(I.mouse_state.last_put_cell, I.mouse_state.last_move_cell);
		} else {
			cells = U.get_straight_route(I.mouse_state.last_put_cell, I.mouse_state.last_move_cell);
		}
		if (cells) {
			cells.forEach((cell, i) => {
				if (i > 0) {
					cell.td.classList.add('highlight-frame');
					I.route_highlight_cells.push(cell);
					if (i === cells.length - 1) {
						cell.td.classList.add('highlight-circle');
					}
				}
			});
			I.last_highlight_cell = I.mouse_state.last_move_cell;
		}
	},
}

/** map
 */
export const map = {

	/** .forEachCell(callback)
	 */
	forEachCell(callback) {
		for (let y = 0; y < this.height(); y++) {
			for (let x = 0; x < this.width(); x++) {
				const cell = I.map_cell[y][x];
				callback(cell);
			}
		}
	},

	/** .forEachY(callback)
	 */
	forEachY(callback) {
		for (let y = 0, h = this.height(); y < h; y++) {
			callback(y);
		}
	},

	/** .forEachX(callback)
	 */
	forEachX(callback) {
		for (let x = 0, w = this.width(); x < w; x++) {
			callback(x);
		}
	},

	/** .height()
	 */
	height() {
		return I.map_cell.length;
	},

	/** .width()
	 */
	width() {
		return I.map_cell[0].length;
	},

	/** .change_map_size()
	 */
	change_map_size() {
		const new_width = parseInt(U.get_elm('.map-size-container[dir=x] input').value);
		const new_height = parseInt(U.get_elm('.map-size-container[dir=y] input').value);
		const current_width = this.width();
		const current_height = this.height();
		const dif_width = Math.abs(new_width - current_width);
		const dif_height = Math.abs(new_height - current_height);
		if (new_width > current_width) {
			// 横幅が増える場合
			for (let y = 0; y < current_height; y++) {
				for (let i = 0; i < dif_width; i++) {
					const x = current_width + i;
					const cell = new Cell(x, y, null);
					I.map_elm.tr[y].append(cell.td);
					I.map_elm.td[y][x] = cell.td;
					I.map_cell[y][x] = cell;
				}
			}
		} else if (new_width < current_width) {
			// 横幅が減る場合
			for (let y = 0; y < current_height; y++) {
				for (let i = dif_width - 1; i >= 0; i--) {
					const x = current_width + i;
					const td = I.map_elm.td[y].pop();
					td.remove();
					I.map_cell[y].pop();
				}
			}
		}
		if (new_height > current_height) {
			// 高さが増える場合
			for (let i = 0; i < dif_height; i++) {
				const y = current_height + i;
				const tr = U.create_elm('tr');
				I.map_elm.tr[y] = tr;
				I.map_elm.td[y] = [];
				I.map_cell[y] = [];
				for (let x = 0; x < new_width; x++) {
					const cell = new Cell(x, y, null);
					I.map_cell[y][x] = cell;
					I.map_elm.td[y][x] = cell.td;
					tr.append(cell.td);
				}
				I.map_elm.table.append(tr);
			}
		} else if (new_height < current_height) {
			// 高さが減る場合
			for (let i = 0; i < dif_height; i++) {
				const y = current_height - i - 1;
				for (let x = 0; x < new_width; x++) {
					I.map_elm.td[y].pop().remove();
					I.map_cell[y].pop();
				}
				I.map_elm.tr.pop().remove();
				I.map_elm.td.pop();
				I.map_cell.pop();
			}
		}

		this.onchange();
	},

	/** .change_map_size_one(dir, is_add)
	 */
	change_map_size_one(dir, is_add) {
		const name = (is_add) ? '_plus' : '_minus';
		this.change_map_size_func[dir + name].call(this);
	},

	/** .change_map_size_func
	 */
	change_map_size_func: {
		/** .right_plus()
		 */
		right_plus() {
			const x = this.width();
			this.forEachY((y) => {
				const cell = new Cell(x, y, null);
				I.map_elm.tr[y].append(cell.td);
				I.map_elm.td[y][x] = cell.td;
				I.map_cell[y][x] = cell;
			});
		},
		/** .right_minus()
		 */
		right_minus() {
			this.forEachY((y) => {
				I.map_elm.td[y].pop().remove();
				I.map_cell[y].pop();
			});
		},
		/** .left_plus()
		 */
		left_plus() {
			this.forEachCell((cell) => {
				cell.x += 1;
			});
			this.forEachY((y) => {
				const cell = new Cell(0, y, null);
				I.map_elm.tr[y].prepend(cell.td);
				I.map_elm.td[y].unshift(cell.td);
				I.map_cell[y].unshift(cell);
			});
		},
		/** .left_minus()
		 */
		left_minus() {
			this.forEachCell((cell) => {
				cell.x -= 1;
			});
			this.forEachY((y) => {
				const cell = new Cell(0, y, null);
				I.map_elm.td[y].shift().remove();
				I.map_cell[y].shift();
			});
		},
		/** .bottom_plus()
		 */
		bottom_plus() {
			const y = this.height();
			const tr = U.create_elm('tr');
			I.map_elm.tr[y] = tr;
			I.map_elm.td[y] = [];
			I.map_cell[y] = [];
			this.forEachX((x) => {
				const cell = new Cell(x, y, null);
				I.map_cell[y][x] = cell;
				I.map_elm.td[y][x] = cell.td;
				tr.append(cell.td);
			});
			I.map_elm.table.append(tr);
		},
		/** .bottom_minus()
		 */
		bottom_minus() {
			const y = this.height() - 1;
			this.forEachX((x) => {
				I.map_elm.td[y].pop().remove();
				I.map_cell[y].pop();
			});
			I.map_elm.tr.pop().remove();
			I.map_elm.td.pop();
			I.map_cell.pop();
		},
		/** .top_plus()
		 */
		top_plus() {
			this.forEachCell((cell) => {
				cell.y += 1;
			});
			const tr = U.create_elm('tr');
			I.map_elm.tr.unshift(tr);
			I.map_elm.td.unshift([]);
			const arr = [];
			this.forEachX((x) => {
				arr.push(null);
			});
			I.map_cell.unshift(arr);
			this.forEachX((x) => {
				const cell = new Cell(x, 0, null);
				I.map_cell[0][x] = cell;
				I.map_elm.td[0][x] = cell.td;
				tr.append(cell.td);
			});
			I.map_elm.table.prepend(tr);
		},
		/** .top_minus()
		 */
		top_minus() {
			this.forEachCell((cell) => {
				cell.y -= 1;
			});
			this.forEachX((x) => {
				I.map_elm.td[0].shift().remove();
				I.map_cell[0].shift();
			});
			I.map_elm.tr.shift().remove();
			I.map_elm.td.shift();
			I.map_cell.shift();
		},
	},

	/** .download_as_image()
	 * マップを画像としてダウンロードします。
	 */
	download_as_image() {
		// 画像形式 'png' または 'jpg'
		const type = 'png';
		// 品質(0～1、typeが'jpg'の場合のみ有効)
		const quality = 0.8;
		// ファイル名
		const name = 'Map-' + U.get_now_date_str();
		// マップを<canvas>として取得してそれをダウンロード
		// (画像を読み込む処理が必要であるため非同期にしてcallbackを渡すやり方、Promiseで実装するのは面倒だった)
		this.get_as_canvas((canvas) => {
			const link = U.create_elm('a');
			if (type === 'jpg') {
				link.href = canvas.toDataURL('image/jpeg', quality);
			} else {
				link.href = canvas.toDataURL('image/png');
			}
			link.download = name + '.' + type;
			link.click();
			U.my_console.log('Downloaded the image!');
		});
	},

	/** .get_as_canvas(callback)
	 * 現在のマップを<canvas>として取得します。(DOM要素を解釈して<canvas>に新しく描画する)
	 */
	get_as_canvas(callback) {
		try {
			const width = I.map_cell[0].length;
			const height = I.map_cell.length;
			const cell_size = 64;
			const canvas = U.create_elm('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = width * cell_size;
			canvas.height = height * cell_size;
			ctx.font = 'bold 90px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu,Cantarell, "Helvetica Neue", Arial,"Hiragino Kaku Gothic ProN", "Hiragino Sans", "BIZ UDPGothic", Meiryo, sans-serif';
			ctx.textAlign = 'left';
			ctx.textBaseline = 'top';

			// =========================================
			// 画像の読み込み
			// =========================================
			let img_count = 0;
			let loaded_img_count = 0;
			const url = location.href.split('?')[0];

			// たとえば 'url(../img/hoge.png)' を './assets/img/hoge.png' に変換する関数
			function parse_src(src) {
				src = (src).replace(/url\(|['")]/g, '');
				src.replace('../img', './assets/img');
				return src.replace(url, './');
			}

			// 画像を読み込んでキャッシュに登録＋カウンタを増やして、
			// すべての読み込みが終わったようならonload_allを呼び出す
			function load_img(src) {
				if (src && src !== 'none') {
					if (!(src in I.image_cache)) {
						I.image_cache[src] = 'loading';
						img_count++;
						const img = new Image();
						img.onload = () => {
							I.image_cache[src] = img;
							loaded_img_count++;
							if (loaded_img_count === img_count) {
								onload_all();
							}
						};
						setTimeout(() => {
							img.src = parse_src(src);
						}, 10);
					}
				}
			}

			for (let y = 0; y < I.map_cell.length; y++) {
				for (let x = 0; x < I.map_cell[0].length; x++) {
					const cell = I.map_cell[y][x];
					const td_style = window.getComputedStyle(cell.td);
					const resource_style = window.getComputedStyle(cell.resource_elm);
					const symbol_style = window.getComputedStyle(cell.symbol_elm);
					load_img(td_style['background-image']);
					load_img(resource_style['background-image']);
					load_img(symbol_style['background-image']);
				}	
			}

			// =========================================
			// 画像の読み込みがすべて終わったら描画
			// =========================================
			function onload_all() {
				for (let y = 0; y < I.map_cell.length; y++) {
					for (let x = 0; x < I.map_cell[0].length; x++) {
						const cell = I.map_cell[y][x];
						const td_style = window.getComputedStyle(cell.td);
						const resource_style = window.getComputedStyle(cell.resource_elm);
						const count_style = window.getComputedStyle(cell.resource_count_elm);
						const symbol_style = window.getComputedStyle(cell.symbol_elm);
						const img_1 = I.image_cache[td_style['background-image']];
						const img_2 = I.image_cache[resource_style['background-image']];
						const img_3 = I.image_cache[symbol_style['background-image']];
						const ctx_x = x * cell_size;
						const ctx_y = y * cell_size;
						ctx.fillStyle = td_style['background-color'];
						ctx.fillRect(ctx_x, ctx_y, cell_size, cell_size);
						if (img_1) ctx.drawImage(img_1, ctx_x, ctx_y, cell_size, cell_size);
						if (img_2) ctx.drawImage(img_2, ctx_x, ctx_y, cell_size, cell_size);
						if (img_3) ctx.drawImage(img_3, ctx_x, ctx_y, cell_size, cell_size);
						if (count_style['display'] === 'block') {
							ctx.fillStyle = '#000';
							ctx.font = `bold ${Math.ceil(cell_size * 0.45)}px ${count_style['font-family']}`;
							ctx.textAlign = 'left';
							ctx.textBaseline = 'top';
							ctx.strokeStyle = '#fff';
							ctx.lineWidth = Math.ceil(cell_size * 0.08);
							ctx.lineJoin = 'round';
							['strokeText', 'fillText'].forEach((draw) => {
								ctx[draw](cell.resource_count_elm.textContent, ctx_x, ctx_y);
							});
						}
					}	
				}
				callback(canvas);
			}

			// img_countがゼロだった場合は読み込みが発生しないため
			// 手動でonload_allを実行する必要がある
			if (img_count === 0) {
				onload_all();
			}
		} catch (e) {
			U.my_console.error('Failed to create the canvas.');
			console.error(e);
		}
	},


	/** .open_map_from_str(origin_str)
	 * 文字列からマップを開きます。
	 */
	 open_map_from_str(origin_str) {

		// 文字列をデコードする
		const map_str = decodeURIComponent(origin_str).inflate() + 'a';

		// バイオーム 横幅 高さ を特定する
		let biome = C.BIOME_PLAINS;
		let width = C.DEFAULT_WIDTH;
		let height = C.DEFAULT_HEIGHT;
		let str = '';
		let mode = '';
		let i;
		for (i = 0; i < map_str.length; i++) {
			const c = map_str.charAt(i);
			let new_mode;
			switch (c) {
			case 'b':
			case 'w':
			case 'h':
			case 'm':
				new_mode = c;
				break;
			default:
				str += c;
				break;
			}
			if (new_mode) {
				if (str) {
					const num = parseInt(str);
					str = '';
					switch (mode) {
					case 'b':
						biome = [
							C.BIOME_PLAINS,
							C.BIOME_DESERT,
							C.BIOME_SNOW,
							C.BIOME_HELL,
							C.BIOME_SPACE,
							C.BIOME_MARS,
						][num - 1];
						break;
					case 'w':
						width = num;
						break;
					case 'h':
						height = num;
						break;
					}
				}
				mode = new_mode;
			}
			if (mode === 'm') {
				i++;
				break;
			}
		}

		// 各セルのデータを特定する
		let arr = [];
		let opt = {};
		let num_str = '';
		for (; i < map_str.length; i++) {
			const c = map_str.charAt(i);
			if (c.match(/[a-z]/)) {
				if (opt.land_char) {
					if (num_str) {
						if (opt.symbol_char) {
							opt.symbol_id = parseInt(num_str);
							num_str = '';
						} else if (opt.resource_char) {
							opt.resource_count = parseInt(num_str);
							num_str = '';
						} else {
							opt.land_num = parseInt(num_str);
							num_str = '';
						}
					}
					arr.push(opt);
				}
				opt = {
					land_char: c
				};
			} else if (c.match(/[A-W]/)) {
				if (num_str) {
					opt.land_num = parseInt(num_str);
					num_str = '';
				}
				opt.resource_char = c;
			} else if (c.match(/[X-Z]/)) {
				if (num_str) {
					if (opt.resource_char) {
						opt.resource_count = parseInt(num_str);
						num_str = '';
					} else {
						opt.land_num = parseInt(num_str);
						num_str = '';
					}
				}
				opt.symbol_char = c;
			} else if (c.match(/[0-9]/)) {
				num_str += c;
			}
		}

		// make_tableに投げる
		this.make_table(biome, width, height, arr);

	},

	/** .make_table(biome, width, height, defs)
	 */
	make_table(biome, width, height, defs) {

		I.is_autosave_enabled = false;

		// マップラッパーを空にする
		I.map_wrapper.innerHTML = '';

		// テーブル要素を新規作成
		const table = U.create_elm('table#map-table');

		// 変数の初期化
		I.map_cell = [];
		I.map_elm = {
			table: table,
			tr: [],
			td: [],
		}

		// セルを作成
		for (let i = 0, y = 0; y < height; y++) {
			const tr = U.create_elm('tr');
			I.map_cell[y] = [];
			I.map_elm.tr[y] = tr;
			I.map_elm.td[y] = [];
			for (let x = 0; x < width; x++) {
				const def = defs ? defs[i] : null;
				const cell = new Cell(x, y, def);
				I.map_cell[y][x] = cell;
				I.map_elm.td[y][x] = cell.td;
				tr.append(cell.td);
				i++;
			}
			table.append(tr);
		}

		// マウスボタンが押されたとき
		table.addEventListener('mousedown', (e) => {
			I.mouse_state.is_down = true;
		});

		// マウスが動いたとき
		table.addEventListener('mousemove', (e) => {
		});

		// マウスボタンが離されたとき
		table.addEventListener('mouseup', (e) => {
			I.mouse_state.is_down = false;
		});

		// マウスが離れたとき
		table.addEventListener('mouseleave', (e) => {
			// ハイライトを消す
			highlight.reset();
		});

		// テーブルを挿入
		I.map_wrapper.append(table);

		this.count();

		I.is_autosave_enabled = true;

	},

	/** .map_to_str()
	 */
	map_to_str() {

		let ret = '';

		// バイオーム
		if (I.map_biome !== C.BIOME_PLAINS) {
			ret += 'b';
			switch (I.map_biome) {
			case C.BIOME_PLAINS:
				ret += '1';
				break;
			case C.BIOME_DESERT:
				ret += '2';
				break;
			case C.BIOME_SNOW:
				ret += '3';
				break;
			case C.BIOME_HELL:
				ret += '4';
				break;
			case C.BIOME_SPACE:
				ret += '5';
				break;
			case C.BIOME_MARS:
				ret += '6';
				break;
			}
		}

		if (I.map_cell[0].length !== C.DEFAULT_WIDTH) {
			ret += 'w';
			ret += I.map_cell[0].length;
		}

		if (I.map_cell.length !== C.DEFAULT_HEIGHT) {
			ret += 'h';
			ret += I.map_cell.length;
		}

		ret += 'm';
		for (let y = 0; y < I.map_cell.length; y++) {
			for (let x = 0; x < I.map_cell[0].length; x++) {
				const cell = I.map_cell[y][x];
				let cell_str = '';
				switch (cell.land_type) {
				case C.LAND_NONE: cell_str += 'a'; break;
				case C.LAND_PLAIN: cell_str += 'b'; break;
				case C.LAND_STATION_L: cell_str += 'c'; break;
				case C.LAND_STATION_R: cell_str += 'd'; break;
				case C.LAND_STATION_F: cell_str += 'e'; break;
				case C.LAND_TREE:
					switch (cell.life) {
					case 3: cell_str += 'f'; break;
					case 2: cell_str += 'g'; break;
					case 1: cell_str += 'h'; break;
					case 0:
						if (cell.resource_type === C.RESOURCE_WOOD && cell.resource_count === 1) {
							cell_str += 'j';
						} else {
							cell_str += 'i';
						}
						break;
					}
					break;
				case C.LAND_IRON:
					switch (cell.life) {
					case 3: cell_str += 'k'; break;
					case 2: cell_str += 'l'; break;
					case 1: cell_str += 'm'; break;
					case 0:
						if (cell.resource_type === C.RESOURCE_IRON && cell.resource_count === 1) {
							cell_str += 'o';
						} else {
							cell_str += 'n';
						}
						break;
					}
					break;
				case C.LAND_ROCK   : cell_str += 'p'; break;
				case C.LAND_WATER  : cell_str += 'q'; break;
				case C.LAND_BRIDGE : cell_str += 'r'; break;
				case C.LAND_STEAM  : cell_str += 's'; break;
				case C.LAND_THORN  : cell_str += 't'; break;
				case C.LAND_COLOR_1: cell_str += 'u1'; break;
				case C.LAND_COLOR_2: cell_str += 'u2'; break;
				case C.LAND_COLOR_3: cell_str += 'u3'; break;
				case C.LAND_COLOR_4: cell_str += 'u4'; break;
				case C.LAND_COLOR_5: cell_str += 'u5'; break;
				case C.LAND_COLOR_6: cell_str += 'u6'; break;
				case C.LAND_COLOR_7: cell_str += 'u7'; break;
				case C.LAND_COLOR_8: cell_str += 'u8'; break;
				case C.LAND_COLOR_9: cell_str += 'u9'; break;
				case C.LAND_COLOR_10: cell_str += 'u10'; break;
				}
				switch (cell.resource_type) {
				case C.RESOURCE_C_RAIL:
					switch (cell.td.getAttribute('rail-direction')) {
					default:
					case 'rl':
						cell_str += 'A';
						break;
					case 'tb':
						cell_str += 'B';
						break;
					case 'tr':
						cell_str += 'C';
						break;
					case 'rb':
						cell_str += 'D';
						break;
					case 'bl':
						cell_str += 'E';
						break;
					case 'tl':
						cell_str += 'F';
						break;
					}
					break;
				case C.RESOURCE_RAIL:
					switch (cell.td.getAttribute('rail-direction')) {
					default:
					case 'rl':
						cell_str += 'G';
						break;
					case 'tb':
						cell_str += 'H';
						break;
					case 'tr':
						cell_str += 'I';
						break;
					case 'rb':
						cell_str += 'J';
						break;
					case 'bl':
						cell_str += 'K';
						break;
					case 'tl':
						cell_str += 'L';
						break;
					}
					if (cell.resource_count > 1) {
						cell_str += cell.resource_count;
					}
					break;
				case C.RESOURCE_WOOD:
					if (cell_str !== 'j') {
						cell_str += 'M';
						if (cell.resource_count > 1) {
							cell_str += cell.resource_count;
						}
					}
					break;
				case C.RESOURCE_IRON:
					if (cell_str !== 'o') {
						cell_str += 'N';
						if (cell.resource_count > 1) {
							cell_str += cell.resource_count;
						}
					}
					break;
				case C.RESOURCE_DYNAMITE_1:
					cell_str += 'S';
					break;
				case C.RESOURCE_DYNAMITE_2:
					cell_str += 'S2';
					break;
				case C.RESOURCE_DYNAMITE_3:
					cell_str += 'S3';
					break;
				case C.RESOURCE_DYNAMITE_4:
					cell_str += 'S4';
					break;
				case C.RESOURCE_DYNAMITE_5:
					cell_str += 'S5';
					break;
				case C.RESOURCE_DYNAMITE_6:
					cell_str += 'S6';
					break;
				case C.RESOURCE_DYNAMITE_7:
					cell_str += 'S7';
					break;
				case C.RESOURCE_DYNAMITE_8:
					cell_str += 'S8';
					break;
				case C.RESOURCE_DYNAMITE_9:
					cell_str += 'S9';
					break;
				case C.RESOURCE_AXE:
					cell_str += 'O';
					break;
				case C.RESOURCE_PICKAXE:
					cell_str += 'P';
					break;
				case C.RESOURCE_BACKET:
					cell_str += 'Q';
					break;
				case C.RESOURCE_BACKET_EMPTY:
					cell_str += 'R';
					break;
				case C.RESOURCE_FACE:
					const face_id = cell.td.getAttribute('face-id');
					cell_str += 'T' + face_id;
					break;
				case C.RESOURCE_SYMBOL:
					const symbol_id = cell.td.getAttribute('symbol-id');
					cell_str += 'U' + symbol_id;
					break;
				case C.RESOURCE_BOLT:
					cell_str += 'V';
					break;
				}
				switch (cell.symbol_type) {
				default:
					break;
				case C.SYMBOL_SYMBOL:
					cell_str += 'X' + cell.td.getAttribute('symbol-id');
					break;
				case C.SYMBOL_FACE:
					cell_str += 'Y' + cell.td.getAttribute('face-id');
					break;
				}
				ret += cell_str;
			}
		}
		return encodeURIComponent(ret.deflate());
	},

	/** .onchange()
	 */
	onchange() {

		// 前回のタイムアウトがまだ呼ばれていなければキャンセルする
		clearTimeout(I.autosave_timer);

		// タイムアウトをセット
		I.autosave_timer = setTimeout(() => {

			// マップを文字列化する
			const data = this.map_to_str();

			// タイムスタンプを取得
			const timestamp = parseInt(new Date().getTime() / 1000);

			// オートセーブ
			if (I.is_autosave_enabled) {
				I.save_data.file['autosave'] = {
					id: 'autosave',
					title: 'Auto-saved data',
					created: 'autosave',
					modified: timestamp,
					data: data,
				};
				I.save_data.last_file_key = 'autosave';
				storage.save();
				U.my_console.log('Auto-saved.');
			}

			I.is_saved = false;

			// URLの書き換え
			// history.replaceState('', '', '?share=' + str);

		}, C.AUTOSAVE_DELAY);

		clearTimeout(I.autosave_timer_sub);
		I.autosave_timer_sub = setTimeout(() => {
			this.count();
		}, 40);

	},


	/** .count()
	 */
	count() {
		const count = {
			'wood': 0,
			'iron': 0,
			'r-wood': 0,
			'r-iron': 0,
			'c-rail': 0,
			'r-rail': 0,
			'bridge': 0,
		};
		const stations = [];
		function is_under_station(cell) {
			for (let i = 0; i < stations.length; i++) {
				const s = stations[i];
				const y  = s.y + 1;
				const x1 = s.x + 0;
				const x2 = s.x + 1;
				const x3 = s.x + 2;
				if (cell.y === y) {
					if (cell.x === x1 || cell.x === x2 || cell.x === x3) {
						return true;
					}
				}
			}
			return false;
		}
		for (let y = 0; y < I.map_cell.length; y++) {
			for (let x = 0; x < I.map_cell[y].length; x++) {
				const cell = I.map_cell[y][x];
				let c = 1;
				switch (cell.land_type) {
				case C.LAND_TREE:
					count['wood']++;
					break;
				case C.LAND_IRON:
					count['iron']++;
					break;
				case C.LAND_BRIDGE:
					count['bridge']++;
					break;
				case C.LAND_STATION_L:
					stations.push(cell);
					break;
				}
				switch (cell.resource_type) {
				case C.RESOURCE_WOOD:
					c = cell.resource_count || 1;
					count['r-wood'] += c;
					break;
				case C.RESOURCE_IRON:
					c = cell.resource_count || 1;
					count['r-iron'] += c;
					break;
				case C.RESOURCE_RAIL:
					if (!is_under_station(cell)) {
						c = cell.resource_count || 1;
						count['r-rail'] += c;
					}
					break;
				case C.RESOURCE_C_RAIL:
					if (!is_under_station(cell)) {
						count['c-rail']++;
					}
					break;
				}
			}
		}
		Object.keys(count).forEach((key) => {
			I.count_elm[key].textContent = count[key];
		});
	},



	/** .is_on_map(x, y)
	 * 座標(x, y)がマップからはみ出ていなければ真を返します。
	 */
	is_on_map(x, y) {
		return x >= 0 && y >= 0 && y < this.height() && x < this.width();
	},
};


/** file
 */
export const file = {

	/** .load(file_key)
	 */
	load(file_key) {
		const file = I.save_data.file[file_key];
		if (file) {
			map.open_map_from_str(file.data);
			if (file_key !== 'autosave') {
				I.current_file_key = file.created;
				I.save_data.last_file_key = file.created;
				U.get_elm('#file-name').val(file.title).classList.add('enabled');
				U.get_elm('#file-save').classList.add('enabled');
			} else {
				I.current_file_key = null;
				I.save_data.last_file_key = 'autosave';
				U.get_elm('#file-name').val(file.title).classList.remove('enabled');
				U.get_elm('#file-save').classList.remove('enabled');
			}
			storage.save();
		}
	},

	/** .save()
	 */
	save() {
		if (I.current_file_key) {
			const title = U.get_elm('#file-name').value;
			const timestamp = parseInt(new Date().getTime() / 1000);
			I.save_data.file[I.current_file_key] = {
				title,
				created: I.current_file_key,
				modified: timestamp,
				data: map.map_to_str(),
			};
			I.is_saved = true;
			I.save_data.last_file_key = I.current_file_key;
			storage.save();
		}
	},

	/** .save_as(title)
	 */
	save_as(title) {
		const timestamp = parseInt(new Date().getTime() / 1000);
		I.save_data.file[timestamp] = {
			title,
			created: timestamp,
			modified: timestamp,
			data: map.map_to_str(),
		};
		I.save_data.last_file_key = timestamp;
		storage.save();
		I.current_file_key = timestamp;
		I.is_saved = true;
		U.get_elm('#file-name').val(title).classList.add('enabled');
		U.get_elm('#file-save').classList.add('enabled');
	},
};