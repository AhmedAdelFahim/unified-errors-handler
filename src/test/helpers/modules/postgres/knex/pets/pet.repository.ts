import { BaseRepository, ICreationOptions } from 'objectionjs-repository';

import { IPet } from './pet.interface';
import Pet from './pet.model';
import { TABLES } from '../../../../database/table.constant';
import { IOptions } from 'objectionjs-repository/build/lib/interfaces/commen.interface';

export class PetRepository extends BaseRepository<IPet> {
  constructor(knexInstance: any) {
    super(Pet, knexInstance);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(data: Omit<Partial<IPet>, 'id'>, options?: ICreationOptions | undefined): Promise<IPet> {
    return this.knex().table(TABLES.PET).insert(data);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(conditions: Partial<IPet>, options?: IOptions | undefined): Promise<number> {
    return this.knex().table(TABLES.PET).delete().where(conditions);
  }
}
