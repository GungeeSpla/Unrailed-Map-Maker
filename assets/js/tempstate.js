import * as C from './constants.js';
import * as U from './utilities.js';
import I from './instances.js';
import map from './map.js';
import logger from './logger.js';
import toaster from './toaster.js';

const tempstate = {

	current_mapstr: '',

	/** .undo_stack
	 */
	undo_stack: [],

	/** .redo_stack
	 */
	redo_stack: [],

	/** .timer
	 */
	timer: {},

	/** .reset()
	 */
	reset() {
		this.current_mapstr = map.to_str();
		while (this.undo_stack.length) {
			this.undo_stack.pop();
		}
		while (this.redo_stack.length) {
			this.redo_stack.pop();
		}
		I.state_save_data = [];
	},

	/** .redo()
	 */
	redo() {
		// リドゥスタックが空なら何もできない
		if (!this.redo_stack.length) {
			return;
		}
		// リドゥスタックから状態を取り出して開く
		map.open_str(this.redo_stack.pop());
		logger.log('Redo.');
		// アンドゥスタックにプッシュしておく
		this.push_undo_stack();
	},

	/** .undo()
	 */
	undo() {
		// アンドゥスタックが空なら何もできない
		if (!this.undo_stack.length) {
			return;
		}
		// アンドゥスタックから状態を取り出して開く
		map.open_str(this.undo_stack.pop());
		logger.log('Undo.');
		// リドゥスタックにプッシュしておく
		this.push_redo_stack();
	},

	/** .push_undo_stack()
	 */
	push_undo_stack() {
		clearTimeout(this.timer['push_undo_stack']);
		this.timer['push_undo_stack'] = setTimeout(() => {
			this.undo_stack.push(this.current_mapstr);
			if (this.undo_stack.length > C.UNDO_STACK_LENGTH_MAX) {
				this.undo_stack.shift();
			}
			logger.log('Pushed to undo-stack.');
			this.current_mapstr = map.to_str();
		}, 50);
	},

	/** .push_redo_stack()
	 */
	push_redo_stack() {
		this.redo_stack.push(this.current_mapstr);
		if (this.redo_stack.length > C.UNDO_STACK_LENGTH_MAX) {
			this.redo_stack.shift();
		}
		logger.log('Pushed to redo-stack.');
		this.current_mapstr = map.to_str();
	},

	/** .state_load(slot)
	 */
	load(num) {
		if (I.state_save_data[num]) {
			toaster.success( U.get_lang('toaster-success-load-state').replace('{num}', num) );
			logger.log(`Loading state save data [F${num}].`);
			map.open_str(I.state_save_data[num]);
		} else {
			toaster.error( U.get_lang('toaster-success-load-state-error').replace('{num}', num) );
			logger.error(`No state save data [F${num}] exists.`);
		}
	},

	/** .state_save(slot)
	 */
	save(num) {
		const data = map.to_str();
		I.state_save_data[num] = data;
		logger.log(`Saved state save data [F${num}].`);
		toaster.success( U.get_lang('toaster-success-save-state').replace('{num}', num) );
	},
}

export { tempstate as default };