import R from 'ramda';
import * as dotenv from 'dotenv';
import { users } from './data/users.json';
// import { pets } from './data/pets.json';
import mongoose, { Mongoose } from 'mongoose';
import User from '../modules/mongodb/mongoosejs/users/user.model';

dotenv.config();
export class MongoDatabase {
  private static _mongooseInstance: Mongoose | null = null;
  private static MONGO_DB_URL: string = process?.env?.MONGO_DB_URL || '';
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static async getInstance() {
    if (R.isNil(this._mongooseInstance)) {
      this._mongooseInstance = await mongoose.connect(this.MONGO_DB_URL, {
        dbName: 'unit_test',
      });
      return this._mongooseInstance;
    } else {
      return this._mongooseInstance;
    }
  }

  static async initSchema() {
    (await this.getInstance()).connection.dropCollection('users');
  }

  static async seed() {
    await (await this.getInstance()).connection.dropCollection('users');
    const userList = await User.create(users);
    console.log(userList);
    // await (await this.getInstance())?.table(TABLES.PET)?.insert(
    //   pets.map((pet) => {
    //     const clonedPet = JSON.parse(JSON.stringify(pet));
    //     clonedPet.user_id = userList[clonedPet.user_id - 1];
    //     return clonedPet;
    //   }),
    // );
  }

  static async init() {
    await this.initSchema();
    await this.seed();
  }

  static async teardown() {
    await (await this.getInstance())?.connection.close();
  }
}
