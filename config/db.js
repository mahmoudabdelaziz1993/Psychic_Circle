var keys = require('../keys/index');
var mongoose = require('mongoose');
mongoose.connect(keys.mongo.url);
module.exports = {
    mongoose
};