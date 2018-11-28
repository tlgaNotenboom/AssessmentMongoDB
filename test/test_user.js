const assert = require('assert')
const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const User = mongoose.model('user')

beforeEach((done)=>{
    let testUser = new User ({name: "beforeEachTestUser", password: "beforeEachTestUser"});
    testUser.save()
        .then(()=> done())
});

describe('Creating users', () => {

    it('Post to /api/user creates a new user', done => {
            User.count().then((count) => {
                request(app)
                    .post('/api/user')
                    .send({
                        name: "createdTestUser",
                        password: "createdTestUser"
                    })
                    .end(() => {
                        User.count().then((newCount => {
                            assert(count + 1 === newCount);
                            done()
                        }))
                    })
            })
        }),

        it('Post to /api/user with a duplicate username returns 409', done => {
            
            User.count().then((count) => {
                console.log("USERS IN THE DB: "+ count);
                request(app)
                    .post('/api/user')
                    .send({
                        name: "beforeEachTestUser",
                        password: "beforeEachTestUser"
                    })
                    .expect(409)
                    .end((err, res) => {
                        User.count().then((newCount => {
                            console.log("NEW AMOUNT OF USERS IN DB: "+newCount);
                            assert(count === newCount && res.status === 409);
                            done()
                        }))
                    })
            })
        })
})


 describe('Changing a password', () => {

     it("Put to /api/user changes a users password", done => {
             User.findOne({
                 name: "beforeEachTestUser"
            }).then((user) => {
                request(app)
                    .put("/api/user")
                    .send({
                        name: "beforeEachTestUser",
                        password: "beforeEachTestUser",
                        newPassword: "NewPass"
                    })
                    .end((err, res) => {
                        User.findOne({
                            name: "beforeEachTestUser"
                        }).then((newUser) => {
                            assert(newUser.password == "NewPass")
                            done()
                        })
                    })
            })
        }),
        it("Put to /api/user with no newPassword property returns 422", done => {
            User.findOne({
                name: "beforeEachTestUser"
            }).then((user) => {
                request(app)
                    .put("/api/user")
                    .send({
                        name: "beforeEachTestUser",
                        password: "beforeEachTestUser",
                    })
                    .expect(422)
                    .end((err, res) => {
                        User.findOne({
                            name: "beforeEachTestUser"
                        }).then((newUser) => {
                            assert(user.password === newUser.password && res.status === 422)
                            done()
                        })
                    })
            })
        }),
        it("Put to /api/user with a non existant user returns 404", done => {
            request(app)
                .put("/api/user")
                .send({
                    name: "wrongUser",
                    password: "wrongPassword",
                    newPassword: "NewPass"
                })
                .expect(404)
                .end((err, res) => {
                    assert(res.status === 404)
                    done()
                })
        }),
        it("Put to /api/user with wrong password returns 401", done => {
            User.findOne({
                name: "beforeEachTestUser"
            }).then((user) => {
                request(app)
                    .put("/api/user")
                    .send({
                        name: "beforeEachTestUser",
                        password: "wrongPassword",
                        newPassword: "NewPass"
                    })
                    .expect(401)
                    .end((err, res) => {
                        User.findOne({
                            name: "beforeEachTestUser"
                        }).then((newUser) => {
                            assert(user.password === newUser.password && res.status === 401)
                            done()
                        })
                    })
            })
        })
});


describe('Removing a user', () => {

    it("Delete to /api/user with a non existant user returns 404", done => {
        request(app)
            .delete("/api/user")
            .send({
                name: "wrongUser",
                password: "wrongPassword"
            })
            .expect(404)
            .end((err, res) => {
                assert(res.status === 404)
                done()
            })
    }),

    it("Delete to /api/user with wrong password returns 401", done => {
        request(app)
            .delete("/api/user")
            .send({
                name: "beforeEachTestUser",
                password: "wrongPassword",
            })
            .expect(401)
            .end((err, res) => {
                assert(res.status === 401)
                done()

            })
    }),
    it("Delete to /api/user deletes a user", done => {
        request(app)
                    .delete("/api/user")
                    .send({
                        name: "beforeEachTestUser",
                        password: "beforeEachTestUser"
                    })
                    .end((err, res) => {
                        User.find({
                            name: "beforeEachTestUser"
                        }).then((deletedUser) => {
                            assert(deletedUser.length === 0)
                            done()
                        })
                    })
    })
})

