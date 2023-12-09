# NexaJS Test Suites

The library offers three (3) comprehensive test suites:
1. Unit testing
2. Integration testing
3. End-to-end (E2E) testing

Library maintainers aim to preserve a minimum of >99.3% test coverage at all times. The following offers details about the rationale behind the various test suites.


## Nx/Lerna (Cloud) Automated Test Suite

```sh
npm test
```


## Library Unit Testing

Unit tests can be run directly from the command-line, using the format:

```sh
cd lib
npm test test/unit/<module-name>
```


## Library Integration Testing

Offers a simulated "real-world" environment using Regtest.

```sh
cd lib
npm test test/integration/<module-name>
```

_NOTE: These tests require a (local) regression network, with Rostrum running.  
( [see here for Setup instructions](#Regression_Testing_Regtest_Setup) )_

## Library End-to-End (E2E) Testing

Connections and executions are made to the LIVE Testnet.

```sh
cd lib
npm test test/e2e/<module-name>
```

---

## Regression Testing (Regtest) Setup

Verify your `nexa.conf` file has indexing and Rostrum enabled:

```yaml
# [General]
server=1                # enable Server (daemon) mode
rpcuser=user            # set RPC user
rpcpassword=password    # set RPC password

# [Data Services]
# Use by blockchain applications
txindex=1               # enable transaction indexing
electrum=1              # enable Rostrum server

# [ZeroMQ]
# ZeroMQ messages power the realtime Nexa Shell indexer
zmqpubrawtx=tcp://127.0.0.1:28332
zmqpubhashtx=tcp://127.0.0.1:28332
zmqpubhashblock=tcp://127.0.0.1:28332

# Nexa Shell makes heavy use of JSON-RPC so it's set to a higher number
rpcworkqueue=512

```

Use the following command to setup to your initial regression test (regtest) environment.

```sh
cd ~/.nexa
rm -rf regtest
nexad -regtest --printtoconsole
```

_(open a new CLI console/window)_

### (optional) test your environment setup

1. `nexa-cli -regtest getblockcount` should display `0` result

2. `nexa-cli -regtest getwalletinfo` should display similar to:

```json
{
  "walletversion": 130000,
  "syncblock": "d71ee431e307d12dfef31a6b21e071f1d5652c0eb6155c04e3222612c9d0b371",
  "syncheight": 0,
  "balance": 0.00,
  "unconfirmed_balance": 0.00,
  "immature_balance": 0.00,
  "watchonly_balance": 0.00,
  "unconfirmed_watchonly_balance": 0.00,
  "immature_watchonly_balance": 0.00,
  "txcount": 0,
  "keypoololdest": 1702137718,
  "keypoolsize": 100,
  "paytxfee": 0,
  "hdmasterkeyid": "6e07a5038907ccd51e83ac451373ad113de69ba9"
}
```

If all looks to be okay, you can excute the following lines to setup your "development" wallets and initial state.

```sh
cd <your-app-root-folder>
nexa-cli -regtest generate 103

nexa-cli -regtest getnewaddress >> .env "ALICE_ADDRESS=$ALICE_ADDRESS"
nexa-cli -regtest dumpprivkey $ALICE_ADDRESS >> .env "ALICE_WIF=$ALICE_PRIVKEY"

nexa-cli -regtest sendtoaddress $ALICE_ADDRESS 1000000.0
nexa-cli -regtest sendtoaddress $BOB_ADDRESS 1000000.0
```

OR, you can run the `scripts/init-regtest.sh` file to automatically do the above for you.

Verify that you have funded your "development" addresses:

```
nexa-cli -regtest listactiveaddresses
```

should display a result (similar to):

```
{
  "nexareg:nqtsq5g5qq0dqlntskyxepgg64v3h55he6r5g20h7ve0lkkv": 20000000.00,
  "nexareg:nqtsq5g5d53rtest8sh35089qvhef6z3wdq37kvt047ajyz7": 1000000.00,
  "nexareg:nqtsq5g5s9zarfznk8yyz0hj0yjpglmnr4ew9pmem0s5lk2y": 0.00,
  "nexareg:nqtsq5g56pkveemqlumjwyf44ejzgksxx36sttrd864mej9l": 7999995.62,
  "nexareg:nqtsq5g57uxmzwguht3ep05q690dk5e7qzg7qxsd03ky9al3": 1000000.00
}
```
