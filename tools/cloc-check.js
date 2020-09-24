/* eslint-disable no-console,no-process-exit,no-sync */

const spawn = require("child_process").spawnSync;
const path = require("path");
const glob = require("glob");
const {config} = require("../package.json");

const files = glob.sync(path.join(__dirname, "..", "*.mjs"));

const result = spawn("cloc", ["--quiet", "--csv", ...files]);

const output = result.stdout.toString("utf-8");

for (const line of output.split("\n")) {
    const fields = line.split(",");
    if (fields[1] === "SUM") {
        const loc = Number(fields[4]);
        const maxLoc = config["max-loc"];
        if (loc <= maxLoc) {
            console.info(`cloc: total of ${loc} lines of code`);
            process.exit(0);
        } else {
            console.error(`cloc: exceed maximum allowed lines of code of ${maxLoc} (has ${loc})`);
            process.exit(1);
        }
    }
}

console.error("LoC count failed");
process.exit(1);
