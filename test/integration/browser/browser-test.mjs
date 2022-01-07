
import assert from "assert";
import puppeteer from "puppeteer";
import WebServer from "./web-server.mjs";

/**
 * Used by browser integration tests. It will spawn a web server and then ask Puppeteer to open a browser and visit
 * our page. The page will load Heapify and run a test function.
 */
export default class BrowserTest {
    #server;
    #browser;

    async start() {
        this.#server = new WebServer();
        await this.#server.start();
        this.#browser = await puppeteer.launch();
    }

    async stop() {
        await this.#server.close();
        await this.#browser.close();
    }

    async run(indexHtml) {
        const page = await this.#browser.newPage();

        page.on("pageerror", (error) => {
            throw error;
        });
        page.on("error", (error) => {
            throw error;
        });

        const url = `http://localhost:${this.#server.port}/${indexHtml}`;
        await page.goto(url);
        assert.ok(await this.#server.waitForAnswer(), "Test failed!");
    }
}
