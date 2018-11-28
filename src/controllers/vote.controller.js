const Thread = require('../models/thread');
const ApiError = require('../ApiError');
const Comment = require('../models/comment');

module.exports = {
    castCommentUpvote(req, res, next){
        try {
            Comment.find({
                _id: req.params.id
            }).then((foundComment) => {
                if (foundComment.length === 1) {
                    Comment.findByIdAndUpdate(req.params.id, {
                        $push: {
                        upvotes: req.body.username
                        }
                    }, 
                    {new: true})
                    .then(comment => {
                        res.status(200).send(comment)
                    }).catch((err) => {
                        next(new ApiError(err.toString(), 400))
                    })
                } else {
                    next(new ApiError("comment not found", 409))
                }
            })
        } catch (ex) {
            const error = new ApiError(ex.message || ex.toString, ex.code);
            next(error);
            return;
        }
    },

    castCommentDownvote(req, res, next){
        try {
            Comment.find({
                _id: req.params.id
            }).then((foundComment) => {
                if (foundComment.length === 1) {
                    Comment.findByIdAndUpdate(req.params.id, {
                        $push: {
                        downvotes: req.body.username
                        }
                    },
                    {new: true})
                    .then(comment => {
                        res.status(200).send(comment)
                    }).catch((err) => {
                        next(new ApiError(err.toString(), 400))
                    })
                } else {
                    next(new ApiError("comment not found", 409))
                }
            })
        } catch (ex) {
            const error = new ApiError(ex.message || ex.toString, ex.code);
            next(error);
            return;
        }
    },

    castThreadUpvote(req, res, next){
        try {
            Thread.find({
                _id: req.params.id
            }).then((foundThread) => {
                if (foundThread.length === 1) {
                    Thread.findByIdAndUpdate(req.params.id, {
                        $push: {
                        upvotes: req.body.username
                        }
                    }, {new: true})
                    .then(thread => {
                        res.status(200).send(thread)
                    }).catch((err) => {
                        next(new ApiError(err.toString(), 400))
                    })
                } else {
                    next(new ApiError("Thread not found"+foundThread.length, 409))
                }
            })
        } catch (ex) {
            const error = new ApiError(ex.message || ex.toString, ex.code);
            next(error);
            return;
        }
    },

    castThreadDownvote(req, res, next){
        try {
            Thread.find({
                _id: req.params.id
            }).then((foundThread) => {
                if (foundThread.length === 1) {
                    Thread.findByIdAndUpdate(req.params.id, {
                        $push: {
                        downvotes: req.body.username
                        }
                    }, {new: true})
                    .then(thread => {
                        res.status(200).send(thread)
                    }).catch((err) => {
                        next(new ApiError(err.toString(), 400))
                    })
                } else {
                    next(new ApiError("Thread not found"+foundThread.length, 409))
                }
            })
        } catch (ex) {
            const error = new ApiError(ex.message || ex.toString, ex.code);
            next(error);
            return;
        }
    }
}