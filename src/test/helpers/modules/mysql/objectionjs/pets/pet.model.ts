import { Model } from 'objection';
import { TABLES } from '../../../../database/table.constant';

export default class Pet extends Model {
  static get tableName() {
    return TABLES.PET;
  }
}
