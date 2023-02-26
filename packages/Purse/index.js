export class Purse {
    constructor(_privateKey) {
        console.log('This is the Address package.')

        this.privateKey = _privateKey
    }

    hello() {
        console.log('hello', this.privateKey)
    }

    test() {
        this.hello()
    }

    static staticTest() {
        console.log('THIS IS A STATIC PURSE TEST')
    }
    // return {
    //     doIt,
    // }
}

// FIXME FOR DEV PURPOSES ONLY
export const testPurse = () => {
    console.log('NexaJS Purse is a GO!')
}

export const sendUtxo = () => {
    console.log('Sending UTXO...')
}
