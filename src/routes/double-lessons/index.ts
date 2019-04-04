import express from 'express';

import { authMiddleware } from '../../auth';
import { getDoubleLessons } from './handlers';

export const routes = express.Router();

routes.get('/double-lessons', authMiddleware, getDoubleLessons);
