import { addressContentsToLockingBytecode } from './_addressContentsToLockingBytecode.js'
import { decodeBase58Address } from './_decodeBase58Address.js'
import { LockingBytecodeType } from './_LockingBytecodeType.js'

export const base58AddressToLockingBytecode = (
  address,
  sha256
) => {
  const decoded = decodeBase58Address(address, sha256);
  if (typeof decoded === 'string') return decoded;

  return {
    bytecode: addressContentsToLockingBytecode({
      payload: decoded.payload,
      type: [
        Base58AddressFormatVersion.p2pkh,
        Base58AddressFormatVersion.p2pkhCopayBCH,
        Base58AddressFormatVersion.p2pkhTestnet,
      ].includes(decoded.version)
        ? LockingBytecodeType.p2pkh
        : LockingBytecodeType.p2sh20,
    }),
    version: decoded.version,
  };
};
