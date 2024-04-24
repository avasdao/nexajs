# NEXA.js Transaction

Create and manage Transactions.

The Transaction Manager represents a transaction internally and is used to build a transaction step-by-step. It can then be expressed as a hexadecimal string ready to be sent to the $NEXA network.

The necessary steps to create a transaction are:
1. Add input(s)
2. Add output(s)
3. Set lock time _(optional)_
4. Sign input(s)
