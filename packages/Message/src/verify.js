/* Import modules. */
import { verifyMessageHashEcdsa } from '@nexajs/crypto'

export default async (_address, _signature, _msgbuf) => {
    return verifyMessageHashEcdsa(_address, _signature, _msgbuf)
}
