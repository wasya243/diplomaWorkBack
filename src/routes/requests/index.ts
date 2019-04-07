import express from 'express';

import { authMiddleware } from '../../auth';
import { createRequest, reviewRequest, getRequests } from './handlers';
import { validate as createValidationMiddleWare } from '../../lib/middlewares';
import { createRequestSchema, reviewRequestSchema } from '../../lib/validation';
import { checkPermission } from '../../auth/middlewares/permission';

export const routes = express.Router();

routes.post('/requests', authMiddleware, checkPermission.create('createRequest'), createValidationMiddleWare(createRequestSchema), createRequest);

routes.put('/review-requests/:id', authMiddleware, checkPermission.update('updateRequest'), createValidationMiddleWare(reviewRequestSchema), reviewRequest);

routes.get('/requests', authMiddleware, checkPermission.read('getAllRequests'), getRequests);
