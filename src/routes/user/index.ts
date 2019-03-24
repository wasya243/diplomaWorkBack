import express from 'express';

import { getUsers, getUserById, deleteUser, updateUser, createUser } from './handlers';
import { checkPermission } from '../../auth/middlewares/permission';
import { authMiddleware } from '../../auth';

export const routes = express.Router();

routes.get('/users', authMiddleware, checkPermission.read('getAllUsers'), getUsers);

// TODO: add auth & permission middleware
routes.get('/users/:id', getUserById);

routes.post('/users', createUser);

routes.put('/users/:id', authMiddleware, checkPermission.update('updateUser'), updateUser);

routes.delete('/users/:id', authMiddleware, checkPermission.delete('removeUser'), deleteUser);
