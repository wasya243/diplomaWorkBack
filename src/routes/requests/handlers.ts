import express from 'express';
import createHttpError = require('http-errors');

import { DatabaseManager } from '../../db/database-manager';
import { Classroom, Request, User } from '../../db/models';

export const createRequest = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const requestInfo = req.body;
    // @ts-ignore
    const dispatcherId = req.userData.id;

    try {
        const connection = DatabaseManager.getConnection();
        const requestRepository = connection.getRepository(Request);
        const classroomRepository = connection.getRepository(Classroom);
        const userRepository = connection.getRepository(User);

        const classroom = await classroomRepository.findOne(requestInfo.classroomId);
        const dispatcher = await userRepository.findOne(dispatcherId, { relations: [ 'requests' ] });

        if (!classroom) {
            return next(createHttpError(404, `Classroom with provided id ${requestInfo.classroomId} does not exist`));
        }

        const request = new Request();

        request.classroom = classroom;
        // @ts-ignore
        // there always will be a dispatcher be given id otherwise auth stage will fail
        request.dispatcher = dispatcher;
        request.end = requestInfo.end;
        request.start = requestInfo.start;

        const savedRequest = await requestRepository.save(request);

        res.send(savedRequest);
    } catch (error) {
        next(error);
    }
};
