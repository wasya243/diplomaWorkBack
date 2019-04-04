import express from 'express';

import { DatabaseManager } from '../../db/database-manager';
import { Faculty } from '../../db/models';

export const getFaculties = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const connection = DatabaseManager.getConnection();
        const facultyRepository = connection.getRepository(Faculty);
        // TODO: find a neat way to do this
        const allFaculties = await facultyRepository.find({ relations: [ 'classrooms' ] });
        res.send(allFaculties.map(faculty => Object.assign(faculty, { classrooms: faculty.classrooms.length })));
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


export const updateFaculty = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInt(req.params.id);
    const facultyInfo = req.body;

    try {
        const connection = DatabaseManager.getConnection();
        const facultyRepository = connection.getRepository(Faculty);
        const facultyToUpdate = await facultyRepository.findOne(id);
        if (!facultyToUpdate) {
            return next();
        }

        Object.assign(facultyToUpdate, facultyInfo);
        await facultyRepository.save(facultyToUpdate);

        res.send(facultyToUpdate);
    } catch (error) {
        next(error);
    }
};

export const createFaculty = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const facultyInfo = req.body;

    try {
        const connection = DatabaseManager.getConnection();
        const facultyRepository = connection.getRepository(Faculty);

        const faculty = new Faculty();
        Object.assign(faculty, facultyInfo);
        const savedFaculty = await facultyRepository.save(faculty);

        res.send(savedFaculty);
    } catch (error) {
        next(error);
    }
};
