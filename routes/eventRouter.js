const express = require('express');
const eventRouter = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {User, Event} = require('../models/users');

eventRouter.post('/', isLoggedIn(), (req, res) => {
	console.log("REQBODYYYYYYYYY", req.body)
	const userId = req.user._id;
	const id = req.body.addId;
	const event = req.body.show;
	const venue = req.body.venue;
	const location = req.body.location;
	const date = req.body.date.replace(' null', '');
	const artist = req.body.artist
	const newEvent = {
		event: event,
		venue: venue,
		date: date,
		location: location,
		eventId: id,
		artist: artist
	};

	User.findOneAndUpdate({_id: userId}, {$push: {'events': newEvent}}, {new: true})
		.then(user => {
			res.status(200).json(user);
		});
})


eventRouter.delete('/', (req, res) => {
	const userId = req.user._id
	const id = req.body.id;
	User.findOneAndUpdate({_id: userId}, {$pull: {'events':{ _id: id }}}, {new: true})
		.then(user => {
			res.json({events: user.events});
		})
		.catch(err => {
			res.status(500).send(err);
		});
});

eventRouter.get('/', (req, res) => {
	res.render('myEvents')
});

eventRouter.get('/:id', (req, res) => {
	const customEvent = req.user.events.filter(event => {
		return event._id == req.params.id
	}) [0]
	res.send({customEvent})
});

function isLoggedIn () {  
	return (req, res, next) => {
	    if (req.isAuthenticated()) return next();
	    res.redirect('/app/login')
	}
}

module.exports = {eventRouter}