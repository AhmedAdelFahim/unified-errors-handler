# Unified Errors Handler

Tired of writing the same error middleware in every Node.js project?
Unified Errors Handler gives you consistent, structured error responses across Express, NestJS, and every major ORM — in one line of setup.

[Latest Stable Version](https://www.npmjs.com/package/unified-errors-handler)
GitHub License
[NPM Downloads](https://www.npmjs.com/package/unified-errors-handler)
[NPM Downloads](https://www.npmjs.com/package/unified-errors-handler)

> Unified Errors Handler simplifies error handling in Node.js, Express, and NestJS. Supports Sequelize, TypeORM, Objection.js, Mongoose, and Knex.js.

## [Full Documentation](https://nodejs-unified-errors-handler-docs.vercel.app/)

## Content

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Why Unified Errors Handler?](#why-unified-errors-handler)
4. [Features](#features)
5. [How to Use](#how-to-use)
  1. [ExpressJS Middleware](#expressjs-middleware)
  2. [Custom ExpressJS Middleware](#custom-expressjs-middleware)
  3. [NestJS Exception Filter](#nestjs-exception-filter)
  4. [Options](#options)
6. [Errors Structure](#errors-structure)
7. [General Exceptions](#general-exceptions)
8. [SQL Database Exceptions](#sql-database-exceptions)
9. [NoSQL Database Exceptions](#nosql-database-exceptions)
10. [Custom Exceptions](#custom-exceptions)
11. [Joi and Zod Validation](#joi-and-zod-validation)
12. [Logging](#logging)
13. [TypeScript Usage](#typescript-usage)
14. [Supported Databases and ORMs](#supported-databases-and-orms)
15. [Tests](#tests)
16. [Changelog](#changelog)
17. [Support and Suggestions](#support-and-suggestions)
18. [License](#license)

---

## Requirements

- Node.js >= 14
- Works with CommonJS (`require`) and ESM (`import`)
- TypeScript 4.x+ (optional but fully supported)

---

## Installation

```bash
npm install unified-errors-handler
```

---

## Why Unified Errors Handler?

**Without unified-errors-handler** — every project ends up with something like this:

```js
app.use((err, req, res, next) => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: err.errors[0].message });
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    // more special cases...
  } else if (err.name === 'ValidationError') {
    // mongoose case...
  }
  // 50 more lines per project...
});
```

**With unified-errors-handler:**

```js
app.use(expressExceptionHandler({ parseSequelizeExceptions: true }));
```

---

## Features

- ✅ Express middleware & NestJS exception filter
- ✅ Supports Sequelize, TypeORM, ObjectionJS, KnexJS, Mongoose
- ✅ Consistent `{ errors: [...] }` response shape across all error types
- ✅ Built-in Joi and Zod validation helpers (`JoiValidationException`, `ZodValidationException`)
- ✅ Custom exception support via `BaseException`
- ✅ Built-in logging with custom logger support
- ✅ Zero config for non-DB errors
- ✅ Full TypeScript support

---

## How to Use

### ExpressJS Middleware

```js
const express = require('express');
const { expressExceptionHandler, NotFoundException } = require('unified-errors-handler');

const app = express();

app.post('/users/:id', function (req, res) {
  const user = // ...
  if (!user) {
    throw new NotFoundException([{ code: 'USER_NOT_FOUND', message: 'User not found' }]);
  }
  res.json(user);
});

// Add as the last middleware
app.use(expressExceptionHandler());

/**
 * Response in case of error:
 * HTTP 404
 * {
 *   "errors": [{ "code": "USER_NOT_FOUND", "message": "User not found" }]
 * }
 */
```

### Custom ExpressJS Middleware

```js
const express = require('express');
const { exceptionMapper, NotFoundException } = require('unified-errors-handler');

const app = express();

app.post('/users/:id', function (req, res) {
  const user = // ...
  if (!user) {
    throw new NotFoundException([{ code: 'USER_NOT_FOUND', message: 'User not found' }]);
  }
  res.json(user);
});

app.use((err, req, res, next) => {
  const mappedError = exceptionMapper(err);
  res.status(mappedError.statusCode).send({
    errors: mappedError.serializeErrors(),
  });
});
```

### NestJS Exception Filter

**Step 1 — Create the filter:**

```typescript
import { exceptionMapper } from 'unified-errors-handler';
import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const error = exceptionMapper(exception);
    response.status(error.statusCode).json({
      errors: error.serializeErrors(),
    });
  }
}
```

**Step 2 — Register the filter in `main.ts`:**

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
bootstrap();
```

### Options

Enable ORM-specific error parsing (disabled by default). Pass options to either `expressExceptionHandler` or `exceptionMapper`:

```js
const options = {
  parseSequelizeExceptions: true,   // enable Sequelize error parsing
  parseMongooseExceptions: true,    // enable Mongoose error parsing
  parseTypeORMExceptions: true,     // enable TypeORM error parsing
  parseObjectionJSExceptions: true, // enable ObjectionJS error parsing
  parseKnexJSExceptions: false,     // enable KnexJS error parsing
};

// Express
app.use(expressExceptionHandler(options));

// Manual
const mappedError = exceptionMapper(err, options);
```

> ⚠️ `mapDBExceptions` has been removed. Use the specific options above instead.

---

## Errors Structure

All errors are serialized into a consistent shape:

```js
{
  errors: [
    {
      fields: ['name', 'password'],  // optional — which fields caused the error
      code: 'YOUR_ERROR_CODE',       // optional — machine-readable code
      message: 'Human readable message',
      details: {                     // optional — additional context
        reason: '...',
      },
    }
  ]
}
```

---

## General Exceptions

### BadRequestException

Status code: **400**

```js
throw new BadRequestException({
  fields: ['password'],       // optional
  code: 'INVALID_PASSWORD',   // optional
  message: 'Invalid password',
  details: {                  // optional
    // additional context
  },
});
```

### UnauthorizedException

Status code: **401**

```js
throw new UnauthorizedException({
  code: 'UNAUTHORIZED',
  message: 'You are not authorized',
});
```

### ForbiddenException

Status code: **403**

```js
throw new ForbiddenException({
  code: 'FORBIDDEN',
  message: 'You do not have access to this resource',
});
```

### NotFoundException

Status code: **404**

```js
throw new NotFoundException([
  {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
  },
]);
```

### ServerException

Status code: **500**

```js
throw new ServerException();
```

---

## SQL Database Exceptions

These are automatically mapped when ORM parsing is enabled. Below are the response shapes.

### UniqueViolationException

Status code: **400**

```js
// Response
[{
  fields: ['name'],
  code: 'DATA_ALREADY_EXIST',
  message: 'name already exist',
}]
```

### ForeignKeyViolationException

Status code: **400**

```js
// Inserting a row with a foreign key that does not exist
[{
  code: 'INVALID_DATA',
  message: 'Invalid data',
  details: {
    reason: 'violates foreign key constraint',
    constraint: 'pet_user_id_foreign',
  },
}]

// Deleting a row that is still referenced by another table
[{
  code: 'DATA_HAS_REFERENCE',
  message: 'Data has reference',
  details: {
    reason: 'violates foreign key constraint',
    constraint: 'pet_user_id_foreign',
  },
}]
```

### NotNullViolationException

Status code: **400**

```js
// Response
[{
  fields: ['age'],
  code: 'INVALID_DATA',
  message: 'age is invalid',
  details: { reason: 'age must not be NULL' },
}]
```

### CheckViolationException

Status code: **400** — example: invalid enum value

```js
// Response
[{
  code: 'INVALID_VALUES',
  message: 'Invalid Values',
  details: {
    constraint: 'user_gender_check',
  },
}]
```

### OutOfRangeViolationException

Status code: **400** — example: numeric value out of range

```js
// Response
[{
  code: 'OUT_OF_RANGE',
  message: 'Out of range',
}]
```

---

## NoSQL Database Exceptions

### MongoDBUniqueViolationException

Status code: **400**

```js
// Response
[{
  fields: ['name'],
  values: ['Ahmed'],
  code: 'DATA_ALREADY_EXIST',
  message: 'name already exist',
}]
```

### MongooseValidationException

Status code: **400**

```js
// Required field missing
[{
  fields: ['age'],
  message: 'Path `age` is required.',
  code: 'MONGODB_VALIDATION_ERROR',
  details: { reason: 'age is required', violate: 'required_validation' },
}]

// Enum violation
[{
  fields: ['gender'],
  message: '`MALEE` is not a valid enum value for path `gender`.',
  code: 'MONGODB_VALIDATION_ERROR',
  details: { reason: "gender's value must be one of MALE, FEMALE", violate: 'enum_validation' },
}]

// Max value exceeded
[{
  fields: ['age'],
  message: 'Path `age` (300) is more than maximum allowed value (50).',
  code: 'MONGODB_VALIDATION_ERROR',
  details: { reason: "age's value exceed maximum allowed value (50)", violate: 'max_validation' },
}]

// Below min value
[{
  fields: ['age'],
  message: 'Path `age` (3) is less than minimum allowed value (20).',
  code: 'MONGODB_VALIDATION_ERROR',
  details: { reason: "age's value less than minimum allowed value (20)", violate: 'min_validation' },
}]

// Type casting error
[{
  fields: ['age'],
  message: 'age is invalid',
  code: 'MONGODB_CASTING_ERROR',
}]
```

---

## Custom Exceptions

Extend `BaseException` to create your own domain-specific exceptions that integrate seamlessly with the handler:

```typescript
import { BaseException } from 'unified-errors-handler';

export class PaymentFailedException extends BaseException {
  statusCode = 402;

  constructor(private reason: string) {
    super(reason);
    Object.setPrototypeOf(this, PaymentFailedException.prototype);
  }

  serializeErrors() {
    return [{
      message: this.reason,
      code: 'PAYMENT_FAILED',
    }];
  }
}

// Usage
throw new PaymentFailedException('Card declined');
```

---

## Joi and Zod Validation

Both helpers extend `ValidationException` (HTTP 400) and map library-specific errors into the unified `errors` array. Joi and Zod are not bundled — install them separately and pass their native error objects into the constructors.

### JoiValidationException

```js
const Joi = require('joi');
const { JoiValidationException } = require('unified-errors-handler');

const schema = Joi.object({ email: Joi.string().email().required() });
const { error } = schema.validate(req.body);
if (error) {
  throw new JoiValidationException(error);
}
```

### ZodValidationException

```js
const { z } = require('zod');
const { ZodValidationException } = require('unified-errors-handler');

const schema = z.object({ email: z.string().email() });
const result = schema.safeParse(req.body);
if (!result.success) {
  throw new ZodValidationException(result.error);
}
```

---

## Logging

### Console Logger

```js
const options = {
  loggerOptions: {
    console: {
      format: ':time :message', // optional — default is message only
      colored: true,            // optional — default is no color
    },
  },
};

app.use(expressExceptionHandler(options));
// or
const mappedError = exceptionMapper(err, options);
```

**Supported format tokens:**


| Token             | Description                                             |
| ----------------- | ------------------------------------------------------- |
| `:message`        | The error message                                       |
| `:time`           | Current UTC time (default: `YYYY-MM-DDTHH:mm:ss.sss Z`) |
| `:time{{FORMAT}}` | Custom time format e.g. `:time{{HH:mm:ss}}`             |


### Custom Logger

Implement the `ILogger` interface to integrate with any logging library (Winston, Pino, etc.):

```typescript
import { ILogger, ILoggerOptions } from 'unified-errors-handler';

class WinstonLogger implements ILogger {
  log(error: any): void {
    winstonInstance.error(error.message, { stack: error.stack });
  }
}

const options: ILoggerOptions = {
  loggerOptions: {
    custom: new WinstonLogger(),
  },
};

app.use(expressExceptionHandler(options));
```

---

## TypeScript Usage

All types are exported from the top level:

```typescript
import {
  expressExceptionHandler,
  exceptionMapper,
  BaseException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  ValidationException,
  ServerException,
  JoiValidationException,
  SQLDatabaseException,
  IException,
  ILogger,
} from 'unified-errors-handler';

import type { IExceptionMapperOptions, ILoggerOptions } from 'unified-errors-handler';

const options: IExceptionMapperOptions = {
  parseSequelizeExceptions: true,
  loggerOptions: {
    console: { colored: true },
  },
};

app.use(expressExceptionHandler(options));
```

---

## Supported Databases and ORMs


| Database   | ORM                                                    |
| ---------- | ------------------------------------------------------ |
| MySQL      | [TypeORM](https://typeorm.io)                          |
| PostgreSQL | [TypeORM](https://typeorm.io)                          |
| MySQL      | [Sequelize](https://www.npmjs.com/package/sequelize)   |
| PostgreSQL | [Sequelize](https://www.npmjs.com/package/sequelize)   |
| MySQL      | [ObjectionJS](https://www.npmjs.com/package/objection) |
| PostgreSQL | [ObjectionJS](https://www.npmjs.com/package/objection) |
| MySQL      | [KnexJS](https://knexjs.org)                           |
| PostgreSQL | [KnexJS](https://knexjs.org)                           |
| MongoDB    | [Mongoose](https://www.npmjs.com/package/mongoose)     |


---

## Tests

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.sample .env

# 3. Start databases (or set your own URLs in .env)
docker-compose up -d

# 4. Run tests
npm test
```

---

## Support and Suggestions

Feel free to open issues or suggest features on [GitHub](https://github.com/AhmedAdelFahim/unified-errors-handler).

---

## License

MIT © Ahmed Adel Fahim