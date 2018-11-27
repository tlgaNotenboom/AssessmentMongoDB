// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/users_test');
// mongoose.connection
//     .once('open', ()=> console.log("Succesfully connected!"))
//     .on('error', (error)=>{
//         console.warn('Warning', error)
//     });

//     beforeEach((done) => {
//         const {
//           users,
//           comments,
//           threads
//         } = mongoose.connection.collections;
//         users.drop(() => {
//           comments.drop(() => {
//             threads.drop(() => {
//               done();
//             });
//           });
//         });
//       });