/* eslint-disable
    no-empty-function,
    @typescript-eslint/no-empty-function,
    @typescript-eslint/ban-ts-comment
*/

// @ts-ignore
import pkg from "./package.json";
import {terser} from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";

// [pkg.types, pkg.main, pkg.module, pkg.browser].forEach(filename => fs.unlink(filename, () => {}));

export default {
    input: "src/heapify.ts",
    output: [
        {
            file: pkg.main,
            format: "cjs",
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: "es",
            sourcemap: true,
        },
        {
            file: pkg.browser,
            format: "iife",
            name: "Heapify",
            sourcemap: true,
        },
    ],
    plugins: [
        typescript({
            noEmitOnError: true,
        }),
        terser(),
    ],
};
