import * as Joi from 'joi';

export const createRequestSchema = {
    body: {
        classroomId: Joi.number().required(),
        start: Joi.string().isoDate().required(),
        end: Joi.string().isoDate().required()
    }
};


export const reviewRequestSchema = {
    body: {
        isApproved: Joi.boolean().required()
    }
};
