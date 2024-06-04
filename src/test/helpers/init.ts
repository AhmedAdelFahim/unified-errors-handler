import { MYSQLDatabase } from './database/mysql-database';
import { PostgresDatabase } from './database/postgres-database';

before(function (done) {
  PostgresDatabase.init()
    .then(() => {
      return MYSQLDatabase.init();
    })
    .then(() => {
      done();
    })
    .catch((err: any) => {
      done(err);
    });
});

after(function (done) {
  PostgresDatabase.teardown()
    .then(() => {
      return MYSQLDatabase.teardown();
    })
    .then(() => {
      done();
    })
    .catch((err: any) => {
      done(err);
    });
});
