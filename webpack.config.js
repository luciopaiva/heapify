
const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";
let shouldClean = true;

function makeConfig(target, filename, module) {
    const config = {
        mode: isProduction ? "production" : "development",
        entry: "./src/heapify.ts",
        target: target,
        experiments: {
            outputModule: module,
        },
        output: {
            clean: shouldClean,
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
            new ForkTsCheckerWebpackPlugin(),
        ],
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },
    };

    shouldClean = false;
    return config;
}

module.exports = [
    makeConfig("node", "heapify.node.js", false),
    makeConfig("web", "heapify.js", false),
    makeConfig("web", "heapify.mjs", true),
];
