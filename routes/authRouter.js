const express = require('express');
const passport = require('passport');
const {BasicStrategy} = require('passport-http');

const config = require('../config');

const {User} = require('../models/users');

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

authRouter.post('/login', 
	passport.authenticate('basic', {session: true}),
	(req, res) => {
		if (req.user.events.length == 0 ) {
			res.send({redirect: '/app/concert'})
		}
		else {
		res.send({redirect: '/app/myEvents'});
		}
	}
);

authRouter.post('/logout', (req, res) => {
	req.logout();
	req.session.destroy(function (err) {
		res.clearCookie('connect.sid', { path: '/' });
        res.redirect('../app/login');
    });
})







module.exports = {authRouter, basicStrategy};