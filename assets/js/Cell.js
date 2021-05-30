import * as C from './constants.js';
import * as U from './utilities.js';
import I from './instances.js';
import map from './map.js';
import train from './train.js';
import logger from './logger.js';
import highlight from './highlight.js';
import tempstate from './tempstate.js';

/** Cell
 */
export default class Cell {

	/** constructor(x, y, def)
	 */
	constructor(x, y, def) {
		this.x = x;
		this.y = y;
		this.td = U.create_elm('td');
		this.td.cell = this;
		this.resource_elm = U.create_elm('div.resource').appendTo(this.td);
		this.symbol_elm = U.create_elm('div.symbol').appendTo(this.td);
		this.highlight_elm = U.create_elm('div.highlight').appendTo(this.td);
		this.resource_count_elm = U.create_elm('p.count').appendTo(this.td);
		this.life = 3;
		this.land_type = C.LAND_PLAIN;
		this.resource_type = C.RESOURCE_NONE;
		this.symbol_type = C.SYMBOL_NONE;
		this.rail_dir = {
			from: C.DIR_NONE,
			to: C.DIR_NONE,
		};
		if (def) {
			switch (def.land_char) {
			case 'a': this.land_type = C.LAND_NONE; break;
			case 'b': this.land_type = C.LAND_PLAIN; break;
			case 'c': this.land_type = C.LAND_STATION_L; break;
			case 'd': this.land_type = C.LAND_STATION_R; break;
			case 'e': this.land_type = C.LAND_STATION_F; break;
			case 'f': this.land_type = C.LAND_TREE; break;
			case 'g': this.land_type = C.LAND_TREE; this.life = 2; break;
			case 'h': this.land_type = C.LAND_TREE; this.life = 1; break;
			case 'i': this.land_type = C.LAND_TREE; this.life = 0; break;
			case 'j': this.land_type = C.LAND_TREE; this.life = 0; this.resource_type = C.RESOURCE_WOOD; break;
			case 'k': this.land_type = C.LAND_IRON; break;
			case 'l': this.land_type = C.LAND_IRON; this.life = 2; break;
			case 'm': this.land_type = C.LAND_IRON; this.life = 1; break;
			case 'n': this.land_type = C.LAND_IRON; this.life = 0; break;
			case 'o': this.land_type = C.LAND_IRON; this.life = 0; this.resource_type = C.RESOURCE_IRON; break;
			case 'p': this.land_type = C.LAND_ROCK; break;
			case 'q': this.land_type = C.LAND_WATER; break;
			case 'r': this.land_type = C.LAND_BRIDGE; break;
			case 's': this.land_type = C.LAND_STEAM; break;
			case 't': this.land_type = C.LAND_THORN; break;
			case 'u': this.land_type = C.LAND_COLOR_1.replace('1', def.land_num); break;
			}
			switch (def.resource_char) {
			case 'A': this._resource_type = C.RESOURCE_C_RAIL; this.td.setAttribute('resource-type',  C.RESOURCE_C_RAIL); this.rail_dir = { from: C.DIR_LEFT,   to: C.DIR_RIGHT  }; this.update_rail(); break;
			case 'B': this._resource_type = C.RESOURCE_C_RAIL; this.td.setAttribute('resource-type',  C.RESOURCE_C_RAIL); this.rail_dir = { from: C.DIR_TOP,	to: C.DIR_BOTTOM }; this.update_rail(); break;
			case 'C': this._resource_type = C.RESOURCE_C_RAIL; this.td.setAttribute('resource-type',  C.RESOURCE_C_RAIL); this.rail_dir = { from: C.DIR_TOP,	to: C.DIR_RIGHT  }; this.update_rail(); break;
			case 'D': this._resource_type = C.RESOURCE_C_RAIL; this.td.setAttribute('resource-type',  C.RESOURCE_C_RAIL); this.rail_dir = { from: C.DIR_RIGHT,  to: C.DIR_BOTTOM }; this.update_rail(); break;
			case 'E': this._resource_type = C.RESOURCE_C_RAIL; this.td.setAttribute('resource-type',  C.RESOURCE_C_RAIL); this.rail_dir = { from: C.DIR_BOTTOM, to: C.DIR_LEFT   }; this.update_rail(); break;
			case 'F': this._resource_type = C.RESOURCE_C_RAIL; this.td.setAttribute('resource-type',  C.RESOURCE_C_RAIL); this.rail_dir = { from: C.DIR_TOP,	to: C.DIR_LEFT   }; this.update_rail(); break;
			case 'G': this._resource_type = C.RESOURCE_RAIL;   this.td.setAttribute('resource-type',  C.RESOURCE_RAIL);   this.rail_dir = { from: C.DIR_LEFT,   to: C.DIR_RIGHT  }; this.update_rail(); if (def.resource_count) this.resource_count = def.resource_count; break;
			case 'H': this._resource_type = C.RESOURCE_RAIL;   this.td.setAttribute('resource-type',  C.RESOURCE_RAIL);   this.rail_dir = { from: C.DIR_TOP,	to: C.DIR_BOTTOM }; this.update_rail(); if (def.resource_count) this.resource_count = def.resource_count; break;
			case 'I': this._resource_type = C.RESOURCE_RAIL;   this.td.setAttribute('resource-type',  C.RESOURCE_RAIL);   this.rail_dir = { from: C.DIR_TOP,	to: C.DIR_RIGHT  }; this.update_rail(); if (def.resource_count) this.resource_count = def.resource_count; break;
			case 'J': this._resource_type = C.RESOURCE_RAIL;   this.td.setAttribute('resource-type',  C.RESOURCE_RAIL);   this.rail_dir = { from: C.DIR_RIGHT,  to: C.DIR_BOTTOM }; this.update_rail(); if (def.resource_count) this.resource_count = def.resource_count; break;
			case 'K': this._resource_type = C.RESOURCE_RAIL;   this.td.setAttribute('resource-type',  C.RESOURCE_RAIL);   this.rail_dir = { from: C.DIR_BOTTOM, to: C.DIR_LEFT   }; this.update_rail(); if (def.resource_count) this.resource_count = def.resource_count; break;
			case 'L': this._resource_type = C.RESOURCE_RAIL;   this.td.setAttribute('resource-type',  C.RESOURCE_RAIL);   this.rail_dir = { from: C.DIR_TOP,	to: C.DIR_LEFT   }; this.update_rail(); if (def.resource_count) this.resource_count = def.resource_count; break;
			case 'M': this.resource_type = C.RESOURCE_WOOD; if (def.resource_count) this.resource_count = def.resource_count; break;
			case 'N': this.resource_type = C.RESOURCE_IRON; if (def.resource_count) this.resource_count = def.resource_count; break;
			case 'O': this.resource_type = C.RESOURCE_AXE; break;
			case 'P': this.resource_type = C.RESOURCE_PICKAXE; break;
			case 'Q': this.resource_type = C.RESOURCE_BACKET; break;
			case 'R': this.resource_type = C.RESOURCE_BACKET_EMPTY; break;
			case 'S': this.resource_type = C.RESOURCE_DYNAMITE_1.replace('1', def.resource_count || 1); break;
			case 'T': this._resource_type = C.RESOURCE_FACE; this.td.setAttribute('resource-type',  C.RESOURCE_FACE); this.td.setAttribute('face-id', def.resource_count); this.td.style.setProperty('--face-image', 'url(../img/face/face-'+def.resource_count+'.png)'); break;
			case 'U': this._resource_type = C.RESOURCE_SYMBOL; this.td.setAttribute('resource-type',  C.RESOURCE_SYMBOL); this.td.setAttribute('symbol-id', def.resource_count); this.td.style.setProperty('--symbol-image', 'url(../img/symbol/'+def.resource_count+'.png)'); break;
			case 'V': this.resource_type = C.RESOURCE_BOLT; break;
			}
			switch (def.symbol_char) {
			case 'X': this._symbol_type = C.SYMBOL_SYMBOL; this.td.setAttribute('symbol-type',  C.SYMBOL_SYMBOL); this.td.setAttribute('symbol-id', def.symbol_id); this.td.style.setProperty('--symbol-image', 'url(../img/symbol/'+def.symbol_id+'.png)'); break;
			case 'Y': this._symbol_type = C.SYMBOL_FACE; this.td.setAttribute('symbol-type',  C.SYMBOL_FACE); this.td.setAttribute('face-id', def.symbol_id); this.td.style.setProperty('--face-image', 'url(../img/face/face-'+def.symbol_id+'.png)'); break;
			}
		}
		this.set_event();
	}

	/** .set_event()
	 */
	set_event() {

		/** 右クリックメニューの削除
		 */
		this.td.oncontextmenu = () => { return false };

		/** マウスボタンが押されたとき
		 */
		this.td.addEventListener('mousedown', (e) => {

			// 左クリックか右クリックかで場合分け
			if (e.button === 0) {
				// 左クリック
				switch (I.mouse_state.current_palette_type) {
				case C.PALETTE_SELECT_LAND:
				case C.PALETTE_SELECT_RESOURCE:
				case C.PALETTE_SELECT_MINE:
				case C.PALETTE_SELECT_SYMBOL:
					// 押されているキーによって場合分け
					if (I.key_state['Control']) {
						// コントロールキーが押されているなら塗りつぶし
						if (I.mouse_state.current_palette_type === C.PALETTE_SELECT_LAND) {
							U.fill(this.x, this.y, I.mouse_state.current_palette_item, this.land_type);
							map.onchange();
						}
					} else if (I.key_state['Shift'] || I.key_state['Alt']) {
						// シフトキーが押されているなら直線塗り
						I.route_highlight_cells.forEach((cell) => {
							cell.apply_palette();
						});
						highlight.reset();
						map.onchange();
					} else {
						// 何のキーも押されていないならここを塗る
						this.apply_palette();
					}
					break;
				case C.PALETTE_SELECT_TRAIN:
					train.put(this);
					map.onchange();
					break;
				}

				// 最後に置いたセルを変更する
				I.mouse_state.last_put_cell = this;
				I.mouse_state.last_move_cell = this;
				I.mouse_state.changed = true;

			} else if (e.button === 2) {

				// 右クリック
				if (this.land_type.includes(C.LAND_COLOR)) {
					const li = document.querySelector(`[land-type=${C.LAND_COLOR_1}]`);
					li.trigger('click');
					li.style.setProperty('background-image', `url(./assets/img/color/${this.land_type.replace('color-', '')}.png)`);
				} else {
					document.querySelector(`[land-type=${this.land_type}]`).trigger('click');
				}
				logger.log(this);

			}

		}, { passive: false });

		/** マウスカーソルが侵入したとき
		 */
		this.td.addEventListener('mouseenter', (e) => {

			const last_move_cell_prev = I.mouse_state.last_move_cell;
			I.mouse_state.last_move_cell = this;

			// マウスボタンが押されているかどうかで場合分け
			if (I.mouse_state.is_down) {

				// マウスボタンが押されている(＝ドラッグ)場合
				// このマスの地形か物資を変更する
				switch (I.mouse_state.current_palette_type) {
				case C.PALETTE_SELECT_LAND:
				case C.PALETTE_SELECT_RESOURCE:
				case C.PALETTE_SELECT_MINE:
				case C.PALETTE_SELECT_SYMBOL:
					const cells = U.get_straight_route(last_move_cell_prev, I.mouse_state.last_move_cell);
					if (cells && cells.length) {
						for (let i = 1; i < cells.length; i++) {
							const cell = cells[i];
							cell.apply_palette(true);
						}
						I.mouse_state.changed = true;
						I.mouse_state.last_put_cell = this;
					}
					break;
				case C.PALETTE_SELECT_TRAIN:
						train.put(this);
						I.mouse_state.changed = true;
						I.mouse_state.last_put_cell = this;
					break;
				}
				highlight.mouse();

			} else {

				// マウスボタンが押されていない場合
				if (I.mouse_state.current_palette_type === C.PALETTE_SELECT_MINE && I.mouse_state.current_palette_item === C.MINE_DYNAMITE) {
					const dynamite_level = parseInt(document.getElementById('mine-dynamite').getAttribute('dynamite-level'));
					highlight.dynamite(dynamite_level);
				} else if (I.key_state['Shift']) {
					highlight.route(false);
				} else if (I.key_state['Alt']) {
					highlight.route(true);
				} else {
					highlight.mouse();
				}

			}
		});

		/** マウスホイールを回したとき
		 */
		this.td.addEventListener('mousewheel', (e) => {
			e.preventDefault();
			const r = this.resource_type;
			if (r === C.RESOURCE_RAIL || r === C.RESOURCE_WOOD || r === C.RESOURCE_IRON) {
				let a = this.resource_count;
				let b;
				if (e.wheelDelta > 0) {
					b = Math.max(1, Math.min(99, a + 1));
				} else {
					b = Math.max(1, Math.min(99, a - 1));
				}
				if (a !== b) {
					this.resource_count = b;
					tempstate.push_undo_stack();
				}
			}
		}, { passive: false });
	}

	/** .apply_palette(is_drag)
	 */
	apply_palette(is_drag) {
		switch (I.mouse_state.current_palette_type) {
		case C.PALETTE_SELECT_LAND:
			this.land_type = I.mouse_state.current_palette_item;
			this.life = 3;
			if (!this.is_vacant()) {
				this.resource_type = C.RESOURCE_NONE;
			}
			if (I.mouse_state.current_palette_item === C.LAND_STATION_L) {
				const right = this.right();
				if (right) {
					right.land_type = C.LAND_STATION_R;
				}
			}
			break;
		case C.PALETTE_SELECT_RESOURCE:
			if (is_drag) {
				if (this.resource_type !== I.mouse_state.current_palette_item) {
					this.resource_type = I.mouse_state.current_palette_item;
				}
			} else {
				this.resource_type = I.mouse_state.current_palette_item;
			}
			break;
		case C.PALETTE_SELECT_SYMBOL:
			this.symbol_type = I.mouse_state.current_palette_item;
			break;
		case C.PALETTE_SELECT_MINE:
			switch (I.mouse_state.current_palette_item) {
			case C.MINE_AXE:
				this.mine(3);
				break;
			case C.MINE_DYNAMITE:
				const dynamite_level = parseInt(document.getElementById('mine-dynamite').getAttribute('dynamite-level'));
				this.mine_with_dynamite(dynamite_level);
				break;
			}
			break;
		}
		map.onchange();
	}

	/** .mine()
	 */
	mine(power) {
		if (!power) {
			return;
		}
		if (this.land_type === C.LAND_TREE) {
			if (this.life > 0) {
				this.life = Math.max(0, this.life - power);
				if (this.life === 0) {
					this.resource_type = C.RESOURCE_WOOD;
				}
			}
		}
		if (this.land_type === C.LAND_IRON) {
			if (this.life > 0) {
				this.life = Math.max(0, this.life - power);
				if (this.life === 0) {
					this.resource_type = C.RESOURCE_IRON;
				}
			}
		}
	}

	/** .mine_with_dynamite()
	 */
	mine_with_dynamite(level) {
		const targets = U.get_dynamite_targets(this, level);
		if (targets && targets.length) {
			targets.forEach((target) => {
				target.cell.mine(target.power);
			});
		}
	}

	/** .is_vacant
	 */
	is_vacant() {
		let ret = false;
		switch (this.land_type) {
		case C.LAND_PLAIN: ret = true; break;
		case C.LAND_COLOR_1: ret = true; break;
		case C.LAND_COLOR_2: ret = true; break;
		case C.LAND_COLOR_3: ret = true; break;
		case C.LAND_COLOR_4: ret = true; break;
		case C.LAND_COLOR_5: ret = true; break;
		case C.LAND_COLOR_6: ret = true; break;
		case C.LAND_COLOR_7: ret = true; break;
		case C.LAND_COLOR_8: ret = true; break;
		case C.LAND_COLOR_9: ret = true; break;
		case C.LAND_COLOR_10: ret = true; break;
		case C.LAND_BRIDGE: ret = true; break;
		default: break;
		}
		return ret;
	}

	/** .life
	 */
	get life() {
		return this._life;
	}
	set life(value) {
		this.td.setAttribute('life', value);
		this._life = value;
	}

	/** .update_rail()
	 * レールの状況を更新する
	 */
	update_rail() {
		// リソースタイプが線路で接続元が定義されている場合
		if (this.resource_type === C.RESOURCE_C_RAIL) {
			// 接続先が定義されているかどうかで場合分け
			if (this.rail_dir.to < 0) {
				// 接続先が定義されていない場合
				// 接続元が上下か左右かで場合分け
				if (this.rail_dir.from === 0 || this.rail_dir.from === 2) {
					// 上下の場合
					this.td.setAttribute('rail-direction',  'tb');
				} else {
					// 左右の場合
					this.td.setAttribute('rail-direction',  'rl');
				}
			} else {
				// 接続先が定義されている場合
				const arr = [this.rail_dir.from, this.rail_dir.to].sort();
				const dir_words = ['t', 'r', 'b', 'l'];
				const dir_word = `${dir_words[arr[0]]}${dir_words[arr[1]]}`; 
				this.td.setAttribute('rail-direction',  dir_word);
			}
		}
	}

	/** .land_type
	 */
	get land_type() {
		return this._land_type;
	}
	set land_type(value) {
		this._land_type = value;
		this.td.setAttribute('land-type',  value);
	}

	/** .checkNextConnectionAround
	 */
	checkNextConnectionAround(ignore_dir) {
		// 上下左右のマスについてチェック
		let ret = false;
		for (let i = 0; i < C.DIRS.length; i++) {
			if (i === ignore_dir) {
				continue;
			}
			const j = U.reverse_dir(i);
			let nx = this.x + C.DIRS[i][0];
			let ny = this.y + C.DIRS[i][1];
			// そこがマップの範囲内であり
			if (map.is_on_map(nx, ny)) {
				let that = I.map_cell[ny][nx];
				// そこに終端ではない線路が敷いてあるならば
				if (that.check_end_of_rail() || (that.resource_type === C.RESOURCE_RAIL && that.resource_count === 1)) {
					this.rail_dir[this.get_free_dir()] = i;
					this.update_rail();
					that.rail_dir[that.get_free_dir()] = j;
					that._resource_type = C.RESOURCE_C_RAIL;
					that.td.setAttribute('resource-type',  C.RESOURCE_C_RAIL);
					that.update_rail();
					that.checkNextConnectionOne();
					ret = true;
					break;
				}
			}
		}
		return ret;
	}

	/** .checkNextConnectionOne
	 */
	checkNextConnectionOne() {
		const i = (this.rail_dir.to > -1) ? this.rail_dir.to : U.reverse_dir(this.rail_dir.from);
		const j = U.reverse_dir(i);
		const nx = this.x + C.DIRS[i][0];
		const ny = this.y + C.DIRS[i][1];
		if (map.is_on_map(nx, ny)) {
			const that = I.map_cell[ny][nx];
			if (that.resource_type === C.RESOURCE_RAIL && that.resource_count === 1 && that.rail_dir.from === j) {
				that._resource_type = C.RESOURCE_C_RAIL;
				that.td.setAttribute('resource-type',  C.RESOURCE_C_RAIL);
				that.checkNextConnectionOne();
			}
		}
	}

	/** .connectToEndOfRail
	 */
	connectToEndOfRail() {
		// 上下左右のマスについてチェック
		let ret = false;
		for (let i = 0; i < C.DIRS.length; i++) {
			const j = U.reverse_dir(i);
			let nx = this.x + C.DIRS[i][0];
			let ny = this.y + C.DIRS[i][1];
			// そこがマップの範囲内であり
			if (map.is_on_map(nx, ny)) {
				let that = I.map_cell[ny][nx];
				// そこが敷いてある線路の終端ならば
				if (that.check_end_of_rail()) {
					const d1 = that.get_free_dir();
					const d2 = (d1 === 'from') ? 'to' : 'from';
					that.rail_dir[d1] = j;
					if (that.is_flexible) {
						that.rail_dir[d2] = i;
						that.is_flexible = false;
					}
					that.update_rail();
					this.rail_dir[this.get_free_dir(i)] = i;
					this.update_rail();
					this.checkNextConnectionAround(i);
					ret = true;
					break;
				}
			}
		}
		return ret;
	}

	/** .symbol_type
	 */
	get symbol_type() {
		return this._symbol_type;
	}
	set symbol_type(value) {
		switch (value) {
		case C.SYMBOL_ERASER:
			this._symbol_type = C.SYMBOL_NONE;
			this.td.setAttribute('symbol-type',  value);
			break;
		case C.SYMBOL_SYMBOL:
			this._symbol_type = value;
			this.td.setAttribute('symbol-type',  value);
			const symbol_id = document.getElementById('palette-symbol').getAttribute('symbol-id');
			this.td.setAttribute('symbol-id', symbol_id);
			this.td.style.setProperty('--symbol-image', 'url(../img/symbol/'+symbol_id+'.png)');
			break;
		case C.SYMBOL_FACE:
			this._symbol_type = value;
			this.td.setAttribute('symbol-type',  value);
			const face_id = document.getElementById('palette-symbol-face').getAttribute('face-id');
			this.td.setAttribute('face-id', face_id);
			this.td.style.setProperty('--face-image', 'url(../img/face/face-'+face_id+'.png)');
			break;
		}
	}

	/** .resource_type
	 */
	get resource_type() {
		return this._resource_type;
	}
	set resource_type(value) {
		switch (value) {
		case C.RESOURCE_ERASER:
			this._resource_type = C.RESOURCE_NONE;
			this.resource_count = 0;
			this.td.setAttribute('resource-type',  value);
			break;
		case C.RESOURCE_C_RAIL:
			// 線路の場合
			// ここが接続線路でないときに限り
			if (this._resource_type !== C.RESOURCE_C_RAIL) {
				this._resource_type = value;
				this.resource_count = 1;
				this.rail_dir = {
					from: C.DIR_NONE,
					to: C.DIR_NONE,
				};
				this.td.setAttribute('rail-direction', 'rl');
				this.td.setAttribute('resource-type',  value);
				// 周囲との接続を試みる
				if (this.connectToEndOfRail()) {
				} else {
					this.is_flexible = true;
					this.update_rail();
				}
			}
			break;
		default:
			if (this._resource_type !== value || value === C.RESOURCE_FACE || value === C.RESOURCE_SYMBOL) {
				this._resource_type = value;
				this.resource_count = 1;
				this.rail_dir = {
					from: C.DIR_NONE,
					to: C.DIR_NONE,
				};
				this.td.setAttribute('resource-type',  value);
				if (value.includes('dynamite')) {
					//const dynamite_level = parseInt(document.getElementById('resource-dynamite').getAttribute('dynamite-level'));
					const dynamite_level = parseInt(value.split('-')[1]);
					this.td.setAttribute('level', dynamite_level);
				}
				if (value === C.RESOURCE_FACE) {
					const face_id = document.getElementById('palette-face').getAttribute('face-id');
					this.td.setAttribute('face-id', face_id);
					this.td.style.setProperty('--face-image', 'url(../img/face/face-'+face_id+'.png)');
				}
				if (value === C.RESOURCE_SYMBOL) {
					const symbol_id = document.getElementById('palette-symbol').getAttribute('symbol-id');
					this.td.setAttribute('symbol-id', symbol_id);
					this.td.style.setProperty('--symbol-image', 'url(../img/symbol/'+symbol_id+'.png)');
				}
				if (value === C.RESOURCE_RAIL) {
					this.rail_dir = {
						from: 3,
						to: 1,
					};
					this.update_rail();
				}
			} else {
				if (value === C.RESOURCE_RAIL || value === C.RESOURCE_WOOD || value === C.RESOURCE_IRON) {
					this.resource_count += 1;
				} 
			}
			break;
		}
	}

	/** .resource_count
	 */
	get resource_count() {
		return this._resource_count;
	}
	set resource_count(value) {
		this._resource_count = value;
		this.resource_count_elm.textContent = value;
		if (value > 1) {
			this.resource_count_elm.style.setProperty('display', 'block');
		} else {
			this.resource_count_elm.style.setProperty('display', 'none');
		}
	}

	/** .check_end_of_rail()
	 */
	check_end_of_rail() {
		// そこにレールがあり
		if (this.resource_type === C.RESOURCE_C_RAIL) {
			const from = this.get_cell_with_dir(this.rail_dir.from);
			const to = this.get_cell_with_dir(this.rail_dir.to);
			if (from && to && this.is_connect_to(from) && this.is_connect_to(to)) {
				return false;
			} else {
				return true;
			}
		}
		return false;
	}

	/** .get_cell_with_dir(dir_idx)
	 */
	get_cell_with_dir(dir_idx) {
		if (dir_idx < 0) {
			return null;
		}
		const dir = C.DIRS[dir_idx];
		const nx = this.x + dir[0];
		const ny = this.y + dir[1];
		if (map.is_on_map(nx, ny)) {
			return I.map_cell[ny][nx];
		}
		return null;
	}

	/** .is_connect_to(that)
	 */
	is_connect_to(that) {
		if (!that) return false;
		const a = this.get_cell_with_dir(this.rail_dir.to);
		const b = this.get_cell_with_dir(this.rail_dir.from);
		const c = that.get_cell_with_dir(that.rail_dir.to);
		const d = that.get_cell_with_dir(that.rail_dir.from);
		return (a === that || b === that) && (c === this || d === this);
	}

	/** .get_free_dir(dir)
	 */
	get_free_dir(dir = -1) {
		if (dir < 0) {
			const a = this.get_cell_with_dir(this.rail_dir.to);
			return (this.is_connect_to(a)) ? 'from' : 'to';
		} else {
			return (this.rail_dir.from !== dir) ? 'from' : 'to';
		}
	}

	/** .get_next_cell(dir)
	 */
	get_next_cell(dir_idx) {
		if (dir_idx < 0 || isNaN(dir_idx)) return null;
		const dir = C.DIRS[dir_idx];
		const nx = this.x + dir[0];
		const ny = this.y + dir[1];
		if (map.is_on_map(nx, ny)) {
			return I.map_cell[ny][nx];
		}
		return null;
	}

	/** .get_next_rail()
	 */
	get_next_rail(arg) {
		if (typeof arg === 'string') {
			const dir = this.rail_dir[arg];
			const ret = this.get_next_cell(dir);
			if (ret && ret.resource_type === C.RESOURCE_C_RAIL) {
				return ret;
			} else {
				return null;
			}
		} else {
			const next_a = this.get_next_cell(this.rail_dir['from']);
			const next_b = this.get_next_cell(this.rail_dir['to']);
			return (next_a === arg) ? next_b : next_a;
		}
		return null;
	}

	/** .right()
	 */
	right() {
		const nx = this.x + 1;
		const ny = this.y;
		if (map.is_on_map(nx, ny)) {
			return I.map_cell[ny][nx];
		}
		return null;
	}
}