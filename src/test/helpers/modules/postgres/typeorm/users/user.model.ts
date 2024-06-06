import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class User {
  // constructor(u: any) {
  //   this.name = u?.name;
  //   this.age = u?.age;
  //   this.fname = u?.fname;
  //   this.lname = u?.lname;
  //   this.status = u?.status;
  //   this.email = u?.email;
  // }
  @PrimaryColumn('bigint')
  id: number | undefined;
  @Column('character varying')
  name: string | undefined;
  @Column('character varying')
  fname: string | undefined;
  @Column('character varying')
  lname: string | undefined;
  @Column('character varying')
  status: string | undefined;
  @Column('bigint')
  age: number | undefined;
  @Column('character varying')
  email: string | undefined;
}
