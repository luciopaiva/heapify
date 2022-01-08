/* eslint-disable no-console, no-empty-function, @typescript-eslint/no-empty-function */
import {spawn} from "child_process";

interface CompletablePromise<T> extends PromiseLike<T> {
    resolve(value: T): void;
    reject(): void;
}

function makeCompletablePromise(): CompletablePromise<unknown> {
    let resolve: (value: unknown) => void = () => {};
    let reject: () => void = () => {};
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    }) as unknown as CompletablePromise<unknown>;
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
}

export async function exec(cmd: string|string[], timeout = 60_000) {
    try {
        const [command, ...args] = typeof cmd === "string" ? [cmd] : cmd;
        const child = spawn(command, args, {
            stdio: "inherit",
        });

        const promise = makeCompletablePromise();

        const timer = setTimeout(() => {
            child.kill("SIGKILL");
            console.error("Process killed due to timeout. If this persists, consider increasing the timeout.");
            promise.reject();
        }, timeout);

        child.on("close", (code: number) => {
            if (code === 0) {
                clearTimeout(timer);
                promise.resolve(0);
            } else {
                promise.reject();
            }
        });

        await promise;
    } catch (e) {
        const cmdStr = typeof cmd === "string" ? cmd : cmd.join(" ");
        console.error(`exec failed: "${cmdStr}"`);
        if (e instanceof Error) {
            console.error(e.toString());
        }
        throw e;
    }
}
