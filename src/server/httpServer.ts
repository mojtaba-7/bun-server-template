import 'reflect-metadata';
import '@controllers';
import { getAllEndPoints, LoggerInitialized, type IEndPoint } from '@decorators';
import { ENV, getContentType, getHeaders, IStatus, IValidMode } from '@ServerTypes';
import dotenv from 'dotenv';
import { CustomError, LoggerUtil, matchDynamicRoute } from '@utils';
import type { IHeadersTypes, IRequest, IRequestInput, IResponseData } from '@ServerTypes';
import Ajv, { type JSONSchemaType } from 'ajv';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import mongodbConfig from './config/mongodbConfig';
import type { Logger } from 'winston';

dotenv.config();

class Server {
  @LoggerInitialized()
  private logger!: Logger;

  private headers = getHeaders();
  private ajv = new Ajv();
  private fileHandler = new FileHandler();
  private requestHandler = new RequestHandler(this.ajv, this.headers);

  constructor() {
    this.start();
  }

  async start() {
    Bun.serve({
      fetch: this.handleRequest.bind(this),
      development: ENV.mode === IValidMode.development,
      hostname: '0.0.0.0',
      port: ENV.port,
      reusePort: true
    });

    this.logger.info(`Server Running On Port ${ENV.port} \ Mode: ${ENV.mode}`);

    try {
      this.logger.info(`Database Connecting...`);
      await mongodbConfig.start();
      this.logger.info(`Database Connected`);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(`Error reading file: ${err.message}`);
      } else {
        this.logger.error(`Unknown error occurred: ${JSON.stringify(err)}`);
      }
      process.exit(1);
    }
  }

  private async handleRequest(req: IRequest) {
    const url = new URL(req.url) as URL;
    const startDate = Date.now();

    // Handle static file requests
    if (url.pathname.startsWith('/public')) {
      return await this.fileHandler.serveStaticFile(url.pathname);
    }

    // Handle API requests (both static and dynamic routes)
    return await this.requestHandler.handleAPIRequest(req, url, startDate);
  }
}

class FileHandler {
  private publicDir = path.join(__dirname, '../../', '/public');
  private headers = getHeaders();

  async serveStaticFile(pathname: string): Promise<Response> {
    try {
      const filePath = path.join(this.publicDir, pathname.replace('/public', ''));
      const fileData = await readFile(filePath);

      if (!fileData) {
        return this.fileNotFoundResponse();
      }

      return new Response(new Uint8Array(fileData), {
        headers: { 'Content-Type': getContentType(filePath) }
      });
    } catch (err) {
      LoggerUtil.getLogger().error(`Error reading file: ${err}`);
      return this.fileNotFoundResponse();
    }
  }

  private fileNotFoundResponse() {
    const notFoundData = JSON.stringify({
      data: null,
      status: IStatus.serverError,
      statusCode: 404,
      message: 'File not found'
    });

    return new Response(notFoundData, {
      headers: this.headers,
      status: 404
    });
  }
}

class RequestHandler {
  constructor(
    private ajv: Ajv,
    private headers: IHeadersTypes
  ) {}

  async handleAPIRequest(req: IRequest, url: URL, startDate: number): Promise<Response> {
    const endpoints = getAllEndPoints();

    // Static route handling
    const staticEnd = endpoints.find((end) => url.pathname === end.route && req.method === end.method);
    if (staticEnd) {
      return await this.processEndpoint(staticEnd, req, url, startDate);
    }

    // Dynamic route handling
    for (let end of endpoints) {
      const params = matchDynamicRoute(url.pathname, end.route);
      if (params && req.method === end.method) {
        return await this.processEndpoint(end, req, url, startDate, params);
      }
    }

    return this.notFoundResponse();
  }

  private async processEndpoint(
    end: IEndPoint,
    req: IRequest,
    url: URL,
    startDate: number,
    params?: { [key: string]: string }
  ): Promise<Response> {
    try {
      // first of all we authenticate then authorize the request
      if (end.authenticate) {
        // authenticate and save user date to req.user
      }
      if (end.authorize.length > 0) {
        // authorize request
      }

      let inputData: IRequestInput = {};
      if (end.method === 'POST') {
        inputData = (await req.json()) as IRequestInput;
      } else if (end.method === 'GET') {
        url.searchParams.forEach((value, key) => {
          inputData[key] = value;
        });
        inputData = { ...inputData, ...params };
      }

      req.bodyData = inputData;

      // Schema validation
      const validateSchema: JSONSchemaType<any> = end.validate || {};
      const validate = this.ajv.compile(validateSchema);
      const isValid = validate(inputData);
      if (!isValid) {
        const errors = validate.errors!.map((e) => e.message).join(', ');
        throw CustomError(errors);
      }

      // Middleware execution
      for (let middleware of end.customMiddleware || []) {
        await middleware(req);
      }

      const response = (await end.handler(req)) as IResponseData<any>;
      return new Response(JSON.stringify(response), {
        status: response.statusCode ?? 200,
        headers: this.headers
      });
    } catch (error) {
      return ErrorHandler.handleError(error, startDate, this.headers);
    }
  }

  private notFoundResponse(): Response {
    const notFoundData = JSON.stringify({
      data: null,
      status: IStatus.serverError,
      statusCode: 404,
      message: 'Route not found'
    });

    return new Response(notFoundData, {
      headers: this.headers,
      status: 404
    });
  }
}

class ErrorHandler {
  static handleError(error: any, startDate: number, headers: IHeadersTypes): Response {
    const errorMessage = error instanceof Error ? error.message : 'Server error';

    return new Response(
      JSON.stringify({
        data: null,
        status: IStatus.serverError,
        statusCode: 500,
        message: errorMessage,
        timeToResponse: `~ ${Date.now() - startDate}ms`
      }),
      {
        headers: headers,
        status: 500
      }
    );
  }
}

// Initialize server
new Server();
