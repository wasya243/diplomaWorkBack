import express from 'express';

import { checkPermission } from '../../auth/middlewares/permission';
import { authMiddleware } from '../../auth';
import { getFaculties } from './handlers';

export const routes = express.Router();

routes.get('/faculties', getFaculties, authMiddleware, checkPermission.read('getAllFaculties'));
