var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, '../client')));

var server = http.createServer(app);
var io = socketio.listen(server);
var port = process.env.PORT || 8080;

server.listen(port, function() {
    console.log('Server listening on ' + port);
});

var ChatServer = require('./chat-server');

new ChatServer(io).init();