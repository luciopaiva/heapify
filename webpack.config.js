
const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";
let isFirstTarget = true;

function makeConfig(target, filename, module) {
    const config = {
        mode: isProduction ? "production" : "development",
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
                ...(!module && {name: "Heapify"}),
                type: module ? "module" : "umd",
            },
        },
        devtool: "inline-source-map",
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/i,
                    loader: "ts-loader",
                    exclude: ["/node_modules/"],
                    options: {
                        transpileOnly: true,
                    },
                },
            ],
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                // we want to generate d.ts files, but only for the first target (no need to generate them 3 times!)
                ...(isFirstTarget && { typescript: {
                        build: true,  // see https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/issues/689#issuecomment-1005020849
                        mode: "write-dts",
                    }}),
            }),
        ],
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },
    };

    isFirstTarget = false;
    return config;
}

module.exports = [
    makeConfig("node", "heapify.node.js", false),
    makeConfig("web", "heapify.js", false),
    makeConfig("web", "heapify.mjs", true),
];
