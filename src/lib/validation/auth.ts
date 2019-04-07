import * as Joi from 'joi';

export const signUpSchema = {
    body: {
        email: Joi.string().required(),
        password: Joi.string().required(),
        roleId: Joi.number().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        facultyId: Joi.number().required()
    }
};

export const signInSchema = {
    body: {
        email: Joi.string().required(),
        password: Joi.string().required()
    }
};
