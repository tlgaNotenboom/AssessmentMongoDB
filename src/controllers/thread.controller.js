const Thread = require('../models/thread')
const ApiError = require('../ApiError');
const User = require('../models/user');
const Comment = require('../models/comment')

module.exports = {

    getAllThreads(req, res, next) {
        try {
            Thread.find({}).select("-comments").exec().then((threads) => {
                if (threads.length !== 0) {
                    res.status(200).send(threads);
                } else {
                    next(new ApiError("No threads found", 404));
                }
            });
        } catch (ex) {
            const error = new ApiError(ex.message || ex.toString, ex.code);
            next(error);
            return;
        }
    },

    getCommentSortedThreads(req, res, next) {
        try {
            Thread.find({}).select("-comments").sort({"comments": -1}).exec().then((threads) => {
                if (threads.length !== 0) {
                    res.status(200).send(threads);
                } else {
                    next(new ApiError("No threads found", 404));
                }
            }).catch((err) => {
                next(new ApiError("No threads found", 404));
            })
        } catch (ex) {
            const error = new ApiError(ex.message || ex.toString, ex.code);
            next(error);
            return;
        }
    },

    getSpecificThread(req, res, next) {
        const threadId = req.params.id;
        try {
            Thread.findById({
                _id: threadId
            })
            .then((threads) => {
                if (threads.length !== 0) {
                    res.status(200).send(threads);
                } else {
                    next(new ApiError("No thread with that ID found", 422));
                }
            })
        } catch (ex) {
            const error = new ApiError(ex.message || ex.toString, ex.code);
            next(error);
            return;
        }
    },
    addThread(req, res, next) {
        try {
            const threadProps = req.body
            Thread.find({
                _id: threadProps.id
            }).then((foundThread) => {
                if (foundThread.length === 0) {
                    Thread.create(threadProps).then(thread => {
                        res.status(200).send(thread)
                    }).catch((err) => {
                        next(new ApiError(err.toString(), 400))
                    })
                } else {
                    next(new ApiError("Thread already exists", 409))
                }
            })
        } catch (ex) {
            const error = new ApiError(ex.message || ex.toString, ex.code);
            next(error);
            return;
        }
    },
    editThread(req, res, next) {
        const threadProps = req.body;
        try {
            Thread.findById({
                _id: req.params.id
            }).then((foundThread) => {
                console.log(threadProps)
                console.log(foundThread)
                if (foundThread.length === 0) {
                    next(new ApiError("Thread not found", 422));
                } else if (foundThread.title === threadProps.title) {
                    Thread.findOneAndUpdate({
                        _id: req.params.id
                    }, {
                        $set: {
                            content: threadProps.content,
                            username: threadProps.username
                        }
                    }).then((editedThread) => {
                        editedThread.content = threadProps.content;
                        editedThread.username = threadProps.username;
                        res.status(200).send(editedThread)
                    }).catch((err) => {
                        next(new ApiError(err.toString(), 400))
                    })
                } else {
                    next(new ApiError("You cannot change the title!", 401))
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

    removeThread(req, res, next) {
        const threadId = req.params.id

        try {
            Thread.find({
                _id: threadId
            }).then((foundThread) => {
                if (foundThread.length === 0) {
                    next(new ApiError("Thread not found", 422));
                } else {
                    Comment.deleteMany({thread: foundThread[0]._id}).then(() => {
                        Thread.findByIdAndDelete(threadId).then(() => {
                        res.status(200).send({success: "Thread deleted!"})
                        }).catch((err) => {
                            next(new ApiError(err.toString(), 400))
                        })
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
    }
};