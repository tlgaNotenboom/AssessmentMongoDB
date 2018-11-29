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

describe("Deleting a comment", () =>{
    it("Delete /api/comment", done =>{
        let foundComment;
        Thread.findOne({
            title: "beforeEachTestTitle"
        })
        .then((thread)=>{
            return Comment.findOne({
                thread: thread._id
            })
        })
        .then((comment) =>{
            foundComment = comment;
            return request(app)
            .delete("/api/comment/"+comment._id)
        })
        .then(() =>{
            return Comment.findById(foundComment._id)
        })
        .then((comment)=>{
            assert(comment.deleted)
            done()
        })
        .catch((err)=> done(err))
    })
})