import express from 'express';

import { checkPermission } from '../../auth/middlewares/permission';
import { authMiddleware } from '../../auth';
import { getFaculties, deleteFaculty, updateFaculty } from './handlers';
import { validate as createValidationMiddleWare } from '../../lib/middlewares';
import { updateFacultySchema } from '../../lib/validation';

export const routes = express.Router();

routes.get('/faculties', getFaculties, authMiddleware, checkPermission.read('getAllFaculties'));

routes.delete('/faculties/:id', authMiddleware, checkPermission.delete('removeFaculty'), deleteFaculty);

routes.put('/faculties/:id', authMiddleware, checkPermission.update('updateFaculty'), createValidationMiddleWare(updateFacultySchema), updateFaculty);
