import moment from 'moment';

import { Request } from '../db/models';
import { RawPermission, ProcessedPermission, ProcessedJoiValidationError, RawJoiValidationError } from '../types';

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
