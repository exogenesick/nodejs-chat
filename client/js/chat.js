var socket = null,
    author = null;

$(document).ready(function () {
    socket = io();
    socket.on("connect", onConnect);
    socket.on("authenticate", onAuthenticate);

    $("#signinForm").submit(function (event) {
        socket.emit('authenticate', $('#username').val(), $('#email').val());
        event.preventDefault();
    });
});

function onConnect () {
    console.log('connected');
}

function onAuthenticate (response) {
    if (1 === response.code || 2 === response.code) {
        author = $('#username').val();

        $('#signinForm').fadeOut('slow', function () {
            $('#chatRoom').fadeIn('slow', function () {
                socket.on("message", onMessage);
                socket.on("users", onUsers);

                socket.emit("users");

                $("#sendMessageButton").on("click", function () {
                    socket.emit("message", author, $("#message").val());
                });
            });
        });
        return;
    }

    $('#signinError').fadeIn('slow', function () {});
}

function onMessage (message) {
    $("#messages").append('<div class="media"><strong class="pull-left">' + message.author + '</strong><div class="media-body">' + message.message + '</div></div>');
    $('#messages').stop().animate({
        scrollTop: $("#messages")[0].scrollHeight
    }, 800);
}

function onUsers (users) {
    console.log(users);
    $("#users").html('');
    $("#users").append('<a href="#" class="list-group-item active">Users online</a>');

    users.forEach(function (user) {
        $("#users").append('<a href="#" class="list-group-item">' + user + '</a>');
    });
}