import * as Joi from 'joi';

export const signUpSchema = {
    body: {
        email: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.number().required(),
        name: Joi.string().required()
    }
};
