import 'reflect-metadata';
import '@controllers';
import { getAllEndPoints, LoggerInitialized, type IEndPoint } from '@decorators';
import { ENV, getContentType, getHeaders, IStatus, IValidMode } from '@ServerTypes';
import dotenv from 'dotenv';
import { CustomError, LoggerUtil, matchDynamicRoute } from '@utils';
import type { IHeadersTypes, IRequest, IRequestInput, IRequestIP, IResponseData } from '@ServerTypes';
import Ajv, { type JSONSchemaType } from 'ajv';

import path from 'node:path';
import { MongoServiceConfig } from '@serverConfigs';
import type { Logger } from 'winston';
import { FileHandler } from './fileHandler';
import { RequestHandler } from './requestHandler';

dotenv.config();

class Server {
  @LoggerInitialized()
  private logger!: Logger;

  private headers = getHeaders();
  private ajv = new Ajv();
  private fileHandler = new FileHandler();
  private requestHandler = new RequestHandler(this.ajv, this.headers);
  public server: any;

  constructor() {
    this.start();

    process.on('SIGTERM', this.shutdown);
    process.on('SIGINT', this.shutdown);
  }

  async start() {
    this.server = Bun.serve({
      fetch: this.handleRequest.bind(this),
      development: ENV.mode === IValidMode.development,
      hostname: '0.0.0.0',
      port: ENV.port,
      reusePort: true
    });

    this.logger.info(`Server Running On Port ${ENV.port} \ Mode: ${ENV.mode}`);

    try {
      this.logger.info(`Database Connecting...`);
      await MongoServiceConfig.start();
      this.logger.info(`Database Connected`);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(`Error reading file: ${err.message}`);
      } else {
        this.logger.error(`Unknown error occurred: ${JSON.stringify(err)}`);
      }
      this.shutdown();
    }
  }

  // Handle shutdown signals
  shutdown() {
    console.log('Shutting down server...');
    process.exit(0);
  }

  private async handleRequest(req: IRequest) {
    const url = new URL(req.url) as URL;
    const startDate = Date.now();

    // Handle static file requests
    if (url.pathname.startsWith('/public')) {
      return await this.fileHandler.serveStaticFile(url.pathname);
    }

    // Handle API requests (both static and dynamic routes)
    const ip = this.server.requestIP(req) as IRequestIP;
    return await this.requestHandler.handleAPIRequest(req, url, startDate, ip);
  }
}

// Initialize server
new Server();
