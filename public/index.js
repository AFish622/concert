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
							<form method="GET" action="/app/myEvents">
								<input type="hidden" class="myEventId" name="eventId" value="">
								<input type="hidden" class="myEventShow" name="mainArtist" value="">
								<input type="hidden" class="myEventVenue" name="eventName" value="">
								<input type="hidden" class="myEventDate" name="eventTime" value="">
								<input type="submit" class="add-new-event" value="Add to my Events">
								<p class="notification"></p>
								<input type="submit" class="back-to-events hidden" value="Back to My Events">
							</form>
							<form method="GET" action="/app/concert" class="search-again-container">
								<input class="search-again hidden" type="submit" value="Search Again">
							</form>
						</div>
					</div>`


const getArtistData = (query) => {
	$('.concert-header').text('Artist');
	$.getJSON("/songkick/" + query,  (data) => {
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


const getUpcomingData = (id) => {
	$('.concert-header').text('Events');
	$('.back-container').show();
	$.getJSON("/songkick/id/" + id, (data) => {
			console.log("SECOND DATA", data);
			$('.search-results').html('<p></p>');
			const appendEvent = data.map(events => {
				return `<p class="event-link" data-event-id=${events.id}>${events.displayName}</p>`
			});
			$('.search-results').append(appendEvent);
	});
}

const eventDetails = (event) => {
	console.log("EVENTS", event)
	const $template = $(eventTemplate);
	$('.concert-header').text('Event Details');
	$('.search-results').addClass('hidden');
	$.ajax({
		url: `/myevents/${event}/registered`
	})
	.then(eventArr => {
		console.log("EEEEEE", eventArr)
		$.getJSON("/songkick/event/" + event, (data) => {
			console.log("THE DATA", data);
			const eventId = data.id;
			const eventName = data.displayName;
			const eventVenue = data.venue.displayName;
			const eventCity = data.location.city;
			const eventStreet = data.venue.street;
			const eventZip = data.venue.zip;
			const eventAddress = eventStreet + ' ' + eventCity + ' ' + eventZip;
			const eventStart = data.start.date;
			const eventTime = data.start.time;
			const dateTime = eventStart + ' ' + eventTime;
			const mainArtist = data.performance[0].displayName;
			for (let i = 0; i < data.performance.length; i++) {
				const eventArtist = data.performance[i].displayName + ',  ';
				$template.find('.event-performers').append(eventArtist);
			};
			$template.find('.event-name').append(eventName).attr('data-event-name', eventName);
			$template.find('.event-venue').append(eventVenue).attr('data-event-id', eventId);
			$template.find('.event-date').append(dateTime).attr('data-date-time', dateTime);
			$template.find('.event-address').append(eventAddress);
			$template.find('.myEventId').val(eventId);
			$template.find('.myEventShow').val(eventName);
			$template.find('.myEventVenue').val(eventVenue);
			$template.find('.myEventDate').val(dateTime);
			if(eventArr.eventIds.includes(data.id)) {
				$template.find('.add-new-event').hide();
				$template.find('.back-to-events').removeClass('hidden');
			}
			$('.append-event').append($template);
		});
	})
	.fail(err => {
		console.log(err);
	})
		
	
;}

const customEventDetails = id => {
	console.log("THE ID IS", id);
	$.ajax({
		url: `/myevents/${id}`,
	})
	.then(data => {
		console.log("DATA", data);
		const template = $(eventTemplate);
		const event = data.customEvent.event;
		const venue = data.customEvent.venue;
		const location = data.customEvent.location;
		const date = data.customEvent.date;
		const artist = data.customEvent.artist;
		template.find('.event-name').append(event);
		template.find('.event-venue').append(venue);
		template.find('.event-address').append(location);
		template.find('.event-date').append(date);
		template.find('.event-performers').append(artist);
		$('.append-event').append(template);
	})
}

const searchQuery = () => {
	$('.main-form').submit((event) => {
		event.preventDefault();
		const query = $('.main-search').val();
		$('.main-search').val('');
		$('.results-container').show();
		$('.event-table, .new-event-container, .big-event-container, .welcome-user').hide();
		$('.search-results').text('');
		$('.search-results').show();
		getArtistData(query);
	});
};

const clickOnArtist = () => {
	$('body').on('click', '.search-link', (event) => {
		event.preventDefault();
		const artistById = ($(event.target).attr('data-artist-id'));
		getUpcomingData(artistById);
	})
}

const clickOnEvent = () => {
	$('body').on('click', '.event-link', (event) => {
		event.preventDefault();
		$('.append-event').show();
		$('.search-results').hide();
		let singleEventId = $(event.target).attr('data-event-id');
		eventDetails(singleEventId);
	});
}

const addNewEvent = () => {
		$('body').on('click', '.add-new-event', (event) => {
			event.preventDefault();
			const addShow = $('.myEventShow').val();
			const addEventVenue = $('.myEventVenue').val();
			const addEventDate = $('.myEventDate').val();
			const addEventId = $('.myEventId').val();
			console.log("recieved id", addShow);
				$.ajax({
					url: "/myevents",
					method: "POST",
				    data: {
				    	show: addShow,
				    	venue: addEventVenue,
				    	date: addEventDate,
				    	addId: addEventId,
				    },
				})
				.done(data => {
					$('.add-new-event, .new-button-container').hide();
					$('.notification').text('Event added to My Events')
					$('.search-again, .notification').show();
				})
				.fail(err => {
					console.log(err)
				})
			})
}

const myEventsDetails = () => {
	$('body').on('click', '.myEventsLink', (event) => {
		event.preventDefault();
		const myEventId = $(event.target).attr('data-myEventsId');
		const mongoId = $(event.target).attr('data-mongo-id');
		$('.event-table, .welcome-user').hide();
		
		

		if(myEventId) {
			eventDetails(myEventId);
		}
		else {
			customEventDetails(mongoId)
		}
	})
}

const repaintEventTable = events => {
	const top = `	<tr>
						<th>Event</th>
						<th>Venue</th>
						<th>Date</th>
					</tr>`

	const toAppend = events.map(event => {
		return 	`<tr>
		   			<td>${event.event}</td>
		   			<td>${event.venue}</td>
		   			<td>${event.date}</td>
		   			<td class="myEventsLink" data-myEventsId=${event.eventId} data-mongo-id=${event._id}>Event Info</td>
					<td class="delete-event" data-deleteId=${event._id}>Delete Event</td>
				 </tr>`
	})
	$('.event-table').html(top + toAppend)
}

const deleteEvent = () => {
	$('body').on('click', '.delete-event', (event) => {
		event.preventDefault();
		const deleteId = $(event.target).attr('data-deleteId');
		console.log('the id i want to delete is ', deleteId);
		$.ajax({
			url: '/myEvents',
			method: 'DELETE',
			data: {
				id: deleteId
			}
		})
		.done(res => {
			repaintEventTable(res.events)
		})
		.fail(err => {
			console.log(err);
		})
	})
}

const addEventToData = (event) =>{
	$('body').on('submit', '.signup-form', (event) => {
		event.preventDefault();
		const newEvent = $('.event-input').val();
		const newVenue = $('.venue-input').val();
		const location = $('.venue-location').val();
		const newDate = $('.date-input').val();
		const artist = $('.artist-input').val();
		$.ajax({
			url: '/myEvents',
			method: 'POST',
			data: {
				show: newEvent,
				venue: newVenue,
				location: location,
				date: newDate,
				artist: artist
			}
		})
		.done(event => {
			window.location.replace('/app/myevents');
		})
		.fail(err => {
			console.log(err);
		})
	});
}
	

const clickOnLandingSingup = () => {
	$('body').on('click', '.landing-signup', (event) => {
		event.preventDefault();
		window.location.replace("/app/signup");
		console.log('landing-signup-worked');
	})
};

const clickOnLandingLogin = () => {
	$('body').on('click', '.landing-login', (event) => {
		event.preventDefault();
		window.location.replace("/app/login")
		console.log('landing-login-worked')
	})
}

const submitLogin = () => {
	$('.signup-form').on('submit', (event) => {
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
				window.location.replace("/app/myEvents")
			};
		})
		.fail(err => {
			console.log(err)
		})
	})
}

$(function() {
	searchQuery();
	clickOnArtist();
	clickOnEvent();
	submitLogin();
	clickOnLandingSingup();
	clickOnLandingLogin();
	myEventsDetails();
	deleteEvent();
	clickOnNewEvent();
	addNewEvent();
	addEventToData();
	// getGeo();
})


var clickOnNewEvent = function() {
	$('body').on('click', '.new-event-button', function(event) {
		event.preventDefault();
		window.location.replace("/app/addEvent");
	})
}

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