var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    // res.send('<h1>Hello World</h1>');
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {

    // When socket connects, send all the data
    socket.emit('chat info', {
        "id": socket.id,
        "users": users,
    });

    // Add the new user to the users array
    users.push({
        "id": socket.id
    });

    socket.on('submitUsername', function(data) {
        users[users.indexOf(userById(data.id))].username = data.username;
        console.log(users);
        io.emit("logStatus", data.username + " joined.");
        io.emit("updateUsers", users);

    });

    socket.on('disconnect', function() {
        var tempUser = userById(socket.id);
        io.emit("logStatus", tempUser.username + " left.");

        // Remove user from users array
        users.splice(users.indexOf(tempUser), 1);

        // Update user display list
        io.emit("updateUsers", users);
    });

    socket.on('messageSent', function(msg) {
        var tempUser = userById(msg.id);
        io.emit('messageReceived', {
            "content": msg.content,
            "id": tempUser.id,
            "username": tempUser.username
        });
    });
});

http.listen(3000, function() {
    console.log("Listening on *:3000");
});

// Find a user, with the id as the parameter
function userById(id) {
    var user;
    for (var i = 0; i < users.length; i++) {
        if (id == users[i].id) {
            user = users[i];
        }
    }
    return user;
}
