---
title: Address Examples & Use-cases
description: A collection of useful Addresses to bootstrap your next "wise" contract.
---

A collection of useful Addresses to bootstrap your Nexa "wise" contract(s).

## For Beginners

Address language is often intimidating at first, so we plan to ease you in ... gently.

```js
pragma nexscript >= 0.2.0;

contract Oddity() {
    /**
     * Transfer
     *
     * An asset transfer is permitted ONLY when the number of recipients
     * is ODD.
     */
    function transfer() {
        /* Set (total) number of (transaction) outputs. */
        int numOutputs = tx.outputs.length;

        /* Calculate oddity flag. */
        int isOddity = numOutputs % 2;

        /* Validate oddity flag. */
        // NOTE: An even number of outputs, eg. Two (2) or Four (4)
        //       will automatically FAIL!
        require(isOddity == 1);
    }
}
```

{% callout title="You should know!" %}
[NexAddress](https://nexscript.org/) offers a very user-friendly JavaAddress-style programming language that is very similar to Solidity.
{% /callout %}
