import * as C from './constants.js';
import I from './instances.js';
import map from './map.js';
import Cell from './Cell.js';

/** copy_str_to_clipboard(str)
 * 文字列をクリップボードにコピーします。
 * @see https://qiita.com/simiraaaa/items/2e7478d72f365aa48356
 */
export function copy_str_to_clipboard(str) {
	var tmp = create_elm('div');
	var pre = document.createElement('pre');
	pre.style.webkitUserSelect = 'auto';
	pre.style.userSelect = 'auto';
	tmp.appendChild(pre).textContent = str;
	var s = tmp.style;
	s.position = 'fixed';
	s.right = '200%';
	document.body.appendChild(tmp);
	document.getSelection().selectAllChildren(tmp);
	var result = document.execCommand('copy');
	document.body.removeChild(tmp);
	return result;
}


/** get_queries(url)
 */
export function get_queries(url) {
	const url_str = String(url || window.location);
	const query_str = url_str.slice(url_str.indexOf('?') + 1);
	const queries = {};
	if (!query_str) {
		return queries;
	}
	query_str.split('&').forEach((query_str) => {
		const query_arr = query_str.split('=');
		queries[query_arr[0]] = query_arr[1];
	});
	return queries;
}


/** get_lang_key()
 */
export function get_lang_key() {
	const navigator_lang_key = navigator.language || navigator.userLanguage || 'ja';
	const url_queries = get_queries();
	return url_queries.lang === 'en' ? 'en' :
		url_queries.lang === 'ja' ? 'ja' :
		navigator_lang_key.includes('ja') ? 'ja' :
		'en';
}


/** get_elm()
 */
export function get_elm(selector) {
	return document.body.querySelector(selector);
}


/** get_elms()
 */
export function get_elms(selector) {
	return document.body.querySelectorAll(selector);
}


/** create_elm(str)
 * DOM要素を新規作成します。
 * 引数strはdiv#hoge.fuga[piyo=piyo]のように指定します。
 */
export function create_elm(str, child) {
	let id;
	const attrs = [];
	const classnames = [];

	// アトリビュートを解析
	let arr = str.split('[');
	if (arr.length > 1) {
		for (let i = 1; i < arr.length; i++) {
			attrs.push(arr[i].split(']')[0].split('='));
		}
	}

	// クラスを解析
	arr = arr[0].split('.');
	if (arr.length > 1) {
		for (let i = 1; i < arr.length; i++) {
			classnames.push(arr[i]);
		}
	}

	// IDを解析
	arr = arr[0].split('#');
	if (arr.length > 1) {
		id = arr[1];
	}

	const tag = arr[0];
	const elm = document.createElement(tag);
	if (id) elm.setAttribute('id', id);
	classnames.forEach((name) => { elm.classList.add(name) });
	attrs.forEach((attr) => { elm.setAttribute(attr[0], attr[1]) });

	if (child) {
		if (typeof child === 'string') {
			elm.textContent = child;
		} else {
			elm.append(child);
		}
	}
	return elm;
}









/** reverse_dir(i)
 */
export function reverse_dir(i) {
	return (i + 2) % 4;
}


/** fill(x, y, land_type, start_land_type)
 * 座標(x, y)を基準に塗りつぶし処理を行います。
 */
export function fill(x, y, land_type, start_land_type, depth = 0) {
	if (depth === 0 && I.map_cell[y][x].land_type === land_type) {
		return;
	}
	if (I.map_cell[y][x].land_type === start_land_type) {
		I.map_cell[y][x].land_type = land_type;
	} else {
		return;
	}
	// 上
	if (y > 0) {
		fill(x, y - 1, land_type, start_land_type, depth + 1);
	}
	// 下
	if (y + 1 < I.map_cell.length) {
		fill(x, y + 1, land_type, start_land_type, depth + 1);
	}
	// 右
	if (x + 1 < I.map_cell[0].length) {
		fill(x + 1, y, land_type, start_land_type, depth + 1);
	}
	// 左
	if (x > 0) {
		fill(x - 1, y, land_type, start_land_type, depth + 1);
	}
}


/** get_dynamite_targets(put_cell, level)
 */
export function get_dynamite_targets(put_cell, level) {
	const targets = [];
	level = Math.max(1, Math.min(9, level));
	const dynamite_range = C.DYNAMITE_RANGE[level - 1];
	const dynamite_range_width = dynamite_range[0].length;
	const dynamite_range_radius = parseInt((dynamite_range_width - 1) / 2);
	for (let y = 0; y < dynamite_range_width; y++) {
		for (let x = 0; x < dynamite_range_width; x++) {
			const power = dynamite_range[y][x];
			const mx = put_cell.x - dynamite_range_radius + x;
			const my = put_cell.y - dynamite_range_radius + y;
			if (map.is_on_map(mx, my)) {
				const cell = I.map_cell[my][mx];
				targets.push({ cell, power });
			}
		}
	}
	return targets;
}


/** get_straight_route(from, to)
 */
export function get_straight_route(from, to) {
	const start_x = from.x;
	const start_y = from.y;
	const move_x = to.x - from.x;
	const move_y = to.y - from.y;
	const move_x_abs = Math.abs(move_x);
	const move_y_abs = Math.abs(move_y);
	const move_x_sign = Math.sign(move_x);
	const move_y_sign = Math.sign(move_y);
	const slope = move_y / move_x;
	const down_positions = [];
	for (let i = 0; i < move_y_abs; i++) {
		const y = move_y_sign * (i + 0.5);
		const x = Math.floor(Math.abs(y / slope + 0.5 * move_x_sign));
		down_positions.push(x);
	}
	const cells = [];
	for (let x = 0, y = 0; x <= move_x_abs; x++) {
		const cell = I.map_cell[start_y + move_y_sign * y][start_x + move_x_sign * x];
		cells.push(cell);
		while (down_positions.length) {
			if (down_positions[0] === x) {
				y++;
				const cell_2 = I.map_cell[start_y + move_y_sign * y][start_x + move_x_sign * x];
				cells.push(cell_2);
				down_positions.shift();
			} else {
				break;
			}
		}
	}
	return cells;
}


/** get_dijkstra_route(from, to)
 */
export function get_dijkstra_route(from, to) {
	for (let y = 0; y < I.map_cell.length; y++) {
		for (let x = 0; x < I.map_cell[y].length; x++) {
			I.map_cell[y][x].explore_data = {
				score: -Infinity,
				from: null,
				is_end: false,
			};
		}
	}
	from.explore_data.score = 0;
	to.explore_data.is_end = true;
	explore_loop(from, 0);
	const route = [];
	if (to.explore_data.from) {
		let cell = to;
		for (let i = 0; i < 9999; i++) {
			route.push(cell);
			if (cell === from) {
				break;
			}
			cell = cell.explore_data.from;
		}
		route.reverse();
	}
	return route;
}


/** explore_loop(cell, depth)
 */
export function explore_loop(cell, depth) {
	let add_score = 0;
	C.DIRS.forEach((dir) => {
		const nx = cell.x + dir[0];
		const ny = cell.y + dir[1];
		if (map.is_on_map(nx, ny)) {
			const to = I.map_cell[ny][nx];
			if (to.land_type === C.LAND_ROCK) {
				add_score += 0.1;
			}
		}
	});
	C.DIRS.forEach((dir) => {
		const nx = cell.x + dir[0];
		const ny = cell.y + dir[1];
		if (map.is_on_map(nx, ny)) {
			const to = I.map_cell[ny][nx];
			if (to.land_type !== C.LAND_ROCK && to.resource_type !== C.RESOURCE_C_RAIL) {
				const score = cell.explore_data.score - 1 + add_score;
				if (score > to.explore_data.score) {
					to.explore_data.score = score;
					to.explore_data.from = cell;
					if (!to.explore_data.is_end) {
						explore_loop(to, depth + 1);
					}
				}
			}
		}
	});
}


/** get_now_date_str()
 */
export function get_now_date_str() {
	var date = new Date();
	var y = date.getFullYear();
	var M = date.getMonth() + 1;
	var d = date.getDate();
	var H = date.getHours();
	var m = date.getMinutes();
	var s = date.getSeconds();
	var str = y + '-'
	  + ('00' + M).slice(-2) + '-'
	  + ('00' + d).slice(-2) + '-'
	  + ('00' + H).slice(-2) + '-'
	  + ('00' + m).slice(-2) + '-'
	  + ('00' + s).slice(-2);
	return str;
}


/** unix_to_str(unix)
 */
export function unix_to_str(unix) {
	const date = new Date(unix * 1000);
	var Y = date.getFullYear();
	var M = date.getMonth() + 1;
	var D = date.getDate();
	var h = date.getHours();
	var m = date.getMinutes().padding(2);
	var s = date.getSeconds().padding(2);
	return `${Y}/${M}/${D} ${h}:${m}:${s}`;
}


/** get_lang(key)
 */
export function get_lang(key) {
	if (C.LANG[key]) {
		return C.LANG[key][I.lang_key];
	} else {
		console.error(key + ' is undefined.');
		return '';
	}
}


/** reverse_from_or_to(str)
 */
export function reverse_from_or_to(str) {
	return (str === 'from') ? 'to' : 'from';
}


/** 各種イージング関数 (参考：http://gizma.com/easing/)
 * t: current time, b: start value, c: change in value, d: duration
 */
export const easing = {
	linearTween(t, b, c, d) {
		return c * t / d + b;
	},
	easeInQuad(t, b, c, d) {
		t /= d;
		return c * t * t + b;
	},
	easeOutQuad(t, b, c, d) {
		t /= d;
		return -c * t * (t - 2) + b;
	},
	easeInOutQuad(t, b, c, d) {
		t /= d / 2;
		if (t < 1) return c / 2 * t * t + b;
		t -= 1;
		return -c / 2 * (t * (t - 2) - 1) + b;
	},
	easeInCubic(t, b, c, d) {
		t /= d;
		return c * t * t * t + b;
	},
	easeOutCubic(t, b, c, d) {
		t /= d;
		t -= 1;
		return c * (t * t * t + 1) + b;
	},
	easeInOutCubic(t, b, c, d) {
		t /= d / 2;
		if (t < 1) return c / 2 * t * t * t + b;
		t -= 2;
		return c / 2 * (t * t * t + 2) + b;
	},
	easeInQuart(t, b, c, d) {
		t /= d;
		return c * t * t * t * t + b;
	},
	easeOutQuart(t, b, c, d) {
		t /= d;
		t -= 1;
		return -c * (t * t * t * t - 1) + b;
	},
	easeInOutQuart(t, b, c, d) {
		t /= d / 2;
		if (t < 1) return c / 2 * t * t * t * t + b;
		t -= 2;
		return -c / 2 * (t * t * t * t - 2) + b;
	},
	easeInQuint(t, b, c, d) {
		t /= d;
		return c * t * t * t * t * t + b;
	},
	easeOutQuint(t, b, c, d) {
		t /= d;
		t -= 1;
		return c * (t * t * t * t * t + 1) + b;
	},
	easeInOutQuint(t, b, c, d) {
		t /= d / 2;
		if (t < 1) return c / 2 * t * t * t * t * t + b;
		t -= 2;
		return c / 2 * (t * t * t * t * t + 2) + b;
	},
	easeInSine(t, b, c, d) {
		return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	},
	easeOutSine(t, b, c, d) {
		return c * Math.sin(t / d * (Math.PI / 2)) + b;
	},
	easeInOutSine(t, b, c, d) {
		return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	},
	easeInExpo(t, b, c, d) {
		return c * Math.pow(2, 10 * (t / d - 1)) + b;
	},
	easeOutExpo(t, b, c, d) {
		return c * (-Math.pow(2, -10 * t / d) + 1) + b;
	},
	easeInOutExpo(t, b, c, d) {
		t /= d / 2;
		if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
		t -= 1;
		return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
	},
	easeInCirc(t, b, c, d) {
		t /= d;
		return -c * (Math.sqrt(1 - t * t) - 1) + b;
	},
	easeOutCirc(t, b, c, d) {
		t /= d;
		t -= 1;
		return c * Math.sqrt(1 - t * t) + b;
	},
	easeInOutCirc(t, b, c, d) {
		t /= d / 2;
		if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
		t -= 2;
		return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
	},
};