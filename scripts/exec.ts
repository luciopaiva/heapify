
import {spawn} from "child_process";

export async function exec(cmd: string|string[]) {
    const [command, ...args] = typeof cmd === "string" ? [cmd] : cmd;
    const process = spawn(command, args, {
        stdio: "inherit",
        timeout: 10_000,  // the process is expected to take only a few seconds to complete
    });
    await new Promise((resolve, reject) => process.on("close",
        (code: number) => code === 0 ? resolve(code) : reject(code)));
}
