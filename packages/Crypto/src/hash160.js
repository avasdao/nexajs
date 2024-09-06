import {
    ripemd160,
    sha256,
} from '../index.js'

export default (_value) => {
    return ripemd160(sha256(_value))
}
