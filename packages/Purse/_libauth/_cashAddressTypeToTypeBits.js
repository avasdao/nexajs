import { CashAddressType } from './_CashAddressType.js'
import { CashAddressTypeBits } from './_CashAddressTypeBits.js'

export const cashAddressTypeToTypeBits = {
  [CashAddressType.p2pkh]: CashAddressTypeBits.p2pkh,
  [CashAddressType.p2sh]: CashAddressTypeBits.p2sh,
  [CashAddressType.p2pkhWithTokens]: CashAddressTypeBits.p2pkhWithTokens,
  [CashAddressType.p2shWithTokens]: CashAddressTypeBits.p2shWithTokens,
  [CashAddressType.p2pkt]: CashAddressTypeBits.p2pkt,
};
