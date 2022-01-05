/* eslint-disable no-console */
import {spawn} from "child_process";

const TESTS = ["node-import", "node-require", "node-typescript", "browser-import", "browser-script"];
const SCRIPTS_FOLDER = "scripts";

async function exec(cmd: string, args: string[] = []) {
    const process = spawn(cmd, args, {
        stdio: "inherit",
        timeout: 10_000,  // the process is expected to take only a few seconds to complete
    });
    await new Promise((resolve, reject) => process.on("close",
        (code: number) => code === 0 ? resolve(code) : reject(code)));
}

async function runTest(folder: string) {
    try {
        await exec(`${SCRIPTS_FOLDER}/run-integration-test.sh`, [folder]);
    } catch (e) {
        if (e instanceof Error) {
            console.error(e.message.trim());
        }
        throw e;
    }
}

async function run() {
    await exec(`${SCRIPTS_FOLDER}/setup-integration-tests.sh`);

    const results = await Promise.allSettled(TESTS.map(runTest));
    if (results.some(result => result.status === "rejected")) {
        console.error("There are failing integration tests.");
    } else {
        console.info("All integration tests passed.");
    }
}

run().then(() => console.info("Done."));
