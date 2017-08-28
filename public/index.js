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




const getData = function() {
	$.getJSON("http://api.songkick.com/api/3.0/search/artists.json?query=flume&apikey=y6tnZdtdNsMK4JG3", function(data) {
		console.log(data.resultsPage.results.artist);
	})
}


$(function() {
	getData();
})
