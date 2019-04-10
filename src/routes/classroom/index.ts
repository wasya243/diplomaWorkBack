import express from 'express';

import {
    getClassrooms,
    createClassroom,
    updateClassroom,
    deleteClassroom,
    getFreeClassrooms
} from './handlers';
import { checkPermission } from '../../auth/middlewares/permission';
import { authMiddleware } from '../../auth';
import { validate as createValidationMiddleWare } from '../../lib/middlewares';
import { createClassroomSchema, updateClassroomSchema, getFreeClassroomsSchema } from '../../lib/validation';

export const routes = express.Router();

// TODO: add permission middleware, add joi validation schema
routes.get('/free-classrooms', authMiddleware, checkPermission.read('getAllFreeClassrooms'), createValidationMiddleWare(getFreeClassroomsSchema), getFreeClassrooms);

routes.get('/classrooms', authMiddleware, checkPermission.read('getAllClassrooms'), getClassrooms);

routes.post('/classrooms', authMiddleware, checkPermission.create('createClassroom'), createValidationMiddleWare(createClassroomSchema), createClassroom);

routes.put('/classrooms/:id', authMiddleware, checkPermission.update('updateClassroom'), createValidationMiddleWare(updateClassroomSchema), updateClassroom);

routes.delete('/classrooms/:id', authMiddleware, checkPermission.delete('removeClassroom'), deleteClassroom);


