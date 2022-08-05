# CashLib

### `cashlib.cc`

[https://gitlab.com/nexa/nexa/-/blob/dev/src/cashlib/cashlib.cpp](https://gitlab.com/nexa/nexa/-/blob/dev/src/cashlib/cashlib.cpp)

## API

Here is the API.

### Bin2Hex

```
int Bin2Hex(
    unsigned char *val,
    int length,
    char *result,
    unsigned int resultLen
);
```

### GetPubKey

```
int GetPubKey(
    unsigned char *keyData,
    unsigned char *result,
    unsigned int resultLen
);
```

### SignTxECDSA

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

### SignBchTxSchnorr

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

### SignTxSchnorr

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

### SignHashECDSA

```
int SignHashECDSA(
    const unsigned char *hash,
    unsigned char *keyData,
    unsigned char *result,
    unsigned int resultLen
);
```

### SignHashSchnorr

```
int SignHashSchnorr(
    const unsigned char *hash,
    unsigned char *keyData,
    unsigned char *result,
    unsigned int resultLen
);
```

### sha256

```
void sha256(
    const unsigned char* data,
    unsigned char len,
    unsigned char* result
);
```

### hash256

```
void hash256(
    const unsigned char* data,
    unsigned char len,
    unsigned char* result
);
```

### hash160

```
void hash160(
    const unsigned char* data,
    unsigned char len,
    unsigned char* result
);
```

### txid

```
int txid(
    unsigned char *txData,
    int txbuflen,
    unsigned char *result
);
```

### txidem

```
int txidem(
    unsigned char *txData,
    int txbuflen,
    unsigned char *result
);
```

### RandomBytes

```
int RandomBytes(
    unsigned char *buf,
    int num
);
```
