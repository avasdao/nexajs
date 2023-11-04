---
title: Node.js
description: Quidem magni aut exercitationem maxime rerum eos.
---

NEXA.js has been optimized to run efficiently as the engine for your back-end Node.js application(s).

---

## V8 JavaScript Engine

V8 is the name of the JavaScript engine that powers Google Chrome. It's the thing that takes our JavaScript and executes it while browsing with Chrome.

{% callout title="You should know!" %}
Learn how to setup and run your own [Nexa daemon](https://nexa.org/node). Easily run a local node at home/work or deploy one _(or more)_ node(s) to remote/cloud server(s).
{% /callout %}

### Basic Application Server

It's quick & easy to setup and host a (Nexa) Web3-enabled application on ANY Node.js server; and in just 13 lines of code.

```js
import { getTip } from '@nexajs/rostrum'
import http from 'http'
const hostname = '127.0.0.1'
const port = 3000
const server = http.createServer(async (req, res) => {
    const blockTip = await getTip()
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end(`Current NEXA block height is: ${blockTip.height}`)
})
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})
```

__The following libraries were built specifically for back-end services:__

1. [RPC](/pkg/rpc)


## Native C/C++ Bindings

You have the option for a "direct" connection to the Nexa ([CashLib](https://gitlab.com/nexa/nexa/-/blob/dev/src/cashlib/cashlib.cpp)) library.
