import * as C from './constants.js';
import * as U from './utilities.js';
import I from './instances.js';
import logger from './logger.js';

const train = {
	
	/** .root_cell
	 * 列車のいるマス
	 */
	root_cell: null,
	
	/** .alpha
	 * 列車の進行度
	 */
	alpha: 0,
	
	/** .elm
	 */
	elm: {},
	
	/** .wagon_names
	 */
	wagon_names: [
		'CraftingWagon',
		'StorageWagon',
		'DynamiteWagon',
		'DynamiteWagon',
		'TankWagon',
	],
	
	/** .cell_size
	 */
	cell_size: 32,
	
	/** .put(root_cell, dir, alpha)
	 */
	put(root_cell, dir = 'to', alpha = 0) {

		// 線路以外のマスなら処理不可能
		if (root_cell.resource_type !== C.RESOURCE_C_RAIL) {
			logger.error('There are no tracks laid in this cell.');
			return;
		}
		// 少なくともこのマスには線路が敷かれているようだ
		
		// ルートセル(列車の中央の点が位置するマス)を設定
		this.root_cell = root_cell;
		
		// もう列車のDOM要素が存在するなら位置の更新だけを行う
		if (this.elm.container) {
			this.alpha = alpha;
			this.update_train_pos();
			return;
		}
		// まだ列車のDOM要素が存在しないようだ
		
		// 列車の進行方向
		this.dir = dir;
		this.dir_rev = U.reverse_from_or_to(this.dir);

		// このマスと接続されている線路のfrom/to方向を統一する
		// 線路周りの実装がテキトーなせいで内部的に次のような状況になっていることがある
		//  　←from■to→　□　←to■from→
		// これをこう直す
		//  　←from■to→　□　←from■to→
		let rail_num = 1;
		['to', 'from'].forEach((dir_1) => {
			const dir_2 = U.reverse_from_or_to(dir_1);
			let next;
			let prev = root_cell;
			for (let i = 0; i < 999; i++) {
				// prevのtoを見る、それをnextとする
				next = prev.get_next_rail(dir_1);
				if (!next || next === root_cell) {
					break;
				}
				// nextのfromを見る、それがprevに一致したなら何もしなくていいが
				if (next.get_next_rail(dir_2) === prev) {
				} else {
					// 一致しないのは問題である
					// rail_dirオブジェクトのfromプロパティとtoプロパティの値を入れ替える
					const a = next.rail_dir[dir_1];
					next.rail_dir[dir_1] = next.rail_dir[dir_2];
					next.rail_dir[dir_2] = a;
				}
				prev = next;
				rail_num++;
			}
		});

		this.elm.container = U.create_elm('div.train-container').appendTo(I.map_wrapper);
		this.elm.engine = U.create_elm('div.train-part.train-engine').appendTo(this.elm.container);
		this.alpha = alpha;
		
		// ワゴンの追加
		this.elm.wagons = [];
		this.wagon_names.forEach((name, i) => {
			this.elm.wagons[i] = U.create_elm('div.train-part.train-wagon').appendTo(this.elm.container);
			this.elm.wagons[i].css('background-image', 'url(./assets/img/train/'+name+'.png)');
		});
		
		// 位置の調整
		this.update_train_pos();

		//setInterval(step, 100);
		window.onkeydown = (e) => {
			if (e.key === 'ArrowRight') {
				this.step(+0.1);
			} else if (e.key === 'ArrowLeft') {
				this.step(-0.1);
			}
		};
	},
	
	/** .update_wagons(names)
	 */
	update_wagons(names) {
		
		this.wagon_names = names;
		
		if (this.elm.container) {
			this.remove();
			this.put(this.root_cell, this.dir, this.alpha);
			return;
		}
		
		
	},
	
	/** .encode(names)
	 */
	encode(names) {
		let str = '';
		names.forEach((name) => {
			const i = C.WAGON_NAMES.indexOf(name);
			if (i > -1) {
				str += i.toAlphabet();
			}
		});
		return str;
	},
	
	/** .decode(str)
	 */
	decode(str) {
		const names = [];
		for (let i = 0; i < str.length; i++) {
			const num = str[i].toNumber();
			const name = C.WAGON_NAMES[num];
			names.push(name);
		}
		return names;
	},
	
	/** .reverse()
	 */
	reverse() {
		if (this.elm.container) {
			this.dir = U.reverse_from_or_to(this.dir);
			this.dir_rev = U.reverse_from_or_to(this.dir);
			this.update_train_pos();
		}
	},
	
	/** .remove()
	 */
	remove() {
		if (this.elm.container) {
			this.elm.container.remove();
		}
		this.elm = {};
	},

	/** .step(unit)
	 */
	step(unit) {
		if (this.elm.container) {
			this.alpha += unit;
			if (this.alpha >= 1) {
				const next = this.root_cell.get_next_rail(this.dir);
				const nxnx = next && next.get_next_rail(this.dir);
				if (nxnx) {
					this.root_cell = next;
					this.alpha -= 1;
				} else {
					this.alpha = 1;
				}
			} else if (this.alpha < 0) {
				const next = this.root_cell.get_next_rail(this.dir_rev);
				const nxnx = next && next.get_next_rail(this.dir_rev);
				if (nxnx) {
					this.root_cell = next;
					this.alpha += 1;
				} else {
					this.alpha = 0;
				}
			}
			this.update_train_pos();
		}
	},

	/** .update_train_pos()
	 */
	update_train_pos() {
		let alpha = this.alpha;
		const pos = this.get_pos_in_cell(this.root_cell, alpha);
		this.elm.engine.style.setProperty('left', `${pos.x}px`);
		this.elm.engine.style.setProperty('top', `${pos.y}px`);
		this.elm.engine.style.setProperty('--rotate', `${pos.rotate}deg`);
		alpha -= (C.TRAIN_ENGINE_LENGTH + C.TRAIN_WAGON_LENGTH) / 2;
		this.elm.wagons.forEach((elm) => {
			const pos = this.calc_wagon_pos(alpha);
			elm.css({
				'left': `${pos.x}px`,
				'top': `${pos.y}px`,
				'--rotate': `${pos.rotate}deg`,
			});
			alpha -= C.TRAIN_WAGON_LENGTH;
		});
	},

	/** .calc_wagon_pos(alpha)
	 */
	calc_wagon_pos(alpha) {
		let prev = null;
		let next = this.root_cell.get_next_rail(this.dir_rev);
		let nxnx = next && next.get_next_rail(this.dir_rev);
		let a = 0;
		let pos;
		for (let i = 0; i < 99; i++) {
			if (!nxnx) {
				pos = this.get_pos_in_cell(next || this.root_cell, 1);
				break;
			}
			if (a <= alpha && alpha < a + 1) {
				const b = alpha - a;
				pos = this.get_pos_in_cell(next || this.root_cell, b);
				break;
			}
			a--;
			prev = next;
			if (i > 0) {
				next = next.get_next_rail(this.dir_rev);
				nxnx = next.get_next_rail(this.dir_rev);
			}
		}
		return pos;
	},



	/** .get_pos_in_cell(cell, alpha)
	 */
	get_pos_in_cell(cell, alpha) {
		let x = 0;
		let y = 0;
		let rotate = 0;
		switch (cell.td.getAttribute('rail-direction')) {
		case 'tb':
			if (cell.rail_dir[this.dir] === C.DIR_TOP) {
				alpha = 1 - alpha;
				rotate += 180;
			}
			// 上から下へ
			rotate += 90;
			x = 0.5;
			y = alpha;
			break;
		case 'rl':
			if (cell.rail_dir[this.dir] === C.DIR_LEFT) {
				alpha = 1 - alpha;
				rotate += 180;
			}
			// 左から右へ
			rotate += 0;
			x = alpha;
			y = 0.5;
			break;
		case 'tr': // ┗
			if (cell.rail_dir[this.dir] === C.DIR_TOP) {
				alpha = 1 - alpha;
				rotate += 180;
			}
			// 上から右へ
			rotate += U.easing.easeInOutQuad(alpha,  90, -90, 1);
			x       = U.easing.easeInQuad   (alpha, 0.5, 0.5, 1);
			y       = U.easing.easeOutQuad  (alpha, 0.0, 0.5, 1);
			break;
		case 'rb': // ┏
			if (cell.rail_dir[this.dir] === C.DIR_RIGHT) {
				alpha = 1 - alpha;
				rotate += 180;
			}
			// 右から下へ
			rotate += U.easing.easeInOutQuad(alpha, 180,  -90, 1);
			x       = U.easing.easeOutQuad  (alpha, 1.0, -0.5, 1);
			y       = U.easing.easeInQuad   (alpha, 0.5,  0.5, 1);
			break;
		case 'bl': // ┓
			if (cell.rail_dir[this.dir] === C.DIR_BOTTOM) {
				alpha = 1 - alpha;
				rotate += 180;
			}
			// 下から左へ
			rotate += U.easing.easeInOutQuad(alpha, 270,  -90, 1);
			x       = U.easing.easeInQuad   (alpha, 0.5, -0.5, 1);
			y       = U.easing.easeOutQuad  (alpha, 1.0, -0.5, 1);
			break;
		case 'tl': // ┛
			if (cell.rail_dir[this.dir] === C.DIR_LEFT) {
				alpha = 1 - alpha;
				rotate += 180;
			}
			// 左から上へ
			rotate += U.easing.easeInOutQuad(alpha,   0,  -90, 1);
			x       = U.easing.easeOutQuad  (alpha, 0.0,  0.5, 1);
			y       = U.easing.easeInQuad   (alpha, 0.5, -0.5, 1);
			break;
		}
		x += cell.x;
		y += cell.y;
		x *= this.cell_size;
		y *= this.cell_size;
		return { x, y, rotate };
	},

};

export { train as default };