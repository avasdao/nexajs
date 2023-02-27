/**
 * @license
 * https://gitlab.com/nexa/nexaddrhaddrjs
 * Copyright (c) 2022 Andrew Stone
 * Copyright (c) 2017-2020 Emilio Almansi
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or http://www.opensource.org/licenses/mit-license.php.
 */

import base32 from './base32'
import bigInt from 'big-integer'
import convertBits from './convertBits'

import { validate } from './validation'
import { ValidationError } from './validation'

/**
 * Encoding and decoding of the bech32 address format for Nexa. <br />
 * Compliant with the nexa address specification:
 * {@link http://spec.nexa.org/protocol/blockchain/encoding/cashaddr}
 * @module cashaddr
 */

/**
 * Encodes a hash from a given type into a Nexa address with the given prefix.
 *
 * @static
 * @param {string} prefix Network prefix. E.g.: 'nexa'.
 * @param {string} type Type of address to generate. Either 'P2PKH', 'TEMPLATE' or 'GROUP'.
 * @param {Uint8Array} hash Hash to encode represented as an array of 8-bit integers.
 * @returns {string}
 * @throws {ValidationError}
 */
export function encode (prefix, type, hash) {
    validate(typeof prefix === 'string' && isValidPrefix(prefix), 'Invalid prefix: ' + prefix + '.')
    validate(typeof type === 'string', 'Invalid type: ' + type + '.')
    validate(hash instanceof Uint8Array, 'Invalid hash: ' + hash + '.')

    const prefixData = concat(prefixToUint5Array(prefix), new Uint8Array(1))

    const versionByte = getTypeBits(type) + getHashSizeBits(hash)

    const payloadData = toUint5Array(concat(new Uint8Array([versionByte]), hash))

    const checksumData = concat(concat(prefixData, payloadData), new Uint8Array(8))

    const payload = concat(payloadData, checksumToUint5Array(polymod(checksumData)))

    return prefix + ':' + base32.encode(payload)
}

/**
 * Decodes the given address into its constituting prefix, type and hash. See [#encode()]{@link encode}.
 *
 * @static
 * @param {string} address Address to decode. E.g.: 'nexa:qpm2qsznhks23z7629mms6s4cwef74vcwvgpsey0xy'.
 * @returns {object}
 * @throws {ValidationError}
 */
export function decode (address) {
    validate(typeof address === 'string' && hasSingleCase(address), 'Invalid address: ' + address + '.')

    var pieces = address.toLowerCase().split(':')

    validate(pieces.length === 2, 'Missing prefix: ' + address + '.');

    var prefix = pieces[0];

    var payload = base32.decode(pieces[1]);

    validate(validChecksum(prefix, payload), 'Invalid checksum: ' + address + '.');

    var payloadData = fromUint5Array(payload.subarray(0, -8));

    var versionByte = payloadData[0];

    var hash = payloadData.subarray(1);

    // no length limits in nexa: validate(getHashSize(versionByte) === hash.length * 8, 'Invalid hash size: ' + address + '.');

    var type = getType(versionByte);

    return {
        prefix: prefix,
        type: type,
        hash: hash,
    }
}

/**
 * Error thrown when encoding or decoding fail due to invalid input.
 *
 * @constructor ValidationError
 * @param {string} message Error description.
 */
// var ValidationError = validation.ValidationError;

/**
 * Valid address prefixes.
 *
 * @private
 */
var VALID_PREFIXES = ['nexa', 'nexatest', 'nexareg'];

/**
 * Checks whether a string is a valid prefix; ie., it has a single letter case
 * and is one of the above.
 *
 * @private
 * @param {string} prefix
 * @returns {boolean}
 */
function isValidPrefix(prefix) {
  return hasSingleCase(prefix) && VALID_PREFIXES.indexOf(prefix.toLowerCase()) !== -1;
}

/**
 * Derives an array from the given prefix to be used in the computation
 * of the address' checksum.
 *
 * @private
 * @param {string} prefix Network prefix. E.g.: 'nexa'.
 * @returns {Uint8Array}
 */
function prefixToUint5Array(prefix) {
  var result = new Uint8Array(prefix.length);
  for (var i = 0; i < prefix.length; ++i) {
    result[i] = prefix[i].charCodeAt(0) & 31;
  }
  return result;
}

/**
 * Returns an array representation of the given checksum to be encoded
 * within the address' payload.
 *
 * @private
 * @param {BigInteger} checksum Computed checksum.
 * @returns {Uint8Array}
 */
function checksumToUint5Array(checksum) {
  var result = new Uint8Array(8);
  for (var i = 0; i < 8; ++i) {
    result[7 - i] = checksum.and(31).toJSNumber();
    checksum = checksum.shiftRight(5);
  }
  return result;
}

/**
 * Returns the bit representation of the given type within the version
 * byte.
 *
 * @private
 * @param {string} type Address type. Either 'P2PKH' or 'P2SH'.
 * @returns {number}
 * @throws {ValidationError}
 */
function getTypeBits(type) {
  switch (type) {
  case 'P2PKH':
    return 0;
  case 'SCRIPT':
    return 1<<3;
  case 'TEMPLATE':
    return 19<<3;
  case 'GROUP':
    return 11<<3;
  default:
    throw new ValidationError('Invalid type: ' + type + '.');
  }
}

/**
 * Retrieves the address type from its bit representation within the
 * version byte.
 *
 * @private
 * @param {number} versionByte
 * @returns {string}
 * @throws {ValidationError}
 */
function getType(versionByte) {
  switch (versionByte & 248) {
  case 0:
    return 'P2PKH';
  case 1<<3:
    return 'SCRIPT';
  case 19<<3:
    return 'TEMPLATE';
  case 11<<3:
    return 'GROUP';
  default:
    throw new ValidationError('Invalid address type in version byte: ' + versionByte + '.');
  }
}

/**
 * Returns the bit representation of the length in bits of the given
 * hash within the version byte.
 *
 * @private
 * @param {Uint8Array} hash Hash to encode represented as an array of 8-bit integers.
 * @returns {number}
 * @throws {ValidationError}
 */
function getHashSizeBits(hash) {
  hash.length;  // Fake use of this
  return 0;  // nexa hash size bits are always 0
}

/**
 * Converts an array of 8-bit integers into an array of 5-bit integers,
 * right-padding with zeroes if necessary.
 *
 * @private
 * @param {Uint8Array} data
 * @returns {Uint8Array}
 */
function toUint5Array(data) {
  return convertBits(data, 8, 5);
}

/**
 * Converts an array of 5-bit integers back into an array of 8-bit integers,
 * removing extra zeroes left from padding if necessary.
 * Throws a {@link ValidationError} if input is not a zero-padded array of 8-bit integers.
 *
 * @private
 * @param {Uint8Array} data
 * @returns {Uint8Array}
 * @throws {ValidationError}
 */
function fromUint5Array(data) {
  return convertBits(data, 5, 8, true);
}

/**
 * Returns the concatenation a and b.
 *
 * @private
 * @param {Uint8Array} a
 * @param {Uint8Array} b
 * @returns {Uint8Array}
 * @throws {ValidationError}
 */
function concat(a, b) {
  var ab = new Uint8Array(a.length + b.length);
  ab.set(a);
  ab.set(b, a.length);
  return ab;
}

/**
 * Computes a checksum from the given input data as specified for the CashAddr
 * format: https://github.com/Bitcoin-UAHF/spec/blob/master/cashaddr.md.
 *
 * @private
 * @param {Uint8Array} data Array of 5-bit integers over which the checksum is to be computed.
 * @returns {BigInteger}
 */
function polymod(data) {
  var GENERATOR = [0x98f2bc8e61, 0x79b76d99e2, 0xf33e5fb3c4, 0xae2eabe2a8, 0x1e4f43e470];
  var checksum = bigInt(1);
  for (var i = 0; i < data.length; ++i) {
    var value = data[i];
    var topBits = checksum.shiftRight(35);
    checksum = checksum.and(0x07ffffffff).shiftLeft(5).xor(value);
    for (var j = 0; j < GENERATOR.length; ++j) {
      if (topBits.shiftRight(j).and(1).equals(1)) {
        checksum = checksum.xor(GENERATOR[j]);
      }
    }
  }
  return checksum.xor(1);
}

/**
 * Verify that the payload has not been corrupted by checking that the
 * checksum is valid.
 *
 * @private
 * @param {string} prefix Network prefix. E.g.: 'nexa'.
 * @param {Uint8Array} payload Array of 5-bit integers containing the address' payload.
 * @returns {boolean}
 */
function validChecksum(prefix, payload) {
  var prefixData = concat(prefixToUint5Array(prefix), new Uint8Array(1));
  var checksumData = concat(prefixData, payload);
  return polymod(checksumData).equals(0);
}

/**
 * Returns true if, and only if, the given string contains either uppercase
 * or lowercase letters, but not both.
 *
 * @private
 * @param {string} string Input string.
 * @returns {boolean}
 */
function hasSingleCase(string) {
  return string === string.toLowerCase() || string === string.toUpperCase();
}

/* Export module. */
export default {
    encode: encode,
    decode: decode,
    ValidationError: ValidationError,
}
