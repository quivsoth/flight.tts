var socket = io();
socket.on('onDataChanged', UpdateFlight);

getFlights();

function UpdateFlight(data) {
    var id = $('#' + data._id);
    id.empty();
    id.append("<li id=" + data._id + ">" + data.flightNumber + "\t" + data.from + "\t" + data.to + "</li>");
}

function BuildFlights(data) {
    $.each(data, function (index, item) {
        $("#flights").append("<li id=" + item._id + ">" + item.flightNumber + "\t" + item.from + "\t" + item.to + "</li>");
    });
}

function getFlights() {
    $.get('http://localhost:3000/flights', (data) => {
        BuildFlights(data);
    })
}