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
    thread: {
        type: Schema.Types.ObjectId,
        ref: "thread",
        required: [true, "You need a thread to post in."]
    },
    comments: [{ type: Schema.Types.ObjectId, 
        ref: 'comment'}]
        
});
const Comment = mongoose.model('comment', CommentSchema);

module.exports= Comment;