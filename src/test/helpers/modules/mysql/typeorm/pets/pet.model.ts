import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class Pet {
  @PrimaryColumn('bigint')
  id: number | undefined;
  @Column('varchar')
  name: string | undefined;
  @Column('bigint')
  age: number | undefined;
  @Column('varchar')
  type: string | undefined;
  @Column('bigint')
  user_id: number | undefined;
}
