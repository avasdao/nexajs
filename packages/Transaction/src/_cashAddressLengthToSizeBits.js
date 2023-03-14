export const cashAddressLengthToSizeBits = (_addressLength) => {
  switch(_addressLength) {
    case 20: return 0
    case 24: return 1
    case 28: return 2
    case 32: return 3
    case 40: return 4
    case 48: return 5
    case 56: return 6
    case 64: return 7
    default:
      throw new Error('Oops! Cash address length is invalid.')
  }
}
