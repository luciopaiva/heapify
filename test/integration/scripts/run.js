
const spawn = require("child_process").spawn;

const TESTS = ["node-import", "node-require", "node-typescript"];
const SCRIPTS_FOLDER = "scripts";

async function exec(cmd, args) {
    const process = spawn(cmd, args, { stdio: "inherit" });
    await new Promise((resolve, reject) => process.on("close", code => code === 0 ? resolve() : reject()));
}

async function runTest(folder) {
    try {
        await exec(`${SCRIPTS_FOLDER}/run-integration-test.sh`, [folder]);
    } catch (e) {
        console.error(e.message.trim());
        throw e;
    }
}

async function run() {
    await exec(`${SCRIPTS_FOLDER}/setup-integration-tests.sh`);

    const results = await Promise.allSettled(TESTS.map(runTest));
    if (results.some(result => result.status === "rejected")) {
        console.error("There are failing integration tests.");
    } else {
        console.info("All integration tests passed.")
    }
}

run();
