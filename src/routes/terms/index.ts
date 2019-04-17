import express from 'express';

import { authMiddleware } from '../../auth';
import { getWeeksByTerm } from './handlers';
import { checkPermission } from '../../auth/middlewares/permission';

export const routes = express.Router();

routes.get('/terms/:id/weeks', authMiddleware, checkPermission.read('getWeeksByTerm'), getWeeksByTerm);
