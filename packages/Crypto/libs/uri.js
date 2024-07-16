'use strict';

var _ = require('lodash');
var URL = require('url');

var Address = require('./address');
var Networks = require('./networks');
var Unit = require('./unit');

/**
 * Nexcore URI
 *
 * Instantiate an URI from a nexa URI String or an Object. An URI instance
 * can be created with a nexa uri string or an object. All instances of
 * URI are valid, the static method isValid allows checking before instantiation.
 *
 * All standard parameters can be found as members of the class, the address
 * is represented using an {Address} instance and the amount is represented in
 * satoshis. Any other non-standard parameters can be found under the extra member.
 *
 * @example
 * ```javascript
 *
 * var uri = new URI('nexa:nqtsq5g5f97xxcj846gaduz8p7940mldglqzcgm30vfwqxtj?amount=5000000.46');
 * console.log(uri.address, uri.amount);
 * ```
 *
 * @param {string|Object} data - A nexa URI string or an Object
 * @param {Array.<string>=} knownParams - Required non-standard params
 * @throws {TypeError} Invalid nexa address
 * @throws {TypeError} Invalid amount
 * @throws {Error} Unknown required argument
 * @returns {URI} A new valid and frozen instance of URI
 * @constructor
 */
function URI(data, knownParams) {
  if (!(this instanceof URI)) {
    return new URI(data, knownParams);
  }

  this.extras = {};
  this.knownParams = knownParams || [];
  this.address = this.network = this.amount = this.message = null;

  if (typeof(data) === 'string') {
    var params = URI.parse(data);
    if (params.amount) {
      params.amount = this._parseAmount(params.amount);
    }
    this._fromObject(params);
  } else if (typeof(data) === 'object') {
    this._fromObject(data);
  } else {
    throw new TypeError('Unrecognized data format.');
  }
};

/**
 * Instantiate a URI from a String
 *
 * @param {string} str - JSON string or object of the URI
 * @returns {URI} A new instance of a URI
 */
URI.fromString = function fromString(str) {
  if (typeof(str) !== 'string') {
    throw new TypeError('Expected a string');
  }
  return new URI(str);
};

/**
 * Instantiate a URI from an Object
 *
 * @param {Object} data - object of the URI
 * @returns {URI} A new instance of a URI
 */
URI.fromObject = function fromObject(json) {
  return new URI(json);
};

/**
 * Check if an bitcoin URI string is valid
 *
 * @example
 * ```javascript
 *
 * var valid = URI.isValid('nexa:nqtsq5g5f97xxcj846gaduz8p7940mldglqzcgm30vfwqxtj');
 * // true
 * ```
 *
 * @param {string|Object} data - A nexa URI string or an Object
 * @param {Array.<string>=} knownParams - Required non-standard params
 * @returns {boolean} Result of uri validation
 */
URI.isValid = function(arg, knownParams) {
  try {
    new URI(arg, knownParams);
  } catch (err) {
    return false;
  }
  return true;
};

/**
 * Convert a nexa URI string into a simple object.
 *
 * @param {string} uri - A nexa URI string
 * @throws {TypeError} Invalid nexa URI
 * @returns {Object} An object with the parsed params
 */
URI.parse = function(uri) {
  var info = URL.parse(uri, true);
  if (Networks.get(info.protocol.replace(':', ''), 'prefix')) {
    // workaround to host insensitiveness
    var group = /([^:]*):\/?\/?([^?]*)/.exec(uri);
    info.query.address = group && (group[1] + ":" + group[2]) || undefined;

    return info.query;
  } else {
    throw new TypeError('Invalid nexa URI');
  }
};

URI.Members = ['address', 'amount', 'message', 'label', 'r'];

/**
 * Internal function to load the URI instance with an object.
 *
 * @param {Object} obj - Object with the information
 * @throws {TypeError} Invalid nexa address
 * @throws {TypeError} Invalid amount
 * @throws {Error} Unknown required argument
 */
URI.prototype._fromObject = function(obj) {
  /* jshint maxcomplexity: 10 */

  if (!Address.isValid(obj.address)) {
    throw new TypeError('Invalid nexa address');
  }

  this.address = new Address(obj.address);
  this.network = this.address.network;
  this.amount = obj.amount;

  for (var key in obj) {
    if (key === 'address' || key === 'amount') {
      continue;
    }

    if (/^req-/.exec(key) && this.knownParams.indexOf(key) === -1) {
      throw Error('Unknown required argument ' + key);
    }

    var destination = URI.Members.indexOf(key) > -1 ? this : this.extras;
    destination[key] = obj[key];
  }
};

/**
 * Internal function to transform a NEXA string amount into satoshis
 *
 * @param {string} amount - Amount NEXA string
 * @throws {TypeError} Invalid amount
 * @returns {number} Amount represented in satoshis
 */
URI.prototype._parseAmount = function(amount) {
  amount = Number(amount);
  if (isNaN(amount)) {
    throw new TypeError('Invalid amount');
  }
  return Unit.fromNEXA(amount).toSatoshis();
};

URI.prototype.toObject = URI.prototype.toJSON = function toObject() {
  var json = {};
  for (var i = 0; i < URI.Members.length; i++) {
    var m = URI.Members[i];
    if (this.hasOwnProperty(m) && typeof(this[m]) !== 'undefined' && this[m] !== null) {
      json[m] = this[m].toString();
    }
  }
  _.extend(json, this.extras);
  return json;
};

/**
 * Will return a the string representation of the URI
 *
 * @returns {string} Nexa URI string
 */
URI.prototype.toString = function() {
  var query = {};
  if (this.amount) {
    query.amount = Unit.fromSatoshis(this.amount).toNEXA();
  }
  if (this.message) {
    query.message = this.message;
  }
  if (this.label) {
    query.label = this.label;
  }
  if (this.r) {
    query.r = this.r;
  }
  _.extend(query, this.extras);

  let prefix = Networks.get(this.network, 'name').prefix + ':';
  return URL.format({
    protocol: prefix,
    host: this.address.toString().replace(prefix, ""),
    query: query
  });
};

/**
 * Will return a string formatted for the console
 *
 * @returns {string} Bitcoin URI
 */
URI.prototype.inspect = function() {
  return '<URI: ' + this.toString() + '>';
};

module.exports = URI;
