import createHttpError = require('http-errors');
import * as express from 'express';

import { DatabaseManager } from '../../db/database-manager';
import { myRequest } from '../../types';
import { verifyPassword, encryptPassword, sign } from '../../auth';
import { User } from '../../db/models/User';
import { simpleUniqueId } from '../../lib/helpers';

export async function signIn(request: express.Request, response: express.Response, next: express.NextFunction) {
    try {
        const { password, email } = request.body;
        const connection = DatabaseManager.getConnection();

        if (connection) {
            const userRepository = connection.getRepository(User);
            const user = await userRepository.findOne({ email });
            if (!user || !await verifyPassword(password, user.password)) {
                return next({ status: 401 });
            }

            const userPayload = { id: user.id, sessionId: simpleUniqueId() };
            const accessToken = await sign(userPayload);
            user.sessionId = userPayload.sessionId;
            await userRepository.save(user);

            response.send({
                accessToken,
                userInfo: {
                    email: user.email,
                    name: user.name,
                    id: user.id
                }
            });
        }
    } catch (error) {
        next(error);
    }
}

export async function signOut(request: myRequest, response: express.Response, next: express.NextFunction) {
    try {
        const id = request.userData.id;
        const connection = DatabaseManager.getConnection();

        if (connection) {
            const userRepository = connection.getRepository(User);
            const user = await userRepository.findOne({ id: id });
            if (!user) {
                // TODO: start using next() instead
                return response.status(404).end();
            }
            // TODO: how to set null so not to get ts error?
            // @ts-ignore
            user.sessionId = null;
            await userRepository.save(user);
            response.status(204).end();
        }

    } catch (error) {
        next(error);
    }
}


export async function signUp(request: express.Request, response: express.Response, next: express.NextFunction) {
    try {
        const userInfo = request.body;
        const connection = DatabaseManager.getConnection();

        if (connection) {
            const userRepository = connection.getRepository(User);
            const user = await userRepository.findOne({ email: userInfo.email });
            if (user) {
                return next(createHttpError(400, `User with ${user.email} already exists`));
            }

            userInfo.password = await encryptPassword(userInfo.password);
            const createdUser = await userRepository.save(userInfo);
            response.send(createdUser);
        }
    } catch (error) {
        next(error);
    }
}
