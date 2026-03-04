#!/usr/bin/env bash
set -euo pipefail

# Build the library
npm run build

# Bundle package.json into dist/ so it can be packed
cp package.json dist/

# Create a local tarball from the dist
rm -f heapify-local.tgz
npm pack ./dist
mv heapify-*.tgz heapify-local.tgz

# Reinstall the benchmark's heapify dependency from the local tarball
rm -rf benchmark/node_modules/heapify
npm -C benchmark install

# Run benchmarks
./benchmark/node_modules/.bin/tsx benchmark/index.ts
