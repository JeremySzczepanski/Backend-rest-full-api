const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProductSchema = new Schema({
	'name' : {type: String, required: true},
	'description' : {type: String, required: true},
	'price' : {type: Number, required: true},
	'stock' : {type: Number, required: true},
	'image' : {type: String, required: true},
	'userId' : {
		type: Schema.Types.ObjectId,
		ref: 'User'				
	},
	'createdAt' : {type: Date , default: Date.now()}				
})

module.exports = mongoose.model('Product', ProductSchema);