import * as Joi from 'joi';
import * as express from 'express';

export function validate(schema: any, options = { abortEarly: false }) {
    return function validationMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (!schema) {
            return next({ status: 500, message: 'Validation schema is not provided' });
        }

        const dataToValidate = [ 'params', 'body', 'query', 'files' ].reduce((result, key) => {
            // @ts-ignore
            // why does not typescript understand req['body'], req['params']?
            return schema[ key ] ? Object.assign(result, { [ key ]: req[ key ] }) : result;
        }, {});

        return Joi.validate(dataToValidate, schema, Object.assign({ convert: false }, options), (err: Error) => {
            if (err) {
                return next({ data: err, joiValidation: true, status: 400 });
            }

            return next();
        });
    };
}
