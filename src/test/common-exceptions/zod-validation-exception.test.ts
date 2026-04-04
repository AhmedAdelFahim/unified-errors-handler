import assert from 'assert';

import { z } from 'zod';

import { BaseException, ValidationException, ZodValidationException } from '../../index';
import constants from '../../lib/utils/constants';

/** Mirrors [ZodValidationException] mapping for assertions against real Zod issues. */
function expectedFromIssues(issues: z.ZodIssue[]) {
  return issues.map((issue) => {
    const item: { message: string; fields?: string[]; code?: string } = {
      message: issue.message,
    };
    if (issue.path.length > 0) {
      item.fields = issue.path.map((p) => String(p));
    }
    item.code = String(issue.code);
    return item;
  });
}

describe('ZodValidationException', function () {
  it('maps a single Zod issue to serializeErrors()', function () {
    const schema = z.object({
      email: z.string().email(),
    });
    const result = schema.safeParse({ email: 'not-an-email' });
    assert.strictEqual(result.success, false);
    if (result.success) return;

    const err = new ZodValidationException(result.error);
    assert.deepStrictEqual(err.serializeErrors(), expectedFromIssues(result.error.issues));
    assert.strictEqual(err.serializeErrors().length, 1);
    assert.strictEqual(err.serializeErrors()[0].message, result.error.issues[0].message);
  });

  it('maps multiple Zod issues in order', function () {
    const schema = z.object({
      a: z.string(),
      b: z.number(),
    });
    const result = schema.safeParse({});
    assert.strictEqual(result.success, false);
    if (result.success) return;

    const err = new ZodValidationException(result.error);
    console.log(err.serializeErrors(), expectedFromIssues(result.error.issues), result.error.issues,"==========");

    assert.deepStrictEqual(err.serializeErrors(), expectedFromIssues(result.error.issues));
    assert.ok(err.serializeErrors().length >= 2);
  });

  it('returns an empty array when issues is empty (mock; Zod does not emit this)', function () {
    const err = new ZodValidationException({ issues: [] });

    assert.deepStrictEqual(err.serializeErrors(), []);
  });

  it('exposes status code 400 and ValidationException / Error inheritance', function () {
    const schema = z.string().min(5);
    const result = schema.safeParse('hi');
    assert.strictEqual(result.success, false);
    if (result.success) return;

    const err = new ZodValidationException(result.error);

    assert.strictEqual(err.statusCode, constants.HTTP_STATUS_CODES.BAD_REQUEST);
    assert.ok(err instanceof ZodValidationException);
    assert.ok(err instanceof ValidationException);
    assert.ok(err instanceof BaseException);
    assert.ok(err instanceof Error);
    assert.strictEqual(Object.getPrototypeOf(err), ZodValidationException.prototype);
  });

  it('sets the Error message from ValidationException', function () {
    const schema = z.boolean();
    const result = schema.safeParse('not-a-boolean');
    assert.strictEqual(result.success, false);
    if (result.success) return;

    const err = new ZodValidationException(result.error);

    assert.strictEqual(err.message, 'Validation Errors');
  });

  describe('invalid input', function () {
    it('throws when error is undefined', function () {
      assert.throws(
        () => new ZodValidationException(undefined as unknown as { issues: unknown }),
        TypeError,
      );
    });

    it('throws when issues is missing', function () {
      assert.throws(() => new ZodValidationException({} as { issues: unknown[] }), TypeError);
    });
  });
});
