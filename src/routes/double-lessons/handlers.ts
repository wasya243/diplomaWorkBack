import * as express from 'express';

import { DatabaseManager } from '../../db/database-manager';
import { DoubleLesson } from '../../db/models';

export async function getDoubleLessons(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const connection = DatabaseManager.getConnection();
        const doubleLessonRepository = connection.getRepository(DoubleLesson);
        const allDoubleLessons = await doubleLessonRepository.find({});
        res.send(allDoubleLessons);
    } catch (error) {
        next(error);
    }
}
