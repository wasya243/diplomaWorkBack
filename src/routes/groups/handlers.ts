import * as express from 'express';

import { DatabaseManager } from '../../db/database-manager';
import { Group } from '../../db/models';

export async function getGroups(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const connection = DatabaseManager.getConnection();
        const groupRepository = connection.getRepository(Group);
        const allGroups = await groupRepository.find({});
        res.send(allGroups);
    } catch (error) {
        next(error);
    }
}

