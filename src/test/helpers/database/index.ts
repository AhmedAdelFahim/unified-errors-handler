import Knex, { Knex as KnexType } from 'knex';
import { Sequelize } from 'sequelize';
import R from 'ramda';
import { Model } from 'objection';
import { TABLES } from './table.constant';
import * as dotenv from 'dotenv';
import { users } from './data/users.json';
import { pets } from './data/pets.json';

dotenv.config();
export class Database {
  private static _knexInstance: KnexType | null = null;
  private static _sequelizeInstance: Sequelize | null = null;
  private static postgresURL: string = process?.env?.DB_URL || '';
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static async getInstance() {
    if (R.isNil(this._knexInstance)) {
      this._knexInstance = Knex({
        client: 'pg',
        connection: this.postgresURL,
      });
      Model.knex(this._knexInstance);
      return this._knexInstance;
    } else {
      return this._knexInstance;
    }
  }

  static getSequelizeInstance() {
    if (R.isNil(this._sequelizeInstance)) {
      this._sequelizeInstance = new Sequelize(this.postgresURL, {
        logging: false,
      });
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
      table.integer('user_id').references('id').inTable(TABLES.USER).onDelete('RESTRICT').onUpdate('CASCADE');
    });
  }

  static async seed() {
    await (await this.getInstance())?.table(TABLES.PET)?.truncate();
    await (await this.getInstance())?.raw(`TRUNCATE TABLE "${TABLES.USER}" CASCADE;`);

    const userList = await (await this.getInstance())?.table(TABLES.USER)?.insert(users).returning('id');
    await (await this.getInstance())?.table(TABLES.PET)?.insert(
      pets.map((pet) => {
        const clonedPet = JSON.parse(JSON.stringify(pet));
        clonedPet.user_id = userList[clonedPet.user_id - 1].id;
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
