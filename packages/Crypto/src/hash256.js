import { sha256 } from '../index.js'

export default (_value) => {
    return sha256(sha256(_value))
}
