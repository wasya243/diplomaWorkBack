import express from 'express';
import createHttpError = require('http-errors');

import { DatabaseManager } from '../../db/database-manager';
import { Classroom, Faculty } from '../../db/models';

export const getClassrooms = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const connection = DatabaseManager.getConnection();
        const classroomRepository = connection.getRepository(Classroom);

        const classrooms = await classroomRepository.find({ relations: [ 'faculty' ] });
        res.send(classrooms.map(classroom => Object.assign({}, {
            id: classroom.id,
            number: classroom.number,
            amountOfSeats: classroom.amountOfSeats,
            faculty: classroom.faculty.name
        })));
    } catch (error) {
        next(error);
    }
};

export const createClassroom = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const classroomInfo = req.body;

    try {
        const connection = DatabaseManager.getConnection();
        const classroomRepository = connection.getRepository(Classroom);
        const facultyRepository = connection.getRepository(Faculty);

        const faculty = await facultyRepository.findOne(classroomInfo.facultyId);
        if (!faculty) {
            return next(createHttpError(404, `Faculty with provided id ${classroomInfo.facultyId} does not exist`));
        }

        const classroom = new Classroom();
        classroom.number = classroomInfo.number;
        classroom.amountOfSeats = classroomInfo.amountOfSeats;
        classroom.faculty = faculty;

        const savedClassroom = await classroomRepository.save(classroom);

        res.send(savedClassroom);
    } catch (error) {
        next(error);
    }
};

export const updateClassroom = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInt(req.params.id);
    const classroomInfo = req.body;

    try {
        const connection = DatabaseManager.getConnection();
        const classroomRepository = connection.getRepository(Classroom);
        const facultyRepository = connection.getRepository(Faculty);

        const classroomToUpdate = await classroomRepository.findOne(id);
        if (!classroomToUpdate) {
            return next();
        }

        const faculty = await facultyRepository.findOne(classroomInfo.facultyId);
        if (!faculty) {
            return next(createHttpError(404, `Faculty with provided id ${classroomInfo.facultyId} does not exist`));
        }

        classroomToUpdate.faculty = faculty;
        classroomToUpdate.amountOfSeats = classroomInfo.amountOfSeats;
        classroomToUpdate.number = classroomInfo.number;

        await classroomRepository.save(classroomToUpdate);

        res.send(Object.assign({}, {
            id: classroomToUpdate.id,
            number: classroomToUpdate.number,
            amountIOfSeats: classroomToUpdate.amountOfSeats,
            faculty: classroomToUpdate.faculty.name
        }));
    } catch (error) {
        next(error);
    }
};


export const deleteClassroom = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInt(req.params.id);

    try {
        const connection = DatabaseManager.getConnection();
        const classroomRepository = connection.getRepository(Classroom);
        const classroomToRemove = await classroomRepository.findOne(id);
        if (!classroomToRemove) {
            return next();
        }
        await classroomRepository.remove(classroomToRemove);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};
