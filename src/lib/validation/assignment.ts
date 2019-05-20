import * as Joi from 'joi';

export const createAssignmentSchema = {
    body: {
        doubleLessonId: Joi.number().required(),
        groupId: Joi.number().required(),
        classroomId: Joi.number().required(),
        assignmentDate: Joi.string().isoDate().required()
    }
};


export const getReportSchema = {
    query: {
        start: Joi.string().regex(new RegExp('[0-9]{4}-[0-9]{2}-[0-9]{2}')),
        end: Joi.string().regex(new RegExp('[0-9]{4}-[0-9]{2}-[0-9]{2}'))
    }
};

export const getAssignmentsSchema = {
    query: {
        start: Joi.string().regex(new RegExp('[0-9]{4}-[0-9]{2}-[0-9]{2}')),
        end: Joi.string().regex(new RegExp('[0-9]{4}-[0-9]{2}-[0-9]{2}'))
    }
};
