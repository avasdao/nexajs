/* Import (test) modules. */
import { expect } from 'chai'
import { v4 as uuidv4 } from 'uuid'

import { encodeAddress } from '@nexajs/address'

import {
    encodePrivateKeyWif,
    parseWif,
} from '@nexajs/hdnode'

import { broadcast } from '@nexajs/provider'

import { getCoins } from '@nexajs/purse'

import {
    encodeNullData,
    OP,
} from '@nexajs/script'

import {
    binToHex,
    hexToBin,
    reverseHex,
} from '@nexajs/utils'

/* Libauth helpers. */
import {
    encodeDataPush,
    instantiateRipemd160,
    instantiateSecp256k1,
    instantiateSha256,
} from '@bitauth/libauth'

/* Import class. */
import { Token } from '../../index.js'

/* Import library modules. */
import {
    getGroupDataScript,
    getGroupId,
    getTokens,
    getTopTokens,
    sendToken,
} from '../../index.js'

/* Set (test) constants. */
const PRIVATE_KEY = 'baa017c1c3458fc80c31c7b5a2ce833a3af44d3c172bff3981103d272f9a5a3c' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const NEXA_RECEIVING_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'
const TOKEN_ID = 'nexa:tptlgmqhvmwqppajq7kduxenwt5ljzcccln8ysn9wdzde540vcqqqcra40x0x'
const TOKEN_ID_HEX = '57f46c1766dc0087b207acde1b3372e9f90b18c7e67242657344dcd2af660000'
// const SATOSHIS = 1337
const TOKENS = 1337n // NOTE: This MUST be a type of BigInt.
const TOP_TOKEN_ID = 'nexa:tzpkl799rmczewlerpu7ck7fywkp828vj3tvqqquaewpaxyhzqqqqk96tks5p'
const TOP_TOKEN_TICKER = 'TOG'

const SAMPLE_GROUP_DATA = '6a38564c054e4558414a534e6578614a532e396139333262303268747470733a2f2f6e6578616a732e6f7267133700000000000000000000000000000000000000000000000000008888888855'

/* Instantiate Libauth crypto interfaces. */
const ripemd160 = await instantiateRipemd160()
const secp256k1 = await instantiateSecp256k1()
const sha256 = await instantiateSha256()

const randomIntFromInterval = (_min, _max) => {
    return Math.floor(Math.random() * (_max - _min + 1) + _min)
}

describe( 'Token Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Token' class.` )
    } )

    describe( 'Token -> Create a new token group', () => {
        it( 'should return an OP_RETURN info data script', async () => {
// return
            const params = {
                ticker: 'NEXAJS',
                name: `NexaJS.${uuidv4().slice(0, 8)}`,
                uri: 'https://nexajs.org',
                hash: '1337000000000000000000000000000000000000000000000000000088888888',
                decimals: randomIntFromInterval(0, 8),
            }

            const groupDataScript = await getGroupDataScript(params)
            // console.log('GROUP DATA SCRIPT', binToHex(groupDataScript))

            expect(groupDataScript).to.have.length.gte(76)
        } )

    } )

    describe( 'Token -> Generate a new group id', () => {
        it( 'should return a new token group id', async () => {
// return
            let groupData
            let groupid
            let nonceDec
            let outpoint
            let scriptPubKey

            outpoint = '48f3a733fa9346b161454b15a72f27f90634a2dd20208fcb52c046472d384ef6'

            groupData = hexToBin('6a0438564c05054f524e4745066f72616e67650f687474703a2f2f6e6578612e6f726720000000000000000000000000000000000000000000000000000000000000000054')
            let { groupidBin, nonceBin } = await getGroupId(outpoint, groupData)
            // console.log('GROUP ID (hex):', binToHex(groupidBin))
            // console.log('NONCE (hex):', binToHex(nonceBin))

            nonceDec = parseInt(reverseHex(binToHex(nonceBin)).slice(2), 16)
            // console.log('NONCE (decimal):', nonceDec)

            expect(groupidBin).to.have.length(32)
            expect(nonceBin).to.eql(hexToBin('99040400000000fc'))
            expect(groupidBin).to.eql(hexToBin('6f9d4d6b1e4fa6cabcf9021701be96f3dde77395acefc5346f93fa8866d90000'))

            /* Encode the public key hash into a P2PKH nexa address. */
            groupid = encodeAddress(
                'nexa',
                'GROUP',
                groupidBin,
            )
            // console.log('GROUP ID', groupid)
            expect(groupid).to.equal('nexa:tqsxl82ddv0ylfk2hnusy9cph6t08h08ww26em79x3he875gvmvsqqq96zkm228')
        } ).timeout(60000) // FIXME Replace magic number.

    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
