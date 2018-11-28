const mongoose = require('mongoose');

before(done => {
    mongoose.connect('mongodb://localhost/suddit_test');
    mongoose.connection
    .once('open', ()=> done())
    .on('error', err => {
        console.warn('Warning', err);
    });
});
beforeEach((done) => {
    const {
      users,
      comments,
      threads
    } = mongoose.connection.collections;
    users.drop(() => {
      comments.drop(() => {
        threads.drop()
        .then(()=> done())
        .catch(()=> done())
        });
      });
    });
