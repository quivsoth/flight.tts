var socket = io();
socket.on('onDataChanged', UpdateFlight);

getFlights();

function UpdateFlight(data) {
    var id = $('#' + data._id);
    id.empty();
    //id.append("<li id=" + data._id + ">" + data.flightNumber + "\t" + data.from + "\t" + data.to + "</li>");
    id.append("<td>" + data.flightNumber + "</td><td>" + data.from + "</td><td>" + data.time +  "</td><td>" + data.terminal + data.gate + "</td><td>" + data.status + "</td>");
}

function BuildFlights(data) {
    $.each(data, function (index, item) {
        // $("#flights").append("<li id=" + item._id + ">" + item.flightNumber + "\t" + item.from + "\t" + item.time +  "\t" + item.terminal + item.gate + "\t" + item.status + "</li>");
        $("#tblFlights").append("<tr id=" + item._id + "><td>" + item.flightNumber + "</td><td>" + item.from + "</td><td>" + item.time +  "</td><td>" + item.terminal + item.gate + "</td><td>" + item.status + "</td></tr>");
    });
}

function getFlights() {
    $.get('http://localhost:3000/api/flights', (data) => {
        BuildFlights(data);
    })
}