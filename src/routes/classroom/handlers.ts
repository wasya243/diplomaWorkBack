import express from 'express';
import createHttpError = require('http-errors');

import { DatabaseManager } from '../../db/database-manager';
import { Assignment, Classroom, DoubleLesson, Faculty } from '../../db/models';

export const getClassrooms = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const connection = DatabaseManager.getConnection();
        const classroomRepository = connection.getRepository(Classroom);

        const classrooms = await classroomRepository.find({ relations: [ 'faculty' ] });
        res.send(classrooms.map(classroom => Object.assign({}, {
            id: classroom.id,
            number: classroom.number,
            amountOfSeats: classroom.amountOfSeats,
            faculty: {
                name: classroom.faculty.name,
                id: classroom.faculty.id
            }
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

        res.send(Object.assign(savedClassroom, { faculty: { name: savedClassroom.faculty.name, id: savedClassroom.faculty.id } }));
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
            faculty: {
                name: classroomToUpdate.faculty.name,
                id: classroomToUpdate.faculty.id
            }
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

export const getFreeClassrooms = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { assignmentDate, facultyId, doubleLessonId } = req.query;
    // @ts-ignore
    try {
        const connection = DatabaseManager.getConnection();

        const classroomRepository = connection.getRepository(Classroom);
        const assignmentsRepository = connection.getRepository(Assignment);
        const facultyRepository = connection.getRepository(Faculty);
        const doubleLessonRepository = connection.getRepository(DoubleLesson);

        const faculty = await facultyRepository.findOne(facultyId);
        const doubleLesson = await doubleLessonRepository.findOne(doubleLessonId);

        if (!faculty) {
            return next(createHttpError(404, `Faculty with provided id ${facultyId} is not found`));
        }

        if (!doubleLesson) {
            return next(createHttpError(404, `Double lesson with provided id ${doubleLessonId} is not found`));
        }

        const assignments = await assignmentsRepository
            .createQueryBuilder('assignment')
            .innerJoinAndSelect('assignment.classroom', 'classroom')
            .innerJoinAndSelect('classroom.faculty', 'faculty')
            .where('faculty.id = :facultyId')
            .andWhere('assignment."assignmentDate" = :assignmentDate')
            .andWhere('assignment."doubleLessonId" = :doubleLessonId')
            .setParameters({ facultyId, assignmentDate, doubleLessonId })
            .getMany();

        const usedClassroomsIds = assignments.map(assignment => assignment.classroom.id);

        const freeClassrooms = await classroomRepository
            .createQueryBuilder('classroom')
            .innerJoinAndSelect('classroom.faculty', 'faculty')
            .where('classroom.id NOT IN (:...usedClassroomsIds)', { usedClassroomsIds })
            .andWhere('faculty.id = :facultyId', { facultyId })
            .getMany();

        res.send(freeClassrooms.map(classroom => Object.assign(classroom, {
            faculty: {
                id: classroom.faculty.id,
                name: classroom.faculty.name
            }
        })));
    } catch (error) {
        next(error);
    }
};
