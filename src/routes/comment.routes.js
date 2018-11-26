let express = require('express');
let routes = express.Router();
let CommentController = require('../controllers/comment.controller')

routes.post("/comment", CommentController.addComment)

module.exports = routes