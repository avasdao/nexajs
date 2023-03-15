export default {
    improperPadding:         'Error decoding CashAddress: the payload is improperly padded.',
    invalidCharacters:       'Error decoding CashAddress: the payload contains non-bech32 characters.',
    invalidChecksum:         'Error decoding CashAddress: invalid checksum - please review the address for errors.',
    invalidFormat:           'Error decoding CashAddress: CashAddresses should be of the form "prefix:payload".',
    mismatchedPayloadLength: 'Error decoding CashAddress: mismatched payload length for specified address version.',
    reservedByte:            'Error decoding CashAddress: unknown CashAddress version, reserved byte set.',
    unknownAddressType:      'Error decoding CashAddress: unknown CashAddress type.',
}
