var datetime = (function() {
	
	"use strict";
	
	
	/**
	 * I. utils
	 */
	var pad = function(number) {
		if(number < 10) return '0' + number.toString();
		else return number.toString();
	};
	
	var isInt = function(thing) {
		return !isNaN(parseInt(thing));
	};
	
	var toInt = function(thing) {
		if(!isInt(thing)) throw new TypeError();
		return parseInt(thing);
	};
	
	var isFloat = function(thing) {
		return !isNaN(parseFloat(thing));
	};
	
	var toFloat = function(thing) {
		if(!isFloat(thing)) throw new TypeError();
		return parseFloat(thing);
	};
	
	var objToArr = function(object, keys) {
		var arr = [], i;
		for(i = 0; i < keys.length; i++) {
			if(!object.hasOwnProperty(keys[i])) arr.push(0);
			else arr.push(object[keys[i]]);
		}
		return arr;
	};
	
	var takeFrom = function(arr, index, defaultVal) {
		if(index < arr.length) return arr[index];
		else return defaultVal;
	};
	
	var strftime = function(datetime, format) {
		var string = '', i, flag;
		for(i = 0; i < format.length; i++) {
			if(flag) {
				if(format[i] == '%') string += '%';
				else if(directives.hasOwnProperty(format[i])) {
					string += directives[format[i]](datetime);
				}
				flag = false;
			}
			else {
				if(format[i] == '%') flag = true;
				else string += format[i];
			}
		}
		return string;
	};
	
	var freeze = function(object) {
		if(Object.freeze) return Object.freeze(object);
		else return object;
	};
	
	var compare = function(left, right) {
		if(left < right) return -1;
		if(left > right) return 1;
		return 0;
	};
	
	var hasProperties = function(object, properties) {
		for(var i = 0; i < properties.length; i++) {
			if(!object.hasOwnProperty(properties[i])) return false;
		}
		return true;
	};
	
	var isTimedelta = function(thing) {
		return hasProperties(thing, ['days', 'seconds', 'milliseconds']);
	};
	
	var isDate = function(thing) {
		return hasProperties(thing, ['year', 'month', 'day']);
	};
	
	var isTime = function(thing) {
		return hasProperties(thing, ['hour', 'minute', 'second', 'millisecond']);
	};
	
	var isTimezone = function(thing) {
		return hasProperties(thing, ['offset']);
	};
	
	
	/**
	 * II. classes
	 */
	/**
	 * @class
	 */
	var timedelta = function() {
		this.days = 0;
		this.seconds = 0;
		this.milliseconds = 0;
	};
	
	timedelta.init = function() {
		if(arguments.length == 0) return freeze(new timedelta());
		
		var args = arguments;
		if(arguments.length == 1 && !isInt(arguments[0])) {
			args = objToArr(arguments[0], [
				'days', 'seconds', 'milliseconds',
				'minutes', 'hours', 'weeks'
			]);
		}
		
		var delta = new timedelta();
		delta.days = toInt(takeFrom(args, 0, 0));
		delta.seconds = toInt(takeFrom(args, 1, 0));
		delta.milliseconds = toInt(takeFrom(args, 2, 0));
		
		delta.seconds += toInt(takeFrom(args, 3, 0)) * 60;
		delta.seconds += toInt(takeFrom(args, 4, 0)) * 3600;
		delta.days += toInt(takeFrom(args, 5, 0)) * 7;
		
		if(delta.milliseconds >= 1000) {
			delta.seconds += parseInt(delta.milliseconds / 1000);
			delta.milliseconds %= 1000;
		}
		if(delta.seconds >= 3600*24) {
			delta.days += parseInt(delta.seconds / (3600 * 24));
			delta.seconds %= (3600 * 24);
		}
		
		return freeze(delta);
	};
	
	/**
	 * instance methods
	 */
	timedelta.prototype.total_seconds = function() {
		var seconds = this.seconds;
		seconds += this.days * 24 * 3600;
		seconds += this.milliseconds * 0.001;
		return seconds;
	};
	
	timedelta.prototype.compare = function(another) {
		if(!isTimedelta(another)) throw new TypeError();
		var res;
		res = compare(this.days, another.days); if(res) return res;
		res = compare(this.seconds, another.seconds); if(res) return res;
		res = compare(this.milliseconds, another.milliseconds); if(res) return res;
		return 0;
	};
	
	timedelta.prototype.add = function(another) {
		if(!isTimedelta(another)) throw new TypeError();
		return timedelta.init(
			this.days + another.days,
			this.seconds + another.seconds,
			this.milliseconds + another.milliseconds
		);
	};
	
	timedelta.prototype.subtract = function(another) {
		if(!isTimedelta(another)) throw new TypeError();
		return timedelta.init(
			this.days - another.days,
			this.seconds - another.seconds,
			this.milliseconds - another.milliseconds
		);
	};
	
	timedelta.prototype.multiply = function(number) {
		if(!isFloat(number)) throw new TypeError();
		var seconds = this.total_seconds() * toFloat(number);
		return timedelta.init(0, parseInt(seconds), seconds % 1 * 1000);
	};
	
	timedelta.prototype.divide = function(divisor) {
		if(isTimedelta(divisor)) {
			return this.total_seconds() / divisor.total_seconds();
		}
		else if(isFloat(divisor)) {
			var seconds = this.total_seconds() / toFloat(divisor);
			return timedelta.init(0, parseInt(seconds), seconds % 1 * 1000);
		}
		else throw new TypeError();
	};
	
	
	/**
	 * @class
	 */
	var date = function() {
		this.year = null;
		this.month  = null;
		this.day = null;
	};
	
	date.init = function() {
		var args = arguments;
		if(arguments.length == 1) {
			args = objToArr(arguments[0], ['year', 'month', 'day']);
		}
		
		if(args.length != 3) throw new TypeError();
		
		var d = new date();
		
		d.year = toInt(args[0]);
		d.month = toInt(args[1]);
		d.day = toInt(args[2]);
		
		return freeze(d);
	};
	
	date.init.today = function() {
		var jsD = new Date();
		var d = new date();
		d.year = jsD.getFullYear();
		d.month = jsD.getMonth() + 1;
		d.day = jsD.getDate();
		return freeze(d);
	};
	
	date.init.fromtimestamp = function(timestamp) {
		var jsD = new Date(timestamp * 1000);
		var d = new date();
		d.year = jsD.getFullYear();
		d.month = jsD.getMonth() + 1;
		d.day = jsD.getDate();
		return freeze(d);
	};
	
	/**
	 * instance methods
	 */
	date.prototype.weekday = function() {
		var d = new Date(this.year, this.month-1, this.day).getDay();
		if(d == 0) return 6;
		else return d - 1;
	};
	
	date.prototype.isoweekday = function() {
		return this.weekday() + 1;
	};
	
	date.prototype.isoformat = function() {
		var string = '';
		string += this.year + '-';
		string += pad(this.month) + '-';
		string += pad(this.day);
		return string;
	};
	
	date.prototype.toString = function() {
		return this.isoformat();
	};
	
	date.prototype.strftime = function(format) {
		return strftime(this, format);
	};
	
	date.prototype.compare = function(another) {
		if(!isDate(another)) throw new TypeError();
		var res;
		res = compare(this.year, another.year); if(res) return res;
		res = compare(this.month, another.month); if(res) return res;
		res = compare(this.day, another.day); if(res) return res;
		return 0;
	};
	
	date.prototype.add = function(delta) {
		if(!isTimedelta(delta)) throw new TypeError();
	};
	
	date.prototype.subtract = function(thing) {
		if(isTimedelta(thing)) {
			
		}
		else if(isDate(thing)) {
			
		}
		else throw new TypeError();
	};
	
	
	/**
	 * @class
	 */
	var datetime = function() {
		this.year = null;
		this.month = null;
		this.day = null;
		this.hour = 0;
		this.minute = 0;
		this.second = 0;
		this.millisecond = 0;
		this.tzinfo = null;
		
		this._date = null;
		this._time = null;
		this._timestamp = null;
	};
	
	datetime.init = function() {
		var args = arguments;
		if(arguments.length == 1) {
			args = objToArr(arguments[0], [
				'year', 'month', 'day', 'hour', 'minute',
				'second', 'millisecond', 'tzinfo'
			]);
			if(args[7] == 0) args[7] = null;
		}
		
		var dt = new datetime();
		
		dt.year = toInt(takeFrom(args, 0, null));
		dt.month = toInt(takeFrom(args, 1, null));
		dt.day = toInt(takeFrom(args, 2, null));
		dt.hour = toInt(takeFrom(args, 3, 0));
		dt.minute = toInt(takeFrom(args, 4, 0));
		dt.second = toInt(takeFrom(args, 5, 0));
		dt.millisecond = toInt(takeFrom(args, 6, 0));
		dt.tzinfo = takeFrom(args, 7, null);
		
		dt._date = date.init(dt.year, dt.month, dt.day);
		dt._time = time.init(
			dt.hour, dt.minute, dt.second, dt.millisecond, dt.tzinfo
		);
		dt._timestamp = Date.UTC(
			dt.year, dt.month-1, dt.day, dt.hour, dt.minute, dt.second, dt.millisecond
		);
		if(dt.tzinfo) {
			dt._timestamp += dt.tzinfo.utcoffset().total_seconds();
		}
		
		return freeze(dt);
	};
	
	datetime.init.today = function() {
		var d = new Date();
		return datetime.init(
			d.getFullYear(), d.getMonth()+1, d.getDate(), d.getHours(),
			d.getMinutes(), d.getSeconds(), d.getMilliseconds(), null
		);
	};
	
	datetime.init.now = function() {
		return datetime.init.today();
	};
	
	datetime.init.utcnow = function() {
		var d = new Date();
		return datetime.init(
			d.getUTCFullYear(), d.getUTCMonth()+1, d.getUTCDate(),
			d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(),
			d.getUTCMilliseconds(), null
		);
	};
	
	datetime.init.fromtimestamp = function(timestamp, tzinfo) {
		if(!isFloat(timestamp)) throw new TypeError();
		if(tzinfo && !isTimezone(tzinfo)) throw new TypeError();
		
		var dt = new datetime();
		
		if(tzinfo) {
			var t = timestamp + tzinfo.utcoffset().total_seconds();
			var d = new Date(t * 1000);
			dt.year = d.getUTCFullYear();
			dt.month = d.getUTCMonth() + 1;
			dt.day = d.getUTCDate();
			dt.hour = d.getUTCHours();
			dt.minute = d.getUTCMinutes();
			dt.second = d.getUTCSeconds();
			dt.millisecond = d.getUTCMilliseconds();
			dt.tzinfo = tzinfo;
		}
		else {
			var d = new Date(timestamp * 1000);
			dt.year = d.getFullYear();
			dt.month = d.getMonth() + 1;
			dt.day = d.getDate();
			dt.hour = d.getHours();
			dt.minute = d.getMinutes();
			dt.second = d.getSeconds();
			dt.millisecond = d.getMilliseconds();
			dt.tzinfo = null;
		}
		
		dt._date = date.init(dt.year, dt.month, dt.day);
		dt._time = time.init(
			dt.hour, dt.minute, dt.second, dt.millisecond, dt.tzinfo
		);
		dt._timestamp = timestamp;
		
		return freeze(dt);
	};
	
	datetime.init.utcfromtimestamp = function(timestamp) {
		var offset = new Date().getTimezoneOffset() * 60;
		var d = new Date(timestamp * 1000 + offset);
		var dt = new datetime();
		
		dt.year = d.getFullYear();
		dt.month = d.getMonth() + 1;
		dt.day = d.getDate();
		dt.hour = d.getHours();
		dt.minute = d.getMinutes();
		dt.second = d.getSeconds();
		dt.millisecond = d.getMilliseconds();
		dt.tzinfo = null;
		
		dt._date = date.init(dt.year, dt.month, dt.day);
		dt._time = time.init(
			dt.hour, dt.minute, dt.second, dt.millisecond, dt.tzinfo
		);
		dt._timestamp = timestamp + offset;
		
		return freeze(dt);
	};
	
	/**
	 * instance methods
	 */
	datetime.prototype.date = function() {
		return this._date;
	};
	
	datetime.prototype.time = function() {
		return time.init(this.hour, this.minute, this.second, this.millisecond);
	};
	
	datetime.prototype.timetz = function() {
		return this._time;
	};
	
	datetime.prototype.tzname = function() {
		if(this.tzinfo) return this.tzinfo.tzname();
		else return null;
	};
	
	datetime.prototype.timestamp = function() {
		return this._timestamp;
	};
	
	datetime.prototype.weekday = function() {
		return this._date.weekday();
	};
	
	datetime.prototype.isoweekday = function() {
		return this._date.isoweekday();
	};
	
	datetime.prototype.isoformat = function(separator) {
		if(!separator) separator = 'T';
		return this._date.isoformat() + separator + this._time.isoformat();
	};
	
	datetime.prototype.toString = function() {
		return this.isoformat();
	};
	
	datetime.prototype.strftime = function(format) {
		return strftime(this, format);
	};
	
	
	/**
	 * @class
	 */
	var time = function() {
		this.hour = 0;
		this.minute = 0;
		this.second = 0;
		this.millisecond = 0;
		this.tzinfo = null;
	};
	
	time.init = function() {
		if(arguments.length == 0) return new time();
		
		var args = arguments;
		if(arguments.length == 1 && !isInt(arguments[0])) {
			args = objToArr(arguments[0], [
				'hour', 'minute', 'second', 'millisecond', 'tzinfo'
			]);
		}
		
		var t = new time();
		t.hour = toInt(takeFrom(args, 0, 0));
		t.minute = toInt(takeFrom(args, 1, 0));
		t.second = toInt(takeFrom(args, 2, 0));
		t.millisecond = toInt(takeFrom(args, 3, 0));
		t.tzinfo = takeFrom(args, 4, null);
		
		return freeze(t);
	};
	
	/**
	 * instance methods
	 */
	time.prototype.isoformat = function() {
		var string = pad(this.hour) +':'+ pad(this.minute) +':'+ pad(this.second);
		if(this.millisecond) {
			string += '.'+ this.millisecond;
		}
		if(this.tzinfo) {
			string += this.tzinfo.tzname().substring(3);
		}
		return string;
	};
	
	time.prototype.toString = function() {
		return this.isoformat();
	};
	
	time.prototype.strftime = function(format) {
		return strftime(this, format);
	};
	
	time.prototype.tzname = function() {
		if(this.tzinfo) return this.tzinfo.tzname();
		else return null;
	};
	
	time.prototype.compare = function(another) {
		if(!isTime(another)) throw new TypeError();
		var res;
		res = compare(this.hour, another.hour); if(res) return res;
		res = compare(this.minute, another.minute); if(res) return res;
		res = compare(this.second, another.second); if(res) return res;
		res = compare(this.millisecond, another.millisecond); if(res) return res;
		return 0;
	};
	
	
	/**
	 * @class
	 */
	var tzinfo = function() {
		var self = this;
	};
	
	
	/**
	 * @class
	 */
	var timezone = function() {
		this.offset = null;
		this.name = '';
	};
	
	timezone.init = function() {
		if(arguments.length == 0) throw new TypeError();
		
		var args = arguments;
		if(!isTimedelta(arguments[0])) {
			args = [];
			args.push(arguments[0]['offset']);
			if(arguments[0].hasOwnProperty('name')) {
				args.push(arguments[0]['name']);
			}
		}
		
		var tz = new timezone();
		tz.offset = takeFrom(args, 0);
		tz.name = takeFrom(args, 1, '');
		
		return freeze(tz);
	};
	
	timezone.init.utc = timezone.init(timedelta.init());
	
	/**
	 * instance methods
	 */
	timezone.prototype.utcoffset = function() {
		return this.offset;
	};
	
	timezone.prototype.tzname = function() {
		if(this.name) return this.name;
		
		var hours = this.offset.divide(timedelta.init(0, 3600));
		var minutes = hours % 1 * 60;
		if(!hours) return 'UTC';
		
		var string = 'UTC';
		if(hours > 0) string += '+';
		else string += '-';
		string += pad(Math.abs(parseInt(hours))) +':';
		string += pad(Math.abs(minutes));
		return string;
	};
	
	
	/**
	 * III. format directives
	 */
	var directives = {
		a: function(d) {
			
		},
		A: function(d) {
			
		},
		w: function(d) {
			if(d.weekday) return pad(d.weekday()); return '00';
		},
		d: function(d) {
			if(d.day) return pad(d.day); return '00';
		},
		b: function(d) {
			
		},
		B: function(d) {
			
		},
		m: function(d) {
			if(d.month) return pad(d.month); return '00';
		},
		y: function(d) {
			if(d.year) return pad(d.year.substring(2)); return '00';
		},
		Y: function(d) {
			if(d.year) return d.year; return '0000';
		},
		H: function(d) {
			if(d.hour) return pad(d.hour); return '00';
		},
		I: function(d) {
			
		},
		p: function(d) {
			
		},
		M: function(d) {
			if(d.minute) return pad(d.minute); return '00';
		},
		S: function(d) {
			if(d.second) return pad(d.second); return '00';
		},
		f: function(d) {
			
		},
		z: function(d) {
			
		},
		Z: function(d) {
			if(d.tzname) return d.tzname(); return '';
		},
		j: function(d) {
			
		},
		U: function(d) {
			
		},
		W: function(d) {
			
		},
		c: function(d) {
			
		},
		x: function(d) {
			
		},
		X: function(d) {
			
		}
	};
	
	
	/**
	 * IV. exports
	 */
	return {
		timedelta: timedelta.init,
		date: date.init,
		datetime: datetime.init,
		time: time.init,
		timezone: timezone.init
	};
	
}());
