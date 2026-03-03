import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Browser, chromium } from "playwright";
import { FIXTURES_DIR, TEMP_DIR } from "./helpers";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

function createTestServer(): http.Server {
    const heapifyDir = path.join(TEMP_DIR, "node_modules", "heapify");

    return http.createServer((req, res) => {
        const url = req.url || "/";

        if (url.endsWith(".html")) {
            const filePath = path.join(FIXTURES_DIR, path.basename(url));
            if (!fs.existsSync(filePath)) {
                res.writeHead(404).end();
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(fs.readFileSync(filePath, "utf-8"));
        } else if (url.endsWith(".js") || url.endsWith(".mjs")) {
            const filePath = path.join(heapifyDir, path.basename(url));
            if (!fs.existsSync(filePath)) {
                res.writeHead(404).end();
                return;
            }
            res.writeHead(200, { "Content-Type": "text/javascript" });
            res.end(fs.readFileSync(filePath, "utf-8"));
        } else {
            res.writeHead(404).end();
        }
    });
}

async function assertBrowserTest(browser: Browser, port: number, htmlFile: string) {
    const page = await browser.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(`http://localhost:${port}/${htmlFile}`);
    await page.waitForFunction(
        () => (globalThis as unknown as Record<string, unknown>).__TEST_RESULT__ !== undefined,
        { timeout: 5_000 },
    );

    const result = await page.evaluate(
        () => (globalThis as unknown as Record<string, unknown>).__TEST_RESULT__,
    );
    expect(errors).toHaveLength(0);
    expect(result).toBe(true);
    await page.close();
}

describe("browser", () => {
    let browser: Browser | null = null;
    let server: http.Server | null = null;
    let port = 0;

    beforeAll(async () => {
        browser = await chromium.launch();
        server = createTestServer();
        await new Promise<void>((resolve) => {
            server!.listen(0, () => resolve());
        });
        const addr = server.address();
        port = typeof addr === "object" && addr ? addr.port : 0;
    });

    afterAll(async () => {
        await browser?.close();
        if (server) {
            await new Promise<void>((resolve) => server!.close(() => resolve()));
        }
    });

    it("imports heapify as ES module", async () => {
        await assertBrowserTest(browser!, port, "browser-module.html");
    });

    it("imports heapify via script tag", async () => {
        await assertBrowserTest(browser!, port, "browser-script.html");
    });
});
