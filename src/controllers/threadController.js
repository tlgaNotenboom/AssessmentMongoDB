const Thread = require ('../models/thread')


module.exports = {

    getAllThreads(res, next){
        try {
            Thread.find({}, (err, threads) => {
                let threadMap = {};

                threads.forEach(thread => {
                    threadMap[thread._id] = thread;
                });
                if (threadMap.length === 0) {
                    res.status(200).send(threadMap);
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
    }
};