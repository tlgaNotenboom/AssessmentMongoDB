const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: {
        type: String,
        required: [true, 'You have to enter a message.']
    },
    username: {
        type: String,
        required: [true, 'You have to enter a username.']
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: "comment"
    },
    thread: {
        type: Schema.Types.ObjectId,
        ref: "thread",
        required: [true, "You need a thread to post in."]
    },
    comments: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'comment',
        autopopulate: true
    }],
    upvotes: [{
        type: String,
        ref: 'upvote'
    }],
    downvotes: [{
        type: String,
        ref: 'downvote'
    }],
    deleted: {
        type: Boolean,
        default: false
    },          
},
{
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true 
    }
});

CommentSchema.virtual('Upvotes').get(function(){
    if(this.upvotes === undefined){
        return 0
    }
    return this.upvotes.length
});
CommentSchema.virtual('Downvotes').get(function(){
    if(this.downvotes === undefined){
        return 0
    }
    return this.downvotes.length
});
CommentSchema.virtual('Karma').get(function(){
    if(this.upvotes === undefined){
        if(this.downvotes === undefined){
            return 0
        }else {
            return this.downvotes.length
        }
    }else if(this.downvotes === undefined){
        return this.upvotes.length
    }else{
        return this.upvotes.length - this.downvotes.length
    }
});
CommentSchema.plugin(require('mongoose-autopopulate'))
const Comment = mongoose.model('comment', CommentSchema);

module.exports= Comment;