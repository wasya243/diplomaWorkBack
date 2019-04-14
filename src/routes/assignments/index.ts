import express from 'express';

import { authMiddleware } from '../../auth';
import { createAssignment, getReport } from './handlers';
import { validate as createValidationMiddleWare } from '../../lib/middlewares';
import { createAssignmentSchema, getReportSchema } from '../../lib/validation';
import { checkPermission } from '../../auth/middlewares/permission';

export const routes = express.Router();

routes.post('/assignments', authMiddleware, checkPermission.create('createAssignment'), createValidationMiddleWare(createAssignmentSchema), createAssignment);

routes.get('/report', authMiddleware, checkPermission.read('getReport'), createValidationMiddleWare(getReportSchema), getReport);
