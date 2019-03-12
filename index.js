var socket = io();
socket.on('onDataChanged', UpdateFlight);

getFlights();

function UpdateFlight(data) {
  console.log('data change detected' + data);
    var id = $('#' + data.flightId);
    id.empty();
    id.append("<td>" + data.flightNumber +
        "</td><td>" + data.departingAirport +
        "</td><td>" + data.departureTime +
        "</td><td>" + data.arrivalTime +
        "</td><td>" + data.terminal + data.gate +
        "</td><td>" + data.status + "</td>");
}

function BuildFlights(data) {
    $.each(data, function (index, item) {
        $("#tblFlights").append("<tr id=" + item.flightId + "><td>" +
                                            item.flightNumber + "</td><td>" +
                                            item.departingAirport + "</td><td>" +
                                            item.departureTime +  "</td><td>" +
                                            item.arrivalTime +  "</td><td>" +
                                            item.terminal + item.gate + "</td><td>" +
                                            item.status +
                                "</td></tr>");
    });
}

function getFlights() {
    $.get('http://localhost:3000/api/flights', (data) => {
        BuildFlights(data);
    })
}
