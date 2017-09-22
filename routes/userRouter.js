const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const {User} = require('../models/users');


const userRouter = express.Router();
const jsonParser = bodyParser.json();

userRouter.post('/', (req, res) => {

	console.log("REQ.BODY", req.body)


	const requiredFields = ['username', 'password'];
	const missingField = requiredFields.find(field => !(field in req.body));

	if (missingField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Missing field',
			location: missingField
		});
	}

	const stringFields = ['username', 'password', 'firstName', 'lastName'];
	const nonStringFields = stringFields.find(field =>
		(field in req.body) && typeof req.body[field] != 'string');

	if (nonStringFields) {
		return res(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Incorrect field type: expected string',
			location: nonStringFields
		});
	}

	const explicitlyTrimmedFields = ['username', 'password'];
	const nonTrimmedField = explicitlyTrimmedFields.find(field =>
		req.body[field].trim() !== req.body[field]);

	if (nonTrimmedField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Cannot start or end with whitespace',
			location: nonTrimmedField
		});
	}

	const sizedFields = {
		username: {
			min: 1
		},
		password: {
			min: 3,
			max: 72
		}
	};
	const tooSmallField = Object.keys(sizedFields).find(field => 
		'min' in sizedFields[field] &&
		req.body[field].trim().length < sizedFields[field].min);

	const tooLargeField = Object.keys(sizedFields).find(field =>
		'max' in sizedFields[field] &&
		req.body[field].trim().length > sizedFields[field].max);

	if (tooSmallField || tooLargeField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: tooSmallField ? 
			`Must be at least ${sizedFields[tooSmallField].min} characters long` :
        	`Must be at most ${sizedFields[tooLargeField].max} characters long`,
        	location: tooSmallField || tooLargeField
		});
	}

	let {username, password, firstName='', lastName=''} = req.body;

	firstName = firstName.trim();
	lastName = lastName.trim();

	return User
		.findOne({username})
		.count()
		.then(count => {
			if (count > 0) {
				console.log('Username already used')
				return Promise.reject({
					code: 422,
					reason: 'ValidationError',
					message: 'Username already taken',
					location: 'username'
				});
			}

			return User.find({username})
		})
		.then(user => {
			console.log("USERRRR", user)
			if (!user.length){
				let _user = new User()
				_user.username = username;
				_user.password = password;
				return _user.save()
			}
			else {
				return res.redirect('/app/login')
			}
		})
		.then(user => {
			return res.redirect('/app/login')
		})
		.catch(err => {
			console.log("ERRRRRR", err)

			if (err.message === 'Username already taken') {
				req.flash('message', 'Username exists, please login')
				return res.redirect('/app/login')
			}

			if (err.reason === 'ValidationError') {
				req.flash('message', 'User name or password is incorrect')
				return res.redirect('back')
			}
			res.status(500).json({code: 500, message: 'Internal server error'});
		});
});

userRouter.get('/logout', (req, res) => {
	req.logout();
  	res.redirect('/app');
})

module.exports = {userRouter}






