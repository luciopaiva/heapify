
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
            new ForkTsCheckerWebpackPlugin({
                // we want to generate a d.ts file, but only for the first target (no need to generate it 3 times!)
                ...isFirstTarget && { typescript: {
                    // build: true,  // see https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/issues/689#issuecomment-1005020849
                    mode: "write-dts",
                }},
            }),
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
