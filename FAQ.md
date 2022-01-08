
# Frequently asked questions

## How to import a specific version of Heapify?

Using npm, just specify the version when installing Heapify:

    npm install heapify@0.6.0

Or using unpkg.com:

    import {MinQueue} from "https://unpkg.com/heapify@0.6.0"

See [unpkg](https://unpkg.com/) for more importing options.

## How do I import Heapify on a Node.js native ES6 module?

One could initially try this:

```js
import {MinQueue} from "heapify";
```

But running it produces the following error:

```
import {MinQueue} from "heapify";
        ^^^^^^^^
SyntaxError: Named export 'MinQueue' not found. The requested module 'heapify' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from 'heapify';
const {MinQueue} = pkg;
```

Developer note: the error is only seen in the Heapify production build. If I build it for development, the error does not appear. I think it has something to do with the uglify step.

This is the correct way of doing it:

```js
import {MinQueue} from "heapify/heapify.mjs";
```

The `main` script exported by Heapify's `package.json` is a CommonJS module, but current Node.js versions still have trouble handling CommonJS modules imported by ES6 module scripts. [There are ways](https://techsparx.com/nodejs/esnext/dynamic-import-2.html) to do it, but they are not very pretty.

The other way around it is to make it a two-step operation, like this:

```js
import Heapify from "heapify";
const {MinQueue} = Heapify;
```

It is weird that this works at all while the one-line version doesn't, but it does 🤷.
