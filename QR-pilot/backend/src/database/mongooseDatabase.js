const mongoose = require('mongoose');
const config = require("../../config");

mongoose.Promise = Promise; // Ask Mongoose to use standard Promises
mongoose.set('debug', false);  // Ask Mongoose to log DB request to console
mongoose.connect(config.MONGODB_URL); // Connect to local database

module.exports = mongoose;
