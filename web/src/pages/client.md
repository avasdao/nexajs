---
title: Web Browser
description: Quidem magni aut exercitationem maxime rerum eos.
---

NEXA.js has been optimized to work efficiently in all modern Web browsers (incl. Chrome, Firefox and Edge). You can either link to one of our CDN packages -OR- build from one of our Node Package Manager (NPM) packages using your preferred bundler.

---

## Link to CDN

Upgrading an existing application is as simple as adding a `<script>` tag (from your preferred CDn) into your HTML document.

### Web2 (CDN) Installation

```html
<!-- CDN (Web2) integration solution -->
<script src="https://cdn.nexajs.org/nexa.min.js"
  integrity="sha384-qBLa2DVAThYbLO3kajnReZVS5cG3m3swWmBL0tNN7CxvzgRZQw/cfwsmbXOGma7K"
  crossorigin="anonymous"></script>
```

### Web3 (IPFS) Installation

```html
<!-- IPFS Gateway (Web3) integration solution -->
<script src="https://bafybeifohi5njjlohhkwcsola3346cn3ngyaqyl5bwn5k7a4mbvtzy4y3m.ipfs.dweb.link/"
  integrity="sha384-qBLa2DVAThYbLO3kajnReZVS5cG3m3swWmBL0tNN7CxvzgRZQw/cfwsmbXOGma7K"
  crossorigin="anonymous"></script>
```

### Web4 (CAPD | Nostr) Installation

```html
<!-- Counterparty and Protocol Discovery (Web4) integration solution -->
<script src="proto://9addf9bc724b2e14094950598918dde63b091253e6106b7d9716nexaverse888"></script>
```

{% callout title="You should know!" %}
We recommend you include the `<script>` tag as the last element in the `<head>` of your HTML document.
{% /callout %}

---

## Package Manager Installation

```bash
npm install --save nexajs
```
```bash
yarn add nexajs
```
```bash
pnpm install nexajs
```

__WARNING__: We presently don't provide any tooling to verify that the release on `npm` matches GitHub.  As such, you should verify anything downloaded by `npm` against your own verified copy.
