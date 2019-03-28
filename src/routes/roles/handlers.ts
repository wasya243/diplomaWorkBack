import * as express from 'express';

import { DatabaseManager } from '../../db/database-manager';
import { Role } from '../../db/models';

export async function getRoles(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const connection = DatabaseManager.getConnection();
        const roleRepository = connection && connection.getRepository(Role);
        const allRoles = await roleRepository.find();
        res.send(allRoles);
    } catch (error) {
        next(error);
    }
}
