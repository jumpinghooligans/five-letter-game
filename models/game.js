var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({

	name : { type: String, required: true, lowercase: true, unique: true},
	player1 : { type: String, required: true },
	player2 : { type: String },
	player1word : { type : String, default: ""},
	player2word : { type : String, default: ""},
	created : { type: Date, default: Date.now },
	turn : { type: String },
	stage : { type : String, default : "pick" },
	words : [{
		player : { type: String },
		word : { type: String },
		letters : { type: Number, default: 0 },
		position : { type: Number, default: 0 }
	}]

});

module.exports = mongoose.model('Game', gameSchema);