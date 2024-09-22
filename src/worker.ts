import os from 'node:os';

const numCPUs = os.cpus().length;

for (let i = 0; i < numCPUs; i++) {
  const workerURL = new URL('./server/httpServer/index.ts', import.meta.url).href;
  new Worker(workerURL);
}
