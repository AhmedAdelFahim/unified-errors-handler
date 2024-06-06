import { BaseRepository, ICreationOptions } from 'objectionjs-repository';

import { IUser } from './user.interface';
import User from './user.model';
import { TABLES } from '../../../../database/table.constant';
import { IOptions } from 'objectionjs-repository/build/lib/interfaces/commen.interface';

export class UserRepository extends BaseRepository<IUser> {
  constructor(knexInstance: any) {
    super(User, knexInstance);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(data: Omit<Partial<IUser>, 'id'>, options?: ICreationOptions | undefined): Promise<IUser> {
    return this.knex().table(TABLES.USER).insert(data);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(conditions: Partial<IUser>, options?: IOptions | undefined): Promise<number> {
    return this.knex().table(TABLES.USER).delete().where(conditions);
  }
}
