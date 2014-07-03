var socket = null,
    username = null;

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
    $('#signinForm').fadeIn('slow', function () {});
}

function onAuthenticate (response) {
    if (1 === response.code || 2 === response.code) {
        username = $('#username').val();

        $('#signinForm').fadeOut('slow', function () {
            $('#chatRoom').fadeIn('slow', function () {
                socket.on("message", onMessage);
                socket.on("users", onUsers);

                socket.emit("users");

                $("#message").bind("keypress", function(e) {
                    var code = e.keyCode || e.which;
                    if(code == 13) {
                        $( "#sendMessageButton" ).trigger("click");
                    }
                });

                $("#sendMessageButton").on("click", function () {
                    if (0 < $("#message").val().length) {
                        socket.emit("message", username, $("#message").val());
                        $("#message").val("");
                    }
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
    $("#users").html('');
    $("#users").append('<a href="#" class="list-group-item active">Users online</a>');

    users.forEach(function (user) {
        $("#users").append('<a href="#" class="list-group-item">' + user + '</a>');
    });
}