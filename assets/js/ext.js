/** Elementクラスの拡張
 -------------------------------------*/

/** Element.text(str)
 */
Element.prototype.text = function(str) {
	this.textContent = str;
	return this;
};

/** Element.val(value)
 */
Element.prototype.val = function(value) {
	this.value = value;
	return this;
};

/** Element.appendTo(elm)
 */
Element.prototype.appendTo = function(elm) {
	elm.append(this);
	return this;
};

/** Element.trigger(type)
 */
Element.prototype.trigger = function(type) {
	const event = document.createEvent('Event');
	event.initEvent(type, false, true);
	this.dispatchEvent(event);
	return this;
};

/** Element.attr(name, value)
 */
Element.prototype.attr = function(name, value) {
	if (arguments.length === 1) {
		return this.getAttribute(name);
	} else if (arguments.length === 2) {
		this.setAttribute(name, value);
		return this;
	}
};

/** Element.css(name, value)
 */
Element.prototype.css = function() {
	if (typeof arguments[0] === 'object') {
		Object.keys(arguments[0]).forEach((key) => {
			this.style.setProperty(key, arguments[0][key]);
		});
	} else {
		if (arguments.length === 1) {
			return this.style.getPropertyValue(arguments[0]);
		} else {
			for (let i = 0; i < arguments.length; i += 2) {
				this.style.setProperty(arguments[i], arguments[i + 1]);
			}
		}
	}
	return this;
};

/** Element.on(names, callback)
 */
Element.prototype.on = function(names, callback, opt) {
	names.split(' ').forEach((name) => {
		this.addEventListener(name, callback, opt);
	});
	return this;
};

/** Stringクラスの拡張
 -------------------------------------*/

/** String.bytes
 * @see https://qiita.com/sawamur@github/items/a46a70b724e3dd9378f2
 */
String.prototype.bytes = function () {
	var bytes = 0,
		i,c,
		len = this.length;
	for(i=0 ;i < len ; i++){
		c = this[i].charCodeAt(0)
		if (c <= 127){
			bytes += 1;
		} else if (c <= 2047){
			bytes += 2;
		} else {
			bytes += 3;
		}
	}
	return bytes;
};

/** String.kbytes
 */
String.prototype.kbytes = function () {
	return (this.bytes() / 1024).toFixed(3);
}

/** String.deflate
 */
String.prototype.deflate = function () {
	return Base64.toBase64(RawDeflate.deflate(Base64.utob(this)));
}

/** String.inflate
 */
String.prototype.inflate = function () {
	return Base64.btou(RawDeflate.inflate(Base64.fromBase64(this)));
}

/** String.toNumber
 */
String.prototype.toNumber = function () {
	return this.charCodeAt(0) - ('a').charCodeAt(0);
}

/** Numberクラスの拡張
 -------------------------------------*/

/** Number.times
 */
Number.prototype.times = function (callback) {
	for (let i = 0; i < this; i++) {
		callback(i);
	}
};

/** Number.padding
 */
Number.prototype.padding = function (digit) {
	return String(this).padStart(digit, '0');
};

/** Number.toAlphabet
 */
Number.prototype.toAlphabet = function () {
	return String.fromCharCode(('a').charCodeAt(0) + this)
};