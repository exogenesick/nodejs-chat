var ChatServer = function (io) {
    var self = this;

    self.io = io;

    self.init = function () {
        self.io.on('connection', self.onClientConnect);
    };

    self.onClientConnect = function (socket) {
        console.log('connected');
        self.handleClient(socket);
    };

    self.handleClient = function (socket) {
        console.log('handling');
        socket.on('authenticate', self.handleAuthenticate);
    };

    self.handleAuthenticate = function (username, email) {
        console.log(username + " - " + email);
    };
};

module.exports = ChatServer;