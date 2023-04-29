/* NexaJS <Script> v2023.04.28 */
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Script = exports.OP = void 0;
var _debug = _interopRequireDefault(require("debug"));
var _Opcodes = _interopRequireDefault(require("./src/Opcodes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Setup (non-ESM) debugger. */

const debug = (0, _debug.default)('nexa:script');

/* Import (local) modules. */

/* Export (local) modules. */
const OP = _Opcodes.default;

/**
 * Script Class
 *
 * Manages script functions.
 */
exports.OP = OP;
class Script {
  constructor(_params) {
    /* Initialize Script class. */
    debug('Initializing Script...');
    debug(JSON.stringify(_params, null, 2));

    // TBD
  }

  test() {
    return 'Script (Instance) is working!';
  }
  static test() {
    return 'Script (Static) is working!';
  }
}

/* Initialize (globalThis) Nexa class. */
exports.Script = Script;
const Nexa = {};

/* Initialize Script class. */
Nexa.Script = Script;

/* Initialize Script modules. */
Nexa.OP = OP;

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
  ...globalThis.Nexa,
  // preserve Nexa object
  ...Nexa // extend Nexa object
};

},{"./src/Opcodes.js":5,"debug":2}],2:[function(require,module,exports){
(function (process){(function (){
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = require('./common')(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};

}).call(this)}).call(this,require('_process'))
},{"./common":3,"_process":6}],3:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = require('ms');
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;

},{"ms":4}],4:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * The `BCH_2023_05` instruction set.
 */
var _default = {
  /**
   * A.K.A. `FALSE` or `PUSHBYTES_0`
   */
  _0: 0x00,
  ZERO: 0x00,
  PUSHBYTES_1: 0x01,
  PUSHBYTES_2: 0x02,
  PUSHBYTES_3: 0x03,
  PUSHBYTES_4: 0x04,
  PUSHBYTES_5: 0x05,
  PUSHBYTES_6: 0x06,
  PUSHBYTES_7: 0x07,
  PUSHBYTES_8: 0x08,
  PUSHBYTES_9: 0x09,
  PUSHBYTES_10: 0x0a,
  PUSHBYTES_11: 0x0b,
  PUSHBYTES_12: 0x0c,
  PUSHBYTES_13: 0x0d,
  PUSHBYTES_14: 0x0e,
  PUSHBYTES_15: 0x0f,
  PUSHBYTES_16: 0x10,
  PUSHBYTES_17: 0x11,
  PUSHBYTES_18: 0x12,
  PUSHBYTES_19: 0x13,
  PUSHBYTES_20: 0x14,
  PUSHBYTES_21: 0x15,
  PUSHBYTES_22: 0x16,
  PUSHBYTES_23: 0x17,
  PUSHBYTES_24: 0x18,
  PUSHBYTES_25: 0x19,
  PUSHBYTES_26: 0x1a,
  PUSHBYTES_27: 0x1b,
  PUSHBYTES_28: 0x1c,
  PUSHBYTES_29: 0x1d,
  PUSHBYTES_30: 0x1e,
  PUSHBYTES_31: 0x1f,
  PUSHBYTES_32: 0x20,
  PUSHBYTES_33: 0x21,
  PUSHBYTES_34: 0x22,
  PUSHBYTES_35: 0x23,
  PUSHBYTES_36: 0x24,
  PUSHBYTES_37: 0x25,
  PUSHBYTES_38: 0x26,
  PUSHBYTES_39: 0x27,
  PUSHBYTES_40: 0x28,
  PUSHBYTES_41: 0x29,
  PUSHBYTES_42: 0x2a,
  PUSHBYTES_43: 0x2b,
  PUSHBYTES_44: 0x2c,
  PUSHBYTES_45: 0x2d,
  PUSHBYTES_46: 0x2e,
  PUSHBYTES_47: 0x2f,
  PUSHBYTES_48: 0x30,
  PUSHBYTES_49: 0x31,
  PUSHBYTES_50: 0x32,
  PUSHBYTES_51: 0x33,
  PUSHBYTES_52: 0x34,
  PUSHBYTES_53: 0x35,
  PUSHBYTES_54: 0x36,
  PUSHBYTES_55: 0x37,
  PUSHBYTES_56: 0x38,
  PUSHBYTES_57: 0x39,
  PUSHBYTES_58: 0x3a,
  PUSHBYTES_59: 0x3b,
  PUSHBYTES_60: 0x3c,
  PUSHBYTES_61: 0x3d,
  PUSHBYTES_62: 0x3e,
  PUSHBYTES_63: 0x3f,
  PUSHBYTES_64: 0x40,
  PUSHBYTES_65: 0x41,
  PUSHBYTES_66: 0x42,
  PUSHBYTES_67: 0x43,
  PUSHBYTES_68: 0x44,
  PUSHBYTES_69: 0x45,
  PUSHBYTES_70: 0x46,
  PUSHBYTES_71: 0x47,
  PUSHBYTES_72: 0x48,
  PUSHBYTES_73: 0x49,
  PUSHBYTES_74: 0x4a,
  PUSHBYTES_75: 0x4b,
  PUSHDATA_1: 0x4c,
  PUSHDATA_2: 0x4d,
  PUSHDATA_4: 0x4e,
  _1NEGATE: 0x4f,
  RESERVED: 0x50,
  /**
   * A.K.A. `TRUE`
   */
  _1: 0x51,
  ONE: 0x51,
  _2: 0x52,
  TWO: 0x52,
  _3: 0x53,
  THREE: 0x53,
  _4: 0x54,
  FOUR: 0x54,
  _5: 0x55,
  FIVE: 0x55,
  _6: 0x56,
  SIX: 0x56,
  _7: 0x57,
  SEVEN: 0x57,
  _8: 0x58,
  EIGHT: 0x58,
  _9: 0x59,
  NINE: 0x59,
  _10: 0x5a,
  TEN: 0x5a,
  _11: 0x5b,
  ELEVEN: 0x5b,
  _12: 0x5c,
  TWELVE: 0x5c,
  _13: 0x5d,
  THIRTEEN: 0x5d,
  _14: 0x5e,
  FOURTEEN: 0x5e,
  _15: 0x5f,
  FIFTEEN: 0x5f,
  _16: 0x60,
  SIXTEEN: 0x60,
  NOP: 0x61,
  VER: 0x62,
  IF: 0x63,
  NOTIF: 0x64,
  VERIF: 0x65,
  VERNOTIF: 0x66,
  ELSE: 0x67,
  ENDIF: 0x68,
  VERIFY: 0x69,
  RETURN: 0x6a,
  TOALTSTACK: 0x6b,
  FROMALTSTACK: 0x6c,
  _2DROP: 0x6d,
  TWODROP: 0x6d,
  _2DUP: 0x6e,
  TWODUP: 0x6e,
  _3DUP: 0x6f,
  THREEDUP: 0x6f,
  _2OVER: 0x70,
  TWOOVER: 0x70,
  _2ROT: 0x71,
  TWOROT: 0x71,
  _2SWAP: 0x72,
  TWOSWAP: 0x72,
  IFDUP: 0x73,
  DEPTH: 0x74,
  DROP: 0x75,
  DUP: 0x76,
  NIP: 0x77,
  OVER: 0x78,
  PICK: 0x79,
  ROLL: 0x7a,
  ROT: 0x7b,
  SWAP: 0x7c,
  TUCK: 0x7d,
  CAT: 0x7e,
  SPLIT: 0x7f,
  NUM2BIN: 0x80,
  BIN2NUM: 0x81,
  SIZE: 0x82,
  INVERT: 0x83,
  AND: 0x84,
  OR: 0x85,
  XOR: 0x86,
  EQUAL: 0x87,
  EQUALVERIFY: 0x88,
  RESERVED1: 0x89,
  RESERVED2: 0x8a,
  _1ADD: 0x8b,
  ONEADD: 0x8b,
  _1SUB: 0x8c,
  ONESUB: 0x8c,
  _2MUL: 0x8d,
  TWOMUL: 0x8d,
  _2DIV: 0x8e,
  TWODIV: 0x8e,
  NEGATE: 0x8f,
  ABS: 0x90,
  NOT: 0x91,
  _0NOTEQUAL: 0x92,
  ZERONOTEQUAL: 0x92,
  ADD: 0x93,
  SUB: 0x94,
  MUL: 0x95,
  DIV: 0x96,
  MOD: 0x97,
  LSHIFT: 0x98,
  RSHIFT: 0x99,
  BOOLAND: 0x9a,
  BOOLOR: 0x9b,
  NUMEQUAL: 0x9c,
  NUMEQUALVERIFY: 0x9d,
  NUMNOTEQUAL: 0x9e,
  LESSTHAN: 0x9f,
  GREATERTHAN: 0xa0,
  LESSTHANOREQUAL: 0xa1,
  GREATERTHANOREQUAL: 0xa2,
  MIN: 0xa3,
  MAX: 0xa4,
  WITHIN: 0xa5,
  RIPEMD160: 0xa6,
  SHA1: 0xa7,
  SHA256: 0xa8,
  HASH160: 0xa9,
  HASH256: 0xaa,
  CODESEPARATOR: 0xab,
  CHECKSIG: 0xac,
  CHECKSIGVERIFY: 0xad,
  CHECKMULTISIG: 0xae,
  CHECKMULTISIGVERIFY: 0xaf,
  NOP1: 0xb0,
  CHECKLOCKTIMEVERIFY: 0xb1,
  CHECKSEQUENCEVERIFY: 0xb2,
  NOP4: 0xb3,
  NOP5: 0xb4,
  NOP6: 0xb5,
  GROUP: 0xb6,
  NOP8: 0xb7,
  NOP9: 0xb8,
  NOP10: 0xb9,
  CHECKDATASIG: 0xba,
  CHECKDATASIGVERIFY: 0xbb,
  REVERSEBYTES: 0xbc,
  /**
   * First codepoint left undefined before nullary introspection operations.
   */
  UNKNOWN189: 0xbd,
  UNKNOWN190: 0xbe,
  /**
   * Last codepoint left undefined before nullary introspection operations.
   */
  UNKNOWN191: 0xbf,
  INPUTINDEX: 0xc0,
  ACTIVEBYTECODE: 0xc1,
  TXVERSION: 0xc2,
  TXINPUTCOUNT: 0xc3,
  TXOUTPUTCOUNT: 0xc4,
  TXLOCKTIME: 0xc5,
  UTXOVALUE: 0xc6,
  UTXOBYTECODE: 0xc7,
  OUTPOINTTXHASH: 0xc8,
  OUTPOINTINDEX: 0xc9,
  INPUTBYTECODE: 0xca,
  INPUTSEQUENCENUMBER: 0xcb,
  OUTPUTVALUE: 0xcc,
  OUTPUTBYTECODE: 0xcd,
  UTXOTOKENCATEGORY: 0xce,
  UTXOTOKENCOMMITMENT: 0xcf,
  UTXOTOKENAMOUNT: 0xd0,
  OUTPUTTOKENCATEGORY: 0xd1,
  OUTPUTTOKENCOMMITMENT: 0xd2,
  OUTPUTTOKENAMOUNT: 0xd3,
  UNKNOWN212: 0xd4,
  UNKNOWN213: 0xd5,
  UNKNOWN214: 0xd6,
  UNKNOWN215: 0xd7,
  UNKNOWN216: 0xd8,
  UNKNOWN217: 0xd9,
  UNKNOWN218: 0xda,
  UNKNOWN219: 0xdb,
  UNKNOWN220: 0xdc,
  UNKNOWN221: 0xdd,
  UNKNOWN222: 0xde,
  UNKNOWN223: 0xdf,
  UNKNOWN224: 0xe0,
  UNKNOWN225: 0xe1,
  UNKNOWN226: 0xe2,
  UNKNOWN227: 0xe3,
  UNKNOWN228: 0xe4,
  UNKNOWN229: 0xe5,
  UNKNOWN230: 0xe6,
  UNKNOWN231: 0xe7,
  UNKNOWN232: 0xe8,
  UNKNOWN233: 0xe9,
  UNKNOWN234: 0xea,
  UNKNOWN235: 0xeb,
  UNKNOWN236: 0xec,
  UNKNOWN237: 0xed,
  UNKNOWN238: 0xee,
  UNKNOWN239: 0xef,
  /**
   * A.K.A. `PREFIX_BEGIN`
   */
  UNKNOWN240: 0xf0,
  UNKNOWN241: 0xf1,
  UNKNOWN242: 0xf2,
  UNKNOWN243: 0xf3,
  UNKNOWN244: 0xf4,
  UNKNOWN245: 0xf5,
  UNKNOWN246: 0xf6,
  /**
   * A.K.A. `PREFIX_END`
   */
  UNKNOWN247: 0xf7,
  UNKNOWN248: 0xf8,
  UNKNOWN249: 0xf9,
  UNKNOWN250: 0xfa,
  UNKNOWN251: 0xfb,
  UNKNOWN252: 0xfc,
  UNKNOWN253: 0xfd,
  UNKNOWN254: 0xfe,
  UNKNOWN255: 0xff
};
exports.default = _default;

},{}],6:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);
