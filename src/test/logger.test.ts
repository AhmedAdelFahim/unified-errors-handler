import bodyParser from 'body-parser';
import express from 'express';
import request from 'supertest';

import { expressExceptionHandler, NotFoundException } from '../index';
import customLogger from './helpers/modules/cutom-logger/custom-logger';

describe('Logger', function () {
  describe('Express Middleware Testing with logging', function () {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.post('/throw-not-found-error', function (req, res) {
      throw new NotFoundException([
        {
          code: 'USER_NOT_FOUND',
          message: 'user not found',
        },
      ]);
    });
    app.use(
      expressExceptionHandler({
        loggerOptions: {
          console: {
            format: ':time :message',
            colored: true,
          },
          custom: customLogger,
        },
      }),
    );
    it('should throw not found error.', function (done) {
      request(app)
        .post('/throw-not-found-error')
        .send({})
        .expect(
          404,
          {
            errors: [
              {
                code: 'USER_NOT_FOUND',
                message: 'user not found',
              },
            ],
          },
          done,
        );
    });
  });
});
