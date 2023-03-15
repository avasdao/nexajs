export default {
    /**
     * Pay to Public Key (P2PK). This address type is uncommon, and primarily
     * occurs in early blocks because the original satoshi implementation mined
     * rewards to P2PK addresses.
     *
     * There are no standardized address formats for representing a P2PK address.
     * Instead, most applications use the `AddressType.p2pkh` format.
     */
    p2pk: 'P2PK',

    /**
     * Pay to Public Key Hash (P2PKH). The most common address type. P2PKH
     * addresses lock funds using a single private key.
     */
    p2pkh: 'P2PKH',

    /**
     * 20-byte Pay to Script Hash (P2SH20). An address type that locks funds to
     * the 20-byte hash of a script provided in the spending transaction. See
     * BIPs 13 and 16 for details.
     */
    p2sh20: 'P2SH20',

    /**
     * 32-byte Pay to Script Hash (P2SH32). An address type that locks funds to
     * the 32-byte hash of a script provided in the spending transaction.
     */
    p2sh32: 'P2SH32',

    /**
     * Pay to Public Key Template (P2PKT). The most common address type. P2PKT
     * addresses lock funds using a single private key.
     */
    p2pkt: 'P2PKT',
}
