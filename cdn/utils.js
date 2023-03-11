/* NexaJS <Utilities> v2023.03.11 */
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reverseBytes = exports.Utils = void 0;
/**
 * Reverse Bytes
 *
 * Reverse the bytes of a HEX string.
 */
const reverseBytes = _bytes => {
  return _bytes.match(/[a-fA-F0-9]{2}/g).reverse().join('');
};

/**
 * Utils Class
 *
 * A suite of useful utilities.
 */
exports.reverseBytes = reverseBytes;
class Utils {
  // NOTE: We won't use a constructor, as this is a purely utility class.

  static reverseBytes(_bytes) {
    return reverseBytes(_bytes);
  }
}

/* Initialize (globalThis) Nexa class. */
exports.Utils = Utils;
const Nexa = {};

/* Initialize Utilities class. */
Nexa.Utils = Utils;

/* Initialize Utilities modules. */
Nexa.reverseBytes = reverseBytes;

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
  ...globalThis.Nexa,
  // preserve Nexa object
  ...Nexa // extend Nexa object
};

},{}]},{},[1]);
