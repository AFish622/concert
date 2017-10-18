const express = require('express');
const Songkick = require('songkick-api-node');
const songkickApi = new Songkick(process.env.SONGKICK_API_KEY);
const songRouter = express.Router();

songRouter.get('/:artist', (req, res) => {
	songkickApi.searchArtists({ query: req.params.artist })
		.then(artists => {
			if(!artists) {
				res.json({err: 'No Artists Found'})
			}
			else {
				res.json(artists);	
			}
		})
})

songRouter.get('/id/:id', (req, res) => {
	songkickApi.getArtistUpcomingEvents(req.params.id)
		.then(events => {
			res.json(events);
	})
})

songRouter.get('/event/:id', (req, res) => {
	console.log("REQUEST", req.params.id)
	songkickApi.getEventDetails(req.params.id)
	.then(event => {
		res.json(event);
	})


})

module.exports = {songRouter}