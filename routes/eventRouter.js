const express = require('express');
const eventRouter = express.Router();
const bodyParser = require('body-parser');
const {User, Events} = require('../models/users');

eventRouter.post('/', isLoggedIn(), (req, res) => {
	// EVENT REQ { addName: 'Railhead, Boulder Station Hotel Casino',
	// console.log("THE USER", user)
	User.findOneAndUpdate({_id: req.user._id}, {$push: {'events': req.body.addArtist}}, {new: true})
		.then(user => {
			res.send('all good')
		})
})

function isLoggedIn () {  
	return (req, res, next) => {
	    if (req.isAuthenticated()) return next();
	    res.redirect('/app/login')
	}
}

module.exports = {eventRouter}