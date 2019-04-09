import express from 'express';
import createHttpError = require('http-errors');

import { DatabaseManager } from '../../db/database-manager';
import { Classroom, Request, Faculty, Dispatcher } from '../../db/models';

export const createRequest = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const requestInfo = req.body;
    // @ts-ignore
    const dispatcherId = req.userData.id;

    try {
        const connection = DatabaseManager.getConnection();

        const dispatcherRepository = connection.getRepository(Dispatcher);
        const requestRepository = connection.getRepository(Request);
        const classroomRepository = connection.getRepository(Classroom);
        const facultyRepository = connection.getRepository(Faculty);

        const dispatcher = await dispatcherRepository.findOne(dispatcherId, { relations: [ 'faculty' ] });
        const classroom = await classroomRepository.findOne(requestInfo.classroomId, { relations: [ 'faculty' ] });
        const faculty = dispatcher && await facultyRepository.findOne(dispatcher.faculty.id);

        if (!classroom) {
            return next(createHttpError(404, `Classroom with provided id ${requestInfo.classroomId} does not exist`));
        }

        if ((dispatcher && classroom) && dispatcher.faculty.id === classroom.faculty.id) {
            return next(createHttpError(404, `Cannot create request for your own classroom. Dispatcher with id ${dispatcher.id}, classroom with id ${classroom.id}`));
        }

        const request = new Request();

        request.classroom = classroom;
        // @ts-ignore
        request.faculty = faculty;
        request.end = requestInfo.end;
        request.start = requestInfo.start;

        const savedRequest = await requestRepository.save(request);

        res.send(savedRequest);
    } catch (error) {
        next(error);
    }
};

export const reviewRequest = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const reviewInfo = req.body;
    const requestId = req.params.id;

    try {
        const connection = DatabaseManager.getConnection();
        const requestRepository = connection.getRepository(Request);

        const requestToReview = await requestRepository.findOne(requestId);

        if (!requestToReview) {
            return next();
        }

        requestToReview.isApproved = reviewInfo.isApproved;

        await requestRepository.save(requestToReview);

        res.send(requestToReview);
    } catch (error) {
        next(error);
    }
};

export const getRequests = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // @ts-ignore
    const userId = req.userData.id;
    try {
        const connection = DatabaseManager.getConnection();

        const dispatcherRepository = connection.getRepository(Dispatcher);
        const requestRepository = connection.getRepository(Request);

        const dispatcher = await dispatcherRepository.findOne(userId, { relations: [ 'faculty' ] });

        const requests = dispatcher && await requestRepository
            .createQueryBuilder('request')
            .innerJoinAndSelect('request.faculty', 'originFaculty')
            .innerJoinAndSelect('request.classroom', 'classroom')
            .innerJoinAndSelect('classroom.faculty', 'sourceFaculty')
            .where('sourceFaculty.id = :facultyId')
            .setParameters({ facultyId: dispatcher.faculty.id })
            .getMany() || [];

        res.send(requests.map(request => Object.assign(request, {
            faculty: request.faculty.name,
            classroom: request.classroom.number
        })));
    } catch (error) {
        next(error);
    }
};

