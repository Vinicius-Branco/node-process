const simulateIntensiveOperation = require("../tools/simulate-intensive-operation");

process.on("message", (message) => {
  simulateIntensiveOperation(message.index);
  process.send({ type: "completed" });
});
