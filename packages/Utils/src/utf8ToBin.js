/**
 * This implementations is derived from:
 * https://github.com/google/closure-library/blob/8598d87242af59aac233270742c8984e2b2bdbe0/closure/goog/crypt/crypt.js
 *
 * Copyright 2008 The Closure Library Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable complexity, functional/no-let, functional/immutable-data, no-bitwise, @typescript-eslint/no-magic-numbers, functional/no-expression-statement, functional/no-conditional-statement, functional/no-loop-statement, no-plusplus */

/**
 * Interpret a string as UTF-8 and encode it as a Uint8Array.
 * @param _utf8 - the string to encode
 */
export default (_utf8) => {
    const out = []

    let p = 0

    for (let i = 0; i < _utf8.length; i++) {
        let c = _utf8.charCodeAt(i)

        if (c < 128) {
            out[p++] = c
        } else if (c < 2048) {
            out[p++] = (c >> 6) | 192
            out[p++] = (c & 63) | 128
        } else if (
            (c & 0xfc00) === 0xd800 &&
            i + 1 < _utf8.length &&
            (_utf8.charCodeAt(i + 1) & 0xfc00) === 0xdc00
        ) {
            c = ((c & 0x03ff) << 10) + 0x10000 + (_utf8.charCodeAt((i += 1)) & 0x03ff)
            out[p++] = (c >> 18) | 240
            out[p++] = ((c >> 12) & 63) | 128
            out[p++] = ((c >> 6) & 63) | 128
            out[p++] = (c & 63) | 128
        } else {
            out[p++] = (c >> 12) | 224
            out[p++] = ((c >> 6) & 63) | 128
            out[p++] = (c & 63) | 128
        }
    }

    return new Uint8Array(out)
}
