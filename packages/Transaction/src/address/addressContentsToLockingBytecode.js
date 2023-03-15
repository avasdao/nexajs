import encodeLockingBytecodeP2pkh from './encodeLockingBytecodeP2pkh.js'
import encodeLockingBytecodeP2pkt from './encodeLockingBytecodeP2pkt.js'
import encodeLockingBytecodeP2sh20 from './encodeLockingBytecodeP2sh20.js'
import encodeLockingBytecodeP2sh32 from './encodeLockingBytecodeP2sh32.js'
import LockingBytecodeType from './LockingBytecodeType.js'

export default ({
    payload,
    type,
}) => {
    if (type === LockingBytecodeType.p2pkh) {
        return encodeLockingBytecodeP2pkh(payload)
    }

    if (type === LockingBytecodeType.p2pkt) {
        return encodeLockingBytecodeP2pkt(payload)
    }

    if (type === LockingBytecodeType.p2sh20) {
        return encodeLockingBytecodeP2sh20(payload)
    }

    if (type === LockingBytecodeType.p2sh32) {
        return encodeLockingBytecodeP2sh32(payload)
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (type === LockingBytecodeType.p2pk) {
        return encodeLockingBytecodeP2pk(payload)
    }

    return unknownValue(
        type,
        `Unrecognized addressContents type: ${type}`
    )
}
