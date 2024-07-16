/* Import modules. */
import _ from 'lodash'

/* Import (local) modules. */
import $ from '../utils/preconditions.js'
import JSUtil from './JS.js'

const _integerAsBuffer = function (integer) {
    $.checkArgumentType(integer, 'number', 'integer')
    var bytes = []
    bytes.push((integer >> 24) & 0xff)
    bytes.push((integer >> 16) & 0xff)
    bytes.push((integer >> 8) & 0xff)
    bytes.push(integer & 0xff)
    return Buffer.from(bytes)
}

const networks = []
const networkMaps = {}

/**
 * A network is merely a map containing values that correspond to version
 * numbers for each nexa network. Currently only supporting "livenet"
 * (a.k.a. "mainnet") and "testnet".
 * @constructor
 */
class Network {
    constructor() {}

    static get(arg, keys) {
        return _get(arg, keys)
    }

    static get defaultNetwork() {
        return _livenet
    }
}

Network.prototype.toString = function toString() {
    return this.name
}

/**
 * @function
 * @member Networks#get
 * Retrieves the network associated with a magic number or string.
 * @param {string|number|Network} arg
 * @param {string|Array} keys - if set, only check if the magic number associated with this name matches
 * @return Network
 */
const _get = function (arg, keys) {
  if (~networks.indexOf(arg)) {
    return arg;
  }
  if (keys) {
    if (!_.isArray(keys)) {
      keys = [keys];
    }
    for (var i = 0; i < networks.length; i++) {
      var network = networks[i];
      var filteredNet = _.pick(network, keys);
      var netValues = _.values(filteredNet);
      if(~netValues.indexOf(arg)) {
	return network;
      }
    }
    return undefined;
  }
  return networkMaps[arg];
}

/***
 * Derives an array from the given prefix to be used in the computation
 * of the address' checksum.
 *
 * @param {string} prefix Network prefix. E.g.: 'bitcoincash'.
 */
const prefixToArray = function (prefix) {
    var result = []

    for (var i=0; i < prefix.length; i++) {
        result.push(prefix.charCodeAt(i) & 31)
    }

    return result
}

/**
 * @function
 * @member Networks#add
 * Will add a custom Network
 * @param {Object} data
 * @param {string} data.name - The name of the network
 * @param {string} data.alias - The aliased name of the network
 * @param {Number} data.pubkeyhash - The publickey hash prefix
 * @param {Number} data.privatekey - The privatekey prefix
 * @param {Number} data.scripthash - The scripthash prefix
 * @param {Number} data.xpubkey - The extended public key magic
 * @param {Number} data.xprivkey - The extended private key magic
 * @param {Number} data.networkMagic - The network magic number
 * @param {Number} data.port - The network port
 * @param {Array}  data.dnsSeeds - An array of dns seeds
 * @return Network
 */
const addNetwork = function (data) {
    var network = new Network()

    JSUtil.defineImmutable(network, {
        name: data.name,
        alias: data.alias,
        pubkeyhash: data.pubkeyhash,
        privatekey: data.privatekey,
        scripthash: data.scripthash,
        xpubkey: data.xpubkey,
        xprivkey: data.xprivkey,
    })

    var indexBy = data.indexBy || Object.keys(data)

  if (data.prefix) {
    _.extend(network, {
      prefix: data.prefix,
      prefixArray: prefixToArray(data.prefix),
    });
  }

  if (data.networkMagic) {
    _.extend(network, {
      networkMagic: _integerAsBuffer(data.networkMagic)
    });
  }

  if (data.port) {
    _.extend(network, {
      port: data.port
    });
  }

  if (data.dnsSeeds) {
    _.extend(network, {
      dnsSeeds: data.dnsSeeds
    });
  }
  networks.push(network);
  indexNetworkBy(network, indexBy);
  return network;
}

const indexNetworkBy = function (network, keys) {
    for (var i = 0; i <  keys.length; i++) {
        var key = keys[i]
        var networkValue = network[key]
        if (!_.isUndefined(networkValue) && !_.isObject(networkValue)) {
            networkMaps[networkValue] = network
        }
    }
}


/**
 * @function
 * @member Networks#remove
 * Will remove a custom network
 * @param {Network} network
 */
const removeNetwork = function (network) {
    if (typeof network !== 'object') {
        network = _get(network)
    }

    for (var i = 0; i < networks.length; i++) {
        if (networks[i] === network) {
            networks.splice(i, 1)
        }
    }

    for (var key in networkMaps) {
        if (networkMaps[key].length) {
            const index = networkMaps[key].indexOf(network)

            if (index >= 0) {
                networkMaps[key].splice(index, 1)
            }

            if (networkMaps[key].length === 0) {
                delete networkMaps[key]
            }
        } else if (networkMaps[key] === network) {
            delete networkMaps[key]
        }
    }
}

// from https://gitlab.com/nexa/nexa/-/blob/dev/src/chainparams.cpp#L577
var dnsSeeds = [
    'seed.nextchain.cash',
    'seeder.nexa.org',
    'nexa-seeder.bitcoinunlimited.info'
]

const liveNetwork = {
    name: 'livenet',
    alias: 'mainnet',
    prefix: 'nexa',
    pubkeyhash: 0x19,
    privatekey: 0x23,
    scripthash: 0x44,
    xpubkey: 0x42696720,
    xprivkey: 0x426c6b73,
    networkMagic: 0x72271221,
    port: 7228,
    dnsSeeds: dnsSeeds,
}

const testNetwork = {
    name: 'testnet',
    prefix: 'nexatest',
    pubkeyhash: 0x6f,
    privatekey: 0xef,
    scripthash: 0xc4,
    xpubkey: 0x043587cf,
    xprivkey: 0x04358394,
    networkMagic: 0xf4e5f3f4,
    port: 18333,
    dnsSeeds: dnsSeeds,
}

const regtestNetwork = {
    name: 'regtest',
    prefix: 'nexareg',
    pubkeyhash: 0x6f,
    privatekey: 0xef,
    scripthash: 0xc4,
    xpubkey: 0x043587cf,
    xprivkey: 0x04358394,
    networkMagic: 0xdab5bffa,
    port: 18444,
    dnsSeeds: [],
    indexBy: [
        'port',
        'name',
        'prefix',
        'networkMagic'
    ],
}


// Add configurable values for testnet/regtest


addNetwork(testNetwork)
addNetwork(regtestNetwork)
addNetwork(liveNetwork)

const _livenet = _get('livenet')
const _regtest = _get('regtest')
const _testnet = _get('testnet')

/**
 * @function
 * @deprecated
 * @member Networks#enableRegtest
 * Will enable regtest features for testnet
 */
const _enableRegtest = function () {
    testnet.regtestEnabled = true
}

/**
 * @function
 * @deprecated
 * @member Networks#disableRegtest
 * Will disable regtest features for testnet
 */
const _disableRegtest = function () {
    testnet.regtestEnabled = false
}

export const add = addNetwork
export const remove = removeNetwork
export const defaultNetwork = _livenet
export const livenet = _livenet
export const mainnet = _livenet
export const testnet = _testnet
export const regtest = _regtest
export const get = _get
export const enableRegtest = _enableRegtest
export const disableRegtest = _disableRegtest

export default Network
