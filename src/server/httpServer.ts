import 'reflect-metadata';
import '@controllers';
import { getAllEndPoints } from '@decorators';
import { ENV, getHeaders, IValidMode } from '@ServerTypes';
import dotenv from 'dotenv';
import { LoggerUtil } from '@loggerUtils';

dotenv.config();

const applicationHeaders = getHeaders();

Bun.serve({
  async fetch(req: Request) {
    const ends = getAllEndPoints();

    for (let end of ends) {
      const url = new URL(req.url);

      if (url.pathname === end.route && req.method === end.method) {
        const response = await end.handler(req);
        for (let middleware of end.customMiddleware) {
          await middleware(req);
        }

        return new Response(JSON.stringify(response));
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

// TODO: please select correct artitecture to use @LoggerInitialized instead
const logger = LoggerUtil.getLogger();
logger.info(`Server Running On Port ${ENV.port}\ \ Mode: ${ENV.mode}`);
