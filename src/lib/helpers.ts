import moment from 'moment';

import { Classroom, DoubleLesson, Request } from '../db/models';
import {
    RawPermission,
    ProcessedPermission,
    ProcessedJoiValidationError,
    RawJoiValidationError,
    IClassroomUsageDBReport,
    IClassroomUsageProcessedReport,
    IReport
} from '../types';

// this function is used to generate sessionId
export function simpleUniqueId() {
    return `${Math.random().toString().substring(2)}.${Date.now()}`;
}

// this method is used to process permissions array returned from database
export function processPermissions(rawPermissions: RawPermission[]): ProcessedPermission[] {
    return rawPermissions.map(item => Object.assign({}, {
        action: item.action.name,
        role: item.role.name,
        resource: item.resource.name,
        id: item.id
    }));
}

// this method is used to process joi error
export function composeJoiValidationError(errorDetails: RawJoiValidationError[]): ProcessedJoiValidationError[] {
    return errorDetails.map(item => Object.assign({}, { key: item.context.key, message: item.message }));
}

// check if two timesegments intersect
function fallsWithin(timeSegment1: any, timeSegment2: any) {
    const arr = [ timeSegment1, timeSegment2 ];
    const res = arr.sort((a, b) => a.start - b.end);
    return res[ 0 ].end > res[ 1 ].start;
}

export function isPassedToOtherFaculty(assignmentDateStart: any, assignmentDateEnd: any, requests: Request[]): boolean {
    const mappedRequests = requests.map(req => Object.assign(req, {
        start: moment(moment(req.start).format()),
        end: moment(moment(req.end).format())
    }));

    let result = false;

    for (let i = 0; i < mappedRequests.length; i++) {
        if (fallsWithin({ start: assignmentDateStart, end: assignmentDateEnd }, {
            start: mappedRequests[ i ].start,
            end: mappedRequests[ i ].end
        })) {
            result = true;
            break;
        }
    }

    return result;
}

export function fillReport(initReport: any, assignments: Array<IClassroomUsageDBReport>) {
    const mappedAssignments = assignments
        .map((assignment: any) => Object.assign(assignment, { 'assignmentDate': moment(assignment[ 'assignmentDate' ]).format() }));

    for (let assignment of mappedAssignments) {
        initReport[ assignment[ 'assignmentDate' ] ][ assignment[ 'classroomNumber' ] ][ 'usages' ][ assignment.doubleLessonNumber ] = parseInt(assignment[ 'count' ]);
        initReport[ assignment[ 'assignmentDate' ] ][ assignment[ 'classroomNumber' ] ].totalUse += parseInt(assignment[ 'count' ]);
    }
}

export function initReport(doubleLessons: Array<DoubleLesson>, classrooms: Array<Classroom>, dateStart: string, dateEnd: string): IClassroomUsageProcessedReport {
    let report: any = {};
    let dates = [ moment(dateStart).format() ];
    dates = dates.concat(enumerateDaysBetweenDates(dateStart, dateEnd).map(date => moment(date).format()));
    dates.push(moment(dateEnd).format());

    for (const date of dates) {
        report[ date ] = {};
        for (const classroom of classrooms) {
            report[ date ][ classroom.number ] = {
                usages: Object.assign({}, doubleLessons.reduce((ac: any, cv: DoubleLesson) => {
                    ac[ cv.number ] = 0;
                    return ac;
                }, {})),
                totalUse: 0
            };
        }
    }

    return report;
}

export function enumerateDaysBetweenDates(start: string, end: string): Array<Date> {
    const dates = [];
    const currentDate = moment(start).startOf('day');
    const lastDate = moment(end).startOf('day');

    while (currentDate.add(1, 'day').diff(lastDate) < 0) {
        dates.push(currentDate.clone().toDate());
    }

    return dates;
}

export function prepareReportForRendering(report: IClassroomUsageProcessedReport): Array<IReport> {
    let result: any[] = [];

    const dates = Object.keys(report);
    for (const date of dates) {
        const currentValue: any = {};
        currentValue.assignmentDate = date;
        currentValue.classrooms = [];
        const classrooms = Object.keys(report[ date ]);
        for (const classroom of classrooms) {
            const currentClassroom: any = {};
            currentClassroom.classroomNuber = parseInt(classroom);
            currentClassroom.usages = [];
            const usages = Object.keys(report[ date ][ classroom ].usages);
            for (const usage of usages) {
                currentClassroom.usages.push({
                    doubleLessonNumber: parseInt(usage),
                    count: report[ date ][ classroom ].usages[ usage ]
                });
            }
            currentClassroom.totalUse = report[ date ][ classroom ].totalUse;
            currentValue.classrooms.push(currentClassroom);
        }
        result.push(currentValue);
    }

    return result;
}

