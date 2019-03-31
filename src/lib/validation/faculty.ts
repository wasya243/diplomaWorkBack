import * as Joi from 'joi';

// TODO: think of optional properties & regexp validation
export const updateFacultySchema = {
    body: {
        name: Joi.string().required(),
        director: Joi.string().required(),
        address: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        website: Joi.string().required()
    }
};
