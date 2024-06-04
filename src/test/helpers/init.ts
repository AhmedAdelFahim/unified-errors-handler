import { Database } from './database';

before(function (done) {
  Database.init()
    .then(() => {
      done();
    })
    .catch((err: any) => {
      done(err);
    });
});

after(function (done) {
  Database.teardown()
    .then(() => {
      done();
    })
    .catch((err: any) => {
      done(err);
    });
});
