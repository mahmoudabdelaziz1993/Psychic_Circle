var socket = io();
// -------------------------connect event -----------
socket.on('connect', function() {
    console.log('connected to sockets');
});

// -------------------------disconnect event -----------
socket.on('disconnect', function() {
    console.log('Disconnected from server');
});


//---------------------create room form --------------
jQuery('#createroom-form').on('submit', function(e) {
    e.preventDefault();
    if (jQuery("#create-room").val() == '') {
        alert("Please fill in createRoom fields ");
        jQuery("#create-room").css("border-color", "red");
        return false;
    }
    var room = jQuery('#create-room')
    console.log(room.val());
    socket.emit('createRoom', {
        // from: 'User',
        name: room.val()
    }, function() {
        room.val('');
    });
});

socket.on('newRoom', function(msg) {
    var template = jQuery('#room-template').html();
    jQuery('#roomsListUL').html('')
    for (var i = 0; i < msg.length; i++) {
        var html = Mustache.render(template, {
            name: msg[i].name,
            id: msg[i].id
        });
        jQuery('#roomsListUL').append(html);
    };

});