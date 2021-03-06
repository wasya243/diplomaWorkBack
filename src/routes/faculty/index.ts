import express from 'express';

import { checkPermission } from '../../auth/middlewares/permission';
import { authMiddleware } from '../../auth';
import {
    getFaculties,
    deleteFaculty,
    updateFaculty,
    createFaculty,
    getClassroomsByFaculty,
    getGroupsByFaculty
} from './handlers';
import { validate as createValidationMiddleWare } from '../../lib/middlewares';
import { updateFacultySchema } from '../../lib/validation';

export const routes = express.Router();

routes.get('/faculties/:id/groups', authMiddleware, checkPermission.read('getGroupsByFaculty'), getGroupsByFaculty);

routes.get('/faculties', getFaculties);

routes.get('/faculties/:id/classrooms', authMiddleware, getClassroomsByFaculty);

routes.post('/faculties', authMiddleware, checkPermission.create('createFaculty'), createFaculty);

routes.delete('/faculties/:id', authMiddleware, checkPermission.delete('removeFaculty'), deleteFaculty);

routes.put('/faculties/:id', authMiddleware, checkPermission.update('updateFaculty'), createValidationMiddleWare(updateFacultySchema), updateFaculty);
