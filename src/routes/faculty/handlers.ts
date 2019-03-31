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

export const deleteFaculty = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInt(req.params.id);

    try {
        const connection = DatabaseManager.getConnection();
        const facultyRepository = connection.getRepository(Faculty);
        const facultyToRemove = await facultyRepository.findOne(id);
        if (!facultyToRemove) {
            return next();
        }
        await facultyRepository.remove(facultyToRemove);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};
