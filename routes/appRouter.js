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








