import express = require('express');
import { DatabaseManager } from './connection';
import { User } from './User';


export const getUsers = async (request: express.Request, response: express.Response) => {

    const connection = DatabaseManager.getConnection();
    if (connection) {
        try {
            let userRepository = connection.getRepository(User);
            let allUsers = await userRepository.find();
            response.send(allUsers);
        } catch (error) {
            console.error(error);
        }
    }
};

export const getUserById = async (request: express.Request, response: express.Response) => {
    const id = parseInt(request.params.id);

    const connection = DatabaseManager.getConnection();
    if (connection) {
        try {
            let userRepository = connection.getRepository(User);
            let user = await userRepository.findOne({ id: id });
            if (!user) {
                return response.status(404).end();
            }
            response.send(user);
        } catch (error) {
            console.error(error);
        }
    }
};

export const createUser = async (request: express.Request, response: express.Response) => {
    const { name, email } = request.body;
    console.log(name, email);

    const connection = DatabaseManager.getConnection();
    if (connection) {
        try {
            let userRepository = connection.getRepository(User);
            const user = new User();
            user.name = name;
            user.email = email;
            let savedUser = await userRepository.save(user);
            response.send(savedUser);
        } catch (error) {
            console.error(error);
        }
    }
};

export const updateUser = async (request: express.Request, response: express.Response) => {
    const id = parseInt(request.params.id);
    const { name, email } = request.body;

    const connection = DatabaseManager.getConnection();
    if (connection) {
        try {
            let userRepository = connection.getRepository(User);
            let userToUpdate = await userRepository.findOne(id);
            if (!userToUpdate) {
                return response.status(404).end();
            }
            name && (userToUpdate.name = name);
            email && (userToUpdate.email = email);
            await userRepository.save(userToUpdate);
            response.send(userToUpdate);
        } catch (error) {
            console.error(error);
        }
    }
};


export const deleteUser = async (request: express.Request, response: express.Response) => {
    const id = parseInt(request.params.id);

    const connection = DatabaseManager.getConnection();
    if (connection) {
        try {
            let userRepository = connection.getRepository(User);
            let userToRemove = await userRepository.findOne(id);
            if (!userToRemove) {
                return response.status(404).end();
            }
            await userRepository.remove(userToRemove);
            response.status(204).end();
        } catch (error) {
            console.error(error);
        }
    }
};
