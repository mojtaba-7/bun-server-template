import { getAllEndPoints } from '@decorators';
import { ENV, getHeaders, IValidMode } from '@ServerTypes';
import dotenv from 'dotenv';
dotenv.config();

const applicationHeaders = getHeaders();

Bun.serve({
  async fetch(req: Request) {
    const ends = getAllEndPoints();

    for (let end of ends) {
      const url = new URL(req.url);

      if (url.pathname === end.route && req.method === end.method) {
        const response = await end.handler(req);

        return new Response(response);
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Request not found' // TODO: hanlde error messages
      }),
      {
        headers: applicationHeaders,
        status: 404
      }
    );
  },
  development: ENV.mode === IValidMode.development,
  hostname: '0.0.0.0',
  port: ENV.port,
  reusePort: true
});

// TODO: write strong console logger to the project
console.log(`Server Running On Port ${ENV.port}\nMode: ${ENV.mode}`);
