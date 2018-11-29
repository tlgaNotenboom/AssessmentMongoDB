const Thread = require('../models/thread');
const ApiError = require('../ApiError');
const Comment = require('../models/comment');
const User = require('../models/user')

module.exports = {
    castCommentUpvote(req, res, next){
            Comment.find({
                _id: req.params.id
            }).then((foundComment) => {
                if (foundComment.length === 1) {
                    let comment = foundComment[0]
                    if(comment.upvotes.includes(req.body.username)){
                        Comment.findByIdAndUpdate(req.params.id, {
                            $pull: {
                                upvotes: {
                                    $in: [
                                    req.body.username
                                    ]
                                },
                            }},
                                { new: true })
                            .then((comment) => {
                                res.status(200).send(comment)
                            })
                            .catch((err)=> {
                                next(new ApiError(err.toString(), 400))
                            })
                        }else if(comment.downvotes.includes(req.body.username)){
                            Comment.findByIdAndUpdate(req.params.id, {
                                $pull: {
                                    downvotes: {
                                        $in: [
                                        req.body.username
                                        ]
                                    },
                                }
                                })
                                .then( () =>
                                        Comment.findByIdAndUpdate(req.params.id, {
                                        $push: {
                                        upvotes: req.body.username
                                        }
                                    }, 
                                    {new: true})
                                )
                                .then((comment)=> {
                                    res.status(200).send(comment)
                                })
                                .catch((err)=> {
                                    next(new ApiError(err.toString(), 400))
                                })
                        }else{
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
                }
                } else {
                    next(new ApiError("comment not found", 409))
                }
            })
    },

    castCommentDownvote(req, res, next){
        try {
            Comment.find({
                _id: req.params.id
            }).then((foundComment) => {
                if (foundComment.length === 1) {
                    let comment = foundComment[0]
                    for(var i = 0, len = comment.downvotes.length; i < len; i++){
                        if( comment.downvotes[i] === req.body.username){
                            next(new ApiError("You already downvoted this comment!", 409))
                        }
                    };
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
                    let thread = foundThread[0]
                    for(var i = 0, len = thread.upvotes.length; i < len; i++){
                        if( thread.upvotes[i] === req.body.username){
                            next(new ApiError("You already upvoted this thread!", 409))
                        }
                    };
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
                    next(new ApiError("Thread not found", 409))
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
            User.find({
                name: req.body.username
            })
            .then((foundUser)=>{
                if (foundUser.length === 0) {
                    next(new ApiError("User not found", 401))
                }
            })
            .catch((err) => {
                next(new ApiError(err.toString(), 400))
            })
            Thread.find({
                _id: req.params.id
            }).then((foundThread) => {
                if (foundThread.length === 1) {
                    let thread = foundThread[0]
                    for(var i = 0, len = thread.downvotes.length; i < len; i++){
                        if( thread.downvotes[i] === req.body.username){
                            next(new ApiError("You already downvoted this thread!", 409))
                        }
                    };
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
                    next(new ApiError("Thread not found", 409))
                }
            })
        } catch (ex) {
            const error = new ApiError(ex.message || ex.toString, ex.code);
            next(error);
            return;
        }
    }
}