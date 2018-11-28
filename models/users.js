const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = mongoose.Schema({
		username: {
			type: String,
		},
		fullname: {
			type: String
		},
		gender: {
			type: String
		},
		mobileNumber: {
			type: Number,
			required: "kindly Enter mobile no." 
		},
		email: {
			type: String,
			required: "Kindly Enter email"
		},
		password: {
			type: String,
			required: "Enter the password"
		}
});

UserSchema.methods.comparePassword = function(password)
{
 return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('User', UserSchema);