
import * as path from "path";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

let isFirstTarget = true;

function makeConfig(mode: string, target: string, filename: string, module: boolean) {
    const config = {
        mode: mode,
        entry: "./src/heapify.ts",
        target: target,
        experiments: {
            outputModule: module,
        },
        output: {
            clean: isFirstTarget,
            filename: filename,
            path: path.resolve(__dirname, "dist"),
            library: {
                ...!module && {name: "Heapify"},
                type: module ? "module" : "umd",
            },
        },
        devtool: mode === "development" && "inline-source-map",
        module: {
            rules: [
                {
                    test: /\.tsx?$/ui,
                    loader: "ts-loader",
                    exclude: ["/node_modules/"],
                    options: {
                        transpileOnly: true,
                    },
                },
            ],
        },
        plugins: [
            ...isFirstTarget ? [  // although we have multiple configurations, we just need to type-check once
                new ForkTsCheckerWebpackPlugin({
                    typescript: {
                        build: true,
                        mode: "write-dts",  // output a declaration file as well
                    },
                })
            ] : [],
        ],
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },
    };

    isFirstTarget = false;
    return config;
}

export default (mode: string) => [
    makeConfig(mode, "node", "heapify.node.js", false),
    makeConfig(mode, "web", "heapify.js", false),
    makeConfig(mode, "web", "heapify.mjs", true),
];
