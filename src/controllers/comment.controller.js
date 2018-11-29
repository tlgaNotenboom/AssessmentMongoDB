const ApiError = require('../ApiError')
const Comment = require('../models/comment');
const User = require('../models/user');
const Thread = require('../models/thread')

module.exports = {
    addComment(req, res, next) {
        const commentProps = req.body
        try {
            User.find({
                name: commentProps.username
            }).then((foundUser) => {
                if (foundUser.length === 0) {
                    next(new ApiError("No user found", 422))
                } else {
                    Comment.create(commentProps).then((comment) => {
                        if (!comment.parent) {
                            Thread.findByIdAndUpdate(commentProps.thread, {
                                $push: {
                                    comments: comment._id
                                }
                            }).then(() => {
                                res.status(200).send(comment)
                            }).catch((err) => {
                                next(new ApiError(err.toString(), 400))
                            })
                        } else {
                            Comment.findByIdAndUpdate(comment.parent, {
                                    $push: {
                                        comments: comment._id
                                    }
                                })
                                .then(() => {
                                    res.status(200).send(comment)
                                }).catch((err) => {
                                    next(new ApiError(err.toString(), 400))
                                })
                        }

                    }).catch((err) => {
                        next(new ApiError(err.toString(), 400))
                    })

                }
            }).catch((err) => {
                next(new ApiError(err.toString(), 400))
            })
        } catch (ex) {
            const error = new ApiError(ex.message || ex.toString, ex.code);
            next(error);
            return;
        }
    },

    removeComment(req, res, next) {
        const commentId = req.params.id

        try {
            Comment.findById(commentId).then((comment) => {
                if (!comment.deleted) {
                    Comment.findByIdAndUpdate(commentId, {
                            username: "<deleted>",
                            content: "deleted",
                            deleted: true
                        }, { new: true })
                        .then((deletedComment) => {
                            res.status(200).send(deletedComment)
                        }).catch((err) => {
                            next(new ApiError(err.toString(), 400))
                        })
                } else {
                    next(new ApiError("Comment already deleted", 422))
                }
            })

        } catch (ex) {
            const error = new ApiError(ex.message || ex.toString, ex.code);
            next(error);
            return;
        }
    }
}