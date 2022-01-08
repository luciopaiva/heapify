/* eslint-disable no-sync */
import fs from "fs";
import http from "http";
import {testFunction} from "common";

const DIST_FOLDER = "../../../dist";
const TEST_FUNCTION_STR = testFunction.toString();

/**
 * A simple web server to serve browser integration tests.
 */
export default class WebServer {
    #server;
    #sockets = new Set();
    #resolve;
    #port = 0;
    #answer = new Promise(resolve => {
        this.#resolve = resolve;
    });

    get port() {
        return this.#port;
    }

    async start() {
        this.#server = http.createServer((req, res) => {
            if (req.url.endsWith("js")) {
                this.sendJs(req.url, res);
            } else if (req.url.endsWith("html")) {
                this.sendHtml(req.url, res);
            } else if (req.url === "/answer") {
                let answer = "";
                req.on("data", data => {
                    answer += data;
                });
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

        this.#server.listen();
        await this.waitForEvent("listening");
        this.#port = this.#server.address().port;
    }

    sendJs(path, res) {
        res.writeHead(200, {"Content-Type": "text/javascript"});
        res.write(fs.readFileSync(`${DIST_FOLDER}${path}`, "utf-8"));
        res.end();
    }

    sendHtml(path, res) {
        const filename = path.substring(1);
        res.writeHead(200, {"Content-Type": "text/html"});
        const index = fs.readFileSync(filename, "utf-8");
        res.write(index.replace("<!--TEST-->", TEST_FUNCTION_STR));
        res.end();
    }

    async close() {
        this.#server.close();
        this.#sockets.forEach(socket => socket.destroy());  // otherwise, server will hang indefinitely
        await this.waitForEvent("close");
    }

    waitForAnswer() {
        return this.#answer;
    }

    waitForEvent(event) {
        return new Promise(resolve => this.#server.on(event, resolve));
    }
}
