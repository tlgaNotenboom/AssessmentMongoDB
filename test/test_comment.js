const assert = require('assert')
const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const Comment = mongoose.model('comment')
const Thread = mongoose.model('thread')

describe("Posting a comment", () =>{
    it("POST /api/comment", done =>{
        let commentcount;
        Thread.findOne({
            title: "beforeEachTestTitle"
        })
        .then((thread)=>{
            commentcount = thread.comments.length
            return thread
        })
        .then((thread)=>{
            return request(app)
                .post('/api/comment')
                .send({
                    content: "testComment2",
                    username: "beforeEachTestUser",
                    thread: thread._id                  
                })
        })
        .then(()=>{
            return Thread.findOne({
                title: "beforeEachTestTitle"
            })
        })
        .then((thread)=>{
            assert(thread.comments.length === commentcount+1)
            done()
        })
        .catch((err)=> done(err))
    })
})