const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: String,
    comments: [{ type: Schema.Types.ObjectId, 
        ref: 'comment'}]
        
});
const Comment = mongoose.model('comment', CommentSchema);

module.exports= Comment;