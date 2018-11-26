const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: (name) => name.length > 2,
      message: 'Name must be longer than 2 characters.'
    },
    required: [true, 'Name is required.']
  },
  password: {
    type: String,
    validate: {
      validator: (password) => password.length > 2,
      message: 'Password must be longer than 2 characters.'
    },
    required: [true, 'Password is required.']
  },
  thread: [{
    type: Schema.Types.ObjectId,
    ref: 'thread'
  }]
},
{usePushEach:true});

const User = mongoose.model('user', UserSchema);

module.exports = User;
