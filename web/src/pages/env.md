---
title: Environment Variables
description: The following environment variables are supported by the library.
---

The following environment variables are supported by the library.


## Introduction

Environment variables allow developers to safely configure the critical parameters required to operate the various library functions.

{% callout title="You should know!" %}
Be sure NOT to save your `.env` files to source control.
{% /callout %}


## Globals

The following are the MOST commonly used variables, that apply across the majority of library modules.

{% callout title="You should know!" %}
This library support over 100+ parameters to allow Builders maximum flexibility and control over their applications.
{% /callout %}


These are the MOST used variables by our community. However, this library support over 100+ parameters to allow Builders maximum flexibility and control over their applications.

### MNEMONIC

Provide either a 12, 18 or 24 word seed phrase.

```
# Provide a 12, 18 or 24 word mnemonic phrase.
MNEMONIC=one two three four
```

### PRIVATE_KEY

Provide a 32-byte private key, in Hex format.

```
# Provide a 32-byte private key (in Hex format).
PRIVATE_KEY=abc123
```

### TESTNET

Performs ALL blockchain actions using the Test network.

```
# Set a flag for Testnet connections.
TESTNET=true
```

---


## Rostrum

Easily configure your Rostrum instances, either single connection or clustered.

### ROSTRUM

Specify your endpoint.

```
# Connect to RegTest
ROSTRUM=ws://127.0.0.1:30404
```

```
# Connect to Testnet
ROSTRUM=ws://127.0.0.1:30003
```

---


## Security Concerns

It's important to be careful how you implement your environment variables. Especially when using source control.
