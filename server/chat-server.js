var ChatServer = function (io) {
    var self = this;

    self.io = io;

    self.users = [];

    self.init = function () {
        self.io.on('connection', self.onClientConnect);
    };

    self.onClientConnect = function (socket) {
        self.handleClient(socket);
    };

    self.handleClient = function (socket) {
        socket.on('authenticate', self.handleAuthenticate);
        socket.on('message', self.handleMessage);
        socket.on('users', self.handleUsers);
    };

    self.handleAuthenticate = function (username, email) {
        var i = self.users.length;
        while (i--) {
            if (username === self.users[i].username && email === self.users[i].email) {
                self.io.emit('authenticate', {code: 1, response: {message: "Success"}});
                return;
            }

            if (username === self.users[i].username && email != self.users[i].email) {
                self.io.emit('authenticate', {code: 0, response: {message: "Wrong email"}});
                return;
            }

            if (username != self.users[i].username && email === self.users[i].email) {
                self.io.emit('authenticate', {code: 0, response: {message: "Wrong username"}});
                return;
            }
        }

        self.users.push({username:username, email:email});
        self.io.emit('authenticate', {code: 2, response: {message: "Account created"}});
    };

    self.handleMessage = function (author, message) {
        self.io.emit('message', {author: author, message: message});
    };

    self.handleUsers = function () {
        var i = self.users.length,
            users = [];
        while (i--) {
            users.push(self.users[i].username);
        }

        self.io.emit('users', users);
    };
};

module.exports = ChatServer;