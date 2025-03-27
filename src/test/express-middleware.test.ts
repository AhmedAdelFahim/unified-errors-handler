/* eslint-disable @typescript-eslint/no-unused-vars */
import bodyParser from 'body-parser';
import express from 'express';
import request from 'supertest';

import {
  BadRequestException,
  expressExceptionHandler,
  ForbiddenException,
  NotFoundException,
  ServerException,
  UnauthorizedException,
  ValidationException,
} from '../index';
import constants from '../lib/utils/constants';

describe('Express Middleware Testing', function () {
  describe('Express Middleware Testing - default errors', function () {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.post('/throw-not-found-error', function (req, res) {
      throw new NotFoundException();
    });

    app.post('/throw-not-authorized-error', function (req, res) {
      throw new UnauthorizedException();
    });

    app.post('/throw-bad-request-error', function (req, res) {
      throw new BadRequestException();
    });

    app.post('/throw-forbidden-error', function (req, res) {
      throw new ForbiddenException();
    });

    app.post('/throw-internal-server-error', function (req, res) {
      throw new ServerException();
    });

    app.use(expressExceptionHandler());
    it('should throw not found error.', function (done) {
      request(app)
        .post('/throw-not-found-error')
        .send({})
        .expect(
          404,
          {
            errors: [
              {
                code: constants.ERROR_CODES.NOT_FOUND,
                message: 'Not Found',
              },
            ],
          },
          done,
        );
    });

    it('should throw not authorized error.', function (done) {
      request(app)
        .post('/throw-not-authorized-error')
        .send({})
        .expect(
          401,
          {
            errors: [
              {
                message: 'Unauthorized',
                code: constants.ERROR_CODES.UNAUTHORIZED,
              },
            ],
          },
          done,
        );
    });

    it('should throw bad request error.', function (done) {
      request(app)
        .post('/throw-bad-request-error')
        .send({})
        .expect(
          400,
          {
            errors: [
              {
                message: 'Bad request',
                code: constants.ERROR_CODES.BAD_REQUEST,
              },
            ],
          },
          done,
        );
    });

    it('should throw forbidden error.', function (done) {
      request(app)
        .post('/throw-forbidden-error')
        .send({})
        .expect(
          403,
          {
            errors: [
              {
                code: constants.ERROR_CODES.FORBIDDEN,
                message: 'Forbidden',
              },
            ],
          },
          done,
        );
    });

    it('should throw internal server error.', function (done) {
      request(app)
        .post('/throw-internal-server-error')
        .send({})
        .expect(
          500,
          {
            errors: [
              {
                message: 'Internal Server Error',
                code: constants.ERROR_CODES.INTERNAL_SERVER_ERROR,
              },
            ],
          },
          done,
        );
    });
  });

  describe('Express Middleware Testing - custom errors', function () {
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

    app.post('/throw-validation-errors', function (req, res) {
      throw new ValidationException([
        {
          code: 'NAME_REQUIRED',
          message: 'name is required',
          fields: ['name'],
        },
        {
          code: 'PASSWORD_MIN_LENGTH',
          message: 'password must be at least 8 characters',
          fields: ['password'],
        },
      ]);
    });

    app.post('/throw-not-authorized-error', function (req, res) {
      throw new UnauthorizedException({
        code: 'USER_NOT_AUTHORIZED',
        message: 'user not authorized',
      });
    });

    app.post('/throw-bad-request-error', function (req, res) {
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'bad request',
      });
    });

    app.post('/throw-forbidden-error', function (req, res) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Forbidden',
      });
    });

    app.post('/throw-internal-server-error', function (req, res) {
      throw new ServerException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'internal server error',
      });
    });

    app.use(expressExceptionHandler());
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

    it('should throw not authorized error.', function (done) {
      request(app)
        .post('/throw-not-authorized-error')
        .send({})
        .expect(
          401,
          {
            errors: [
              {
                code: 'USER_NOT_AUTHORIZED',
                message: 'user not authorized',
              },
            ],
          },
          done,
        );
    });

    it('should throw bad request error.', function (done) {
      request(app)
        .post('/throw-bad-request-error')
        .send({})
        .expect(
          400,
          {
            errors: [
              {
                code: 'BAD_REQUEST',
                message: 'bad request',
              },
            ],
          },
          done,
        );
    });

    it('should throw forbidden error.', function (done) {
      request(app)
        .post('/throw-forbidden-error')
        .send({})
        .expect(
          403,
          {
            errors: [
              {
                code: 'FORBIDDEN',
                message: 'Forbidden',
              },
            ],
          },
          done,
        );
    });

    it('should throw internal server error.', function (done) {
      request(app)
        .post('/throw-internal-server-error')
        .send({})
        .expect(
          500,
          {
            errors: [
              {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'internal server error',
              },
            ],
          },
          done,
        );
    });

    it('should throw validation errors.', function (done) {
      request(app)
        .post('/throw-validation-errors')
        .send({})
        .expect(
          400,
          {
            errors: [
              {
                code: 'NAME_REQUIRED',
                message: 'name is required',
                fields: ['name'],
              },
              {
                code: 'PASSWORD_MIN_LENGTH',
                message: 'password must be at least 8 characters',
                fields: ['password'],
              },
            ],
          },
          done,
        );
    });
  });
});
