const express = require('express');
const eventRouter = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {User, Event} = require('../models/users');

eventRouter.post('/', isLoggedIn(), (req, res) => {
	console.log("THE USER", req.user)
	const userId = req.user._id;
	const id = req.body.addId;
	const event = req.body.addName;
	const artist = req.body.addArtist;
	const date = req.body.addTime;
	const newEvent = {
		artist: artist,
		event: event,
		date: date
	}
	// User.findOneAndUpdate({_id: userId}, {$push: {'events': id, event, artist, date}}, {new: true})
	User.findOneAndUpdate({_id: userId}, {$push: {'events': newEvent}}, {new: true})

	// User.find({_id: userId}).populate('events')
		.then(user => {
			res.status(200).json(user)
		});
})
// User.findOneAndUpdate({_id: userId}, {$pushAll: {'events': [ artist, event, date, id ]}}, {new: true});
	// User.findOneAndUpdate({_id: userId}, {$push: {'events': eventInfo}}, {new: true})
	// User.findOneAndUpdate({_id: userId}, {$set: {'eventArtist': artist}}, {new: true})

function isLoggedIn () {  
	return (req, res, next) => {
	    if (req.isAuthenticated()) return next();
	    res.redirect('/app/login')
	}
}

module.exports = {eventRouter}