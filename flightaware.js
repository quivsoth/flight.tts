/*
 * This required node-rest-client.
 * To install type 'npm install'
 * Tested with node.js v4.8.3
 */
var Client = require('node-rest-client').Client;

var username = 'myalanwalker';
var apiKey = '22ac7fde416cc15f49f8012d2eb8ad2bb8600e6b';
var fxmlUrl = 'https://flightxml.flightaware.com/json/FlightXML3/'

var client_options = {
	user: username,
	password: apiKey
};
var client = new Client(client_options);

client.registerMethod('findFlights', fxmlUrl + 'FindFlight', 'GET');
client.registerMethod('weatherConditions', fxmlUrl + 'WeatherConditions', 'GET');

var findFlightArgs = {
	parameters: {
		origin: 'KLGA',
        destination: 'KDFW',
		type: 'nonstop'
	}
};

client.methods.findFlights(findFlightArgs, function (data, response) {
	// console.log('Number of Flights: %j', data.FindFlightResult.num_flights);
    // console.log('First flight found: %j', data.FindFlightResult.flights[0]);
    
    var i;
    for (i = 0; i < data.FindFlightResult.num_flights; i++) { 
        //console.log(data.FindFlightResult.flights[i].segments[0].airline);
        if(data.FindFlightResult.flights[i].segments[0].airline === 'AAL') {
            console.log(data.FindFlightResult.flights[i].segments[0]);
        }
    }
});

// var weatherConditionsArgs = {
// 	parameters: {
// 		airport_code: 'KHOU'
// 	}
// };

// client.methods.weatherConditions(weatherConditionsArgs, function (data, response) {
// 	console.log('Current conditions at Hobby Airport: %j', data.WeatherConditionsResult.conditions[0]);
// });