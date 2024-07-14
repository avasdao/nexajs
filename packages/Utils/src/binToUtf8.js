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
 * Decode a Uint8Array as a UTF-8 string.
 * @param _bytes - the Uint8Array to decode
 */
export default(_bytes) => {
    const out = []

    let pos = 0
    let c = 0

    while (pos < _bytes.length) {
        const c1 = _bytes[pos++]

        if (c1 < 128) {
            out[c++] = String.fromCharCode(c1)
        } else if (c1 > 191 && c1 < 224) {
            const c2 = _bytes[pos++]
            out[c++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63))
        } else if (c1 > 239 && c1 < 365) {
            const c2 = _bytes[pos++]
            const c3 = _bytes[pos++]
            const c4 = _bytes[pos++]
            const u =
                (((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63)) -
                0x10000;
            out[c++] = String.fromCharCode((u >> 10) + 0xd800)
            out[c++] = String.fromCharCode((u & 1023) + 0xdc00)
        } else {
            const c2 = _bytes[pos++]
            const c3 = _bytes[pos++]
            out[c++] = String.fromCharCode(
                ((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
            )
        }
    }

    return out.join('')
}
