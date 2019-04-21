import * as Joi from 'joi';

export const updateGroupSchema = {
    body: {
        name: Joi.string().required(),
        amountOfPeople: Joi.number().required().min(1),
        yearStart: Joi.number().required().min(0),
        yearEnd: Joi.number().required().min(0)
    }
};
