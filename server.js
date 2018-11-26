const Mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express')
const ApiError = require('./src/ApiError')

Mongoose.connect("mongodb://localhost/StudditMongo");
Mongoose.connection
    .once('open', () => console.log("Mongoose: connection open"))
    .on("error", (err) => console.warn("Error", err));

const port = process.env.PORT || 3000

let app = express();

app.use(bodyParser.json())

app.use("*", function(req, res, next) {
    next();
});

// ROUTES

// ROUTES

app.use('*', (req, res, next) => {
	console.log('Non-existing endpoint');
	const error = new ApiError("Non existant endpoint", 404);
	next(error);
});

app.use((err, req, res, next) => {
	console.log(err);
	res.status(err.code).send(err);
});

app.listen(port, () => {
	console.log('Server running on port ' + port);
});

module.exports = app;