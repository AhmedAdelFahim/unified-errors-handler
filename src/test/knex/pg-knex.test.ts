import assert from 'assert';
import { PostgresDatabase } from '../helpers/database/postgres-database';
import exceptionMapper from '../../lib/exceptions/exception-mapper';
import { UserRepository } from '../helpers/modules/postgres/knex/users/user.repository';
import { PetRepository } from '../helpers/modules/postgres/knex/pets/pet.repository';

describe('Postgres ObjectionJS Testing', function () {
  let userRepo: UserRepository;
  let petRepo: PetRepository;

  before(async function () {
    userRepo = new UserRepository(await PostgresDatabase.getInstance());
    petRepo = new PetRepository(await PostgresDatabase.getInstance());
  });

  beforeEach(async function () {
    await PostgresDatabase.seed();
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
      await userRepo.create(userToBeInserted);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseKnexJSExceptions: true,
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
      await userRepo.create(userToBeInserted);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseKnexJSExceptions: true,
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
      await userRepo.create(user);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseKnexJSExceptions: true,
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
      await petRepo.create(pet);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseKnexJSExceptions: true,
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
        parseKnexJSExceptions: true,
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
      await userRepo.create(userToBeInserted);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseKnexJSExceptions: true,
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
      age: 999999999999999,
    };
    try {
      await userRepo.create(userToBeInserted);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseKnexJSExceptions: true,
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
