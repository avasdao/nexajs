import CashAddressType from './CashAddressType.js'
import CashAddressTypeBits from './CashAddressTypeBits.js'

export default {
    [CashAddressTypeBits.p2pkh]: CashAddressType.p2pkh,
    [CashAddressTypeBits.p2pkt]: CashAddressType.p2pkt,
    [CashAddressTypeBits.p2sh]: CashAddressType.p2sh,
    [CashAddressTypeBits.p2pkhWithTokens]: CashAddressType.p2pkhWithTokens,
    [CashAddressTypeBits.p2shWithTokens]: CashAddressType.p2shWithTokens,
}
