var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

	username : { type: String, required: true, lowercase: true, unique: true},
	password : { type: String, required: true },
	joined : { type: Date, default: Date.now }

});

module.exports = mongoose.model('User', userSchema);