import * as Joi from 'joi';

export const updateGroupSchema = {
    body: {
        name: Joi.string().required(),
        amountOfPeople: Joi.number().required()
    }
};
