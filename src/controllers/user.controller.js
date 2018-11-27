const ApiError = require('../ApiError')
const User = require('../models/user');

module.exports = {
    addUser(req, res, next) {

        try {
            const userProps = req.body
            User.find({
                name: userProps.name
            }).then((foundUser) => {
                if (foundUser.length === 0) {
                    User.create(userProps).then(user => {
                        res.status(200).send(user)
                    }).catch((err) => {
                        next(new ApiError(err.toString(), 400))
                    })
                } else {
                    next(new ApiError("User already exists", 409))
                }
            })
        } catch (ex) {
            const error = new ApiError(ex.message || ex.toString, ex.code);
            next(error);
            return;
        }
    },

    getAllUsers(req, res, next) {
        try {
            User.find({}, (err, users) => {
                if (users.length !== 0) {
                    res.status(200).send(users);
                } else {
                    next(new ApiError("No users found", 404));
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

    getSpecificUser(req, res, next) {
        const userId = req.params.id;
        try {
            User.findById({
                _id: userId
            }, (err, users) => {
                if (users) {
                    res.status(200).send(users);
                } else {
                    next(new ApiError("No users found", 404));
                }
            });
        } catch (ex) {
            const error = new ApiError(ex.message || ex.toString, ex.code);
            next(error);
            return;
        }
    },

    changePassword(req, res, next) {
        const userProps = req.body;

        try {
            User.find({
                name: userProps.name
            }).then((foundUser) => {
                if (userProps.newPassword === undefined) {
                    next(new ApiError("Please enter a new password", 422));
                } else if (foundUser.length === 0) {
                    next(new ApiError("User not found", 404));
                } else if (foundUser[0].password === userProps.password) {
                    User.findOneAndUpdate({name: userProps.name}, {$set:{password: userProps.newPassword}}).then((editedUser) => {
                        editedUser.password = userProps.newPassword
                        res.status(200).send(editedUser)
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

    removeUser(req, res, next) {
        const userProps = req.body

        try {
            User.find({
                name: userProps.name
            }).then((foundUser) => {
                if (foundUser.length === 0) {
                    next(new ApiError("User not found", 404));
                } else if (foundUser[0].password === userProps.password) {
                    User.findOneAndDelete({name: userProps.name}).then((deletedUser) => {
                        res.status(200).send({done: "User " + deletedUser.name + " deleted!" })
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
    }
}