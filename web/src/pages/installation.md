---
title: Installation
description: Ready to add Crypto to your current application?
---

Getting started is quick and easy!

---

## Add Nexa to your Existing Webapp

Ready to add Crypto to your current application?

It's easy to drop-in the NEXA.js core library to your existing application, then add the individual features you need one at a time.

### Setup using a <script> tag in HTML

To quickly get started using Nexa in your existing Webapp, simply include this tag in the <head> section of your HTML:

```html
<!-- CDN (Web2) integration solution -->
<script src="https://cdn.nexajs.org/nexa.min.js"
  integrity="sha384-qBLa2DVAThYbLO3kajnReZVS5cG3m3swWmBL0tNN7CxvzgRZQw/cfwsmbXOGma7K"
  crossorigin="anonymous"></script>
```

__- OR -__

```html
<!-- IPFS Gateway (Web3) integration solution -->
<script src="https://bafybeifohi5njjlohhkwcsola3346cn3ngyaqyl5bwn5k7a4mbvtzy4y3m.ipfs.dweb.link/"
  integrity="sha384-qBLa2DVAThYbLO3kajnReZVS5cG3m3swWmBL0tNN7CxvzgRZQw/cfwsmbXOGma7K"
  crossorigin="anonymous"></script>
```

{% callout type="note" title="Pro Builder Tip — Import Individual Packages" %}
Although convenient to just import `nexa.min.js` and be on your way; we highly recommend that you import packages individually.

This means that decide when `methods()` you want to use and then import `package-name.min.js` for a much smaller load your your application.

Visit our [modules](/modules) section to learn more about importing packages.
{% /callout %}

### Setup using a package manager

NEXA.js is fully-supported by your favorite package manager. Choose from one of the options below to begin installation of NEXA.js into your existing Webapp.

```shell
npm install --save nexajs
```

```shell
yarn add nexajs
```

```shell
pnpm install nexajs
```

{% callout title="You should know!" %}
If you are NOT using a Package Manager like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/), then it is highly advised that you import individual packages, eg. [`@nexajs/rostrum`](https://github.com/avasdao/nexajs/tree/master/packages/Rostrum) to reduce your application's total package size.
{% /callout %}
