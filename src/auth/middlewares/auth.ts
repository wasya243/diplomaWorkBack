import * as express from 'express';

import * as token from '../token';
import { User } from '../../db/models';
import { DatabaseManager } from '../../db/database-manager';

// TODO: fix type error on myRequest
// @ts-ignore

export async function authMiddleware(request: express.Request, response: express.Response, next: express.NextFunction) {
    const authHeader = request.header('Authorization');
    if (!authHeader) {
        return next({ status: 401 });
    }

    const [ , accessToken = '' ] = /Bearer (.+)/.exec(authHeader) || [];

    try {
        const connection = DatabaseManager.getConnection();
        // decode token & fetch user id from it
        const encoded = await token.verify(accessToken);
        // get user repo & find user by id
        const userRepository = connection.getRepository(User);
        const user = await userRepository.findOne(parseInt(encoded.id), { relations: [ 'role' ] });
        // if there is no such user || session id is not the same => throw 401 error
        if (user && user.sessionId !== encoded.sessionId) {
            return next({ status: 401, message: 'Session id is not the same' });
        }
        if (!user) {
            return next({ status: 401 });
        }
        // add user id on the request object to be reused later in handlers
        // @ts-ignore
        request.userData = { id: user.id, role: user.role.name };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next({ ...error, status: 401 });
        }
        next(error);
    }

}
