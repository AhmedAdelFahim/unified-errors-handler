import 'reflect-metadata';
import { MYSQLDatabase } from './database/mysql-database';
import { PostgresDatabase } from './database/postgres-database';
import { MongoDatabase } from './database/mongo-database';

before(function (done) {
  PostgresDatabase.init()
    .then(() => {
      console.log('Postgres database initialized');
      return MYSQLDatabase.init();
    })
    .then(() => {
      console.log('MYSQL database initialized');
      return MongoDatabase.init();
    })
    .then(() => {
      console.log('Mongo database initialized');
      done();
    })
    .catch((err: any) => {
      console.log(err);
      done(err);
    });
});

after(function (done) {
  PostgresDatabase.teardown()
    .then(() => {
      return MYSQLDatabase.teardown();
    })
    .then(() => {
      return MongoDatabase.teardown();
    })
    .then(() => {
      done();
    })
    .catch((err: any) => {
      done(err);
    });
});
