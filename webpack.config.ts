
import * as path from "path";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import pkg from "./package.json";

let shouldCheckTypeScript = true;

function checkTypeScript(plugins: Array<unknown>) {
    plugins.push(new ForkTsCheckerWebpackPlugin({
        typescript: {
            build: true,
            mode: "write-dts",  // output a declaration file as well
        },
    }));
}

function makeConfig(mode: string, filename: string, module: boolean) {
    const config = {
        mode: mode,
        entry: "./src/heapify.ts",
        target: "web",  // works for Node.js too as long as globalObject is set to `this` (see below)
        experiments: {
            outputModule: module,
        },
        output: {
            filename: filename,
            path: path.resolve(__dirname, "dist"),

            /*
             * Here, `globalObject` must be set to `this` so the same output can work for both Node.js and the browser.
             * See:
             * - https://stackoverflow.com/a/64639975/778272
             * - https://webpack.js.org/configuration/output/#outputglobalobject
             */
            globalObject: "this",
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
        plugins: [],
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },
    };

    if (shouldCheckTypeScript) {  // although we have multiple configurations, we just need to type-check once
        checkTypeScript(config.plugins);
        shouldCheckTypeScript = false;
    }

    return config;
}

export default (_env: unknown, argv: {mode: string}) => [
    makeConfig(argv.mode, path.basename(pkg.main), false),
    makeConfig(argv.mode, path.basename(pkg.module), true),
];
