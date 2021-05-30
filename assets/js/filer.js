import * as C from './constants.js';
import * as U from './utilities.js';
import I from './instances.js';
import map from './map.js';
import storage from './storage.js';
import tempstate from './tempstate.js';

const filer = {

	/** .load(file_key)
	 */
	load(file_key) {
		const file = I.save_data.file[file_key];
		if (file) {
			map.open_str(file.data);
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
			tempstate.reset();
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
				data: map.to_str(),
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
			data: map.to_str(),
		};
		I.save_data.last_file_key = timestamp;
		storage.save();
		I.current_file_key = timestamp;
		I.is_saved = true;
		U.get_elm('#file-name').val(title).classList.add('enabled');
		U.get_elm('#file-save').classList.add('enabled');
	},
};

export { filer as default };