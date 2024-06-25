/* Setup environment. */
import dotenv from 'dotenv'
import path from 'path'

console.log('NEXA_ENV', process.env.NEXA_ENV)
switch(process.env.NEXA_ENV) {
case 'mainnet':
    dotenv.config({ silent: true, path: path.join('test', '.env') })
    break
case 'testnet':
    dotenv.config({ silent: true, path: path.join('test', '.env.testnet') })
    break
case 'regtest':
    dotenv.config({ silent: true, path: path.join('test', '.env.regtest') })
    break
default:
    dotenv.config({ silent: true, path: path.join('test', '.env') })
    break
}
