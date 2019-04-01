import { Column, Entity, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm';

import { Classroom } from './Сlassroom';

@Entity()
export class Faculty {
    @PrimaryGeneratedColumn()
        //@ts-ignore
    id: number;

    @Index({ unique: true })
    @Column()
        //@ts-ignore
    name: string;

    @Index({ unique: true })
    @Column()
        //@ts-ignore
    phoneNumber: string;

    @Index({ unique: true })
    @Column()
        //@ts-ignore
    website: string;

    @Column()
        //@ts-ignore
    director: string;

    @Column()
        //@ts-ignore
    address: string;

    @OneToMany(type => Classroom, classroom => classroom.faculty)
        //@ts-ignore
    classrooms: Classroom[];

}
