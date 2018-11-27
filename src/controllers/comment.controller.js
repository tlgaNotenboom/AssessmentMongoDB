const ApiError = require('../ApiError')
const Comment = require('../models/Comment');
const User = require('../models/user');

module.exports = {
    addComment(req, res, next) {
        const commentProps = req.body
        try {
            User.find({
                name: commentProps.username
            }).then((foundUser) => {
                if (foundUser.length === 0) {
                    next(new ApiError("No user found", 404))
                } else {
                    Comment.create(commentProps).then((comment) => {
                        res.status(200).send(comment)
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
}