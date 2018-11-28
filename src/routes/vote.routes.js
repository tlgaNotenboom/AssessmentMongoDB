let express = require('express');
let routes = express.Router();
let VoteController = require('../controllers/vote.controller')

routes.post("/comment/upvote/:id", VoteController.castCommentUpvote);
routes.post("/comment/downvote/:id", VoteController.castCommentDownvote);

routes.post("/thread/upvote/:id", VoteController.castThreadUpvote);
routes.post("/thread/downvote/:id", VoteController.castThreadDownvote);


module.exports = routes