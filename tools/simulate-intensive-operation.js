const crypto = require("crypto");

function simulateIntensiveOperation(iterations = 1000000) {
  for (let i = 0; i < iterations; i++) {
    crypto.createHash("sha256").update(`data${i}`).digest("hex");
  }
}

module.exports = simulateIntensiveOperation;
