import 'reflect-metadata';
import '@controllers';
import { getAllEndPoints, IMethodType, type IEndPoint } from '@decorators';
import { ENV, getHeaders, IStatus, IValidMode } from '@ServerTypes';
import dotenv from 'dotenv';
import { CustomError, LoggerUtil, decodeCustomError, matchDynamicRoute } from '@utils';
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
    const url = new URL(req.url) as URL;

    // First, prioritize static routes over dynamic routes
    const staticEnd = ends.find((end) => url.pathname === end.route && req.method === end.method);
    if (staticEnd) {
      return await handleRequest(staticEnd, req, url, startDate);
    }

    // If no static route matches, then check for dynamic routes
    for await (let end of ends) {
      const params = matchDynamicRoute(url.pathname, end.route);
      if (params && req.method === end.method) {
        return await handleRequest(end, req, url, startDate, params);
      }
    }

    // If no route matches, return 404
    return new Response(
      JSON.stringify({
        data: null,
        status: IStatus.serverError,
        statusCode: 404,
        message: 'Route not found'
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

// Helper function to process the request
async function handleRequest(
  end: IEndPoint,
  req: IRequest,
  url: URL,
  startDate: number,
  params?: { [key: string]: string }
) {
  try {
    // extract data for GET or POST requests
    let inputData = {} as { [key: string]: any };
    if (end.method === 'POST') {
      inputData = (await req.json()) as Object;
    } else if (end.method === 'GET') {
      url.searchParams.forEach((value, key) => {
        inputData[key] = value;
      });
      // Merge dynamic route params (if they exist)
      inputData = { ...inputData, ...params };
    }

    req.bodyData = inputData;

    // Schema validation
    const validateSchema: JSONSchemaType<any> = end.validate || {};
    const validate = ajv.compile(validateSchema);
    const isValid = validate(inputData);
    if (!isValid && validate.errors) {
      const errors = validate.errors.map((e) => e.message!);
      throw CustomError(errors.join(', '));
    }

    // Execute middlewares if any
    for await (let middleware of end.customMiddleware || []) {
      await middleware(req);
    }

    // Call the handler and return the response
    const response = (await end.handler(req)) as IResponseData<any>;

    return new Response(JSON.stringify(response), {
      status: response.statusCode ?? 200,
      headers: applicationHeaders
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        data: null,
        status: IStatus.serverError,
        statusCode: 500,
        message: error instanceof Error ? error.message : 'Server error',
        timeToResponse: `~ ${Date.now() - startDate}ms`
      }),
      {
        headers: applicationHeaders,
        status: 500
      }
    );
  }
}

logger.info(`Server Running On Port ${ENV.port}\ \ Mode: ${ENV.mode}`);
