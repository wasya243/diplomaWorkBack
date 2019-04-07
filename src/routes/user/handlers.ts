import express from 'express';

import { sendResetPasswordEmail } from '../../../nodemailer.config';
import { encryptPassword } from '../../auth';
import { DatabaseManager } from '../../db/database-manager';
import { User } from '../../db/models';

// TODO: I should put response types somewhere

export const getUsers = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const connection = DatabaseManager.getConnection();
        const userRepository = connection.getRepository(User);
        // All user entries with permitted = false => are counted as registration requests
        const allUsers = await userRepository.find({
            where: [ { isPermitted: true } ],
            select: [ 'id', 'firstName', 'lastName', 'email' ],
            relations: [ 'role' ]
        });
        res.send(allUsers.map(user => Object.assign({}, {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role.name
        })));
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInt(req.params.id);

    try {
        const connection = DatabaseManager.getConnection();
        const userRepository = connection.getRepository(User);
        const user = await userRepository.findOne({ id: id });
        if (!user) {
            return next();
        }
        res.send(user);
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { firstName, lastName, password, role, email } = req.body;

    try {
        const connection = DatabaseManager.getConnection();
        const userRepository = connection.getRepository(User);
        const user = new User();

        user.firstName = firstName;
        user.lastName = lastName;
        user.password = password;
        user.role = role;
        user.email = email;

        const savedUser = await userRepository.save(user);
        res.send(savedUser);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInt(req.params.id);
    const userInfo = req.body;

    try {
        const connection = DatabaseManager.getConnection();
        const userRepository = connection.getRepository(User);
        const userToUpdate = await userRepository.findOne(id, { relations: [ 'role' ] });
        if (!userToUpdate) {
            return next();
        }

        const role = userToUpdate.role.name;

        userToUpdate.firstName = userInfo.firstName;
        userToUpdate.lastName = userInfo.lastName;
        userToUpdate.role = userInfo.role;
        userToUpdate.email = userInfo.email;

        await userRepository.save(userToUpdate);
        res.send(Object.assign({}, {
            firstName: userToUpdate.firstName,
            lastName: userToUpdate.lastName,
            email: userToUpdate.email,
            id: userToUpdate.id,
            role
        }));
    } catch (error) {
        next(error);
    }
};


export const deleteUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInt(req.params.id);

    try {
        const connection = DatabaseManager.getConnection();
        const userRepository = connection.getRepository(User);
        const userToRemove = await userRepository.findOne(id);
        if (!userToRemove) {
            return next();
        }
        await userRepository.remove(userToRemove);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInt(req.params.id);
    const newPassword = req.body.password;

    try {
        const connection = DatabaseManager.getConnection();
        const userRepository = connection.getRepository(User);
        const userToResetPassword = await userRepository.findOne(id);

        if (!userToResetPassword) {
            return next();
        }
        // TODO: send notification email
        userToResetPassword.password = await encryptPassword(newPassword);
        await userRepository.save(userToResetPassword);


        res.status(200).end();

        // TODO: handle this stuff separately
        const context = {
            name: userToResetPassword.firstName,
            password: newPassword,
            appName: 'diplomaWork',
            email: userToResetPassword.email
        };
        await sendResetPasswordEmail(userToResetPassword.email, context);

    } catch (error) {
        next(error);
    }
};
