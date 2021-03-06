import express from 'express';

import { authMiddleware } from '../../auth';
import { getPermissions } from './handlers';

export const routes = express.Router();

routes.get('/permissions', authMiddleware, getPermissions);
