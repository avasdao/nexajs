import { CashAddressType } from './_CashAddressType.js'
import { CashAddressTypeBits } from './_CashAddressTypeBits.js'

export const cashAddressTypeBitsToType = {
  [CashAddressTypeBits.p2pkh]: CashAddressType.p2pkh,
  [CashAddressTypeBits.p2sh]: CashAddressType.p2sh,
  [CashAddressTypeBits.p2pkhWithTokens]: CashAddressType.p2pkhWithTokens,
  [CashAddressTypeBits.p2shWithTokens]: CashAddressType.p2shWithTokens,
  [CashAddressTypeBits.p2pkt]: CashAddressType.p2pkt,
};
