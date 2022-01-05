
const spawn = require("child_process").spawn;

const tests = ["node-import", "node-require", "node-typescript"];

async function exec(cmd, args) {
    const process = spawn(cmd, args, { stdio: "inherit" });
    await new Promise((resolve, reject) => process.on("close", code => code === 0 ? resolve() : reject()));
}

async function runTest(folder) {
    try {
        await exec(`./run-integration-test.sh`, [folder]);
    } catch (e) {
        console.error(e.message.trim());
        throw e;
    }
}

async function run() {
    await exec("./setup-integration-tests.sh");

    const results = await Promise.allSettled(tests.map(runTest));
    if (results.some(result => result.status === "rejected")) {
        console.error("There are failing integration tests.");
    } else {
        console.info("All integration tests passed.")
    }
}

run();
