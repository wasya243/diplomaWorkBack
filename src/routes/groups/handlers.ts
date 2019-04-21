import * as express from 'express';

import { DatabaseManager } from '../../db/database-manager';
import { Group, User, Dispatcher } from '../../db/models';

export async function getGroups(req: express.Request, res: express.Response, next: express.NextFunction) {
    // @ts-ignore
    const userId = req.userData.id;
    try {
        const connection = DatabaseManager.getConnection();

        const groupRepository = connection.getRepository(Group);
        const userRepository = connection.getRepository(User);
        const dispatcherRepository = connection.getRepository(Dispatcher);

        const user = await userRepository.findOne(userId, { relations: [ 'role' ] });

        let groups = [];

        if (user && user.role.name === 'dispatcher') {
            const dispatcher = await dispatcherRepository.findOne(userId, { relations: [ 'faculty' ] });
            groups = await groupRepository.find({ faculty: dispatcher && dispatcher.faculty });

        } else {
            groups = await groupRepository.find({});
        }

        res.send(groups);
    } catch (error) {
        next(error);
    }
}

