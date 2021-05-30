const toaster = {

	/** .init()
	 */
	init() {
		this.timer;
		this.image = document.getElementById('bot-image');
		this.head = document.getElementById('bot-head-area');
		this.balloon = document.getElementById('bot-balloon');
		this.loaded_src = {};
		let neglect_timer;
		let move_reset_timer;
		let move_on_head = 0;
		let prev_mouse_x = -1;
		let prev_mouse_y = -1;
		this.image.addEventListener('mouseenter', (e) => {
			clearTimeout(neglect_timer);
			neglect_timer = setTimeout(() => {
				this.emoji('p2-7');
			}, 1000);
		});
		this.image.addEventListener('mouseleave', (e) => {
			clearTimeout(neglect_timer);
			move_reset_timer = setTimeout(() => {
				move_on_head = 0;
				prev_mouse_x = -1;
				prev_mouse_y = -1;
			}, 1000);
		});
		this.head.addEventListener('mousemove', (e) => {
			clearTimeout(move_reset_timer);
			if (prev_mouse_x > -1) {
				const move_x = Math.abs(prev_mouse_x - e.pageX);
				const move_y = Math.abs(prev_mouse_y - e.pageY);
				move_on_head += move_x + move_y;
				if (move_on_head > 300) {
					move_on_head = 0;
					this.emoji('p2-1');
				}
			}
			prev_mouse_x = e.pageX;
			prev_mouse_y = e.pageY;
		});
		this.image.addEventListener('click', (e) => {
			clearTimeout(neglect_timer);
			const r = parseInt(100 * Math.random());
			let emoji;
			if (r < 70) emoji = 'p2-2';
			else if (r < 80) emoji = 'p1-8';
			else if (r < 90) emoji = 'p2-3';
			else emoji = 'p2-2-a';
			this.emoji(emoji);
		});
		this.image.addEventListener('mousewheel', (e) => {
			clearTimeout(neglect_timer);
			e.preventDefault();
			if (e.wheelDelta > 0) {
				this.emoji('p3-1');
			} else {
				this.emoji('p3-5');
			}
		}, { passive: false });
	},

	/** .parse(str)
	 */
	parse(str) {
		return str.replace(/:.+:/, (match) => {
			const type = match.replace(/:/g, '');
			return '<img class="single-emoji" data-src="./assets/img/emoji/emoji-'+type+'.png">';
		});
	},

	/** .log(str, time, type)
	 */
	log(str, time = 3000, type) {
		this.balloon.innerHTML = this.parse(str);
		this.balloon.classList.remove('error', 'success', 'gray', 'orange', 'emoji', 'blue');
		this.balloon.classList.add(type);
		this.balloon.style.setProperty('display', 'none');
		const onload = () => {
			this.balloon.style.setProperty('animation-duration', time + 'ms');
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.balloon.style.setProperty('display', 'block');
				this.timer = setTimeout(() => {
					this.balloon.style.setProperty('display', 'none');
				}, time);
			}, 33);
		};
		const img = this.balloon.querySelector('img');
		if (img) {
			const src = img.getAttribute('data-src');
			if (this.loaded_src[src]) {
				img.src = src;
				onload();
			} else {
				img.onload = () => {
					onload();
					this.loaded_src[src] = true;
				};
				img.src = src;
			}
		} else {
			onload();
		}
	},

	/** .emoji(type, time)
	 */
	emoji(type, time) {
		const str = '<img class="single-emoji" data-src="./assets/img/emoji/emoji-'+type+'.png">';
		this.log(str, time, 'emoji');
	},

	/** .gray(str, time)
	 */
	gray(str, time) {
		this.log(str, time, 'gray');
	},

	/** .orange(str, time)
	 */
	orange(str, time) {
		this.log(str, time, 'orange');
	},

	/** .blue(str, time)
	 */
	blue(str, time) {
		this.log(str, time, 'blue');
	},

	/** .success(str, time)
	 */
	success(str, time) {
		this.log(str, time, 'success');
	},

	/** .error(str, time)
	 */
	error(str, time) {
		this.log(str, time, 'error');
	},
};

export { toaster as default };