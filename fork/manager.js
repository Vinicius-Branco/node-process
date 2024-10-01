const { fork } = require("child_process");
const path = require("path");

class ProcessQueue {
  constructor(numWorkers = 10) {
    this.queue = [];
    this.workers = [];
    this.availableWorkers = [];
    this.completedProcesses = 0;
    this.totalProcesses = 0;

    for (let i = 0; i < numWorkers; i++) {
      const worker = fork(path.join(__dirname, "child-process.js"));
      this.workers.push(worker);
      this.availableWorkers.push(worker);

      worker.on("message", (message) => {
        if (message.type === "completed") {
          this.availableWorkers.push(worker);
          this.completedProcesses++;
          this.processNext();
        }
      });

      worker.on("error", () => {
        this.availableWorkers.push(worker);
        this.completedProcesses++;
        this.processNext();
      });
    }
  }

  addProcess(process) {
    this.queue.push(process);
    this.totalProcesses++;
    this.processNext();
  }

  async processNext() {
    if (this.queue.length === 0 || this.availableWorkers.length === 0) {
      return;
    }

    const currentProcess = this.queue.shift();
    const worker = this.availableWorkers.pop();

    worker.send({ index: currentProcess });
  }

  waitForCompletion() {
    return new Promise((resolve) => {
      const checkCompletion = () => {
        if (this.completedProcesses === this.totalProcesses) {
          resolve();
        } else {
          setTimeout(checkCompletion, 100);
        }
      };
      checkCompletion();
    });
  }
}

async function addMultipleProcesses(queue, count) {
  for (let i = 1; i <= count; i++) {
    queue.addProcess(i);
  }
}

async function runProcesses(totalProcesses = 100) {
  const queue = new ProcessQueue();
  const startTime = Date.now();

  await addMultipleProcesses(queue, totalProcesses);
  await queue.waitForCompletion();

  const totalTime = Date.now() - startTime;

  return totalTime;
}

module.exports = { runProcesses };
