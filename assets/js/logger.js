const logger = {

	/** .get_time_str()
	 */
	get_time_str() {
		const date = new Date();
		var h = date.getHours().padding(1);
		var m = date.getMinutes().padding(2);
		var s = date.getSeconds().padding(2);
		return `${h}:${m}:${s}`;
	},

	/** .hr()
	 */
	hr() {
		console.log('------------------------------');
	},

	/** .log(str)
	 */
	log(str) {
		if (typeof str === 'string') {
			console.log(`${this.get_time_str()} ${str}`);
		} else {
			console.log(`${this.get_time_str()} %o`, str);
		}
	},

	/** .error(str)
	 */
	error(str) {
		console.error(`${this.get_time_str()} ${str}`);
	},

	/** .info(str)
	 */
	info(str) {
		console.info(`${this.get_time_str()} ${str}`);
	},
};

export { logger as default };