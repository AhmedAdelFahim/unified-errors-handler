# Unified Errors Handler
 Unified Errors Handler is error handler that unify error structure across application. it can unify database errors.
 ## Installation

```bash
$ npm i unified-errors-handler
```
## Usage
You can use it as middleware

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const { expressExceptionHandler } = require('expressExceptionHandler');

const app = express();

app.use(bodyParser.json({limit:'1kb'}));
app.use(bodyParser.urlencoded({extended: true, limit:'1kb'}));

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

You can add options to allow parsing for database errors this is disabled by default

```javascript
const options = {
   mapDBExceptions: true,
}

app.use(expressExceptionHandler(options));
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
## Database Exceptions
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

## Supported Database and ORMs
1. MYSQL with [ObjectionJS](https://www.npmjs.com/package/objection)
2. MYSQL with [Sequelize](https://www.npmjs.com/package/sequelize)
3. Postgres with [ObjectionJS](https://www.npmjs.com/package/objection)
4. Postgres with [Sequelize](https://www.npmjs.com/package/sequelize)

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
