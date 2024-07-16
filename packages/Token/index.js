/* Import modules. */
import { EventEmitter } from 'events'

/* Import flags. */
import _getFlags from './src/getFlags.js'

/* Export flags. */
export const flags = _getFlags

/* Import (local) modules. */
import _buildTokens from './src/buildTokens.js'
import _getDustLimit from './src/getDustLimit.js'
import _getGroupDataScript from './src/getGroupDataScript.js'
import _getGroupId from './src/getGroupId.js'
import _getSubgroupDataScript from './src/getSubgroupDataScript.js'
import _getTokens from './src/getTokens.js'
import _getTopTokens from './src/getTopTokens.js'
import _sendTokens from './src/sendTokens.js'

/* Export (local) modules. */
export const buildTokens = _buildTokens
export const getDustLimit = _getDustLimit
export const getGroupDataScript = _getGroupDataScript
export const getGroupId = _getGroupId
export const getSubgroupDataScript = _getSubgroupDataScript
export const getTokens = _getTokens
export const getTopTokens = _getTopTokens
export const sendToken = _sendTokens // alias
export const sendTokens = _sendTokens


/**
 * Token Class
 *
 * Manages token functions.
 */
export class Token extends EventEmitter {
    constructor(_primary, _secondary) {
        /* Initialize Token class. */
        // console.info('Initializing Token...')
        // console.log(JSON.stringify(_primary, null, 2))
        // console.log(JSON.stringify(_secondary, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Token (Instance) is working!'
    }
    static test() {
        return 'Token (Static) is working!'
    }

    /* Token Flags */
    static get flags() {
        return flags
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Token class. */
Nexa.Token = Token

/* Initialize Token flags. */
Nexa.flags = flags

/* Initialize Token modules. */
Nexa.buildTokens = buildTokens
Nexa.getGroupDataScript = getGroupDataScript
Nexa.getGroupId = getGroupId
Nexa.getSubgroupDataScript = getSubgroupDataScript
Nexa.getTokens = getTokens
Nexa.getTopTokens = getTopTokens
Nexa.sendToken = sendTokens // alias
Nexa.sendTokens = sendTokens

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
