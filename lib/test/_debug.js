#!/usr/bin/env node

/* Import classes. */
import { Address } from '../index.js'
import { Purse } from '../index.js'

/* Import (Purse) modules. */
import { sendUtxo } from '../index.js'

const PRIVATE_KEY = 'a42801c4-40cd-4e8f-aeba-a74f5145ad9b'

/* Check debug flag. */
if (process.env.DEBUG) {
    /* Initialize Address. */
    const address = new Address('nexa:nqblahblahblah')

    address.test()
    console.log()

    address.print()
    console.log()

    /* Initialize Purse. */
    const purse = new Purse(PRIVATE_KEY)

    purse.test()
    console.log()

    Purse.staticTest()
    console.log()

    /* Private keys. */
    console.log('Private Key (constructor) :', purse.privateKey)
    purse.privateKey = 'my-new-super-secure-key'
    console.log('Private Key (setter)      :', purse.privateKey)
    console.log()

    /* UTXOs. */
    sendUtxo()
    console.log()

}
