import express from 'express';

import { authMiddleware } from '../../auth';
import { createRequest } from './handlers';
import { validate as createValidationMiddleWare } from '../../lib/middlewares';
import { createRequestSchema } from '../../lib/validation';

export const routes = express.Router();

// TODO: add permission middleware
routes.post('/requests', authMiddleware, createValidationMiddleWare(createRequestSchema), createRequest);
