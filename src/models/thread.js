const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ThreadSchema = new Schema ({
    title: String,
    content: String,
    comments: [{ type: Schema.Types.ObjectId, 
        ref: 'comment'}]
    
});
const Thread = mongoose.model('thread', ThreadSchema);

module.exports = Thread;