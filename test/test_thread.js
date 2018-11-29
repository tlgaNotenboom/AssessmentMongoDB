const assert = require('assert')
const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const Thread = mongoose.model('thread')

describe("Creating Threads", () => {
    it('Post to /api/thread creates a new thread', done => {
            Thread.count()
                .then((count) => {
                    request(app)
                        .post('/api/thread')
                        .send({
                            username: "createdTestUsername",
                            title: "createdTestThread",
                            content: "createdTestContent"
                        })
                        .end(() => {
                            Thread.count().then((newCount => {
                                assert(count + 1 === newCount);
                                done()
                            }))
                        })
                })
                .catch((err) => done(err))
        }),
        it('Put to /api/thread/:id edits the username and content', done => {
            Thread.findOne({
                    title: "beforeEachTestTitle"
                })
                .then((thread) => {
                    let threadId = thread._id
                    request(app)
                        .put("/api/thread/" + threadId)
                        .send({
                            username: "beforeEachTestChangedUsername",
                            title: "beforeEachTestTitle",
                            content: "beforeEachTestChangedContent"
                        })
                        .end((err, res) => {
                            Thread.findOne({
                                    title: "beforeEachTestTitle"
                                })
                                .then((newThread) => {
                                    assert(newThread.username == "beforeEachTestChangedUsername" && newThread.content == "beforeEachTestChangedContent");
                                    done()
                                })
                                .catch((err) => done(err))
                        })
                })
                .catch((err) => done(err))
        })
})

describe("Getting a thread", () => {
    it('gets all threads available without comments', (done) => {
        request(app)
            .get("/api/thread")
            .end((err, res) => {
                if (err) {
                    done(err)
                } 
                assert(JSON.parse(res.text).comments === undefined)
                done()
            })
    }),

    it('gets a specific thread with all comments', (done) => {
        Thread.findOne({title: "beforeEachTestTitle"})
        .then((thread) => {
            return request(app)
            .get("/api/thread/" + thread._id)
        }) 
        .then((res) => {
            assert(JSON.parse(res.text).comments !== undefined)
            done()
        }).catch((err) => {
            done(err)
        }) 
    })
})


describe("Remove Threads", () => {
    it('removes a thread and its comments', done => {
        let savedThread
        Thread.findOne({
                title: "beforeEachTestTitle"
            })
            .then((thread) => {
                savedThread = thread
                return request(app)
                    .delete("/api/thread/" + thread._id)
            })
            .then(() => {
                return Thread.findById(savedThread._id)
            })
            .then((deletedThread) => {
                assert(deletedThread === null)
                done()
            })
            .catch((err) => {
                done(err)
            })
    })
})