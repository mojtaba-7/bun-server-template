import 'reflect-metadata';
import '@controllers';
import { getAllEndPoints } from '@decorators';
import { ENV, getHeaders, IStatus, IValidMode } from '@ServerTypes';
import dotenv from 'dotenv';
import { LoggerUtil, decodeCustomError } from '@utils';
import type { IResponse } from './Types/Response';

dotenv.config();

const applicationHeaders = getHeaders();

Bun.serve({
  async fetch(req: Request) {
    const startDate = Date.now();
    const ends = getAllEndPoints();

    for (let end of ends) {
      const url = new URL(req.url);

      if (url.pathname === end.route && req.method === end.method) {
        try {
          for (let middleware of end.customMiddleware) {
            await middleware(req);
          }

          const response = await end.handler(req);

          return new Response(JSON.stringify(response), {
            status: response.statusCode ?? 200
          });
        } catch (error) {
          let response: IResponse<null> = {
            data: null,
            documentCount: 0,
            timeToResponse: `~ ${Date.now() - startDate}ms`,
            status: IStatus.serverError,
            statusCode: 500
          };

          if (error instanceof Error) {
            const { status, statusCode, errorMessage } = decodeCustomError(error.message);
            response = {
              ...response,
              status,
              statusCode,
              message: errorMessage
            };
            return new Response(JSON.stringify(response), {
              status: statusCode
            });
          } else {
            return new Response(JSON.stringify(response), {
              status: 500
            });
          }
        }
      }
    }

    const response: IResponse<null> = {
      data: null,
      documentCount: 0,
      timeToResponse: `~ ${Date.now() - startDate}ms`,
      status: IStatus.serverError,
      statusCode: 500
    };

    return new Response(JSON.stringify(response), {
      headers: applicationHeaders,
      status: 500
    });
  },
  development: ENV.mode === IValidMode.development,
  hostname: '0.0.0.0',
  port: ENV.port,
  reusePort: true
});

// TODO: please select correct artitecture to use @LoggerInitialized instead
const logger = LoggerUtil.getLogger();
logger.info(`Server Running On Port ${ENV.port}\ \ Mode: ${ENV.mode}`);
