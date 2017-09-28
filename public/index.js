const mainTemplate = `<table class="event-table">
						<caption>Events</caption>	
							</tr class="row-event">
								<th>Artist</th>
								<th>Date</th>
							</tr>
							<tr>
							<td class="table-artist"></td>
							<td class="table-date"></td>
							</tr>
					</table>`

const eventTemplate = `<div class="big-event-container">
						<div>
							<h1 class="event-name"></h1>
							<p class="event-venue">Venue: </p>
							<p class="event-date">Date: </p>
							<p class="event-address">Address: </p>
							<h2 class="all-artist-caption">All performing Artist</h2>
							<p class="event-performers"></p>
							<form>
								<input type="hidden" class="myEventId" name="eventId" value="">
								<input type="hidden" class="myEventArtist" name="mainArtist" value="">
								<input type="hidden" class="myEventName" name="eventName" value="">
								<input type="hidden" class="myEventTime" name="eventTime" value="">
								<input class="add-new-event" type="submit" value="Add to my Events">
							</form>
						</div>
					</div>`

// method="POST" action="/app/myEvents"
const getArtistData = function(query) {
	$('.concert-header').text('Artist');
	$.getJSON("/songkick/" + query, function (data) {
			console.log('FIRST CALL DATA', data);
			if (data.err) {
				$('.search-results').append('<p>' + data.err + '</p>');
			}

			else {
				const appendArtist = data.map(artist => {
					
					return !artist.onTourUntil 
						? `<p class="artist-output">
								${artist.displayName}:
								<span style="color:red"> Currently not on tour </span>
						   </p>`
						: `<p class="search-link artist-output" data-artist-id=${artist.id}>
								${artist.displayName}:
								<span class="search-link" data-artist-id=${artist.id} style="color:blue"> Currently Touring until ${artist.onTourUntil}</span>
						   </p>`

				})

				$('.search-results').append(appendArtist);
			}
	});
} 


const getUpcomingData = function(id) {
	$('.concert-header').text('Events');
	$.getJSON("/songkick/id/" + id, function(data) {
			console.log("SECOND DATA", data);
			$('.search-results').html('<p></p>');
			const appendEvent = data.map(events => {
				return `<p class="event-link" data-event-id=${events.id}>${events.displayName}</p>`
			});
			$('.search-results').append(appendEvent);
	});
}

const eventDetails = function(event) {
	console.log("EVENTS", event)
	let $template = $(eventTemplate);
	$('.concert-header').text('Event Details');
	$('.search-results').addClass('hidden');
	$.getJSON("/songkick/event/" + event, function(data) {
		console.log("EVENT DATA", data);
		let eventId = data.id;
		let eventName = data.displayName;
		let eventVenue = data.venue.displayName;
		let eventCity = data.location.city;
		let eventStreet = data.venue.street;
		let eventZip = data.venue.zip;
		let eventAddress = eventStreet + ' ' + eventCity + ' ' + eventZip;
		let eventStart = data.start.date;
		let eventTime = data.start.time;
		let dateTime = eventStart + ' ' + eventTime;
		let mainArtist = data.performance[0].displayName;
		for (let i = 0; i < data.performance.length; i++) {
			let eventArtist = data.performance[i].displayName + ',  ';
			$template.find('.event-performers').append(eventArtist);
		};
		$template.find('.event-name').append(eventName).attr('data-event-name', eventName);
		$template.find('.event-venue').append(eventVenue).attr('data-event-id', eventId);
		$template.find('.event-date').append(dateTime).attr('data-date-time', dateTime);
		$template.find('.event-address').append(eventAddress);
		$template.find('.myEventId').val(eventId);
		$template.find('.myEventArtist').val(mainArtist);
		$template.find('.myEventName').val(eventVenue);
		$template.find('.myEventTime').val(dateTime);
		// $template.find('.event-address').val(eventAddress);
		$('.append-event').append($template);
	});
;}

const searchQuery = function() {
	$('.main-form').submit(function(event) {
		event.preventDefault();
		const query = $('.main-search').val();
		// const queryType = $('select').find(':selected').val();
		// const endpoint = queryType == 'concerts' ? getArtistData(query) : getVenueData(query);
		$('.main-search').val('');
		$('.results-container').removeClass('hidden');
		$('.search-results').text('');
		$('.welcome-user').addClass('hidden');
		getArtistData(query);
	})
}

const clickOnArtist = function() {
	$('body').on('click', '.search-link', function(event) {
		event.preventDefault();
		const artistById = ($(event.target).attr('data-artist-id'));
		console.log("ID", artistById)
		getUpcomingData(artistById);
	})
}

const clickOnEvent = function() {
	$('body').on('click', '.event-link', function(event) {
		event.preventDefault();
		let singleEventId = $(event.target).attr('data-event-id');
		eventDetails(singleEventId);
	} )
}

const addNewEvent = function() {
		$('body').on('click', '.add-new-event', function(event) {
			event.preventDefault();
			const addMainArtist = $('.myEventArtist').val();
			const addEventName = $('.myEventName').val();
			const addEventTime = $('.myEventTime').val();
			const addEventId = $('.myEventId').val();
			console.log("recieved id", addMainArtist);
				$.ajax({
					url: "/myevents",
					method: "POST",
				    data: {
				    	addArtist: addMainArtist,
				    	addName: addEventName,
				    	addTime: addEventTime,
				    	addId: addEventId
				    },
				})
				.done(data => {
					window.location.replace('/app/myevents')
					console.log('NEW EVENT DATA', addEventName, addEventTime);
				})
				.fail(err => {
					console.log(err)
				})
			})
}

const clickOnLandingSingup = function() {
	$('body').on('click', '.landing-signup', function(event) {
		event.preventDefault();
		window.location.replace("/app/signup")
		console.log('landing-signup-worked');
	})
};

const clickOnLandingLogin = function() {
	$('body').on('click', '.landing-login', function(event) {
		event.preventDefault();
		window.location.replace("/app/login")
		console.log('landing-login-worked')
	})
}

const submitLogin = () => {
	$('.signup-form').on('submit', event => {
		event.preventDefault();
		const username = $('.username-input').val();
		const password = $('.password-input').val();
		
		$.ajax({
			url: "/auth/login",
			method: "POST",
			username, 
			password
		})
		.done(data => {
			console.log("THE DATA", data);
			if (data.redirect == '/app/concert') {
				window.location.replace("/app/concert")
			};
		})
		.fail(err => {
			console.log(err)
		})


		// build up an ajax request with jquery
		// send data to api
	})
}

$(function() {
	searchQuery();
	clickOnArtist();
	clickOnEvent();
	submitLogin();
	clickOnLandingSingup();
	clickOnLandingLogin();
	// clickOnNewEvent();
	addNewEvent();
	// getGeo();
})


// var clickOnNewEvent = function() {
// 	$('body').on('click', '.add-new-event', function(event) {
// 		event.preventDefault()
// 		$('.my-events').addClass('hidden');
// 		$('.new-event-container').removeClass('hidden')
// 	})
// }

// $(document).ready(function() {
// 	getLocation();

// });

// var x = document.getElementById("demo");

// function getLocation() {
// 	if(navigator.geolocation) {
// 		navigator.geolocation.getCurrentPosition(showPosition);
// 	}
// 	else {
// 		x.innerHTML = "Geolocation not supported by this browser"
// 	}
// }

// function showPosition(position) {
// 	x.innerHTML = "Latitude: " + position.coords.latitude + 
// 	"<br>Longitude: " + position.longitude;
// }

// const getVenueData = function(name) {
// 	$.getJSON("http://api.songkick.com/api/3.0/search/venues.json?query=" + name + "&apikey=y6tnZdtdNsMK4JG3", function(data) {
// 		console.log("venue", data);
// 		for (let i = 0; i < data.resultsPage.results.venue.length; i++) {
// 			let venueName = data.resultsPage.results.venue[i].displayName;
// 			let venueStreet = data.resultsPage.results.venue[i].street;
// 			let venueCity = data.resultsPage.results.venue[i].metroArea.displayName;
// 			// let venueState = data.resultsPage.results.venue[i].metroArea.state.displayName;
// 			let venueAddress = venueStreet + ' ' + venueCity;
// 			$('.myTable').after('<tr><th class="tableArtist">' + venueName + '</th><td>' + venueAddress + '</tr>');
// 		}
// 	});
// }


// const getGeo = function () {
// 	$.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address=1060+Bush+Street,+San+Francisco,+CA&key=AIzaSyAROW-3VQEqRj_dwg8Gmexm7JxWO335gBI", 
// 	function(data) {
// 		console.log("GEO", data);
// 	});
// }

// const youTubeKey = "AIzaSyAROW-3VQEqRj_dwg8Gmexm7JxWO335gBI"

// callApi = function(name) {
// 	$.getJSON("http://api.songkick.com/api/3.0/events.json?apikey=y6tnZdtdNsMK4JG3&artist_name=" + name, function(data) {
// 		console.log("11111", data)
// 		console.log(data.resultsPage.results.event.length)
// 	});
// }