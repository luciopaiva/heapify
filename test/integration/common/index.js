
/**
 * This function is used to run all tests, be they Node.js or browser tests.
 * Returns a boolean indicating whether the test passed or not.
 */
function testFunction(queue) {
    queue.push(3, 3);
    queue.push(2, 2);
    queue.push(1, 1);

    const results = [];
    while (queue.size > 0) {
        results.push(queue.pop());
    }

    const outcome = results.join(",");
    const expected = "1,2,3";

    return outcome === expected;
}

module.exports = { testFunction };
