const mongoose = require('mongoose')
const User = require('../src/models/user')
const request = require('supertest')
const Thread = require('../src/models/thread')
process.env.NODE_ENV = 'test'
const app = require('../server')
const neo4j = require('../src/neo4j/neo4jdriver')
let session = neo4j.session()

before(done => {
    console.log("Mongoose is connected to test Atlas remote DB")
    mongoose.connect("mongodb+srv://admin:admin123@studdit-ggmur.mongodb.net/test?retryWrites=true", { useNewUrlParser: true } );
    mongoose.connection
        .once('open', () => done())
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
            threads.drop(() => {
                session.run("MATCH (u:User)-[r:FRIEND]-(:User) WHERE u.name = 'createdTestUser' DELETE r").then(() => {
                    session.run("MATCH (u:User) WHERE u.name = 'createdTestUser' OR u.name = 'createdTestUser1' OR u.name = 'createdTestUser2' DELETE u")
                }).then(() => {
                    session.close()
                    done()
                })
            })
        })
    })
})

beforeEach((done) => {
    let testUser = new User({
        name: "beforeEachTestUser",
        password: "beforeEachTestUser"
    });
    testUser.save()
        .then(() => {
            return request(app)
                .post('/api/thread')
                .send({
                    username: "beforeEachTestUsername",
                    title: "beforeEachTestTitle",
                    content: "beforeEachTestContent"
                })
                .then(() => {
                    return Thread.findOne({
                        title: "beforeEachTestTitle"
                    })
                })
                .then(() => {
                    return request(app)
                        .post('/api/comment')
                        .send({
                            content: "testComment",
                            username: "beforeEachTestUsername",
                            thread: "beforeEachTestTitle"
                        })
                })
        })
        .then(() => done())
        .catch((err) => done(err))
});