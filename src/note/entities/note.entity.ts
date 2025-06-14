import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('note')
export class Note{

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({type: 'varchar', length: 255})
    title : string

    @Column({type: 'text'})
    content : string

    @CreateDateColumn()
    creatdAt: Date

    @CreateDateColumn()
    updatedAt: Date
}