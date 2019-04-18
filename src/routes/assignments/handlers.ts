import express from 'express';
import moment from 'moment';
import createHttpError = require('http-errors');

import { IClassroomUsageDBReport } from '../../types';
import { DatabaseManager } from '../../db/database-manager';
import { Assignment, Classroom, DoubleLesson, Group, Request, Dispatcher, User } from '../../db/models';
import {
    isPassedToOtherFaculty,
    initReport,
    fillReport,
    prepareReportForRendering,
    groupAssignments, enumerateDaysBetweenDates
} from '../../lib/helpers';

export const createAssignment = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { doubleLessonId, groupId, classroomId, assignmentDate } = req.body;
    // @ts-ignore
    const dispatcherId = req.userData.id;
    try {
        const connection = DatabaseManager.getConnection();

        const classroomRepository = connection.getRepository(Classroom);
        const doubleLessonRepository = connection.getRepository(DoubleLesson);
        const groupRepository = connection.getRepository(Group);
        const requestRepository = connection.getRepository(Request);
        const assignmentRepository = connection.getRepository(Assignment);
        const dispatcherRepository = connection.getRepository(Dispatcher);

        const dispatcher = await dispatcherRepository.findOne(dispatcherId, { relations: [ 'faculty' ] });
        const doubleLesson = await doubleLessonRepository.findOne(doubleLessonId);
        const group = await groupRepository.findOne(groupId);
        const classroom = await classroomRepository.findOne(classroomId, { relations: [ 'faculty' ] });

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

        // if classroom belongs to the dispatcher sending the request
        if ((dispatcher && dispatcher.faculty.id === classroom.faculty.id) && isPassed) {
            return next(createHttpError(400, `This ${classroomId} classroom cannot be used during this period start ${assignmentDateStart} end ${assignmentDateEnd} cause it was passed to other faculty`));
        }

        // if classroom does not belong to the dispatcher sending the request
        if ((dispatcher && dispatcher.faculty.id !== classroom.faculty.id) && !isPassed) {
            return next(createHttpError(400, `This ${classroomId} classroom cannot be used during this period start ${assignmentDateStart} end ${assignmentDateEnd} cause it was not passed dispatcher with id ${dispatcher.id}`));
        }


        // check if there is enough space left in classroom
        const assignments = await assignmentRepository
            .createQueryBuilder('assignment')
            .where('assignment."classroomId" = :classroomId')
            .andWhere('assignment.assignmentDate = :assignmentDate')
            .andWhere('assignment."doubleLessonId" = :doubleLessonId')
            .setParameters({
                doubleLessonId: doubleLessonId,
                classroomId: classroomId,
                assignmentDate: moment(assignmentDate).startOf('day').format()
            })
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
        assignment.dispatcher = dispatcher as Dispatcher;
        assignment.assignmentDate = moment(assignmentDate).startOf('day').format();

        await assignmentRepository.save(assignment);

        res.send(assignment);
    } catch (error) {
        next(error);
    }
};


export const getReport = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // @ts-ignore
    const dispatcherId = req.userData.id;
    const { start, end } = req.query;
    try {
        const connection = DatabaseManager.getConnection();

        const assignmentRepository = connection.getRepository(Assignment);
        const dispatcherRepository = connection.getRepository(Dispatcher);
        const classroomRepository = connection.getRepository(Classroom);
        const doubleLessonRepository = connection.getRepository(DoubleLesson);

        const dispatcher = await dispatcherRepository.findOne(dispatcherId, { relations: [ 'faculty' ] });
        const classrooms = await classroomRepository.find({ faculty: dispatcher && dispatcher.faculty });
        const doubleLessons = await doubleLessonRepository.find();

        const assignments: Array<IClassroomUsageDBReport> = (await assignmentRepository
            .query(`
                SELECT "assignmentDate", classroom.number AS "classroomNumber", double_lesson.number AS "doubleLessonNumber", COUNT(*)
                FROM classroom
                INNER JOIN assignment on classroom.id = assignment."classroomId"
                INNER JOIN double_lesson on assignment."doubleLessonId" = double_lesson.id
                WHERE classroom."facultyId" = ${dispatcher && dispatcher.faculty.id}
                AND "assignmentDate" >= '${moment(start).format()}'::timestamptz AND "assignmentDate" <= '${moment(end).format()}'::timestamptz
                GROUP BY "assignmentDate", "doubleLessonNumber", "classroomNumber"
            `));

        const report = initReport(doubleLessons, classrooms, start, end);
        fillReport(report, assignments);

        const processedReport = prepareReportForRendering(report);

        res.send(processedReport);
    } catch (error) {
        next(error);
    }
};


export const getAssignments = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // @ts-ignore
    const dispatcherId = req.userData.id;
    const { start, end } = req.query;
    try {
        const connection = DatabaseManager.getConnection();

        const dispatcherRepository = connection.getRepository(Dispatcher);
        const assignmentRepository = connection.getRepository(Assignment);

        const dispatcher = await dispatcherRepository.findOne(dispatcherId, { relations: [ 'faculty' ] });
        // get all dispatchers of current faculty
        const dispatcherIds = (await dispatcherRepository.find({ faculty: dispatcher && dispatcher.faculty })).map(dispatcher => dispatcher.id);
        // find assignments made by dispatchers of current faculty
        const assignments = await assignmentRepository
            .query(`
                SELECT *
                FROM classroom
                INNER JOIN assignment ON classroom.id = assignment."classroomId"
                WHERE assignment."dispatcherId" IN (${dispatcherIds})
                AND "assignmentDate" >= '${moment(start).format()}'::timestamptz AND "assignmentDate" <= '${moment(end).format()}'::timestamptz
            `);

        let dates = [ moment(start).format() ];
        dates = dates.concat(enumerateDaysBetweenDates(start, end).map(date => moment(date).format()));
        dates.push(moment(end).format());

        const processedAssignments = groupAssignments(assignments, dates);

        res.send(processedAssignments);
    } catch (error) {
        next(error);
    }
};

export const removeAssignment = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // @ts-ignore
    const assignmentId = req.params.id;
    try {
        const connection = DatabaseManager.getConnection();

        const assignmentRepository = connection.getRepository(Assignment);

        const assignmentToRemove = await assignmentRepository.findOne(assignmentId);
        if (!assignmentToRemove) {
            return next();
        }

        await assignmentRepository.remove(assignmentToRemove);

        res.status(204).end();
    } catch (error) {
        next(error);
    }
};
