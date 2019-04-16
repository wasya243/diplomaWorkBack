import * as express from 'express';

// I'm gonna need userData property on express request object later in handlers
export interface myRequest extends express.Request {
    userData: {
        id: number;
    }
}

export interface ProcessedPermission {
    id: number;
    action: string;
    role: string;
    resource: string;
}


export interface RawPermission {
    id: number;
    action: {
        id: number;
        name: string;
    };
    role: {
        id: number;
        name: string;
    };
    resource: {
        id: number;
        name: string;
    };
}

export interface RawJoiValidationError {
    context: {
        key: string;
        label: string;
    },
    message: string;
    path: Array<string>,
    type: string;
}

export interface ProcessedJoiValidationError {
    key: string;
    message: string;
}


export interface IClassroomUsageDBReport {
    assignmentDate: string;
    doubleLessonNumber: number;
    classroomNumber: number;
    count: string;
}

export interface IClassroomUsageProcessedReport {
    [ key: string ]: {
        [ key: string ]: {
            usages: {
                [ key: string ]: number;
            };
            totalUse: number;
        }
    }
}

export interface IReport {
    assignmentDate: string;
    classrooms: [ {
        usage: {
            doubleLessonNumber: number,
            count: number
        },
        totalUse: number;
    } ];
}

export interface IAssignment {
    id: number;
    groupId: number;
    classroomId: number;
    assignmentDate: string;
    doubleLessonId: number;
    createdAt: string;
    number: number;
    amountOfSeats: number;
    facultyId: number;
}
