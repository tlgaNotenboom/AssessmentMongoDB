let express = require('express');
let routes = express.Router();
let ThreadController = require('../controllers/thread.controller')

routes.get("/thread", ThreadController.getAllThreads);
routes.get("/thread/:id", ThreadController.getSpecificThread);

routes.post("/thread", ThreadController.addThread);

routes.put("/thread/:id", ThreadController.editThread);
routes.delete("thread/:id", ThreadController.removeThread);


module.exports = routes