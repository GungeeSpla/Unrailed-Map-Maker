import * as C from './constants.js';
import * as U from './utilities.js';
import I from './instances.js';

const storage = {

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

export { storage as default };