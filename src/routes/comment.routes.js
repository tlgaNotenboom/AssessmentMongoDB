let express = require('express');
let routes = express.Router();
let CommentController = require('../controllers/comment.controller')

routes.post("/comment", CommentController.addComment)

routes.delete("/comment/:id", CommentController.removeComment)

module.exports = routes