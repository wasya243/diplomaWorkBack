import express from 'express';

import { getClassrooms, createClassroom, updateClassroom, deleteClassroom } from './handlers';
import { checkPermission } from '../../auth/middlewares/permission';
import { authMiddleware } from '../../auth';
import { validate as createValidationMiddleWare } from '../../lib/middlewares';
import { createClassroomSchema, updateClassroomSchema } from '../../lib/validation';

export const routes = express.Router();

routes.get('/classrooms', authMiddleware, checkPermission.read('getAllClassrooms'), getClassrooms);

routes.post('/classrooms', authMiddleware, checkPermission.create('createClassroom'), createValidationMiddleWare(createClassroomSchema), createClassroom);

routes.put('/classrooms/:id', authMiddleware, checkPermission.update('updateClassroom'), createValidationMiddleWare(updateClassroomSchema), updateClassroom);

routes.delete('/classrooms/:id', authMiddleware, checkPermission.delete('removeClassroom'), deleteClassroom);


