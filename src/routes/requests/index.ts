import express from 'express';

import { authMiddleware } from '../../auth';
import { createRequest, reviewRequest } from './handlers';
import { validate as createValidationMiddleWare } from '../../lib/middlewares';
import { createRequestSchema, reviewRequestSchema } from '../../lib/validation';

export const routes = express.Router();

// TODO: add permission middleware
routes.post('/requests', authMiddleware, createValidationMiddleWare(createRequestSchema), createRequest);

// TODO: add permission middleware
routes.put('/review-requests/:id', authMiddleware, createValidationMiddleWare(reviewRequestSchema), reviewRequest);
