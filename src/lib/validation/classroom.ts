import * as Joi from 'joi';

export const createClassroomSchema = {
    body: {
        number: Joi.number().required(),
        amountOfSeats: Joi.number().required(),
        facultyId: Joi.number().required()
    }
};

export const getFreeClassroomsSchema = {
    query: {
        assignmentDate: Joi.string().regex(new RegExp('[0-9]{4}-[0-9]{2}-[0-9]{2}')),
        facultyId: Joi.string().regex(new RegExp('^[1-9]\\d*$')),
        doubleLessonId: Joi.string().regex(new RegExp('^[1-9]\\d*$'))
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
