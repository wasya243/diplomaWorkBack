import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class DoubleLesson {
    @PrimaryGeneratedColumn()
        //@ts-ignore
    id: number;

    @Index({ unique: true })
    @Column()
        //@ts-ignore
    number: number;

    @Index({ unique: true })
    @Column({ type: 'time' })
        //@ts-ignore
    start: string;

    @Index({ unique: true })
    @Column({ type: 'time' })
        //@ts-ignore
    end: string;
}
