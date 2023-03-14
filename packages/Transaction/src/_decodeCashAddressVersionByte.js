import { cashAddressSizeBitsToLength } from './_cashAddressSizeBitsToLength.js'

const Constants = {
  cashAddressTypeBitsShift: 3,
  base32WordLength: 5,
  base256WordLength: 8,
  payloadSeparator: 0,
  asciiLowerCaseStart: 96,
  finiteFieldOrder: 32,
  cashAddressReservedBitMask: 0b10000000,
  cashAddressTypeBits: 0b1111,
  cashAddressSizeBits: 0b111,
  /**
   * In ASCII, each pair of upper and lower case characters share the same 5 least
   * significant bits.
   */
  asciiCaseInsensitiveBits: 0b11111,
}

export const decodeCashAddressVersionByte = (version) =>
  // eslint-disable-next-line no-negated-condition, no-bitwise
  (version & Constants.cashAddressReservedBitMask) !== 0
    ? 'Reserved bit is set.'
    : {
        length:
          cashAddressSizeBitsToLength[
            // eslint-disable-next-line no-bitwise
            (version &
              Constants.cashAddressSizeBits)
          ],
        typeBits:
          // eslint-disable-next-line no-bitwise
          (version >>> Constants.cashAddressTypeBitsShift) &
          Constants.cashAddressTypeBits,
      };
