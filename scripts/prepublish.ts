/*
 * This script is a little hack to prevent someone from directly running `npm publish`.
 * https://stackoverflow.com/a/51651639/778272
 */

/* eslint-disable no-process-env, no-console, no-process-exit */

const ENABLE_PUBLISH = Boolean(process.env.ENABLE_PUBLISH);

if (!ENABLE_PUBLISH) {
    console.info("Run `npm run release` to publish the package");
    process.exit(1);
}
