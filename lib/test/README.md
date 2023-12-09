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
