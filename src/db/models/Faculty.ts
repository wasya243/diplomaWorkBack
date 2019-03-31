import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

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

}
