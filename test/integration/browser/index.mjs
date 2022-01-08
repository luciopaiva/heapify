
import BrowserTest from "./browser-test.mjs";

(async () => {
    const test = new BrowserTest();
    await test.start();
    try {
        // this test will make sure Heapify can be imported as a module
        await test.run("index-module.html");
        // this test verifies that Heapify can be loaded as window.Heapify via a script tag
        await test.run("index-script.html");
    } finally {
        await test.stop();
    }
})();
