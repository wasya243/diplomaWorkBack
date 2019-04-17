import * as express from 'express';
import moment from 'moment';

import { DatabaseManager } from '../../db/database-manager';
import { Term, Week } from '../../db/models';

export async function getWeeksByTerm(req: express.Request, res: express.Response, next: express.NextFunction) {
    const termId = req.params.id;
    try {
        const connection = DatabaseManager.getConnection();

        const weekRepository = connection.getRepository(Week);
        const termRepository = connection.getRepository(Term);

        const term = await termRepository.findOne(termId);
        if (!term) {
            return next();
        }

        const weeks = await weekRepository
            .createQueryBuilder('week')
            .where({ term })
            .orderBy('week.number')
            .getMany();

        res.send(weeks.map(week => Object.assign(week, {
            start: moment(week.start).format(),
            end: moment(week.end).format()
        })));
    } catch (error) {
        next(error);
    }
}

