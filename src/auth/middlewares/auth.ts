import * as express from 'express';

import * as token from '../token';
import { User } from '../../db/models/User';
import { DatabaseManager } from '../../db/database-manager';
import { myRequest } from '../../types';

export async function authMiddleware(request: myRequest, response: express.Response, next: express.NextFunction) {
    const authHeader = request.header('Authorization');
    if (!authHeader) {
        return next({ status: 401 });
    }

    const [ , accessToken = '' ] = /Bearer (.+)/.exec(authHeader) || [];
    // TODO: what todo if there is no connection?
    const connection = DatabaseManager.getConnection();
    if (connection) {
        try {
            // decode token & fetch user id from it
            const encoded = await token.verify(accessToken);
            // get user repo & find user by id
            const userRepository = connection.getRepository(User);
            const user = await userRepository.findOne({ id: parseInt(encoded.id) });
            // if there is no such user || session id is not the same => throw 401 error
            if (user && user.sessionId !== encoded.sessionId) {
                return next({ status: 401, message: 'Session id is not the same' });
            }
            if (!user) {
                return next({ status: 401 });
            }
            // add user id on the request object to be reused later in handlers
            request.userData = { id: user.id };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return next({ ...error, status: 401 });
            }
            next(error);
        }
    }

}
