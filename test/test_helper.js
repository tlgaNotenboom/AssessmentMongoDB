const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/users_test');
mongoose.connection
    .once('open', ()=> console.log("gtg"))
    .on('error', (error)=>{
        console.warn('Warning', error)
    });