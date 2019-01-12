var host = window.location.host;
var socket = io(host + '/chatroom');
var params = jQuery.deparam(window.location.search);


jQuery('.send_message').on('click', function() {
    jQuery('#message-form').submit();
});
jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    var messageTextbox = jQuery('[name=message]');
    socket.emit('newMessage', {
        body: messageTextbox.val()
    }, function() {
        messageTextbox.val('')
    });
});


socket.on('connect', function() {


    // --------------- emit the join room event with the room uniqe id ------
    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/profile';
        } else {
            console.log('no err');
        }
    });
});


// active users update event 
socket.on('activeUpdate', function(msg) {
    var template = jQuery('#active-template').html();
    jQuery('#usersph').html('');
    for (var i = 0; i < msg.length; i++) {
        var html = Mustache.render(template, {
            name: msg[i].username,
            image: msg[i].image
        });
        jQuery('#usersph').append(html);
    };
});


//  message event 
socket.on('newMessage', function(msg) {
    console.log(msg);
    var templateLeft = jQuery('#left-template').html();
    var templateRight = jQuery('#right-template').html();
    var x = jQuery('#active-cl').val();
    var message = {
        image: msg.image,
        name: msg.name,
        body: msg.body,
    };
    if (msg.from == x) {
        var html = Mustache.render(templateRight, message);
    } else {
        var html = Mustache.render(templateLeft, message);
    }
    jQuery('.messages').append(html);
});



socket.on('disconnect', function() {
    console.log('Disconnected from server');
});