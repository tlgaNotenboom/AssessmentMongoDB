const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/users_test');
mongoose.connection
    .once('open', ()=> console.log("gtg"))
    .on('error', (error)=>{
        console.warn('Warning', error)
    });
    
    beforeEach((done) => {
        const {
          users,
          comments,
          blogposts
        } = mongoose.connection.collections;
        users.drop(() => {
          comments.drop(() => {
            blogposts.drop(() => {
              done();
            });
          });
        });
      });