const { EventEmitter } = require("events");
const simulateIntensiveOperation = require("../tools/simulate-intensive-operation");

class EventsManagerQueue extends EventEmitter {
  constructor(numWorkers = 4) {
    super();
    this.queue = [];
    this.workers = new Array(numWorkers).fill(false);
    this.totalProcessingTime = 0;
    this.completedProcesses = 0;
    this.totalProcesses = 0;
  }

  addProcess(process) {
    this.queue.push(process);
    this.totalProcesses++;
    this.emit("processAdded");
    this.processNext();
  }

  processNext() {
    const availableWorker = this.workers.findIndex((w) => !w);
    if (availableWorker === -1 || this.queue.length === 0) {
      return;
    }

    this.workers[availableWorker] = true;
    const currentProcess = this.queue.shift();

    const startTime = Date.now();
    currentProcess()
      .then(() => {
        const endTime = Date.now();
        this.totalProcessingTime += endTime - startTime;
        this.completedProcesses++;
        this.workers[availableWorker] = false;
        this.emit("processCompleted");

        if (this.completedProcesses === this.totalProcesses) {
          this.emit("allProcessesCompleted");
        } else {
          this.processNext();
        }
      })
      .catch((error) => {
        this.emit("processError", error);
        this.workers[availableWorker] = false;
        this.processNext();
      });

    this.processNext();
  }
}

function createProcess() {
  return () => {
    simulateIntensiveOperation();
    return Promise.resolve();
  };
}

function addMultipleProcesses(queue, count) {
  for (let i = 1; i <= count; i++) {
    queue.addProcess(createProcess());
  }
}

async function runProcesses(totalProcesses = 100) {
  const queue = new EventsManagerQueue();

  const startTime = Date.now();

  addMultipleProcesses(queue, totalProcesses);

  return new Promise((resolve) => {
    queue.on("allProcessesCompleted", () => {
      const totalTime = Date.now() - startTime;
      resolve(totalTime);
    });
  });
}

module.exports = { runProcesses };
