const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {BasicStrategy} = require('passport-http');
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');

const config = require('../config');

const {User} = require('../models/users');
const {JWT_SECRET} = require('../config');

const authRouter = express.Router();

const basicStrategy = new BasicStrategy((username, password, callback) => {

	console.log("Strategy", username, password)

	let user;
	User
		.findOne({username: username})
		.then(_user => {
			user = _user;
			console.log("USER", user)
			if (!user) {
				return Promise.reject({
					reason: 'LoginError',
					message: 'Incorrect username or password'
				});
			}
			return user.validatePassword(password);
		})
		.then(isValid => {
			if (!isValid) {
				return Promise.reject({
					reason:'LoginError',
					message: 'Incorrect username or password',
				});
			}

			return callback(null, user)
		})
		.catch(err => {
			if (err.reason === 'LoginError') {
				return callback(null, false, err);
			}
			return callback(err, false);
		})
});

const jwtStrategy = new JwtStrategy({
	secretOrKey: config.JWT_SECRET,
	jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
	algorithms: ['HS256']
},
	(payload, done) => {
		done(null, payload.user)
	}
)

const createAuthToken = user => {
	return jwt.sign({user}, config.JWT_SECRET, {
		subject: user.username,
		expiresIn: config.JWT_EXPIRY,
		algorithm: 'HS256'
	});
}

const reqUser = (req, res, next) => {
	console.log('reqUser', req.user)
	next()
}

authRouter.post('/login', 
	reqUser,
	passport.authenticate('basic', {session: false}),
	(req, res) => {
		console.log('reqUser below', req.user)
		const authToken = createAuthToken(req.user.apiRepr());
		res.json({authToken})
	}
);

authRouter.post('/refresh', 
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		console.log("user", req.user)
		const authToken = createAuthToken(req.user);
		res.json({authToken})
	}
);

module.exports = {authRouter, basicStrategy, jwtStrategy};