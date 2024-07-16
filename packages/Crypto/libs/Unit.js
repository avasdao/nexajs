/* Import modules. */
import _ from 'lodash'

/* Import (local) modules. */
import $ from '../utils/preconditions.js'
import errors from '../errors/index.js'

const UNITS = {
    'MEX'      : [1e8, 8],
    'KEX'      : [1e5, 5],
    'NEX'      : [1e2, 2],
    'NEXA'     : [1e2, 2],
    'satoshis' : [1, 0]
}

/**
 * Utility for handling and converting nexa units. The supported units are
 * MEX, KEX, NEXA (also named NEX) and satoshis. A unit instance can be created with an
 * amount and a unit code, or alternatively using static methods like {fromNEXA}.
 * It also allows to be created from a fiat amount and the exchange rate, or
 * alternatively using the {fromFiat} static method.
 * You can consult for different representation of a unit instance using it's
 * {to} method, the fixed unit methods like {toSatoshis} or alternatively using
 * the unit accessors. It also can be converted to a fiat amount by providing the
 * corresponding NEXA/fiat exchange rate.
 *
 * @example
 * ```javascript
 * var sats = Unit.fromNEXA(5.46).toSatoshis();
 * var nex = Unit.fromMEX(5.46).to(Unit.NEX);
 * var kex = Unit.fromFiat(5.46, 350).KEX;
 * var mex = new Unit(5.46, Unit.NEXA).MEX;
 * ```
 *
 * @param {Number} amount - The amount to be represented
 * @param {String|Number} code - The unit of the amount or the exchange rate
 * @returns {Unit} A new instance of an Unit
 * @constructor
 */
const Unit = function (amount, code) {
    if (!(this instanceof Unit)) {
        return new Unit(amount, code)
    }

    // convert fiat to NEXA
    if (_.isNumber(code)) {
        if (code <= 0) {
            throw new errors.Unit.InvalidRate(code)
        }

        amount = amount / code

        code = Unit.NEXA
    }

    this._value = this._from(amount, code)

    var self = this

    var defineAccesor = function(key) {
        Object.defineProperty(self, key, {
            get: function() { return self.to(key); },
            enumerable: true,
        })
    }

    Object.keys(UNITS).forEach(defineAccesor)
}

Object.keys(UNITS).forEach(function (key) {
    Unit[key] = key
})

/**
 * Returns a Unit instance created from JSON string or object
 *
 * @param {String|Object} json - JSON with keys: amount and code
 * @returns {Unit} A Unit instance
 */
Unit.fromObject = function (data) {
    $.checkArgument(_.isObject(data), 'Argument is expected to be an object')

    return new Unit(data.amount, data.code)
}

/**
 * Returns a Unit instance created from an amount in NEXA
 *
 * @param {Number} amount - The amount in NEXA
 * @returns {Unit} A Unit instance
 */
Unit.fromNEX = Unit.fromNEXA = function (amount) {
    return new Unit(amount, Unit.NEXA)
}

/**
 * Returns a Unit instance created from an amount in KEX
 *
 * @param {Number} amount - The amount in KEX
 * @returns {Unit} A Unit instance
 */
Unit.fromKEX = function (amount) {
    return new Unit(amount, Unit.KEX)
}

/**
 * Returns a Unit instance created from an amount in MEX
 *
 * @param {Number} amount - The amount in MEX
 * @returns {Unit} A Unit instance
 */
Unit.fromMEX = function (amount) {
    return new Unit(amount, Unit.MEX)
}

/**
 * Returns a Unit instance created from an amount in satoshis
 *
 * @param {Number} amount - The amount in satoshis
 * @returns {Unit} A Unit instance
 */
Unit.fromSatoshis = function (amount) {
    return new Unit(amount, Unit.satoshis)
}

/**
 * Returns a Unit instance created from a fiat amount and exchange rate.
 *
 * @param {Number} amount - The amount in fiat
 * @param {Number} rate - The exchange rate NEXA/fiat
 * @returns {Unit} A Unit instance
 */
Unit.fromFiat = function (amount, rate) {
    return new Unit(amount, rate)
}

Unit.prototype._from = function (amount, code) {
    if (!UNITS[code]) {
        throw new errors.Unit.UnknownCode(code)
    }

    return parseInt((amount * UNITS[code][0]).toFixed())
}

/**
 * Returns the value represented in the specified unit
 *
 * @param {String|Number} code - The unit code or exchange rate
 * @returns {Number} The converted value
 */
Unit.prototype.to = function (code) {
    if (_.isNumber(code)) {
        if (code <= 0) {
            throw new errors.Unit.InvalidRate(code)
        }

        return parseFloat((this.NEXA * code).toFixed(2))
    }

    if (!UNITS[code]) {
        throw new errors.Unit.UnknownCode(code)
    }

    var value = this._value / UNITS[code][0]

    return parseFloat(value.toFixed(UNITS[code][1]))
}

/**
 * Returns the value represented in NEXA
 *
 * @returns {Number} The value converted to NEXA
 */
Unit.prototype.toNEX = Unit.prototype.toNEXA = function () {
    return this.to(Unit.NEXA)
}

/**
 * Returns the value represented in KEX
 *
 * @returns {Number} The value converted to KEX
 */
Unit.prototype.toKEX = function () {
    return this.to(Unit.KEX)
}

/**
 * Returns the value represented in MEX
 *
 * @returns {Number} The value converted to MEX
 */
Unit.prototype.toMEX = function () {
    return this.to(Unit.MEX)
}

/**
 * Returns the value represented in satoshis
 *
 * @returns {Number} The value converted to satoshis
 */
Unit.prototype.toSatoshis = function () {
    return this.to(Unit.satoshis)
}

/**
 * Returns the value represented in fiat
 *
 * @param {number} rate - The exchange rate between NEXA/currency
 * @returns {Number} The value converted to fiat
 */
Unit.prototype.atRate = function (rate) {
    return this.to(rate)
}

/**
 * Returns a the string representation of the value in satoshis
 *
 * @returns {string} the value in satoshis
 */
Unit.prototype.toString = function () {
    return this.satoshis + ' satoshis'
}

/**
 * Returns a plain object representation of the Unit
 *
 * @returns {Object} An object with the keys: amount and code
 */
Unit.prototype.toObject = Unit.prototype.toJSON = function () {
    return {
        amount: this.NEXA,
        code: Unit.NEXA,
    }
}

/**
 * Returns a string formatted for the console
 *
 * @returns {string} the value in satoshis
 */
Unit.prototype.inspect = function () {
    return '<Unit: ' + this.toString() + '>'
}

export default Unit
