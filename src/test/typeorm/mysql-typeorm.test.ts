import assert from 'assert';
import exceptionMapper from '../../lib/exceptions/exception-mapper';
import { MYSQLDatabase } from '../helpers/database/mysql-database';
import { Repository } from 'typeorm';
import User from '../helpers/modules/mysql/typeorm/users/user.model';
import Pet from '../helpers/modules/mysql/typeorm/pets/pet.model';

describe('MYSQL Typeorm Testing', function () {
  let userRepo: Repository<User>;
  let petRepo: Repository<Pet>;

  before(async function () {
    userRepo = (await MYSQLDatabase.getTypeormInstance()).getRepository(User);
    petRepo = (await MYSQLDatabase.getTypeormInstance()).getRepository(Pet);
  });

  beforeEach(async function () {
    await MYSQLDatabase.seed();
  });

  it('Should violate Unique Constraint.', async function () {
    const userToBeInserted = {
      name: 'Ahmed',
      fname: 'Hassan',
      lname: 'ALi',
      status: 'Active',
      age: 28,
    };
    try {
      await userRepo.save(userToBeInserted);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseTypeORMExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          code: 'DATA_ALREADY_EXIST',
          message: 'data already exist',
        },
      ]);
    }
  });

  it('Should violate Unique Constraint (multi columns).', async function () {
    const userToBeInserted = {
      name: 'Osama',
      fname: 'Ahmed',
      lname: 'Adel',
      status: 'Active',
      age: 28,
    };
    try {
      await userRepo.save(userToBeInserted);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseTypeORMExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          code: 'DATA_ALREADY_EXIST',
          message: 'data already exist',
        },
      ]);
    }
  });

  it('Should violate not nullable Constraint.', async function () {
    const user = {
      name: 'Ahmed',
      fname: 'Hassan',
      lname: 'ALi',
      status: 'Active',
    };
    try {
      await userRepo.save(user);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseTypeORMExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          fields: ['age'],
          code: 'INVALID_DATA',
          message: 'age is invalid',
          details: { reason: 'age must not be NULL' },
        },
      ]);
    }
  });

  it('Should violate Foreign Constraint.', async function () {
    const pet = {
      name: 'Fofa',
      age: 1,
      user_id: 90,
      type: 'Cow',
    };
    try {
      await petRepo.save(pet);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseTypeORMExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          code: 'INVALID_DATA',
          message: 'Invalid data',
          details: {
            reason: 'violates foreign key constraint',
            constraint: 'pet_user_id_foreign',
          },
        },
      ]);
    }
  });

  it('Should violate Foreign Constraint (delete row has reference in another table).', async function () {
    try {
      await userRepo.delete({ name: 'Ahmed' });
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseTypeORMExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          code: 'DATA_HAS_REFERENCE',
          message: 'Data has reference',
          details: {
            reason: 'violates foreign key constraint',
            constraint: 'pet_user_id_foreign',
          },
        },
      ]);
    }
  });
  it('Should violate Check Constraint.', async function () {
    const userToBeInserted: any = {
      name: 'Osama',
      fname: 'Ahmed',
      lname: 'Adel',
      status: 'Active',
      gender: 'fff',
    };
    try {
      await userRepo.save(userToBeInserted);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseTypeORMExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          code: 'INVALID_VALUES',
          message: 'Invalid Values',
        },
      ]);
    }
  });

  it('Should violate Check Constraint.', async function () {
    const userToBeInserted: any = {
      name: 'Osama',
      fname: 'Ahmed',
      lname: 'Adel',
      status: 'Active',
      gender: 'FEMALE',
      age: 999999999999999,
    };
    try {
      await userRepo.save(userToBeInserted);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseTypeORMExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          code: 'OUT_OF_RANGE',
          message: 'Out of range',
        },
      ]);
    }
  });
});
