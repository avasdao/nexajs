import CashAddressType from './CashAddressType.js'
import CashAddressTypeBits from './CashAddressTypeBits.js'

export default {
    [CashAddressType.p2pkh]: CashAddressTypeBits.p2pkh,
    [CashAddressType.p2pkt]: CashAddressTypeBits.p2pkt,
    [CashAddressType.p2sh]: CashAddressTypeBits.p2sh,
    [CashAddressType.p2pkhWithTokens]: CashAddressTypeBits.p2pkhWithTokens,
    [CashAddressType.p2shWithTokens]: CashAddressTypeBits.p2shWithTokens,
}
