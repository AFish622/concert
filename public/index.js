const event-table = `<table>
						<caption>My Events</caption>
						<tr clss="table-header">
							<th>Event</th>
							<th>Date</th>
							<th>Location</th>
						</tr>
								
						<tbody>
							</tr>
								<td>Flume</td>
								<td>10/10/10</td>
								<td>Bill Graham, San Francisco CA</td>
							</tr>
							<tr>
								<td>Skrillex</td>
								<td>11/11/11</td>
								<td>Fox Theatre, Oakland CA</td>
							</tr>
							<tr>
								<td>Coachella Valley Music Festical</td>
								<td>12/12/12</td>
								<td>Indio, CA</td>
							</tr>
						</tbody>
					</table>`

//upcoming events search
//http://api.songkick.com/api/3.0/events.json?apikey=y6tnZdtdNsMK4JG3&artist_name=lorde

//search by artist
//http://api.songkick.com/api/3.0/search/artists.json?query=flume&apikey=y6tnZdtdNsMK4JG3

//search by id
//http://api.songkick.com/api/3.0/artists/68043/calendar.json?apikey=y6tnZdtdNsMK4JG3

//search by music brainz id
//http://api.songkick.com/api/3.0/artists/mbid:35fd8d42-b4a6-4414-9827-8766bd0daa3c/calendar.json?apikey=y6tnZdtdNsMK4JG3

//search by venue
//http://api.songkick.com/api/3.0/search/venues.json?query=bill_graham&apikey=y6tnZdtdNsMK4JG3

//search by similar artist
//http://api.songkick.com/api/3.0/artists/68043/similar_artists.json?apikey=y6tnZdtdNsMK4JG3

//search by past events
//http://api.songkick.com/api/3.0/artists/3084961/gigography.json?apikey=y6tnZdtdNsMK4JG3

//search by location name
//http://api.songkick.com/api/3.0/search/locations.json?query=san_francisco&apikey=y6tnZdtdNsMK4JG3

//search by location lat and long
//http://api.songkick.com/api/3.0/search/locations.json?location=geo:37.7599,-122.437&apikey=y6tnZdtdNsMK4JG3

//Data to be displayed during initial search
// eventDetails: 
// 	location
// 	displayName
// 	date
// 	venue
	
//Data to be displayed during specific event
//Artist Name
//Event details
//youtube clip
//related artist


const getArtistData = function(endpoint, query) {
	const key = '&apikey=y6tnZdtdNsMK4JG3';
	$.getJSON("http://api.songkick.com/api/3.0/search/" + endpoint + query + key,
		function (data) {
			console.log(data);
			if (data.resultsPage.totalEntries === 0) {
				alert('No results found')
			}
			for (let i = 0; i < data.resultsPage.results.artist.length; i++) {
				let artist = data.resultsPage.results.artist[i].displayName;
				let touring = data.resultsPage.results.artist[i].onTourUntil = 'null' ? ' Currently not on tour ' : ' Currently Touring ' + data.resultsPage.results.artist[i].onTourUntil;
				let artistId = data.resultsPage.results.artist[i].id;
				$('.search-results').append('<div class="little-container"><p><a class="chosen-link" href=#>' + artist + '</a>' + touring +'</p><p class="artist-id hidden">' + artistId + '</p></div>' )
			}
		
	});
}

const getUpcomingData = function(name) {
	$.getJSON("http://api.songkick.com/api/3.0/events.json?apikey=y6tnZdtdNsMK4JG3&artist_name=" + name,
		function(data) {
			console.log("UPCOMING", data)
			$('.search-results').text('');
			if (data.resultsPage.totalEntries === 0) {
				alert('No results found')
			}
			for (let i = 0; i < data.resultsPage.results.event.length; i++) {
				const concertName = data.resultsPage.results.event[i].displayName;
				const concertType = data.resultsPage.results.event[i].type;
				$('.search-results').append('<div class="little-container"><p class="concert-link"><a href=#>' + concertName + ' (' + concertType + ') ' + '</a></p></div>');
			}
			
		});
}

var searchRequest = function() {
	$('.main-form').submit(function(event) {
		event.preventDefault();
		const endpoint = 'artists.json?query=';
		const query = $('.main-search').val();
		$('.main-search').val('');
		$('.results-container').removeClass('hidden');
		$('.search-results').html('');
		getArtistData(endpoint, query);
	})
}

var renderArtistLinks = function() {
	$('body').on('click', '.chosen-link', function(event) {
	event.preventDefault();
	let singleId = $('.little-container').find('.chosen-link').html();
	console.log(singleId)
	getUpcomingData(singleId);
	})
}

var renderIndividualShow = function() {
	$('body').on('click', 'concert-link', function(event) {
		event.preventDefault();
		let singleConcert = $('.little-container').find('.concert-link').html();
		console.log(singleConcert);
	} )
}

var clickOnNewEvent = function() {
	$('.new-event-button').on('click', function() {
		event.preventDefault()
		$('.my-events').addClass('hidden');
		$('.new-event-container').removeClass('hidden')
	})
}


$(function() {
	searchRequest();
	renderArtistLinks();
	renderIndividualShow();
	clickOnNewEvent();
})


// else {
// 				for (let i = 0; i < data.resultsPage.results.venue.length; i++) {
// 					let venue = data.resultsPage.results.venue[i].displayName;
// 					let venueId = data.resultsPage.results.venue[i].id;
// 					$('.search-results').append('<div class="little-container"><p><a class="chosen-link" href=#>' + venue + '</a><p></div>' )
// 				}
			// }
