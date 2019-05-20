import express from 'express';

import { authMiddleware } from '../../auth';
import { getDoubleLessons, getDoubleLessonById } from './handlers';

export const routes = express.Router();

routes.get('/double-lessons', authMiddleware, getDoubleLessons);

routes.get('/double-lessons/:id', authMiddleware, getDoubleLessonById);
