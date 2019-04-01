import { STATUS_CODES } from 'http';
import * as express from 'express';

import { composeJoiValidationError } from '../helpers';

// TODO: add type for error object
export function errorHandlerMiddleware(error: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    const { status = 500, message, name } = error;

    console.error(error);

    let response = {
        status,
        message: STATUS_CODES[ status ] || 'Unknown error'
    };

    error.joiValidation && Object.assign(response, { data: composeJoiValidationError(error.data.details) });
    error.name === 'NotFoundError' && Object.assign(response, { data: message });

    res.status(response.status).send(response);
}
