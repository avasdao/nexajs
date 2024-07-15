/*************************************************
 *
 * TEST VECTORS
 * ------------
 *
 * An assortment of variables to be used for comprehensive testing.
 */

/* System Settings */
export const DUST_VAL = 546
export const MAINNET_PREFIX = 'nexa'
export const TESTNET_PREFIX = 'nexatest'
export const REGTEST_PREFIX = 'nexareg'
export const GROUP_TYPE = 'GROUP'
export const TEMPLATE_TYPE = 'TEMPLATE'
export const SLEEP_DURATION = 5000
export const TIMEOUT = 10000

/* Values */
export const SATOSHIS = 1337n // NOTE: This MUST be a type of BigInt.
export const TOKENS = 1337n // NOTE: This MUST be a type of BigInt.

/* Addresses */
export const NEXA_TEST_ADDRESS = 'nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz'
export const NEXA_RECEIVING_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'
export const NEXA_DUMP_ADDRESS = 'nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz'
export const ADDRESS_BINARY_HASH = new Uint8Array([
   0,  81,  20, 132, 172,
   11, 121, 194, 105,  92, 235,
  150, 170, 136, 198, 245, 183,
  190, 219, 213, 225, 147, 242
])
export const P2PKH_TEST_ADDRESS = 'nexa:qqq9z9yy4s9hnsnftn4ed25gcm6m00km6hse8usme8yynpn'
export const RETURN_ADDRESS = 'nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz'

/* (Token) Assets */
export const NEXA_TEST_TOKEN = 'nexareg:tqcfh2wjq3l9pd43s997282eu4esxhf4mfl5uplk5jpt7gt50vqqqa49yj5gp'
export const TOKEN_BINARY_HASH = new Uint8Array([
   48, 155, 169, 210,   4, 126,  80, 182,
  177, 129,  75, 229,  29,  89, 229, 115,
    3,  93,  53, 218, 127,  78,   7, 246,
  164, 130, 191,  33, 116, 123,   0,   0
])
// 309ba9d2047e50b6b1814be51d59e573035d35da7f4e07f6a482bf21747b0000

export const NEXA_TOKENID = 'nexa:tr8dsp7r9dr2efafva3wkylhyus3nq76gw637um5k5ps3999ngqqq3dtn9avf' // NEXAJS
export const NEXA_TOKENID_HEX = 'ced807c32b46aca7a96762eb13f727211983da43b51f7374b5030894a59a0000' // NEXAJS

export const NIFTY_TOKENID = 'nexa:tr9v70v4s9s6jfwz32ts60zqmmkp50lqv7t0ux620d50xa7dhyqqqcg6kdm6f' // NiftyArt.cash

export const AVAS_TOKENID = 'nexa:tptlgmqhvmwqppajq7kduxenwt5ljzcccln8ysn9wdzde540vcqqqcra40x0x'
export const AVAS_TOKENID_HEX = ''
export const STUDIO_TOKENID = 'nexa:tztnyazksgqpkphrx2m2fgxapllufqmuwp6k07xtlc8k4xcjpqqqq99lxywr8'
export const STUDIO_TOKENID_HEX = '9732745682001b06e332b6a4a0dd0fffc4837c707567f8cbfe0f6a9b12080000'

export const LIVE_TOKEN_ADDRESS = 'nexa:nqtsq5g5eap34upgh8g09n44lh4ccx32fqr7g48fzlqha8w2' // Wally wallet


/* Mining */
export const MINING_PAYLOAD = '005114c5c521c611bfd1b32c2fbd22212b3bbd5bd0b09e'

/* Alice */
export const ALICE_PAYLOAD = '005114f70db1391cbae390be80d15edb533e0091e01a0d'
export const ALICE_TOKENID = 'nexareg:trmag6n5j7vh59nalyxppwkpu2d4yl9j7ws65tq2z3umeq5lnvqqqrvcnxcht'
export const ALICE_TOKENID_HEX = 'f7d46a7497997a167df90c10bac1e29b527cb2f3a1aa2c0a1479bc829f9b0000'

/* Rostrum */
export const FIRST_USE_BLOCK = '97ff8f23985915cc10c24c4467ae720a837da028c03b9365a090555aaa7b836a'
export const FIRST_USE_TX = '66aa8ffac98f9dee16c4693aa902587bb7ba8f048e6a9ebd553f3fdc3e805b8f'

/* Blocks */
export const BLOCK_HEIGHT = 104
export const BLOCK_HASH = 'e622acd01ffe83b30fb9b49085ecc248666b74f2145d0978c422cde015479720ffff7f2071b3d0c9122622e3045c15b60e2c65d5f171e0216b1af3fe2dd107e331e41ed76b6639d919997e4414446898de8824f9015093ece4212151c5a1f01db341d11200000000000000000000000000000000000000000000000000000000000000000292746565cc00000000000000000000000000000000000000000000000000000000000000f700000000000000010000000400000000010000020100ca9a3b0000000017005114001ed07e6b85886c8508d5591bd297ce874429f70000000000000000000f6a0165000a0000000000000000000000000000'

/* Transactions */
export const SAMPLE_TXID = 'f6be0fffecb1862348c2d48e17576bf5bfcb41494a643d1a3294435bf7baf79f'
export const SAMPLE_OUTPOINT = 'f5819081c64451ef0e514cb06e8298625afa7fd0fb8f1b21378e7a61465f4983'

/* Scripts */
export const ADDRESS_SCRIPT_HASH = '5a9cde8e7b0ca1549f424411f9115662b09467e3cabc22184d3706a19b33629a'
export const BIT_AUTH = BigInt(9223372036854775808)    // 1 << 63
export const BIT_MINT = BigInt(4611686018427387904)    // 1 << 62
export const BIT_MELT = BigInt(2305843009213693952)    // 1 << 61
export const BIT_BATON = BigInt(1152921504606846976n)  // 1 << 60
export const BIT_RESCRIPT = BigInt(576460752303423488) // 1 << 59
export const BIT_SUBGROUP = BigInt(288230376151711744) // 1 << 58

/* Secrets */
export const TEST_MNEMONIC = 'bacon mind chronic bean luxury endless ostrich festival bicycle dragon worth balcony' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
export const PRIVATE_KEY = 'baa017c1c3458fc80c31c7b5a2ce833a3af44d3c172bff3981103d272f9a5a3c'
export const PRIVATE_KEY_1 = 'ab93ef31c3de84f33d6a7c96a85b13f5653e93e014d5eba30f2a2353dc2b8af7' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
export const PRIVATE_KEY_2 = 'f6bbef4f472ee95ec56576e84cfb640eb5e086f67c0bda5463f3e9ccc84b5f32' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
export const PRIVATE_KEY_3 = '238990ddf6e84495abf641db1034ed429c3ddfd7808e8bf0900a4ac50fa00323' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
export const TEST_SEED = '7f4b36c05bc7b02fbacf1bd60077fd41478f0da66d5c895b7f9106e17a90e2e3a456255f17701d8548d756741dc854c61aa68f2cd9d36bcbc869f1c046a65de9'
export const TEST_WIF = '6HYqypNbnLLYvhd9cDjD888wNugsRVUV4xboQHPBvvqhWwzZazFP'
export const RPC_USERNAME = 'user'
export const RPC_PASSWORD = 'password'
export const RPC_PORT = '18332'

/* Samples */
export const NEXA_TEST_PARAM = 'some-val'
export const PUBLIC_KEY = '03fc6dbeb83e8d9514eb2512fa1c5f00ab7f96bce07195cb6a5f6ae4f3c41592b2'
export const SAMPLE_INPUT = {
    outpoint: 'dd4456006ddfcf16607c7caa297e9654f0aa65c2b758db06d6cc2ec790d20992',
    amount: 160.72,
    scriptSig: {
        asm: '210218264068bc8be1517fb289818a6bc4264a49eba9ee1114aaa040521a1c7c7834 c856ef6c3ab5555d4614e76c464ff2d8b5abf7440b86f512eb439b98f14f783b329241dd1ce649d6f6595b9cc2a60d7dad95283689793758787e35aba00d34c0[ALL]',
        hex: '22210218264068bc8be1517fb289818a6bc4264a49eba9ee1114aaa040521a1c7c783440c856ef6c3ab5555d4614e76c464ff2d8b5abf7440b86f512eb439b98f14f783b329241dd1ce649d6f6595b9cc2a60d7dad95283689793758787e35aba00d34c0'
    },
    sequence: 4294967294
}
export const SAMPLE_RAW_TX = '0001e405cfdb6865fbbf6ef6a2328d13b599d57f1736634ce81608375759f7db98ca6441850f48143a95b3225ede77a81d985cd0468d58b3fe91cd163c3e522ef677c92ba330c2ef72c45562cc70c6194a3aa4f4a93c04c5f55bfbe5375ea43e4de66226002102bd3f95e1b1b90286955c5f99d804b9baa8f825bf9bbcb087aa3b5546d5eb0c7d0000000039050000000000000100000000'
export const SAMPLE_NULL_DATA = '6a0438564c05054f524e4745066f72616e67650f687474703a2f2f6e6578612e6f726720000000000000000000000000000000000000000000000000000000000000000054' // Token creation for NEXA.js
export const NEXA_TEST_BODY = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
export const NEXA_TEST_SECRET = 'correct horse battery staple'
export const NEXA_FOR_EVERYONE = 'NEXAForEveryone'
export const NEXA_FOR_EVERYONE_HEX = '4e455841466f7245766572796f6e65'
export const TEST_BYTES = '3feb2e20a908ccd7d31f84224276b02f2c3951ed3448da58722a107ec4ab393c'
export const TEST_BINARY = new Uint8Array([21, 31, 41])
export const TEST_HEX = '151f29'
export const REVERSED_VERIFY = '3c39abc47e102a7258da4834ed51392c2fb0764222841fd3d7cc08a9202eeb3f'
export const TEST_ARRAY_64_BIT = [ 57, 5, 0, 0, 0, 0, 0, 0 ] // 1337
export const TEST_ARRAY_32_BIT = [ 57, 5, 0, 0 ] // 1337
export const TEST_ARRAY_16_BIT = [ 57, 5 ] // 1337
export const TEST_ARRAY_16_VARINT = [ 253, 57, 5 ] // 1337

export const MSG_SIG_ECDSA = 'z2GrpCb75+hhSBClNRjYtiWmy5xY+4w3+RSinTfxz/Z4zIzJ0L6H6RuNx0ng0k+AWwBYjE3OV1bsJfyE6ZPwYw=='
export const MSG_SIG_BIN = new Uint8Array([
    207,  97, 171, 164,  38, 251, 231, 232,  97,  72,  16,
    165,  53,  24, 216, 182,  37, 166, 203, 156,  88, 251,
    140,  55, 249,  20, 162, 157,  55, 241, 207, 246, 120,
    204, 140, 201, 208, 190, 135, 233,  27, 141, 199,  73,
    224, 210,  79, 128,  91,   0,  88, 140,  77, 206,  87,
     86, 236,  37, 252, 132, 233, 147, 240,  99
])
export const MSG_SIG_HEX = 'cf61aba426fbe7e8614810a53518d8b625a6cb9c58fb8c37f914a29d37f1cff678cc8cc9d0be87e91b8dc749e0d24f805b00588c4dce5756ec25fc84e993f063'
export const MSG_SIG_ELECTRON = 'IM9hq6Qm++foYUgQpTUY2LYlpsucWPuMN/kUop038c/2eMyMydC+h+kbjcdJ4NJPgFsAWIxNzldW7CX8hOmT8GM='

/* MetaNet */
export const METANET_ADMIN_ADDR = '0x27a9b30dbe015842098f4cd31f0301a1cee74bfe'

/* DeFi */
export const ALICE_ID_HEX = '845ee20d7b603506d4fc597b3e0a1a14be9a96fbcd8bb1205f8a9a034a9a0000'
export const AUTH_TOKENID_HEX = '845ee20d7b603506d4fc597b3e0a1a14be9a96fbcd8bb1205f8a9a034a9a00001337330000000000000000000000000000000000000000000000000088888888'
export const POLYMORPH_HEX = `76009c630500f2052a010320fd0051023905148c26e10aa399c5e2d4ff7c449c7279a5b5708f0f08ffffffffffffff008103ffff00815154c0c7517f7c76010087636d00677f7501207f7568c0cdc0c788c45279a169c47b9c6353cd517f7c76010087636d00677f7501207f756881009d685a7aa9557a88c0c85a7a7c7e5a7a7ea7a9577f7501007e81567a6351b27554795379965479a46ea1697567765579a16968146d2235e60b3c2f1a3ce5032f94e85173411f598b51cd827751cd7c0114947f7788040084d71751cd517f7c76010087636d00677f77517f7c76010087636d00677f75816868a16951cd517f7c76010087636d00677f7501207f7568527988557a567a968b567a7c965853797eea9d52cd517f7c76010087636d00677f7501207f75687b886d6d7567519d14d9236063bc604f8408a7e12050c4f67bb46bdcfe51c7517f7c76010087636d00677f75820120876375006868a98868`
