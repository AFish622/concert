const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport')

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

	const stringFields = ['username', 'password'];
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
			min: 8,
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

	// console.log("USER", User)

	return User
		.findOne({username})
		// .count()
		// .then(count => {
		// 	// console.log("user-------", User)
		// 	if (count > 0) {
		// 		console.log('user already saved')
		// 		return Promise.reject({
		// 			code: 422,
		// 			reason: 'ValidationError',
		// 			message: 'Username already taken',
		// 			location: 'username'
		// 		});
		// 	}

		// 	return User.find({username})
		// })
		.then(user => {
			console.log("USERRRR", user)
			if (!user){
				let _user = new User()
				_user.username = username;
				_user.password = password;
				return _user.save()
			}
			else {
				return Promise.reject();
			}
			// return User
			// 	.create({
			// 		username,
			// 		password: hash,
			// 		firstName,
			// 		lastName
			// 	})
		})
		.then(user => {
			return res.status(201).json(user.apiRepr());
		})
		.catch(err => {
			if (err.reason === 'ValidationError') {
				return res.status(err.code).json(err);
			}
			console.log("ERROOOORRRR", err)
			res.status(500).json({code: 500, message: 'Internal server error'});
		});
});

module.exports = {userRouter}






