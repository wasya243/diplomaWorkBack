import express from 'express';

import { DatabaseManager } from '../../db/database-manager';
import { User } from '../../db/models';


export const getUsers = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const connection = DatabaseManager.getConnection();
        const userRepository = connection.getRepository(User);
        const allUsers = await userRepository.find();
        res.send(allUsers);
    } catch (error) {
        console.error(error);
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
        console.error(error);
    }
};

export const createUser = async (req: express.Request, res: express.Response) => {
    const { name, email } = req.body;

    try {
        const connection = DatabaseManager.getConnection();
        const userRepository = connection.getRepository(User);
        const user = new User();
        user.name = name;
        user.email = email;
        const savedUser = await userRepository.save(user);
        res.send(savedUser);
    } catch (error) {
        console.error(error);
    }
};

export const updateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;

    try {
        const connection = DatabaseManager.getConnection();
        const userRepository = connection.getRepository(User);
        const userToUpdate = await userRepository.findOne(id);
        if (!userToUpdate) {
            return next();
        }
        name && (userToUpdate.name = name);
        email && (userToUpdate.email = email);
        await userRepository.save(userToUpdate);
        res.send(userToUpdate);
    } catch (error) {
        console.error(error);
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
        console.error(error);
    }
};
