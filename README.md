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

## Exceptions
1. #### BadRequestException
* Status code - 400  
```javascript
throw new BadRequestException({
  code: 'INVALID_PASSWORD',
  message: 'invalid password'
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
## Support
Feel free to open issues on [github](https://github.com/AhmedAdelFahim/unified-errors-handler).
