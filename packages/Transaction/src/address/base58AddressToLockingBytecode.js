import addressContentsToLockingBytecode from './addressContentsToLockingBytecode.js'
import decodeBase58Address from './decodeBase58Address.js'
import LockingBytecodeType from './LockingBytecodeType.js'

export default (
    address,
    sha256
) => {
    const decoded = decodeBase58Address(address, sha256)

    if (typeof decoded === 'string') return decoded

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
        }
    }
