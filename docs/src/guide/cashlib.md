# CashLib

The Cash Library is your gateway into a Nexa full node. The API interface provides a collection of methods to perform all of the critical actions necessary to build (advanced) blockchain applications.

## cashlib.h

[https://gitlab.com/nexa/nexa/-/blob/dev/src/cashlib/cashlib.h](https://gitlab.com/nexa/nexa/-/blob/dev/src/cashlib/cashlib.h)

Contains the Header template.

## cashlib.cpp

[https://gitlab.com/nexa/nexa/-/blob/dev/src/cashlib/cashlib.cpp](https://gitlab.com/nexa/nexa/-/blob/dev/src/cashlib/cashlib.cpp)

Contains the C++ source code.

---

> __Did you know? —__ The Cash Library API provides a Nexa developer with everything she needs to build production-ready decentralized applications.

## Bin2Hex

```
int Bin2Hex(
    unsigned char *val,
    int length,
    char *result,
    unsigned int resultLen
);
```

## GetPubKey

```
int GetPubKey(
    unsigned char *keyData,
    unsigned char *result,
    unsigned int resultLen
);
```

## hash160

```
void hash160(
    const unsigned char* data,
    unsigned char len,
    unsigned char* result
);
```

## hash256

```
void hash256(
    const unsigned char* data,
    unsigned char len,
    unsigned char* result
);
```

## RandomBytes

Return random bytes from cryptographically acceptable random sources.

Params ↪ `unsigned char` • `int`

Returns ↩ `int`

```
int RandomBytes(
    unsigned char *buf,
    int num
);
```

#### Possible Use Cases

- Private keey seed generation
- Object ID generation

## sha256

```
void sha256(
    const unsigned char* data,
    unsigned char len,
    unsigned char* result
);
```

## SignBchTxSchnorr

```
int SignBchTxSchnorr(
    unsigned char *txData,
    int txbuflen,
    unsigned int inputIdx,
    int64_t inputAmount,
    unsigned char *prevoutScript,
    uint32_t priorScriptLen,
    uint32_t nHashType,
    unsigned char *keyData,
    unsigned char *result,
    unsigned int resultLen
);
```

## SignHashECDSA

```
int SignHashECDSA(
    const unsigned char *hash,
    unsigned char *keyData,
    unsigned char *result,
    unsigned int resultLen
);
```

## SignHashSchnorr

```
int SignHashSchnorr(
    const unsigned char *hash,
    unsigned char *keyData,
    unsigned char *result,
    unsigned int resultLen
);
```

## SignTxECDSA

```
int SignTxECDSA(
    unsigned char *txData,
    int txbuflen,
    unsigned int inputIdx,
    int64_t inputAmount,
    unsigned char *prevoutScript,
    uint32_t priorScriptLen,
    uint32_t nHashType,
    unsigned char *keyData,
    unsigned char *result,
    unsigned int resultLen
);
```

## SignTxSchnorr

```
int SignTxSchnorr(
    unsigned char *txData,
    int txbuflen,
    unsigned int inputIdx,
    int64_t inputAmount,
    unsigned char *prevoutScript,
    uint32_t priorScriptLen,
    unsigned char *hashType,
    unsigned int hashTypeLen,
    unsigned char *keyData,
    unsigned char *result,
    unsigned int resultLen
);
```

## txid

```
int txid(
    unsigned char *txData,
    int txbuflen,
    unsigned char *result
);
```

## txidem

```
int txidem(
    unsigned char *txData,
    int txbuflen,
    unsigned char *result
);
```
