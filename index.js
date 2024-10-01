const { runProcesses: runForkProcesses } = require("./fork/manager");
const { runProcesses: runWorkerProcesses } = require("./worker/manager");
const { runProcesses: runEventsProcesses } = require("./events/manager");

async function executeAllProcesses(totalProcesses = 10) {
  console.log("Starting process execution...");

  console.log("\nExecuting processes with Fork:");
  const forkTime = await runForkProcesses(totalProcesses);

  console.log("\nExecuting processes with Worker Threads:");
  const workerTime = await runWorkerProcesses(totalProcesses);

  console.log("\nExecuting processes with Events:");
  const eventsTime = await runEventsProcesses(totalProcesses);

  console.log("\nFinal results:");
  console.log(`Fork: ${forkTime} ms`);
  console.log(`Worker Threads: ${workerTime} ms`);
  console.log(`Events: ${eventsTime} ms`);

  const fastest = Math.min(forkTime, workerTime, eventsTime);
  let fastestMethod;

  if (fastest === forkTime) fastestMethod = "Fork";
  else if (fastest === workerTime) fastestMethod = "Worker Threads";
  else fastestMethod = "Events";

  console.log(`\nThe fastest method was: ${fastestMethod}`);
}

executeAllProcesses().catch(console.error);
