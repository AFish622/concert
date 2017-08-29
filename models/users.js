const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
})

UserSchema.methods.apiRepr = function() {
	return {
		username: this.username 
	}
}

UserSchema.methods.validatePassword = function(password) { 
	var user = this; 
	return bcrypt.compareSync(password, user.password); 
}


UserSchema.methods.hashPassword = function(password) {
	return bcrypt.hash(password, 10)
}

UserSchema.pre('save', function(next) { 
	var user = this; 
	if (!user.isModified('password')) {
		return next(); 
	}
	bcrypt.hash(user.password, null, null, function(err, hash) { 
			if (err) {
				 return next(err); 
			}
			user.password = hash; 
			next();
	});
});

const User = mongoose.model('User', UserSchema);

module.exports = {User};

// module.exports = mongoose.model('User', UserSchema);


// export default const User = mongoose.model('User', UserSchema);