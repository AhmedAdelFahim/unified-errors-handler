import assert from 'assert';
import exceptionMapper from '../lib/exceptions/exception-mapper';
import { MYSQLDatabase } from './helpers/database/mysql-database';
import { PetRepository } from './helpers/modules/mysql/objectionjs/pets/pet.repository';
import { UserRepository } from './helpers/modules/mysql/objectionjs/users/user.repository';

describe('MYSQL ObjectionJS Testing', function () {
  let userRepo: UserRepository;
  let petRepo: PetRepository;

  before(async function () {
    userRepo = new UserRepository(await MYSQLDatabase.getInstance());
    petRepo = new PetRepository(await MYSQLDatabase.getInstance());
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
      await userRepo.create(userToBeInserted);
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        mapDBExceptions: true,
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
      await userRepo.create(userToBeInserted);
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        mapDBExceptions: true,
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
      await userRepo.create(user);
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        mapDBExceptions: true,
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
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        mapDBExceptions: true,
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
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        mapDBExceptions: true,
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
  // it('Should violate Check Constraint.', async function () {
  //   const userToBeInserted: any = {
  //     name: 'Osama',
  //     fname: 'Ahmed',
  //     lname: 'Adel',
  //     status: 'Active',
  //     gender: 'fff',
  //     age: 43,
  //   };
  //   try {
  //     await userRepo.create(userToBeInserted);
  //   } catch (e) {
  //     console.log(e)
  //     const mappedError = exceptionMapper(e, {
  //       mapDBExceptions: true,
  //     }).serializeErrors();
  //     assert.deepEqual(mappedError, [
  //       {
  //         code: 'INVALID_VALUES',
  //         message: 'Invalid Values',
  //         details: {
  //           constraint: 'user_gender_check',
  //         },
  //       },
  //     ]);
  //   }
  // });
});
