import express from 'express';

import { getRegistrationRequests, permitRegistrationRequest } from './handlers';
import { checkPermission } from '../../auth/middlewares/permission';
import { authMiddleware } from '../../auth';

export const routes = express.Router();

routes.get('/registration-requests', authMiddleware, checkPermission.read('getAllRegistrationRequests'), getRegistrationRequests);

routes.put('/registration-requests/:id', authMiddleware, checkPermission.update('permitRegistrationRequest'), permitRegistrationRequest);
