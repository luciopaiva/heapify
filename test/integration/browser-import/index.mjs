
import * as assert from "assert";
import * as http from "http";
import * as fs from "fs";
import puppeteer from "puppeteer";
import {test as testFunction} from "common";

class Server {
    #server;
    #sockets = new Set();
    #resolve;
    #answer = new Promise(resolve => this.#resolve = resolve);

    async start() {
        this.#server = http.createServer((req, res) => {
            if (req.url === "/") {
                res.writeHead(200, {"Content-Type": "text/html"});
                const index = fs.readFileSync("index.html", "utf-8");
                res.write(index.replace("<!--TEST-->", testFunction.toString()));
                res.end();
            } else if (req.url === "/heapify") {
                res.writeHead(200, {"Content-Type": "text/javascript"});
                res.write(fs.readFileSync("../../../dist/heapify.mjs", "utf-8"));
                res.end();
            } else if (req.url === "/answer") {
                let answer = "";
                req.on("data", data => answer += data);
                req.on("end", () => this.#resolve(answer));
                this.#answer.then(() => res.writeHead(200).end());
            } else {
                res.writeHead(404).end();
            }
        });

        this.#server.on("connection", socket => {
            this.#sockets.add(socket);
            socket.once("close", () => this.#sockets.delete(socket));
        });

        this.#server.listen(5000);
        await new Promise(resolve => this.#server.on("listening", resolve));
        console.info("Server is up and running.");
    }

    async waitForAnswer() {
        return this.#answer;
    }

    async close() {
        this.#server.close();

        for (const socket of this.#sockets) {
            socket.destroy();
        }

        await new Promise(resolve => {
            this.#server.on("close", () => {
                resolve();
            })
        });
        console.info("Server closed.");
    }
}

class Test {

    async run() {
        const server = new Server();
        await server.start();

        const browser = await puppeteer.launch();
        const page = await browser.newPage()
        await page.goto("http://localhost:5000");

        console.info("Waiting for answer...");

        assert.ok(await server.waitForAnswer(), "Test failed!");
        console.info("Test passed!");
        await server.close();

        await browser.close();
    }
}

(async () => {
    await (new Test()).run();
})();
