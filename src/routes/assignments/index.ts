import express from 'express';

import { authMiddleware } from '../../auth';
import { createAssignment } from './handlers';
import { validate as createValidationMiddleWare } from '../../lib/middlewares';
import { createAssignmentSchema } from '../../lib/validation';

export const routes = express.Router();

// TODO: add permission middleware
routes.post('/assignments', authMiddleware, createValidationMiddleWare(createAssignmentSchema), createAssignment);
