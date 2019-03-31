import express from 'express';

import { DatabaseManager } from '../../db/database-manager';
import { Faculty } from '../../db/models';

export const getFaculties = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const connection = DatabaseManager.getConnection();
        const facultyRepository = connection.getRepository(Faculty);
        const allFaculties = await facultyRepository.find();
        res.send(allFaculties);
    } catch (error) {
        next(error);
    }
};
