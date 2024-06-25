import assert from 'assert';
import exceptionMapper from '../../lib/exceptions/exception-mapper';
import { MongoDatabase } from '../helpers/database/mongo-database';
import User from '../helpers/modules/mongodb/mongoosejs/users/user.model';

describe('MongoDB Mongoose Testing', function () {
  beforeEach(async function () {
    await MongoDatabase.seed();
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
      await User.create(userToBeInserted);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseMongooseExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          fields: ['name'],
          values: ['Ahmed'],
          code: 'DATA_ALREADY_EXIST',
          message: 'name already exist',
        },
      ]);
    }
  });

  it('Should violate Unique Constraint  (multi columns).', async function () {
    const userToBeInserted = {
      name: 'Osama',
      fname: 'Ahmed',
      lname: 'Adel',
      status: 'Active',
      age: 28,
    };
    try {
      await User.create(userToBeInserted);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseMongooseExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          fields: ['lname', 'fname'],
          values: ['Adel', 'Ahmed'],
          code: 'DATA_ALREADY_EXIST',
          message: 'lname, fname already exist',
        },
      ]);
    }
  });

  it('Should violate required validation. (one column with custom message)', async function () {
    const user = {
      name: 'Akin',
      fname: 'Hassan',
      lname: 'ALi',
      age: 30,
    };
    try {
      await User.create(user);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseMongooseExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          fields: ['status'],
          message: 'status is required',
          code: 'MONGODB_VALIDATION_ERROR',
          details: { reason: 'status is required', violate: 'required_validation' },
        },
      ]);
    }
  });

  it('Should violate required validation. (one column with default message)', async function () {
    const user = {
      name: 'Akin',
      fname: 'Hassan',
      lname: 'ALi',
      status: 'Active',
    };
    try {
      await User.create(user);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseMongooseExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          fields: ['age'],
          message: 'Path `age` is required.',
          code: 'MONGODB_VALIDATION_ERROR',
          details: { reason: 'age is required', violate: 'required_validation' },
        },
      ]);
    }
  });

  it('Should violate required validation. (multiple columns)', async function () {
    const user = {
      name: 'Akin',
      fname: 'Hassan',
      lname: 'ALi',
    };
    try {
      await User.create(user);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseMongooseExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          fields: ['status'],
          message: 'status is required',
          code: 'MONGODB_VALIDATION_ERROR',
          details: { reason: 'status is required', violate: 'required_validation' },
        },
        {
          fields: ['age'],
          message: 'Path `age` is required.',
          code: 'MONGODB_VALIDATION_ERROR',
          details: { reason: 'age is required', violate: 'required_validation' },
        },
      ]);
    }
  });

  it('Should violate enum validation. (one column with custom message)', async function () {
    const user = {
      name: 'Akin',
      fname: 'Hassan',
      lname: 'ALi',
      status: 'Active',
      age: 30,
      blood_type: 'C',
    };
    try {
      await User.create(user);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseMongooseExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          fields: ['blood_type'],
          message: 'invalid blood type',
          code: 'MONGODB_VALIDATION_ERROR',
          details: { reason: "blood_type's value must be one of A, B, A+", violate: 'enum_validation' },
        },
      ]);
    }
  });

  it('Should violate enum validation. (one column with default message)', async function () {
    const user = {
      name: 'Akin',
      fname: 'Hassan',
      lname: 'ALi',
      status: 'Active',
      age: 30,
      blood_type: 'A',
      gender: 'MALEE',
    };
    try {
      await User.create(user);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseMongooseExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          fields: ['gender'],
          message: '`MALEE` is not a valid enum value for path `gender`.',
          code: 'MONGODB_VALIDATION_ERROR',
          details: { reason: "gender's value must be one of MALE, FEMALE", violate: 'enum_validation' },
        },
      ]);
    }
  });

  it('Should violate enum validation. (multiple columns)', async function () {
    const user = {
      name: 'Akin',
      fname: 'Hassan',
      lname: 'ALi',
      status: 'Active',
      age: 30,
      blood_type: 'Ap',
      gender: 'MALEE',
    };
    try {
      await User.create(user);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseMongooseExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          fields: ['gender'],
          message: '`MALEE` is not a valid enum value for path `gender`.',
          code: 'MONGODB_VALIDATION_ERROR',
          details: { reason: "gender's value must be one of MALE, FEMALE", violate: 'enum_validation' },
        },
        {
          fields: ['blood_type'],
          message: 'invalid blood type',
          code: 'MONGODB_VALIDATION_ERROR',
          details: { reason: "blood_type's value must be one of A, B, A+", violate: 'enum_validation' },
        },
      ]);
    }
  });

  it('Should violate enum validation and required validation.', async function () {
    const user = {
      name: 'Akin',
      fname: 'Hassan',
      lname: 'ALi',
      status: 'Active',
      // age: 30,
      blood_type: 'A',
      gender: 'MALEE',
    };
    try {
      await User.create(user);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseMongooseExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          fields: ['age'],
          message: 'Path `age` is required.',
          code: 'MONGODB_VALIDATION_ERROR',
          details: { reason: 'age is required', violate: 'required_validation' },
        },
        {
          fields: ['gender'],
          message: '`MALEE` is not a valid enum value for path `gender`.',
          code: 'MONGODB_VALIDATION_ERROR',
          details: { reason: "gender's value must be one of MALE, FEMALE", violate: 'enum_validation' },
        },
      ]);
    }
  });

  it('Should violate max validation. (one column)', async function () {
    const user = {
      name: 'Akin',
      fname: 'Hassan',
      lname: 'ALi',
      status: 'Active',
      age: 300,
      gender: 'MALE',
      blood_type: 'A',
    };
    try {
      await User.create(user);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseMongooseExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          fields: ['age'],
          message: 'Path `age` (300) is more than maximum allowed value (50).',
          code: 'MONGODB_VALIDATION_ERROR',
          details: { reason: `age's value exceed maximum allowed value (50)`, violate: 'max_validation' },
        },
      ]);
    }
  });

  it('Should violate min validation. (one column)', async function () {
    const user = {
      name: 'Akin',
      fname: 'Hassan',
      lname: 'ALi',
      status: 'Active',
      age: 3,
      gender: 'MALE',
      blood_type: 'A',
    };
    try {
      await User.create(user);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseMongooseExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          fields: ['age'],
          message: 'Path `age` (3) is less than minimum allowed value (20).',
          code: 'MONGODB_VALIDATION_ERROR',
          details: { reason: `age's value less than minimum allowed value (20)`, violate: 'min_validation' },
        },
      ]);
    }
  });

  it('Should violate cast validation. (one column)', async function () {
    const user = {
      name: 'Akin',
      fname: 'Hassan',
      lname: 'ALi',
      status: 'Active',
      age: 'age',
      gender: 'MALE',
      blood_type: 'A',
    };
    try {
      await User.create(user);
      throw new Error('Database error must be fired.');
    } catch (e) {
      const mappedError = exceptionMapper(e, {
        parseMongooseExceptions: true,
      }).serializeErrors();
      assert.deepEqual(mappedError, [
        {
          fields: ['age'],
          message: 'age is invalid',
          code: 'MONGODB_CASTING_ERROR',
        },
      ]);
    }
  });
});
