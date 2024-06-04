import { BaseRepository } from 'objectionjs-repository';

import { IPet } from './pet.interface';
import Pet from './pet.model';

export class PetRepository extends BaseRepository<IPet> {
  constructor(knexInstance: any) {
    super(Pet, knexInstance);
  }
}
