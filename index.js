const cache = new apolloboost.InMemoryCache();
const link = new apolloboost.HttpLink({uri: 'https://gql-flighthub.azurewebsites.net/api/http-entry'});
const client = new apolloboost.ApolloClient({cache, link});
const gql = apolloboost.gql;
const mom = moment;


console.log('QUERY http-entry for flight stats data');

client.query({
    query: gql
    `{
        getFlightsArrivingToday{
            flightId,
            flightNumber,
            departureAirportFsCode,
            departureDate{dateLocal},
            arrivalDate{dateLocal},
            flightAirportResources{
                arrivalTerminal,
                arrivalGate
            }
            status
       } 
    }`
  }).then(result => BuildFlights(result)).catch(error => console.error(error));

  function BuildFlights(data) {
    console.log('BUILD FLIGHTS DATA');
    
    var dataArray = data.data.getFlightsArrivingToday;

    for(var i = 0; i < dataArray.length; i++)
    {
        $("#tblFlights").append("<tr id=" + dataArray[i].flightId + "><td>" +
        dataArray[i].flightNumber + "</td><td>" +
        dataArray[i].departureAirportFsCode + "</td><td>" +
        mom(dataArray[i].departureDate.dateLocal).format("hh:mm a") + "</td><td>" +  
        mom(dataArray[i].arrivalDate.dateLocal).format("hh:mm a") + "</td><td>"  + "TERMINAL GATE" + "</td><td>" +
        dataArray[i].status + "</td></tr>");
    }

    console.log('FLIGHTS DATA BUILT');
    //$.each(data, function (index, item) {
    //    $("#tblFlights").append("<tr id=" + item.flightId + "><td>" );
    //});
}

/*
//this asks for data from the server to build out the data table

var socket = io();
socket.on('onDataChanged', UpdateFlight);

getFlights();

function UpdateFlight(data) {
    var id = $('#' + data.flightId);
    id.empty();
    id.append("<td>" + data.flightNumber +
        "</td><td>" + data.departingAirport +
        "</td><td>" + data.departureTime +
        "</td><td>" + data.arrivalTime +
        "</td><td>" + data.terminal + data.gate +
        "</td><td>" + hashtable[data.status] + "</td>");
}

function BuildFlights(data) {
    $.each(data, function (index, item) {
        $("#tblFlights").append("<tr id=" + item.flightId + "><td>" +
                                            item.flightNumber + "</td><td>" +
                                            item.departingAirport + "</td><td>" +
                                            item.departureTime +  "</td><td>" +
                                            item.arrivalTime +  "</td><td>" +
                                            item.terminal + item.gate + "</td><td>" +
                                            hashtable[item.status] +
                                "</td></tr>");
    });
}

function getFlights() {
    $.get('http://localhost:3000/api/flights', (data) => {
        BuildFlights(data);
    })
}
*/