import { Model } from 'objection';
import { TABLES } from '../../../../database/table.constant';

export default class User extends Model {
  static get tableName() {
    return TABLES.USER;
  }
}
