import express from 'express';
import createHttpError = require('http-errors');

import { DatabaseManager } from '../../db/database-manager';
import { Dispatcher } from '../../db/models';
import { sendPermitRegistrationRequest } from '../../../nodemailer.config';

export const getRegistrationRequests = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const connection = DatabaseManager.getConnection();
        const dispatcherRepository = connection.getRepository(Dispatcher);
        // All user entries with permitted = false => are counted as registration requests
        const allRegistrationRequests = await dispatcherRepository.find({
            where: [ { isPermitted: false } ],
            select: [ 'id', 'firstName', 'lastName', 'email' ],
            relations: [ 'faculty' ]
        });
        res.send(allRegistrationRequests.map(registrationRequest => Object.assign({}, {
            id: registrationRequest.id,
            firstName: registrationRequest.firstName,
            lastName: registrationRequest.lastName,
            email: registrationRequest.email,
            faculty: registrationRequest.faculty.name
        })));
    } catch (error) {
        next(error);
    }
};

export const permitRegistrationRequest = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id } = req.params;
    try {
        const connection = DatabaseManager.getConnection();
        const dispatcherRepository = connection.getRepository(Dispatcher);

        const registrationRequest = await dispatcherRepository.findOne(id);

        if (!registrationRequest) {
            return next();
        }

        if (registrationRequest.isPermitted) {
            return next(createHttpError(400, `Dispatcher with id ${registrationRequest.id} has already been permitted to access resource`));
        }

        registrationRequest.isPermitted = true;
        await dispatcherRepository.save(registrationRequest);

        res.send(registrationRequest);

        // TODO: handle this stuff separately
        const context = {
            name: registrationRequest.firstName,
            appName: 'diplomaWork'
        };

        await sendPermitRegistrationRequest(registrationRequest.email, context);
    } catch (error) {
        next(error);
    }
};
