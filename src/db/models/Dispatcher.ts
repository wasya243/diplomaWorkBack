import { Column, ChildEntity, ManyToOne, OneToMany } from 'typeorm';

import { Request, Faculty, User } from '../models';

@ChildEntity()
export class Dispatcher extends User {

    @Column({ type: 'boolean', default: false })
        //@ts-ignore
    isPermitted: boolean;

    @OneToMany(type => Request, request => request.dispatcher)
        //@ts-ignore
    requests: Request[];

    @ManyToOne(type => Faculty, faculty => faculty.classrooms, { cascade: true, onDelete: 'CASCADE' })
        //@ts-ignore
    faculty: Faculty;
}
