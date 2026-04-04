import assert from 'assert';

import Joi from 'joi';

import { BaseException, JoiValidationException, ValidationException } from '../../index';
import constants from '../../lib/utils/constants';

describe('JoiValidationException', function () {
  it('maps a single Joi ValidationError detail to serializeErrors()', function () {
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });
    const { error } = schema.validate({ email: 'not-an-email' });
    assert.ok(error);

    const err = new JoiValidationException(error);
    const expected = error.details.map((d) => ({ message: d.message }));

    assert.deepStrictEqual(err.serializeErrors(), expected);
    assert.strictEqual(err.serializeErrors().length, 1);
    assert.strictEqual(err.serializeErrors()[0].message, error.details[0].message);
  });

  it('maps multiple Joi details in order when abortEarly is false', function () {
    const schema = Joi.object({
      a: Joi.string().required(),
      b: Joi.number().required(),
    });
    const { error } = schema.validate({}, { abortEarly: false });
    assert.ok(error);

    const err = new JoiValidationException(error);
    const expected = error.details.map((d) => ({ message: d.message }));

    assert.deepStrictEqual(err.serializeErrors(), expected);
    assert.ok(err.serializeErrors().length >= 2);
  });

  it('returns an empty array when details is empty (mock; Joi does not emit this)', function () {
    const err = new JoiValidationException({ details: [] });

    assert.deepStrictEqual(err.serializeErrors(), []);
  });

  it('exposes status code 400 and ValidationException / Error inheritance', function () {
    const schema = Joi.string().min(5);
    const { error } = schema.validate('hi');
    assert.ok(error);

    const err = new JoiValidationException(error);

    assert.strictEqual(err.statusCode, constants.HTTP_STATUS_CODES.BAD_REQUEST);
    assert.ok(err instanceof JoiValidationException);
    assert.ok(err instanceof ValidationException);
    assert.ok(err instanceof BaseException);
    assert.ok(err instanceof Error);
    assert.strictEqual(Object.getPrototypeOf(err), JoiValidationException.prototype);
  });

  it('sets the Error message from ValidationException', function () {
    const schema = Joi.boolean();
    const { error } = schema.validate('not-a-boolean');
    assert.ok(error);

    const err = new JoiValidationException(error);

    assert.strictEqual(err.message, 'Validation Errors');
  });

  describe('invalid input', function () {
    it('throws when errors is undefined', function () {
      assert.throws(
        () => new JoiValidationException(undefined as unknown as { details: unknown }),
        TypeError,
      );
    });

    it('throws when details is missing', function () {
      assert.throws(() => new JoiValidationException({} as { details: unknown[] }), TypeError);
    });
  });
});
