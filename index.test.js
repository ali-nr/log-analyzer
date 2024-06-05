const fs = require("fs");
const path = require("path");
const { countUniqueIPs, findTopEntries, analyzeLogFile } = require("./index");

jest.mock("fs");

describe("Log Analyzer", () => {
  const logLines = [
    '177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0"',
    '168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "GET http://example.net/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0"',
    '168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "GET http://example.net/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0"',
    '168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "GET https://example.net/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0"',
    '168.41.191.41 - - [11/Jul/2018:17:41:30 +0200] "GET /this/page/does/not/exist/ HTTP/1.1" 404 3574 "-" "Mozilla/5.0"',
    '177.71.128.21 - - [10/Jul/2018:22:21:03 +0200] "GET /docs/manage-websites/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0"',
    '177.71.128.28 - - [10/Jul/2018:22:21:03 +0200] "GET /docs/new-doc/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0"',
    '50.112.00.28 - - [11/Jul/2018:15:49:46 +0200] "GET /faq/how-to-install/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0"',
    '50.112.20.24 - - [11/Jul/2018:15:49:46 +0200] "GET /faq/most-asked/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0"',
    '50.112.10.24 - - [11/Jul/2018:15:49:46 +0200] "GET / HTTP/1.1" 200 3574 "-" "Mozilla/5.0"',
    '50.112.129.33 - - [11/Jul/2018:15:49:46 +0200] "GET /faq/how-to-install/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0"',
  ];

  test("countUniqueIPs returns the correct number of unique IP addresses", () => {
    const ipCounts = {
      "177.71.128.21": 2,
      "168.41.191.40": 2,
      "168.41.191.41": 1,
      "50.112.00.28": 1,
    };
    const result = countUniqueIPs(ipCounts);
    expect(result).toBe(4);
  });

  test("findTopEntries returns the top 3 most repeated keys of the given entries", () => {
    const ipCounts = {
      "177.71.128.21": 2,
      "168.41.191.40": 2,
      "168.41.191.41": 1,
      "50.112.00.28": 1,
    };
    const result = findTopEntries(ipCounts);
    expect(result).toEqual(["177.71.128.21", "168.41.191.40", "168.41.191.41"]);
  });

  test("analyzeLogFile correctly processes the log file and return expected results", async () => {
    const logData = logLines.join("\n");

    fs.promises = {
      readFile: jest.fn().mockResolvedValue(logData),
    };

    const logFilePath = path.join(
      __dirname,
      "programming-task-example-data.log"
    );

    const result = await analyzeLogFile(logFilePath);

    expect(result.numberOfUniqueIPs).toBe(8);
    expect(result.top3IPs).toEqual([
      "168.41.191.40",
      "177.71.128.21",
      "168.41.191.41",
    ]);
    expect(result.top3Domains).toEqual(["example.net", "faq", "docs"]);
  });
});
