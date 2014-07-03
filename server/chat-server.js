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
        socket.on('disconnect', self.handleDisconnect);
        socket.on('authenticate', self.handleAuthenticate);
        socket.on('message', self.handleMessage);
        socket.on('users', self.handleUsers);
    };

    self.handleAuthenticate = function (username, email) {
        var i = self.users.length;
        while (i--) {

            if (username === self.users[i].username && email === self.users[i].email && null != self.users[i].socket) {
                this.emit('authenticate', {code: -1, response: {message: "Already logged"}});
                return;
            }

            if (username === self.users[i].username && email === self.users[i].email) {
                this.emit('authenticate', {code: 1, response: {message: "Success"}});
                return;
            }

            if (username === self.users[i].username && email != self.users[i].email) {
                this.emit('authenticate', {code: 0, response: {message: "Wrong email"}});
                return;
            }

            if (username != self.users[i].username && email === self.users[i].email) {
                this.emit('authenticate', {code: 0, response: {message: "Wrong username"}});
                return;
            }
        }

        self.users.push({username:username, email:email, socket:this});
        this.emit('authenticate', {code: 2, response: {message: "Account created"}});
        self.broadcastUsersList(this);
    };

    self.handleMessage = function (author, message) {
        self.io.emit('message', {author: author, message: message});
    };

    self.handleDisconnect = function () {
        self.logoutUser(this);
        self.broadcastUsersList(this);
    };

    self.broadcastUsersList = function (broadcaster) {
        var i = self.users.length, users = [];
        while (i--) {
            if (null != self.users[i].socket) {
                users.push(self.users[i].username);
            }
        }

        broadcaster.broadcast.emit('users', users);
    };

    self.handleUsers = function () {
        var i = self.users.length, users = [];
        while (i--) {
            if (null != self.users[i].socket) {
                users.push(self.users[i].username);
            }
        }

        this.emit('users', users);
    };

    self.logoutUser = function (socket) {
        var i = self.users.length;
        while (i--) {
            if (socket === self.users[i].socket) {
                self.users[i].socket = null;
                return;
            }
        }
    };
};

module.exports = ChatServer;