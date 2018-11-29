const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ThreadSchema = new Schema ({
    username: {
        type: String,
        required: [true, 'Username is required.']
    },  
    title: {
        type: String,
        required: [true, 'Title is required.']
    },
    content: {
        type: String,
        required: [true, 'Content is required.']
    },
    upvotes: [{
        type: String,
        ref: 'upvotes'
    }],
    downvotes: [{
        type: String,
        ref: 'downvotes'
    }],
    comments: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'comment',
        autopopulate: true
    }],
    
    },
    {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true 
        }
    });

ThreadSchema.virtual('Upvotes').get(function(){
    if(this.upvotes === undefined){
        return 0
    }
    return this.upvotes.length
});
ThreadSchema.virtual('Downvotes').get(function(){
    if(this.downvotes === undefined){
        return 0
    }
    return this.downvotes.length
});
ThreadSchema.virtual('Karma').get(function(){
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
ThreadSchema.plugin(require('mongoose-autopopulate'))
const Thread = mongoose.model('thread', ThreadSchema);

module.exports = Thread;