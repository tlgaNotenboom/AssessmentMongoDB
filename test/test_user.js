const assert = require('assert')
const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const User = mongoose.model('user')

describe('Creating users', () => {

    it('Post to /api/user creates a new user', done => {
            User.count().then((count) => {
                request(app)
                    .post('/api/user')
                    .send({
                        name: "test",
                        password: "test"
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
                request(app)
                    .post('/api/user')
                    .send({
                        name: "test",
                        password: "test"
                    })
                    .expect(409)
                    .end((err, res) => {
                        User.count().then((newCount => {
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
                name: "test"
            }).then((user) => {
                request(app)
                    .put("/api/user")
                    .send({
                        name: "test",
                        password: "test",
                        newPassword: "NewPass"
                    })
                    .end((err, res) => {
                        User.findOne({
                            name: "test"
                        }).then((newUser) => {
                            assert(user.password !== newUser.password)
                            done()
                        })
                    })
            })
        }),

        it("Put to /api/user with no newPassword property returns 422", done => {
            User.findOne({
                name: "test"
            }).then((user) => {
                request(app)
                    .put("/api/user")
                    .send({
                        name: "test",
                        password: "test",
                    })
                    .expect(422)
                    .end((err, res) => {
                        User.findOne({
                            name: "test"
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
                    name: "test123",
                    password: "test",
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
                name: "test"
            }).then((user) => {
                request(app)
                    .put("/api/user")
                    .send({
                        name: "test",
                        password: "test123",
                        newPassword: "NewPass"
                    })
                    .expect(401)
                    .end((err, res) => {
                        User.findOne({
                            name: "test"
                        }).then((newUser) => {
                            assert(user.password === newUser.password && res.status === 401)
                            done()
                        })
                    })
            })
        })
})


describe('Removing a user', () => {

    it("Delete to /api/user with a non existant user returns 404", done => {
        request(app)
            .delete("/api/user")
            .send({
                name: "test123",
                password: "test"
            })
            .expect(404)
            .end((err, res) => {
                assert(res.status === 404)
                done()
            })
    })

    it("Delete to /api/user with wrong password returns 401", done => {
        request(app)
            .delete("/api/user")
            .send({
                name: "test",
                password: "test123",
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
                        name: "test",
                        password: "NewPass"
                    })
                    .end((err, res) => {
                        User.find({
                            name: "test"
                        }).then((deletedUser) => {
                            assert(deletedUser.length === 0)
                            done()
                        })
                    })
    })
})