(function() {

var socket = io();
var id;

socket.on("chat info", function(data) {
    id = data.id;
    updateUsers(data.users);
});

// Submit username
var usernameForm = document.querySelector('#username-form');
if (usernameForm != null) {
    usernameForm.addEventListener('submit', function(ev) {
        ev.preventDefault();
        var inputField = document.querySelector('#username-field');
        if (inputField.value != "") {
            socket.emit('submitUsername', {
                "username": inputField.value,
                "id": id
            });
            document.querySelector('#username-overlay').style.display = "none";
        }
        inputField.value = "";
        return false;
    });
}


// Send chat messages
var form = document.querySelector('#messageForm');
if (form != null) {
    form.addEventListener('submit', function(ev) {
        ev.preventDefault();
        var inputField = document.querySelector('#message_input');
        if (inputField.value != "") {
            socket.emit('messageSent', {
                "content": inputField.value,
                "id": id
            });
        }
        inputField.value = "";
        return false;
    });
}

// Receive messages
var messageContainer = document.querySelector('#messages');
socket.on('messageReceived', function(msg){
    var tempHTML = "";
    if (msg.id == id) {
        tempHTML += '<div class="clearfix">';
            tempHTML += '<div class="message own">';
            tempHTML += msg.content;
            tempHTML += '</div>';
        tempHTML += '</div>';
    } else {
        tempHTML += '<div class="clearfix">';
            tempHTML += '<div class="message ">';
            tempHTML += '<b>' + msg.username + ' says: </b> ' + msg.content;
            tempHTML += '</div>';
        tempHTML += '</div>';
    }


    messageContainer.innerHTML += tempHTML;
});

// Log statuses
socket.on("logStatus", function(text) {
    messageContainer.innerHTML += '<div class="log-status">' + text + '</div>';
});

// Update user display list
socket.on("updateUsers", function(users) {
    updateUsers(users);
});

function updateUsers(users) {
    var usersContainer = document.querySelector("#users");
    usersContainer.innerHTML = "";
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        usersContainer.innerHTML += "<li>" + user.username + "</li>";
    }
}
})();
