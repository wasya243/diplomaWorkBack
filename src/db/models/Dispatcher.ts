import { Column, ChildEntity, ManyToOne } from 'typeorm';

import { Faculty, User } from '../models';

@ChildEntity()
export class Dispatcher extends User {

    @Column({ type: 'boolean', default: false })
        //@ts-ignore
    isPermitted: boolean;

    @ManyToOne(type => Faculty, faculty => faculty.classrooms, { cascade: true, onDelete: 'CASCADE' })
        //@ts-ignore
    faculty: Faculty;
}
