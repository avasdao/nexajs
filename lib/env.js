/* Setup environment. */
import dotenv from 'dotenv'

console.log('NEXA_ENV', process.env.NEXA_ENV)
switch(process.env.NEXA_ENV) {
case 'mainnet':
    dotenv.config({ silent: true })
    break
case 'testnet':
    dotenv.config({ silent: true, path: '.env.testnet' })
    break
case 'regtest':
    dotenv.config({ silent: true, path: '.env.regtest' })
    break
default:
    dotenv.config({ silent: true })
    break
}
