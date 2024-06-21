import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class User {
  @PrimaryColumn('bigint')
  id: number | undefined;
  @Column('character varying')
  name: string | undefined;
  @Column('character varying')
  fname: string | undefined;
  @Column('enum', {
    enum: ['MALE', 'FEMALE'],
  })
  gender: 'MALE' | 'FEMALE' | undefined;
  @Column('character varying')
  lname: string | undefined;
  @Column('character varying')
  status: string | undefined;
  @Column('integer')
  age: number | undefined;
  @Column('character varying')
  email: string | undefined;
}
