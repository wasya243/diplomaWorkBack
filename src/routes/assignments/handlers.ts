import express from 'express';
import moment from 'moment';
import createHttpError = require('http-errors');

import { DatabaseManager } from '../../db/database-manager';
import { Assignment, Classroom, DoubleLesson, Group, Request } from '../../db/models';
import { isPassedToOtherFaculty } from '../../lib/helpers';

export const createAssignment = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { doubleLessonId, groupId, classroomId, assignmentDate } = req.body;
    try {
        const connection = DatabaseManager.getConnection();

        const classroomRepository = connection.getRepository(Classroom);
        const doubleLessonRepository = connection.getRepository(DoubleLesson);
        const groupRepository = connection.getRepository(Group);
        const requestRepository = connection.getRepository(Request);
        const assignmentRepository = connection.getRepository(Assignment);

        const doubleLesson = await doubleLessonRepository.findOne(doubleLessonId);
        const group = await groupRepository.findOne(groupId);
        const classroom = await classroomRepository.findOne(classroomId);

        if (!doubleLesson) {
            return next(createHttpError(404, `Double lesson with provided id ${doubleLessonId} does not exist`));
        }

        if (!group) {
            return next(createHttpError(404, `Group with provided id ${groupId} does not exist`));
        }

        if (!classroom) {
            return next(createHttpError(404, `Classroom with provided id ${classroomId} does not exist`));
        }

        // check if given classroom is not passed over to other faculty
        const requests = await requestRepository
            .createQueryBuilder('request')
            .where('request."classroomId" = :classroomId')
            .andWhere('request.isApproved = true')
            .setParameters({ classroomId: classroomId })
            .getMany();

        const doubleLessonStart = moment(doubleLesson.start);
        const doubleLessonEnd = moment(doubleLesson.end);

        const assignmentDateStart = moment(
            moment(assignmentDate)
                .startOf('day')
                .add(doubleLessonStart.hours(), 'hours')
                .add(doubleLessonStart.minutes(), 'minutes')
                .format());
        const assignmentDateEnd = moment(
            moment(assignmentDate)
                .startOf('day')
                .add(doubleLessonEnd.hours(), 'hours')
                .add(doubleLessonEnd.minutes(), 'minutes')
                .format());


        const isPassed = isPassedToOtherFaculty(assignmentDateStart, assignmentDateEnd, requests);
        if (isPassed) {
            return next(createHttpError(400, `This ${classroomId} classroom cannot be used during this period start ${assignmentDateStart} end ${assignmentDateEnd} cause it was passed to other faculty`));
        }

        // check if there is enough space left in classroom
        const assignments = await assignmentRepository
            .createQueryBuilder('assignment')
            .where('assignment."classroomId" = :classroomId')
            .andWhere('assignment.assignmentDate = :assignmentDate')
            .setParameters({ classroomId: classroomId, assignmentDate: moment(assignmentDate).startOf('day').format() })
            .innerJoinAndSelect('assignment.group', 'group')
            .getMany();
        const amountOfPeople = assignments.reduce((ac, cu) => ac + cu.group.amountOfPeople, 0);

        if ((classroom.amountOfSeats - amountOfPeople) < group.amountOfPeople) {
            return next(createHttpError(400, `Classroom with id ${classroomId} has not enough space left for ${group.amountOfPeople} people in group with id ${group.id}`));
        }

        const assignment = new Assignment();
        assignment.classroom = classroom;
        assignment.doubleLesson = doubleLesson;
        assignment.group = group;
        assignment.assignmentDate = moment(assignmentDate).startOf('day').format();

        await assignmentRepository.save(assignment);

        res.send(assignment);
    } catch (error) {
        next(error);
    }
};
