// Copyright (c) 2015-2019 The Bitcoin Unlimited developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef CASHLIB_H
#define CASHLIB_H

#include "stdint.h"
/** Convert binary data to a hex string.  The provided result buffer must be 2*length+1 bytes.
 */
SLAPI int Bin2Hex(unsigned char *val, int length, char *result, unsigned int resultLen);

/** Given a private key, return its corresponding public key */
SLAPI int GetPubKey(unsigned char *keyData, unsigned char *result, unsigned int resultLen);

/** Sign one input of a transaction using an ECDSA signature
    All buffer arguments should be in binary-serialized data.
    The transaction (txData) must contain the COutPoint (tx hash and vout) of all relevant inputs,
    however, it is not necessary to provide the spend script.
*/
SLAPI int SignTxECDSA(unsigned char *txData,
    int txbuflen,
    unsigned int inputIdx,
    int64_t inputAmount,
    unsigned char *prevoutScript,
    uint32_t priorScriptLen,
    uint32_t nHashType,
    unsigned char *keyData,
    unsigned char *result,
    unsigned int resultLen);

/** Sign one input of a transaction using a Schnorr signature
    All buffer arguments should be in binary-serialized data.
    The transaction (txData) must contain the COutPoint (tx hash and vout) of all relevant inputs,
    however, it is not necessary to provide the spend script.
*/
SLAPI int SignBchTxSchnorr(unsigned char *txData,
    int txbuflen,
    unsigned int inputIdx,
    int64_t inputAmount,
    unsigned char *prevoutScript,
    uint32_t priorScriptLen,
    uint32_t nHashType,
    unsigned char *keyData,
    unsigned char *result,
    unsigned int resultLen);

/** Sign one input of a transaction using a Schnorr signature
    All buffer arguments should be in binary-serialized data.
    The transaction (txData) must contain the COutPoint (tx hash and vout) of all relevant inputs,
    however, it is not necessary to provide the spend script.
*/
SLAPI int SignTxSchnorr(unsigned char *txData,
    int txbuflen,
    unsigned int inputIdx,
    int64_t inputAmount,
    unsigned char *prevoutScript,
    uint32_t priorScriptLen,
    unsigned char *hashType,
    unsigned int hashTypeLen,
    unsigned char *keyData,
    unsigned char *result,
    unsigned int resultLen);

/* Sign a hash (presumably the hash of some data) using an ECDSA signature */
SLAPI int SignHashECDSA(const unsigned char *hash,
    unsigned char *keyData,
    unsigned char *result,
    unsigned int resultLen);



/* Sign a hash (presumably the hash of some data) using a Schnorr signature */
SLAPI int SignHashSchnorr(const unsigned char *hash,
    unsigned char *keyData,
    unsigned char *result,
    unsigned int resultLen);


/** Calculates the sha256 of data, and places it in result.  Result must be 32 bytes */
SLAPI void sha256(const unsigned char* data, unsigned char len, unsigned char* result);

/** Calculates the double sha256 of data and places it in result. Result must be 32 bytes */
SLAPI void hash256(const unsigned char* data, unsigned char len, unsigned char* result);

/** Calculates the RIPEMD160 of the SHA256 of data and places it in result. Result must be 20 bytes */
SLAPI void hash160(const unsigned char* data, unsigned char len, unsigned char* result);

/** Calculates the id of the passed serialized transaction.  Result must be 32 bytes */
SLAPI int txid(unsigned char *txData, int txbuflen, unsigned char *result);

/** Calculates the idem of the passed serialized transaction.  Result must be 32 bytes */
SLAPI int txidem(unsigned char *txData, int txbuflen, unsigned char *result);

/** Return random bytes from cryptographically acceptable random sources */
SLAPI int RandomBytes(unsigned char *buf, int num);

#endif /* CASHLIB_H */
