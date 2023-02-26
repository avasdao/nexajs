export class Purse {
    constructor(_privateKey) {
        console.info('\n  Creating new Purse instance...\n') // eslint-disable-line no-console

        /* Set private key. */
        this._privateKey = _privateKey
    }

    get privateKey() {
        return this._privateKey
    }

    set privateKey(_privateKey) {
        this._privateKey = _privateKey
    }

    test() {
        testPurse()
    }

    static staticTest() {
        console.log('Running STATIC Purse test...')
        testPurse()
    }

    static sendUtxo() {
        sendUtxo()
    }
}

// FIXME FOR DEV PURPOSES ONLY
export const testPurse = () => {
    console.log('NexaJS Purse is a GO!')
}

export const sendUtxo = () => {
    console.log('Sending UTXO...')
}
