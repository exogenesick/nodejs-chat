var socket = null;

$(document).ready(function () {
    socket = io();
    socket.on('connect', onConnect);
});

function onConnect () {
    console.log('connected');
    socket.emit('authenticate', 'exogeneick', 'kpajak@gmail.com');
}