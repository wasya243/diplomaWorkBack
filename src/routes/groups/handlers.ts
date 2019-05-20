import * as express from 'express';
import createHttpError = require('http-errors');

import { DatabaseManager } from '../../db/database-manager';
import { Faculty, Group } from '../../db/models';

export async function getGroups(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const connection = DatabaseManager.getConnection();
        const groupRepository = connection.getRepository(Group);

        const allGroups = await groupRepository.find({ relations: [ 'faculty' ] });

        res.send(allGroups.map(group => Object.assign(group, { faculty: { id: group.faculty.id, name: group.faculty.name } })));
    } catch (error) {
        next(error);
    }
}

export async function deleteGroup(req: express.Request, res: express.Response, next: express.NextFunction) {
    const groupId = req.params.id;
    try {
        const connection = DatabaseManager.getConnection();
        const groupRepository = connection.getRepository(Group);

        const groupToDelete = await groupRepository.findOne(groupId);
        if (!groupToDelete) {
            return next();
        }

        await groupRepository.remove(groupToDelete);

        res.status(204).end();

    } catch (error) {
        next(error);
    }
}

export async function getGroupById(req: express.Request, res: express.Response, next: express.NextFunction) {
    const groupId = req.params.id;
    try {
        const connection = DatabaseManager.getConnection();
        const groupRepository = connection.getRepository(Group);

        const group = await groupRepository.findOne(groupId);
        if (!group) {
            return next();
        }

        res.send(group);

    } catch (error) {
        next(error);
    }
}

export async function updateGroup(req: express.Request, res: express.Response, next: express.NextFunction) {
    const groupId = req.params.id;
    const groupData = req.body;
    try {
        const connection = DatabaseManager.getConnection();
        const groupRepository = connection.getRepository(Group);

        const groupToUpdate = await groupRepository.findOne(groupId, { relations: [ 'faculty' ] });
        if (!groupToUpdate) {
            return next();
        }

        groupToUpdate.name = groupData.name;
        groupToUpdate.amountOfPeople = groupData.amountOfPeople;
        groupToUpdate.yearEnd = groupData.yearEnd;
        groupToUpdate.yearStart = groupData.yearStart;

        await groupRepository.save(groupToUpdate);

        res.send(Object.assign(groupToUpdate, {
            faculty: {
                id: groupToUpdate.faculty.id,
                name: groupToUpdate.faculty.name
            }
        }));
    } catch (error) {
        next(error);
    }
}

export async function createGroup(req: express.Request, res: express.Response, next: express.NextFunction) {
    const groupData = req.body;
    try {
        const connection = DatabaseManager.getConnection();

        const groupRepository = connection.getRepository(Group);
        const facultyRepository = connection.getRepository(Faculty);

        const faculty = await facultyRepository.findOne(groupData.facultyId);
        if (!faculty) {
            return next(createHttpError(404, `Faculty with provided id ${groupData.facultyId} is not found`));
        }

        const group = new Group();

        group.faculty = faculty;
        group.yearStart = groupData.yearStart;
        group.yearEnd = groupData.yearEnd;
        group.amountOfPeople = groupData.amountOfPeople;
        group.name = groupData.name;

        const savedGroup = await groupRepository.save(group);

        res.send(savedGroup);
    } catch (error) {
        next(error);
    }
}
