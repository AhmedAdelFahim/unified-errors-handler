import Knex, { Knex as KnexType } from 'knex';
import { Sequelize } from 'sequelize';
import R from 'ramda';
import { Model } from 'objection';
import { TABLES } from './table.constant';
import * as dotenv from 'dotenv';
import { users } from './data/users.json';
import { pets } from './data/pets.json';
import { DataSource } from 'typeorm';
import User from '../modules/mysql/typeorm/users/user.model';
import Pet from '../modules/mysql/typeorm/pets/pet.model';

dotenv.config();
export class MYSQLDatabase {
  private static _knexInstance: KnexType | null = null;
  private static _sequelizeInstance: Sequelize | null = null;
  private static _typeormInstance: DataSource | null = null;
  private static MYSQL_DB_URL: string = process?.env?.MYSQL_DB_URL || '';
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static async getInstance() {
    if (R.isNil(this._knexInstance)) {
      this._knexInstance = Knex({
        client: 'mysql2',
        connection: this.MYSQL_DB_URL,
      });
      Model.knex(this._knexInstance);
      return this._knexInstance;
    } else {
      Model.knex(this._knexInstance);
      return this._knexInstance;
    }
  }

  static getSequelizeInstance() {
    if (R.isNil(this._sequelizeInstance)) {
      this._sequelizeInstance = new Sequelize(this.MYSQL_DB_URL, {
        logging: false,
      });
      return this._sequelizeInstance;
    } else {
      return this._sequelizeInstance;
    }
  }

  static async getTypeormInstance() {
    if (R.isNil(this._typeormInstance)) {
      this._typeormInstance = new DataSource({
        type: 'mysql',
        url: this.MYSQL_DB_URL,
        entities: [User, Pet],
        logging: false,
      });
      await this._typeormInstance.initialize();
      return this._typeormInstance;
    } else {
      return this._typeormInstance;
    }
  }

  static async initSchema() {
    console.log('Creating tables');
    await (await this.getInstance())?.schema.dropTableIfExists(TABLES.PET);
    console.log('Dropped table PET');
    await (await this.getInstance())?.schema.dropTableIfExists(TABLES.USER);
    console.log('Dropped table USER');
    await (
      await this.getInstance()
    )?.schema.createTable(TABLES.USER, (table: any) => {
      table.increments('id');
      table.string('name').unique();
      table.string('fname');
      table.string('lname');
      table.integer('age').notNullable();
      table.string('status').notNullable();
      table.enu('gender', ['MALE', 'FEMALE']);
      table.enu('blood_type', ['A', 'B', 'A+']);
      table.string('email').defaultTo(null);
      table.unique(['fname', 'lname'], {
        indexName: 'fname_lname_unique_index',
      });
    });
    console.log('Created table USER');
    await (
      await this.getInstance()
    )?.schema.createTable(TABLES.PET, (table: any) => {
      table.increments('id');
      table.string('name');
      table.integer('age');
      table.string('type');
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable(TABLES.USER)
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');
    });
    console.log('Created table PET');
  }

  static async seed() {
    await (await this.getInstance())?.table(TABLES.PET)?.truncate();
    console.log('Truncated table PET');
    await (await this.getInstance())?.raw(`SET FOREIGN_KEY_CHECKS = 0; `);
    console.log('Disabled foreign key checks');
    await (await this.getInstance())?.raw(`TRUNCATE TABLE ${TABLES.USER};`);
    console.log('Truncated table USER');
    await (await this.getInstance())?.raw(`SET FOREIGN_KEY_CHECKS = 1;`);
    console.log('Enabled foreign key checks');
    const userList = await (await this.getInstance())?.table(TABLES.USER)?.insert(users);
    console.log('Seeded table USER');
    await (await this.getInstance())?.table(TABLES.PET)?.insert(
      pets.map((pet) => {
        const clonedPet = JSON.parse(JSON.stringify(pet));
        clonedPet.user_id = userList[clonedPet.user_id - 1];
        return clonedPet;
      }),
    );
    console.log('Seeded table PET');
  }

  static async init() {
    await this.initSchema();
    await this.seed();
  }

  static async teardown() {
    await (await this.getInstance())?.destroy();
    await this.getSequelizeInstance().close();
    await (await this.getTypeormInstance()).destroy();
  }
}
