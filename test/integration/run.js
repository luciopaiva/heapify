
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const tests = ["node-import", "node-require", "node-typescript"];

async function run(folder) {
    try {
        await exec(`cd ${folder} && npm --silent test`);
    } catch (e) {
        console.error(e.message.trim());
        throw e;
    }
}

Promise.allSettled(tests.map(run))
    .then(results => {
        if (results.some(result => result.status === "rejected")) {
            console.error("There are failing integration tests.");
        } else {
            console.info("All integration tests passed.")
        }
    });
