import 'reflect-metadata';
import { MYSQLDatabase } from './database/mysql-database';
import { PostgresDatabase } from './database/postgres-database';
import { MongoDatabase } from './database/mongo-database';

before(function (done) {
  PostgresDatabase.init()
    .then(() => {
      return MYSQLDatabase.init();
    })
    .then(() => {
      return MongoDatabase.init();
    })
    .then(() => {
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
