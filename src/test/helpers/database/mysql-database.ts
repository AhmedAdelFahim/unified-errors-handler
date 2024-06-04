import Knex, { Knex as KnexType } from 'knex';
import { Sequelize } from 'sequelize';
import R from 'ramda';
import { Model } from 'objection';
import { TABLES } from './table.constant';
import * as dotenv from 'dotenv';
import { users } from './data/users.json';
import { pets } from './data/pets.json';

dotenv.config();
export class MYSQLDatabase {
  private static _knexInstance: KnexType | null = null;
  private static _sequelizeInstance: Sequelize | null = null;
  private static dbHost: string = process?.env?.MYSQL_HOST || '';
  private static dbPort: string = process?.env?.MYSQL_PORT || '';
  private static dbPassword: string = process?.env?.MYSQL_PASSWORD || '';
  private static dbName: string = process?.env?.MYSQL_DB || '';
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static async getInstance() {
    if (R.isNil(this._knexInstance)) {
      this._knexInstance = Knex({
        client: 'mysql2',
        connection: 'mysql://r00t:r00t@0.0.0.0:3308/unit_test',
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
      this._sequelizeInstance = new Sequelize('mysql://r00t:r00t@0.0.0.0:3308/unit_test');
      return this._sequelizeInstance;
    } else {
      return this._sequelizeInstance;
    }
  }

  static async initSchema() {
    await (await this.getInstance())?.schema.dropTableIfExists(TABLES.PET);
    await (await this.getInstance())?.schema.dropTableIfExists(TABLES.USER);
    await (
      await this.getInstance()
    )?.schema.createTable(TABLES.USER, (table: any) => {
      table.increments('id');
      table.string('name').unique();
      table.string('fname');
      table.string('lname');
      table.integer('age').notNullable();
      table.string('status').notNullable();
      table.string('email').defaultTo(null);
      table.unique(['fname', 'lname'], {
        indexName: 'fname_lname_unique_index',
      });
    });

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
  }

  static async seed() {
    await (await this.getInstance())?.table(TABLES.PET)?.truncate();
    await (await this.getInstance())?.raw(`SET FOREIGN_KEY_CHECKS = 0; `);
    await (await this.getInstance())?.raw(`TRUNCATE TABLE ${TABLES.USER};`);
    await (await this.getInstance())?.raw(`SET FOREIGN_KEY_CHECKS = 1;`);

    const userList = await (await this.getInstance())?.table(TABLES.USER)?.insert(users);
    await (await this.getInstance())?.table(TABLES.PET)?.insert(
      pets.map((pet) => {
        const clonedPet = JSON.parse(JSON.stringify(pet));
        clonedPet.user_id = userList[clonedPet.user_id - 1];
        return clonedPet;
      }),
    );
  }

  static async init() {
    await this.initSchema();
    await this.seed();
  }

  static async teardown() {
    await (await this.getInstance())?.destroy();
    await this.getSequelizeInstance().close();
  }
}
