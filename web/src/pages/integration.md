---
title: Integration
description: Quidem magni aut exercitationem maxime rerum eos.
---

NEXA.js can be integrated with plain JavaScript or with different module loaders.



## Introduction

We provide several examples below showing how to load NEXA.js in different systems.

{% callout title="You should know!" %}
If you're using a front-end framework (e.g., React, Angular, or Vue), please see available integrations.
{% /callout %}

### Script Tag

NEXA.js offers a drop-in option that plays nicely with your current JS framework.

```html
<script src="path/to/nexajs/dist/nexajs.umd.js"></script>

<script>
const wallet = new Nexa.Wallet(ctx, {...})
</script>
```

### Bundlers (Webpack, Rollup, etc.)

NEXA.js is 100% modular and tree-shakeable. However, it is recommended to import ONLY the methods you are going to use, to keep (re-)build times as short as possible.

```js
import Nexa from 'nexajs'

const wallet = new Nexa.Wallet(ctx, {...})
```

### CommonJS

Because Chart.js is an ESM library, in CommonJS modules you should use a dynamic `import`:

```js
const Nexa = await import('nexajs')

const wallet = new Nexa.Wallet(ctx, {...})
```

### RequireJS

__Important:__ RequireJS can load only [AMD modules](https://requirejs.org/docs/whyamd.html), so be sure to require one of the UMD builds instead (i.e. `dist/nexajs.umd.js`).

```js
require(['path/to/nexajs/dist/nexajs.umd.js'], function(Nexa) {
    const wallet = new Nexa.Wallet(ctx, {...})
})
```
