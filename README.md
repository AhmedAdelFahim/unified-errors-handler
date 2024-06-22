# Unified Errors Handler
Unified Errors Handler is A Powerful Error Handling Library for Node.js that unify error structure across application. it can unify database errors.

[![Latest Stable Version](https://img.shields.io/npm/v/unified-errors-handler.svg?style=for-the-badge)](https://www.npmjs.com/package/unified-errors-handler)
![GitHub License](https://img.shields.io/github/license/AhmedAdelFahim/unified-errors-handler?style=for-the-badge)
[![NPM Downloads](https://img.shields.io/npm/dt/unified-errors-handler.svg?style=for-the-badge)](https://www.npmjs.com/package/unified-errors-handler)
[![NPM Downloads](https://img.shields.io/npm/dm/unified-errors-handler.svg?style=for-the-badge)](https://www.npmjs.com/package/unified-errors-handler)

## Content
1. [Installation](https://www.npmjs.com/package/unified-errors-handler#installation)
2. [Usage](https://www.npmjs.com/package/unified-errors-handler#usage)
    1. [ExpressJS Middleware](https://www.npmjs.com/package/unified-errors-handler#expressjs-middleware)
    2. [Custom ExpressJS Middleware](https://www.npmjs.com/package/unified-errors-handler#custom-expressjs-middleware)
    3. [NestJS Exception Filter](https://www.npmjs.com/package/unified-errors-handler#nestjs-exception-filter)
    4. [Options](https://www.npmjs.com/package/unified-errors-handler#options)
3. [Errors Structure](https://www.npmjs.com/package/unified-errors-handler#unified-structure)
4. [General Exceptions](https://www.npmjs.com/package/unified-errors-handler#exceptions)
5. [SQL Database Exceptions](https://www.npmjs.com/package/unified-errors-handler#sql-database-exceptions)
6. [No SQL Database Exceptions](https://www.npmjs.com/package/unified-errors-handler#no-sql-database-exceptions)
7. [Custom Exceptions](https://www.npmjs.com/package/unified-errors-handler#custom-exceptions)
8. [Supported Database and ORMs](https://www.npmjs.com/package/unified-errors-handler#supported-database-and-orms)
9. [Tests](https://www.npmjs.com/package/unified-errors-handler#tests)
10. [Support and Suggestions](https://www.npmjs.com/package/unified-errors-handler#support-and-suggestions)

 ## Installation

```bash
$ npm i unified-errors-handler
```
## Usage
* #### ExpressJS Middleware

```javascript
const express = require('express');
const { expressExceptionHandler } = require('unified-errors-handler');
const app = express();
/**
  response in case of error will be
  {
    errors: [
      {
        code: 'USER_NOT_FOUND',
        message: 'user not found',
      },
    ],
  }
  with status code 404
*/
app.post('/test', function (req, res) {
    const isFound = // ...
    if (isFound) {
      // return response
    } else {
      throw new NotFoundException([
        {
          code: 'USER_NOT_FOUND',
          message: 'user not found',
        },
      ]);
    }
});

app.use(expressExceptionHandler());
```
* #### Custom ExpressJS Middleware

```javascript
const express = require('express');
const { exceptionMapper } = require('unified-errors-handler');

const app = express();
/**
  response in case of error will be
  {
    errors: [
      {
        code: 'USER_NOT_FOUND',
        message: 'user not found',
      },
    ],
  }
  with status code 404
*/
app.post('/test', function (req, res) {
    const isFound = // ...
    if (isFound) {
      // return response
    } else {
      throw new NotFoundException([
        {
          code: 'USER_NOT_FOUND',
          message: 'user not found',
        },
      ]);
    }
});

app.use((err: Error, req: any, res: any, next: any) => {
    const mappedError = exceptionMapper(err);
   
    res.status(mappedError.statusCode).send({
      errors: mappedError.serializeErrors(),
    });
  });
```

* #### NestJS Exception Filter
```javascript
const { exceptionMapper } = require('unified-errors-handler');

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const error = exceptionMapper(exception);
    const statusCode = error.statusCode;
    response.status(statusCode).json({
      errors: error.serializeErrors(),
    });
  }
}
```

* #### Options
You can add options to (enable/disable) parsing for database errors (depends on your ORM) this is disabled by default, [See supported ORMs](https://www.npmjs.com/package/unified-errors-handler#supported-database-and-orms)

```javascript
const options = {
    mapDBExceptions: true,            // deprecated
    parseSequelizeExceptions: true;
    parseMongooseExceptions: true;
    parseTypeORMExceptions: true;
    parseObjectionJSExceptions: true;
    parseKnexJSExceptions: false;
}

expressExceptionHandler(options)
// or 
const mappedError = exceptionMapper(err, options);
```

## Unified Structure
```javascript
{
   errors: [{
      fields: ['name', 'password'],   // optional
      code: 'YOUR_CODE',
      message: 'your message'
      details: {    // optional - more details about error
        key: value 
      }
   }]
}
```

## Exceptions
1. #### BadRequestException
* Status code - 400  
```javascript
throw new BadRequestException({
  fields: ['password'],        // optional
  code: 'INVALID_PASSWORD',    // optional
  message: 'invalid password'
  details: {                  // optional
   // ... more details
  }
});
```
2. #### UnauthorizedException
* Status code - 401
```javascript
throw new UnauthorizedException({
  code: 'UNAUTHORIZED',
  message: 'You are not authorized'
});
```
3. #### ForbiddenException
* Status code - 403
```javascript
throw new ForbiddenException({
  code: 'FORBIDDEN',
  message: 'You have no access'
});
```
4. #### NotFoundException
* Status code - 404
```javascript
throw new NotFoundException([
  {
     code: 'USER_NOT_FOUND',
     message: 'user not found',
  },
]);
```
5. #### ServerException
* Status code - 500
```javascript
throw new ServerException();
```
## SQL Database Exceptions
1. #### UniqueViolationException
* Status code - 400  
```javascript
// output
[
  {
    fields: ['name'],
    code: 'DATA_ALREADY_EXIST',
    message: 'name already exist',
  },
]
```
2. #### ForeignKeyViolationException
* Status code - 400  
```javascript
// output
// foreign key is not exist as primary key in another table
// trying insert value with invalid foreign key
[
  code: 'INVALID_DATA',
  message: 'Invalid data',
  details: {
    reason: 'violates foreign key constraint',
    constraint: 'pet_user_id_foreign',
  },
]
// foreign key has reference in another table 
[
  code: 'DATA_HAS_REFERENCE',
  message: 'Data has reference',
  details: {
    reason: 'violates foreign key constraint',
    constraint: 'pet_user_id_foreign',
  },
]
```
3. #### NotNullViolationException
* Status code - 400  
```javascript
// output
[
  {
    fields: ['age'],
    code: 'INVALID_DATA',
    message: 'age is invalid',
    details: { reason: 'age must not be NULL' },
  },
]
```
4. #### CheckViolationException
* Status code - 400  
* Example - Invalid enum value
```javascript
// output
[{
  code: 'INVALID_VALUES',
  message: 'Invalid Values',
  details: {
    constraint: 'user_gender_check',
  },
}]
```
5. #### OutOfRangeViolationException
* Status code - 400  
* Example - numeric value out of range 
```javascript
// output
[{
  {
    code: 'OUT_OF_RANGE',
    message: 'Out of range',
  },
}]
```
## No SQL Database Exceptions
1. #### MongoDBUniqueViolationException
* Status code - 400  
```javascript
// output
[
  {
    fields: ['name'],
    values: ['Ahmed'],
    code: 'DATA_ALREADY_EXIST',
    message: 'name already exist',
  },
]
```
2. #### MongooseValidationException
* Status code - 400  
```javascript
// output
[
  // field is required
  {
    fields: ['age'],
    message: 'Path `age` is required.',
    code: 'MONGODB_VALIDATION_ERROR',
    details: { 
      reason: 'age is required', 
      violate: 'required_validation'
    },
  },
  // field's value violate enum values
  {
    fields: ['gender'],
    message: '`MALEE` is not a valid enum value for path `gender`.',
    code: 'MONGODB_VALIDATION_ERROR',
    details: { 
      reason: "gender's value must be one of MALE, FEMALE", 
      violate: 'enum_validation'
    },
  },
  // field's value violate max value
  {
    fields: ['age'],
    message: 'Path `age` (300) is more than maximum allowed value (50).',
    code: 'MONGODB_VALIDATION_ERROR',
    details: { 
      reason: `age's value exceed maximum allowed value (50)`, 
      violate: 'max_validation'
    },
  },
  // field's value violate min value
  {
    fields: ['age'],
    message: 'Path `age` (3) is less than minimum allowed value (20).',
    code: 'MONGODB_VALIDATION_ERROR',
    details: { 
      reason: `age's value less than minimum allowed value (20)`, 
      violate: 'min_validation'
    },
  },
  // field's value violate type of field
  {
    fields: ['age'],
    message: 'age is invalid',
    code: 'MONGODB_CASTING_ERROR',
  },
]
```

## Custom Exceptions
You can create your own exceptions by extend `BaseException`
```javascript
export class MyCustomException extends BaseException {
  statusCode = 400;

  constructor(private message: string) {
    super(message);
    Object.setPrototypeOf(this, MyCustomException.prototype);
  }

  serializeErrors() {
    return [{
      message,
      code: 'CUSTOM_CODE'
    }];
  }
}
```

## Supported Database and ORMs
1. MYSQL with [TypeORM](https://typeorm.io)
2. Postgres with [TypeORM](https://typeorm.io)
3. MYSQL with [Sequelize](https://www.npmjs.com/package/sequelize)
4. Postgres with [Sequelize](https://www.npmjs.com/package/sequelize)
5. MYSQL with [ObjectionJS](https://www.npmjs.com/package/objection)
6. Postgres with [ObjectionJS](https://www.npmjs.com/package/objection)
5. MYSQL with [KnexJS](https://knexjs.org)
6. Postgres with [KnexJS](https://knexjs.org)
7. MongoDB with [Mongoose](https://www.npmjs.com/package/mongoose)


## Tests
To run the test suite, 
1. first install the dependencies
2. rename .env.sample to .env 
3. You can run `docker-comose up` or set your own connection URLs for postgres database and mysql database in .env
4. run `npm test`:
```bash
$ npm install
$ npm test
```
## Support and Suggestions
Feel free to open issues on [github](https://github.com/AhmedAdelFahim/unified-errors-handler).
