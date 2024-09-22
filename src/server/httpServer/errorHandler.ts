import { IStatus, type IHeadersTypes } from '@ServerTypes';

export class ErrorHandler {
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
