const express = require('express');
const passport = require('passport');
// const jwt = require('jsonwebtoken');
const {BasicStrategy} = require('passport-http');
// const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');

const config = require('../config');

const {User} = require('../models/users');
// const {JWT_SECRET} = require('../config');

const authRouter = express.Router();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const basicStrategy = new BasicStrategy((username, password, callback) => {

	

	let user;
	User
		.findOne({username: username})
		.then(_user => {
			user = _user;
			
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

// const jwtStrategy = new JwtStrategy({
// 	secretOrKey: config.JWT_SECRET,
// 	jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
// 	algorithms: ['HS256']
// },
// 	(payload, done) => {
// 		done(null, payload.user)
// 	}
// )

// const createAuthToken = user => {
// 	return jwt.sign({user}, config.JWT_SECRET, {
// 		subject: user.username,
// 		expiresIn: config.JWT_EXPIRY,
// 		algorithm: 'HS256'
// 	});
// }

authRouter.post('/login', 
	passport.authenticate('basic', {session: true}),
	(req, res) => {
		if (req.user.events.length == 0 ) {
			res.send({redirect: '/app/concert'})
		}
		else {
		res.send({redirect: '/app/myEvents'});
		}
			// res.render('concert', {user: req.user});
		
		// res.json({authToken})
	}
);

authRouter.post('/logout', (req, res) => {
	req.logout();
	req.session.destroy(function (err) {
		res.clearCookie('connect.sid', { path: '/' });
        res.redirect('../app/login'); //Inside a callback… bulletproof!
    });
	// res.redirect('../app/login');
})

// authRouter.post('/refresh', 
// 	passport.authenticate('jwt', {session: true}),
// 	(req, res) => {
// 		console.log("REFRESH", req.user)
// 		const authToken = createAuthToken(req.user);
// 		res.json({authToken})
// 	}
// );





module.exports = {authRouter, basicStrategy};
// module.exports = {authRouter, basicStrategy, jwtStrategy};