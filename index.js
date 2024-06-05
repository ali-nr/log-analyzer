const fs = require("fs");
const path = require("path");

const findTopEntries = (counts, topN = 3) => {
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN)
    .map(([key]) => key);
};

function countUniqueIPs(ipCounts) {
  return Object.keys(ipCounts).length;
}

async function analyzeLogFile(filePath) {
  const data = await fs.promises.readFile(filePath, "utf8");
  const logLines = data.split("\n").filter((line) => line);
  const ipCounts = {};
  const urlRootCounts = {};

  logLines.forEach((line) => {
    const sections = line.split(" ");

    const ip = sections[0];
    let url = sections[6];

    const urlRoot = url.match(/^https?:\/\//)
      ? url.split("/")[2]
      : url.split("/")[1];

    ipCounts[ip] = (ipCounts[ip] || 0) + 1;
    urlRootCounts[urlRoot] = (urlRootCounts[urlRoot] || 0) + 1;
  });

  const numberOfUniqueIPs = countUniqueIPs(ipCounts);
  const top3IPs = findTopEntries(ipCounts);
  const top3Domains = findTopEntries(urlRootCounts);

  return { numberOfUniqueIPs, top3IPs, top3Domains };
}

const logFilePath = path.join(__dirname, "programming-task-example-data.log");
analyzeLogFile(logFilePath)
  .then((result) => {
    console.log(`Number of unique IP addresses: ${result.numberOfUniqueIPs}`);
    console.log(`Top 3 most active IP addresses: ${result.top3IPs.join(", ")}`);
    console.log(`Top 3 most visited URLs: ${result.top3Domains.join("/, ")}/`);
  })
  .catch((err) => console.error(err));

module.exports = {
  countUniqueIPs,
  findTopEntries,
  analyzeLogFile,
};
