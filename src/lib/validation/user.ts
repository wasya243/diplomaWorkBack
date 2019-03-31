import * as Joi from 'joi';

export const updateUserSchema = {
    body: {
        email: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required()
    }
};

export const resetPasswordSchema = {
    body: {
        password: Joi.string().required()
    }
};
