import * as express from 'express';

import { DatabaseManager } from '../../db/database-manager';
import { Permission } from '../../db/models';

export async function getPermissions(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const connection = DatabaseManager.getConnection();
        const permissionRepository = connection.getRepository(Permission);
        const allPermissions = await permissionRepository.find({ relations: [ 'action', 'role', 'resource' ] });
        res.send(allPermissions);
    } catch (error) {
        next(error);
    }
}
