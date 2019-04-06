import * as Joi from 'joi';

export const createAssignmentSchema = {
    body: {
        doubleLessonId: Joi.number().required(),
        groupId: Joi.number().required(),
        classroomId: Joi.number().required(),
        assignmentDate: Joi.string().isoDate().required()
    }
};
