import * as C from './constants.js';
import * as U from './utilities.js';
import I from './instances.js';

const highlight = {

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

export { highlight as default };