import createHttpError = require('http-errors');
import * as express from 'express';

import { DatabaseManager } from '../../db/database-manager';
import { myRequest } from '../../types';
import { verifyPassword, encryptPassword, sign } from '../../auth';
import { User } from '../../db/models';
import { simpleUniqueId } from '../../lib/helpers';

export async function signIn(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const { password, email } = req.body;
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

            res.send({
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

export async function signOut(req: myRequest, res: express.Response, next: express.NextFunction) {
    try {
        const id = req.userData.id;
        const connection = DatabaseManager.getConnection();

        if (connection) {
            const userRepository = connection.getRepository(User);
            const user = await userRepository.findOne({ id: id });
            if (!user) {
                return next();
            }
            // TODO: how to set null so not to get ts error?
            // @ts-ignore
            user.sessionId = null;
            await userRepository.save(user);
            res.status(204).end();
        }

    } catch (error) {
        next(error);
    }
}


export async function signUp(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const userInfo = req.body;
        const connection = DatabaseManager.getConnection();

        if (connection) {
            const userRepository = connection.getRepository(User);
            const user = await userRepository.findOne({ email: userInfo.email });
            if (user) {
                return next(createHttpError(400, `User with ${user.email} already exists`));
            }

            userInfo.password = await encryptPassword(userInfo.password);
            const createdUser = await userRepository.save(userInfo);
            res.send(createdUser);
        }
    } catch (error) {
        next(error);
    }
}
