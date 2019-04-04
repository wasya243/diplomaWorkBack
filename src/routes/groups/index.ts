import express from 'express';

import { authMiddleware } from '../../auth';
import { getGroups } from './handlers';

export const routes = express.Router();

routes.get('/groups', authMiddleware, getGroups);
