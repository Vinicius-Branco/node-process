const { EventEmitter } = require("events");
const { Worker, isMainThread, parentPort } = require("worker_threads");
const simulateIntensiveOperation = require("../tools/simulate-intensive-operation");

class WorkerManagerQueue extends EventEmitter {
  constructor(numWorkers = 10) {
    super();
    this.queue = [];
    this.workers = [];
    this.availableWorkers = [];
    this.isProcessing = false;
    this.totalProcessingTime = 0;
    this.completedProcesses = 0;

    for (let i = 0; i < numWorkers; i++) {
      const worker = new Worker(__filename, { workerData: { workerId: i } });
      this.workers.push(worker);
      this.availableWorkers.push(worker);

      worker.on("message", (message) => {
        if (message.type === "completed") {
          this.totalProcessingTime += message.processingTime;
          this.completedProcesses++;
          this.availableWorkers.push(worker);
          this.emit("processCompleted");
          this.processNext();
        }
      });

      worker.on("error", (error) => {
        this.emit("processError", error);
        this.availableWorkers.push(worker);
        this.processNext();
      });
    }
  }

  addProcess(process) {
    this.queue.push(process);
    this.emit("processAdded");
    this.processNext();
  }

  processNext() {
    if (this.queue.length === 0 || this.availableWorkers.length === 0) {
      return;
    }

    const worker = this.availableWorkers.pop();
    const currentProcess = this.queue.shift();
    worker.postMessage({ type: "process", data: currentProcess });
  }
}

function addMultipleProcesses(queue, count) {
  for (let i = 1; i <= count; i++) {
    queue.addProcess(i);
  }
}

async function runProcesses(totalProcesses = 100) {
  const queue = new WorkerManagerQueue();

  const startTime = Date.now();

  addMultipleProcesses(queue, totalProcesses);

  return new Promise((resolve) => {
    const checkCompletion = setInterval(() => {
      if (queue.completedProcesses === totalProcesses) {
        clearInterval(checkCompletion);
        const totalTime = Date.now() - startTime;
        resolve(totalTime);
      }
    }, 100);
  });
}

if (isMainThread) {
  module.exports = { runProcesses };
} else {
  parentPort.on("message", (message) => {
    if (message.type === "process") {
      const startTime = Date.now();
      simulateIntensiveOperation(message.data);
      const endTime = Date.now();
      const processingTime = endTime - startTime;
      parentPort.postMessage({ type: "completed", processingTime });
    }
  });
}
