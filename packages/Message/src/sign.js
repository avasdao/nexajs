/* Import modules. */
import { signMessageHashEcdsa } from '@nexajs/crypto'

import { parseWif } from '@nexajs/hdnode'

export default async (_wif, _message) => {
    let prefix

    prefix = 'nexa'

    /* Parse WIF. */
    const {
        // address,
        privateKey,
        // publicKey,
    } = await parseWif(_wif, prefix, 'TEMPLATE')

    /* Return signature. */
    return signMessageHashEcdsa(privateKey, _msgbuf)
}
