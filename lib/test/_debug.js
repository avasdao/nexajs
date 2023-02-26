#!/usr/bin/env node

/* Import classes. */
import { Address } from '../index.js'
import { Purse } from '../index.js'

/* Import (Purse) modules. */
import { sendUtxo } from '../index.js'

/* Check debug flag. */
if (process.env.DEBUG) {
    /* Initialize Purse. */
    const purse = new Purse('my-secret-key')
    purse.hello()
    purse.test()

    sendUtxo()

    Purse.staticTest()
}
