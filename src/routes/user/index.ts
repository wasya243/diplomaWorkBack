import express from 'express';

import { getUsers, getUserById, deleteUser, updateUser, createUser, resetPassword } from './handlers';
import { checkPermission } from '../../auth/middlewares/permission';
import { authMiddleware } from '../../auth';
import { validate as createValidationMiddleWare } from '../../lib/middlewares';
import { updateUserSchema, resetPasswordSchema } from '../../lib/validation';

export const routes = express.Router();

routes.get('/users', authMiddleware, checkPermission.read('getAllUsers'), getUsers);

// TODO: add auth & permission middleware
routes.get('/users/:id', getUserById);

routes.post('/users', createUser);

routes.put('/users/:id', authMiddleware, checkPermission.update('updateUser'), createValidationMiddleWare(updateUserSchema), updateUser);

routes.put('/users/:id/reset-password', authMiddleware, checkPermission.update('reset-password'), createValidationMiddleWare(resetPasswordSchema), resetPassword);

routes.delete('/users/:id', authMiddleware, checkPermission.delete('removeUser'), deleteUser);


