import * as express from 'express';

import { DatabaseManager } from '../../db/database-manager';
import { A } from '../../db/models';

export async function getA(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const connection = DatabaseManager.getConnection();
        const aRepository = connection.getRepository(A);
        const allA = await aRepository.find();
        res.send(allA);
    } catch (error) {
        next(error);
    }
}
