#!/usr/bin/env node

/* Import classes. */
import { Address } from '../index.js'
import { Purse } from '../index.js'

/* Import (Purse) modules. */
import { sendUtxo } from '../index.js'

const PRIVATE_KEY = 'a42801c4-40cd-4e8f-aeba-a74f5145ad9b'
const NEXA_TEST_ADDRESS = 'nexatest:qzmzm493h5j67z2zk2lsag4qeye02x5pxyrlswqv76';

/* Check debug flag. */
if (process.env.DEBUG) {
    /* Initialize Address. */
    const address = new Address('nexa:nqblahblahblah')

    address.test()
    console.log()

    address.toString(true)
    console.log()

    const { prefix, type, hash } = Address.decode(NEXA_TEST_ADDRESS)
    console.log(prefix); // 'nexatest'
    console.log(type); // 'P2PKH'
    console.log(hash); // Uint8Array [... ]
    console.log(Address.encode(prefix, type, hash)); // 'nexatest:qzmzm493h5j67z2zk2lsag4qeye02x5pxyrlswqv76'


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
