import express from 'express';

import { checkPermission } from '../../auth/middlewares/permission';
import { authMiddleware } from '../../auth';
import { getFaculties, deleteFaculty } from './handlers';

export const routes = express.Router();

routes.get('/faculties', getFaculties, authMiddleware, checkPermission.read('getAllFaculties'));

routes.delete('/faculties/:id', authMiddleware, checkPermission.delete('removeFaculty'), deleteFaculty);
