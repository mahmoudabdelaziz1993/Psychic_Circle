var host = window.location.host;
var socket = io(host + '/chatroom');
var params = jQuery.deparam(window.location.search);


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
    console.log(msg);
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

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});