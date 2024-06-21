import assert from 'assert';
import { PostgresDatabase } from './helpers/database/postgres-database';
import exceptionMapper from '../lib/exceptions/exception-mapper';
import User from './helpers/modules/postgres/typeorm/users/user.model';
import { Repository } from 'typeorm';
import Pet from './helpers/modules/postgres/typeorm/pets/pet.model';

describe('Postgres Typeorm Testing', function () {
  let userRepo: Repository<User>;
  let petRepo: Repository<Pet>;

  before(async function () {
    userRepo = (await PostgresDatabase.getTypeormInstance()).getRepository(User);
    petRepo = (await PostgresDatabase.getTypeormInstance()).getRepository(Pet);
  });

  beforeEach(async function () {
    await PostgresDatabase.seed();
  });

  it('Should violate Unique Constraint.', async function () {
    const user = new User();
    user.name = 'Ahmed';
    user.fname = 'Hassan';
    user.lname = 'ALi';
    user.status = 'Active';
    user.age = 28;
    try {
      await userRepo.save(user);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseTypeORMExceptions: true,
      }).serializeErrors();
      assert.equal(mappedError?.[0]?.fields?.[0], 'name');
      assert.equal(mappedError?.[0]?.code, 'DATA_ALREADY_EXIST');
      assert.equal(mappedError?.[0]?.message, 'name already exist');
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
          fields: ['fname', 'lname'],
          code: 'DATA_ALREADY_EXIST',
          message: 'fname, lname already exist',
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
      await userRepo.delete({
        name: 'Ahmed',
      });
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
      gender: 'MALEE',
      age: 23,
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
          details: {
            constraint: 'user_gender_check',
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
      gender: 'FEMALE',
      age: '9999999999999999999999999999',
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
