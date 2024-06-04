import { BaseRepository } from 'objectionjs-repository';

import { IUser } from './user.interface';
import User from './user.model';

export class UserRepository extends BaseRepository<IUser> {
  constructor(knexInstance: any) {
    super(User, knexInstance);
  }
}
