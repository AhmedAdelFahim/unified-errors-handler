import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class User {
  @PrimaryColumn('bigint')
  id: number | undefined;
  @Column('varchar')
  name: string | undefined;
  @Column('varchar')
  fname: string | undefined;
  @Column('varchar')
  lname: string | undefined;
  @Column('varchar')
  status: string | undefined;
  @Column('enum', {
    enum: ['MALE', 'FEMALE'],
  })
  gender: 'MALE' | 'FEMALE' | undefined;
  @Column('bigint')
  age: number | undefined;
  @Column('varchar')
  email: string | undefined;
}
