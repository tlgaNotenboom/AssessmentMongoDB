let express = require('express');
let routes = express.Router();
let UserController = require('../controllers/user.controller')

routes.get("/user", UserController.getAllUsers);
routes.get("/user/:id", UserController.getSpecificUser)

routes.post("/user", UserController.addUser);

routes.put("/user/", UserController.changePassword);

routes.delete("/user/", UserController.removeUser);

module.exports = routes