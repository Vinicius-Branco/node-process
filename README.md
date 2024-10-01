# Node.js Process Execution Comparison

## Project Objective

This project aims to compare the performance of different methods for executing multiple processes in Node.js. It implements and benchmarks three approaches:

1. Child Process (Fork)
2. Worker Threads
3. Event-driven

By running the same intensive operations using these three methods, we can analyze and compare their execution times to determine which approach is most efficient for specific scenarios.

## Process Implementations

### 1. Child Process (Fork)

**How it works:**

- Uses Node.js `child_process.fork()` to create separate Node.js processes.
- Each child process runs in its own memory space and has its own V8 instance.
- Communication between parent and child processes is done via IPC (Inter-Process Communication).

**Best suited for:**

- CPU-intensive tasks that require isolation.
- When you need to run scripts in different Node.js environments.
- When memory isolation between processes is crucial.

### 2. Worker Threads

**How it works:**

- Uses Node.js `worker_threads` module to create threads within the same process.
- Threads share the same memory space but run JavaScript in parallel.
- Communication between threads is done via message passing or shared memory.

**Best suited for:**

- CPU-intensive tasks that can benefit from parallelism.
- When you need to share memory between threads (using SharedArrayBuffer).
- For better performance in multi-core systems without the overhead of creating separate processes.

### 3. Event-driven (Events Emitter)

**How it works:**

- Uses Node.js `events` module to create an event-based system.
- Processes are managed within a single thread using asynchronous operations.
- Relies on Node.js event loop to handle multiple operations concurrently.

**Best suited for:**

- I/O-bound tasks where operations spend most time waiting for external resources.
- When you need to handle a large number of concurrent operations efficiently.
- For scenarios where the simplicity of a single-threaded model is preferred.

## File Structure and Purpose

- `src/index.js`: The main entry point of the application. It orchestrates the execution of all three methods and displays the results.

- `src/fork/manager.js`: Implements the Child Process (Fork) approach using Node.js `child_process` module.

- `src/fork/child-process.js`: The script executed by each forked child process.

- `src/worker/manager.js`: Implements the Worker Threads approach using Node.js `worker_threads` module.

- `src/events/manager.js`: Implements the Event-driven approach using Node.js `events` module.

- `src/tools/simulate-intensive-operation.js`: Contains a function that simulates an intensive operation (cryptographic hashing) used by all three methods.

## How to Run the Project

1. Ensure you have Node.js installed on your system (version 12 or higher recommended).

2. Clone this repository to your local machine.

3. Navigate to the project directory in your terminal.

4. Install the dependencies (if any) by running:

   ```
   npm install
   ```

5. Run the project using the following command:

   ```
   npm start
   ```

6. The program will execute the intensive operations using all three methods and display the results, including the execution time for each method and the fastest method overall.

## Customization

You can adjust the number of processes to run by modifying the `totalProcesses` parameter in the `executeAllProcesses` function call in `src/index.js`.

## Note

The performance results may vary depending on your system's specifications and current load. It's recommended to run the test multiple times to get a more accurate comparison.

Different approaches may perform better in different scenarios. The Child Process method is good for isolated, CPU-intensive tasks. Worker Threads are efficient for parallel processing within the same process. The Event-driven approach excels in handling many concurrent, I/O-bound operations.
