import express from 'express';

import { authMiddleware } from '../../auth';
import { getGroups, deleteGroup, updateGroup } from './handlers';
import { checkPermission } from '../../auth/middlewares/permission';
import { validate as createValidationMiddleWare } from '../../lib/middlewares';
import { updateGroupSchema } from '../../lib/validation';

export const routes = express.Router();

// TODO: add permission middleware
routes.get('/groups', authMiddleware, getGroups);

routes.delete('/groups/:id', authMiddleware, checkPermission.read('removeGroup'), deleteGroup);

routes.put('/groups/:id', authMiddleware, checkPermission.update('updateGroup'), createValidationMiddleWare(updateGroupSchema), updateGroup);
