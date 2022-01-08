/*
 * This script copies all relevant files to the dist folder, where the library will be published from. This
 * unconventional way of publishing a library has the benefit of making the scripts appear at the root of
 * the library folder for whomever is going to use it. Instead of importing, say, `heapify/dist/heapify.mjs`,
 * one can now import `heapify/heapify.mjs`.
 */

/* eslint-disable no-process-env, no-console, no-process-exit, no-sync */

import * as fs from "fs";
import * as path from "path";

const FILES = [
    "package.json",
    "README.md",
    "LICENSE.md",
];

FILES.forEach(source => {
    const destination = path.resolve("dist", source);
    fs.copyFileSync(source, destination);
});
