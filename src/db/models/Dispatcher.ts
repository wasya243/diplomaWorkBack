import { Column, ChildEntity, ManyToOne, OneToMany } from 'typeorm';

import { Faculty, User, Assignment } from '../models';

@ChildEntity()
export class Dispatcher extends User {

    @Column({ type: 'boolean', default: false })
        //@ts-ignore
    isPermitted: boolean;

    @ManyToOne(type => Faculty, faculty => faculty.classrooms, { cascade: true, onDelete: 'CASCADE' })
        //@ts-ignore
    faculty: Faculty;

    @OneToMany(type => Assignment, assignment => assignment.dispatcher)
        //@ts-ignore
    assignments: Assignment[];
}
