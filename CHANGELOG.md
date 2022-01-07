
# CHANGELOG

## v0.6.0

This version brings an important major update to Heapify. Until v0.5.x, Heapify could only be used via ES6 modules, forcing the use of `import` statements both in Node.js and the browser. Starting with v0.6, Heapify is now much more accessible, enabling `require()` and non-module script tag usages.

As [is naturally expected](https://semver.org/#spec-item-4) in v0.x versions, this new version introduces a breaking change. The priority queue class is now called `MinQueue` and must be accessed like this:

    import {MinQueue} from "heapify";

This change prepares the field for upcoming API additions, starting a journey that will eventually lead us to v1.0 with a useful and stable library.

List of changes:

- completely ported Heapify to TypeScript (with no performance penalty 🎉)
- added Webpack as builder, generating builds for Node.js and the browser
- besides `import`, Heapify can now be `require()`d in Node.js as well
- pre-ES6 browser scripts can now use Heapify too
- replaced Mocha/c8 with Jest for unit tests and code coverage
- added integration tests for Node.js and the browser (the latter via puppeteer)

## v0.5.0

- added TypeScript typings

## v0.4.1

- fixed heap after bug introduced in v0.4.0 

## v0.4.0

- added performance improvement for successive push & pop calls
- added more benchmarks

## v0.3.0

- replaced nyc with c8 for code coverage
- added ESLint
- added `size` and `capacity` properties
- renamed `toString()` to `dumpRawPriorities()` to avoid confusion

## v0.2.1

- updated documentation

## v0.2.0

- build heap in linear time
- using 1-based index for the underlying arrays

## v0.1.0

- first released version
