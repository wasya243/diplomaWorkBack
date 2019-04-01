import * as Joi from 'joi';

export const createClassroomSchema = {
    body: {
        number: Joi.number().required(),
        amountOfSeats: Joi.number().required(),
        facultyId: Joi.number().required()
    }
};

// TODO: think of optional properties & regexp validation
export const updateClassroomSchema = {
    body: {
        number: Joi.number().required(),
        amountOfSeats: Joi.number().required(),
        facultyId: Joi.number().required()
    }
};
