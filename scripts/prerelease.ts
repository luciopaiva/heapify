/*
 * This script copies all relevant files to the dist folder, where the library will be published from. This
 * unconventional way of publishing a library has the benefit of making the scripts appear at the root of
 * the library folder for whomever is going to use it. Instead of importing, say, `heapify/dist/heapify.mjs`,
 * one can now import `heapify/heapify.mjs`.
 */

/* eslint-disable no-process-env, no-console, no-process-exit, no-sync */

import * as fs from "fs";
import * as path from "path";
import pkg from "../package.json";

const DIST_FOLDER = "dist";

const BASE_FILES = [
    "package.json",
    "README.md",
    "LICENSE.md",
];

const ALL_FILES = new Set(BASE_FILES.concat(pkg.main, pkg.module, pkg.browser, pkg.types));

function copyBaseFiles() {
    BASE_FILES.forEach(source => {
        const destination = path.resolve("dist", source);
        fs.copyFileSync(source, destination);
    });
    console.info("✓ base files copies");
}

function verifyFiles() {
    for (const file of ALL_FILES) {
        const fullPath = path.resolve(DIST_FOLDER, file);
        if (!fs.existsSync(fullPath)) {
            throw new Error(`File "${file}" was not found, but is expected for the release.`);
        }
    }
    console.info("✓ file list verified");
}

function checkForExtranousFiles() {
    for (const file of fs.readdirSync(DIST_FOLDER)) {
        if (!ALL_FILES.has(file)) {
            throw new Error(`Extraneous file "${file}" found in release folder.`);
        }
    }
    console.info("✓ no extraneous files found");
}

console.info("> running prerelease procedure");
copyBaseFiles();
verifyFiles();
checkForExtranousFiles();
