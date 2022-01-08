/* eslint-disable no-console */
import {exec} from "../../../scripts/exec";

const TESTS = ["node-import", "node-require", "node-typescript", "browser"];
const SCRIPTS_FOLDER = "scripts";

async function runTest(folder: string) {
    try {
        await exec([`${SCRIPTS_FOLDER}/run-integration-test.sh`, folder]);
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
