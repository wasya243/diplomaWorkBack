import { STATUS_CODES } from 'http';
import * as express from 'express';

// TODO: add type for error object
export function errorHandlerMiddleware(error: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    const { status = 500, message, name } = error;

    const response = {
        status,
        message: STATUS_CODES[ status ] || 'Unknown error'
    };

    res.status(response.status).send(response);
}
