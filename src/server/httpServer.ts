import 'reflect-metadata';
import '@controllers';
import { getAllEndPoints, IMethodType } from '@decorators';
import { ENV, getHeaders, IStatus, IValidMode } from '@ServerTypes';
import dotenv from 'dotenv';
import { CustomError, LoggerUtil, decodeCustomError } from '@utils';
import type { IResponse, IRequest, IResponseData } from '@ServerTypes';
import Ajv, { type JSONSchemaType } from 'ajv';

dotenv.config();

// TODO: please select correct artitecture to use @LoggerInitialized instead
const logger = LoggerUtil.getLogger();
const applicationHeaders = getHeaders();
const ajv = new Ajv();

Bun.serve({
  async fetch(req: IRequest) {
    const startDate = Date.now();
    const ends = getAllEndPoints();

    for await (let end of ends) {
      const url = new URL(req.url);

      if (url.pathname === end.route && req.method === end.method) {
        try {
          // extract data
          let inputData = {} as { [key: string]: any };
          if (end.method === IMethodType.post) {
            inputData = (await req.json()) as Object;
          } else if (end.method === IMethodType.get) {
            url.searchParams.forEach((value, key) => {
              inputData[key] = value;
            });
          }
          req.bodyData = inputData;

          // validator
          const validateSchema: JSONSchemaType<any> = end.validate || {};
          const validate = ajv.compile(validateSchema);
          const isValid = validate(inputData);
          if (!isValid && validate.errors) {
            // TODO: fix error message to correct format with multi language support
            const errors = validate.errors.map((e) => e.message!);
            const errorString = errors.join(', ');
            throw CustomError(errorString);
          }

          for await (let middleware of end.customMiddleware) {
            await middleware(req);
          }

          const response = (await end.handler(req)) as IResponseData<any>;

          return new Response(JSON.stringify(response), {
            status: response.statusCode ?? 200,
            headers: applicationHeaders
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
              headers: applicationHeaders,
              status: statusCode
            });
          } else {
            return new Response(JSON.stringify(response), {
              headers: applicationHeaders,
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

logger.info(`Server Running On Port ${ENV.port}\ \ Mode: ${ENV.mode}`);
