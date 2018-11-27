const Thread = require ('../models/thread')


module.exports = {

    getAllThreads(res, next){
        try {
            Thread.find({}, (err, threads) => {
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
    
    getSpecificThread(req, res, next) {
        const threadId = req.params.id;
        try {
            Thread.findById({
                _id: threadId
            }, (err, threads) => {
                if (threads) {
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
            Thread.find({
                _id: threadProps.id
            }).then((foundThread) => {
                } if (foundThread.length === 0) {
                    next(new ApiError("Thread not found", 404));
                } else if (foundThread[0].title === threadProps.title) {
                    Thread.findOneAndUpdate({_id: threadProps.id}, {$set:{content: threadProps.content, username: threadProps.username}}).then((editedThread) => {
                        editedThread.content = threadProps.content;
                        editedThread.username = threadProps.username;
                        res.status(200).send(editedThread)
                    }).catch((err) => {
                        next(new ApiError(err.toString(), 400))
                    })
                } else {
                    next(new ApiError("Entered wrong password!", 401))
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
         const threadProps = req.body

        try {
            Thread.find({
                _id: threadProps.id
            }).then((foundThread) => {
                if (foundThread.length === 0) {
                    next(new ApiError("Thread not found", 404));
                } else(){
                    //Delete thread, comments, upvotes en downvotes
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
    }
};