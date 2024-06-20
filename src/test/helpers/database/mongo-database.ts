import R from 'ramda';
import * as dotenv from 'dotenv';
import { users } from './data/users.json';
import mongoose, { Mongoose } from 'mongoose';
import User from '../modules/mongodb/mongoosejs/users/user.model';
import { DataSource } from 'typeorm';

dotenv.config();
export class MongoDatabase {
  private static _mongooseInstance: Mongoose | null = null;
  private static _typeormInstance: DataSource | null = null;
  private static MONGO_DB_URL: string = process?.env?.MONGO_DB_URL || '';
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static async getInstance() {
    if (R.isNil(this._mongooseInstance)) {
      this._mongooseInstance = await mongoose.connect(this.MONGO_DB_URL, {
        dbName: 'unit_test',
        autoIndex: true,
        autoCreate: false,
      });
      return this._mongooseInstance;
    } else {
      return this._mongooseInstance;
    }
  }

  static async cleanCollections() {
    try {
      await User.deleteMany({});
    } catch (e) {
      console.log(e);
    }
  }

  static async seed() {
    await this.cleanCollections();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const userList = await User.create(users);
    // await (await this.getInstance())?.table(TABLES.PET)?.insert(
    //   pets.map((pet) => {
    //     const clonedPet = JSON.parse(JSON.stringify(pet));
    //     clonedPet.user_id = userList[clonedPet.user_id - 1];
    //     return clonedPet;
    //   }),
    // );
  }

  static async init() {
    await this.getInstance();
    await this.seed();
  }

  static async teardown() {
    await (await this.getInstance())?.connection.close();
  }
}
