const mongoose = require('mongoose');
const User = require('../src/models/user')
const request = require('supertest')
const Thread = require('../src/models/thread')
const app = require('../server')

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
        threads.drop(() =>{
          done()
        })
      })
    })
  })

  beforeEach((done) => {
    let testUser = new User ({name: "beforeEachTestUser", password: "beforeEachTestUser"});
    testUser.save()
  .then(() => {
    return request(app)
    .post('/api/thread')
    .send({
        username: "beforeEachTestUsername", 
        title: "beforeEachTestTitle", 
        content: "beforeEachTestContent"
    })
    .then(()=> {
        return Thread.findOne({
            title: "beforeEachTestTitle"
        })
    })
    .then(()=> {
        return request(app)
        .post('/api/comment')
        .send({
            content: "testComment",
            username: "beforeEachTestUsername",
            thread: "beforeEachTestTitle"     
        })
    })
  })
  .then(()=> done())
  .catch((err)=> done(err))
});
        
