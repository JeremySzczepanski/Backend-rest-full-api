const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');				//uniqueValidator est un plugin de mongoose, on va donc mettre le Schema plus bas

let UserSchema = new Schema({
	'username' : {type: String, required: false},
	'firstname' : {type: String, required: false},
	'lastname' : {type: String, required: false},
	'email' : {type: String, required: true, unique: true},		//On ajoute unique: true
	'password' : {type: String, required: true},
	'avatar' : {type: String, required: false},
	'createdAt' : {type : Date, default : Date.now() }
})

UserSchema.plugin(uniqueValidator);								//ICI

module.exports = mongoose.model('User', UserSchema);