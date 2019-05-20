import express from 'express';

import { authMiddleware } from '../../auth';
import { getGroups, deleteGroup, updateGroup, createGroup, getGroupById } from './handlers';
import { checkPermission } from '../../auth/middlewares/permission';
import { validate as createValidationMiddleWare } from '../../lib/middlewares';
import { updateGroupSchema, createGroupSchema } from '../../lib/validation';

export const routes = express.Router();

routes.get('/groups', authMiddleware, getGroups);

routes.delete('/groups/:id', authMiddleware, checkPermission.delete('removeGroup'), deleteGroup);

routes.put('/groups/:id', authMiddleware, checkPermission.update('updateGroup'), createValidationMiddleWare(updateGroupSchema), updateGroup);

routes.post('/groups', authMiddleware, checkPermission.create('createGroup'), createValidationMiddleWare(createGroupSchema), createGroup);

// TODO: add permission middleware
routes.get('/groups/:id', authMiddleware, getGroupById);
