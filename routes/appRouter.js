const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport')

const {User, Events} = require('../models/users');

const appRouter = express.Router();
const jsonParser = bodyParser.json();

appRouter.get('/', (req, res) => {
	res.render('signup')
});

appRouter.get('/login', (req, res) => {
	res.render('login')
});

appRouter.get('/signup', (req, res) => {
	res.render('signup') 
});

appRouter.get('/concert', isLoggedIn(), (req, res) => {
		res.render('concert', {user: req.user});
});

// Events.create({
// 	user: '59c95ae98d6c981929223230',
// 	name: 'Cool Show',
// 	date: Date.now()
// })
// Events.find({user: '59c95ae98d6c981929223230'})
// .populate('user')
// .then(data => {
// 	console.log(data, 'Events')
// })
// User.find()
// .then(data => {
// 	console.log(data, 'User')
// })


appRouter.get('/myevents', isLoggedIn(), (req, res) => {	
	User.findOne({_id: req.user._id})
		.then(user => {
			res.render('myEvents', {user})
		})
});


appRouter.get('/addEvent', (req, res) => {
	res.render('addEvent')
})

function isLoggedIn () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/app/login')
	}
}

module.exports = {appRouter}








