import createHttpError = require('http-errors');
import * as express from 'express';

import { DatabaseManager } from '../../db/database-manager';
import { verifyPassword, encryptPassword, sign } from '../../auth';
import { User, Role, Faculty, Dispatcher } from '../../db/models';
import { simpleUniqueId } from '../../lib/helpers';

export async function signIn(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const { password, email } = req.body;
        const connection = DatabaseManager.getConnection();

        const userRepository = connection.getRepository(User);
        const dispatcherRepository = connection.getRepository(Dispatcher);

        let facultyId = null;
        const user = await userRepository.findOne({ email }, { relations: [ 'role' ] });
        if (!user || !await verifyPassword(password, user.password)) {
            return next({ status: 401 });
        }
        if (user && user.role.name === 'dispatcher' && !(user as Dispatcher).isPermitted) {
            return next(createHttpError(403, `Dispatcher with id ${user.id} has not been yet permitted to access resource`));
        }
        if (user.role.name === 'dispatcher') {
            const dispatcherInfo = await dispatcherRepository
                .createQueryBuilder('dispatcher')
                .where('dispatcher.email = :email')
                .setParameters({ email: email })
                .innerJoinAndSelect('dispatcher.faculty', 'faculty')
                .getOne();
            facultyId = dispatcherInfo && dispatcherInfo.faculty.id;
        }

        const userPayload = { id: user.id, sessionId: simpleUniqueId() };
        const accessToken = await sign(userPayload);
        user.sessionId = userPayload.sessionId;
        await userRepository.save(user);

        res.send({
            accessToken,
            userInfo: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                id: user.id,
                role: user.role.name,
                facultyId: facultyId ? facultyId : null
            }
        });
    } catch (error) {
        next(error);
    }
}

export async function signOut(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        // @ts-ignore
        const id = req.userData.id;
        const connection = DatabaseManager.getConnection();

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

    } catch (error) {
        next(error);
    }
}


export async function signUp(req: express.Request, res: express.Response, next: express.NextFunction) {
    const { firstName, lastName, password, roleId, facultyId, email } = req.body;
    try {
        const connection = DatabaseManager.getConnection();

        const userRepository = connection.getRepository(User);
        const roleRepository = connection.getRepository(Role);
        const facultiesRepository = connection.getRepository(Faculty);
        const dispatcherRepository = connection.getRepository(Dispatcher);

        const user = await userRepository.findOne({ email: email });
        const faculty = await facultiesRepository.findOne(facultyId);
        const role = await roleRepository.findOne(roleId);

        if (user) {
            return next(createHttpError(400, `User with ${user.email} already exists`));
        }

        if (!role) {
            return next(createHttpError(404, `Role with provided id ${roleId} does not exist`));
        }

        if (!faculty) {
            return next(createHttpError(404, `Faculty with provided id ${facultyId} does not exist`));
        }

        const dispatcher = new Dispatcher();

        dispatcher.password = await encryptPassword(password);
        dispatcher.email = email;
        dispatcher.firstName = firstName;
        dispatcher.lastName = lastName;
        dispatcher.role = role;
        dispatcher.faculty = faculty;

        await dispatcherRepository.save(dispatcher);

        res.send(dispatcher);
    } catch (error) {
        next(error);
    }
}
