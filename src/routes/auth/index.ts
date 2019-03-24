import express from 'express';

import { signIn, signOut, signUp } from './handlers';
import { authMiddleware } from '../../auth';
import { validate as createValidationMiddleWare } from '../../lib/middlewares';
import { signUpSchema } from '../../lib/validation';

export const routes = express.Router();

routes.post('/auth/sign-out', authMiddleware, signOut);

routes.post('/auth/sign-in', signIn);

routes.post('/auth/sign-up', createValidationMiddleWare(signUpSchema), signUp);
