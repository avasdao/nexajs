import { base58ToBin } from '@bitauth/libauth'

export const decodeBase58AddressFormat = (
  address,
  sha256
) => {
  const checksumBytes = 4;
  const bin = base58ToBin(address);
  if (bin === BaseConversionError.unknownCharacter) {
    return Base58AddressError.unknownCharacter;
  }
  const minimumBase58AddressLength = 5;
  if (bin.length < minimumBase58AddressLength) {
    return Base58AddressError.tooShort;
  }

  const content = bin.slice(0, -checksumBytes);
  const checksum = bin.slice(-checksumBytes);

  const expectedChecksum = sha256
    .hash(sha256.hash(content))
    .slice(0, checksumBytes);

  if (!checksum.every((value, i) => value === expectedChecksum[i])) {
    return Base58AddressError.invalidChecksum;
  }

  return {
    payload: content.slice(1),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    version: content[0],
  };
};
