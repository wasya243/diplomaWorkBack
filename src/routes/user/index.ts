import express = require('express');
import { getUsers, getUserById, deleteUser, updateUser, createUser } from './handlers';

export const routes = express.Router();

routes.get('/users', getUsers);

routes.get('/users/:id', getUserById);

routes.post('/users', createUser);

routes.put('/users/:id', updateUser);

routes.delete('/users/:id', deleteUser);
