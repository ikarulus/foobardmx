var socket = io.connect('http://10.42.23.7');

$(document).ready(function() {

    $('.preset').on('click', function(e) {
        socket.emit('preset', $(e.target).val())
    })


    $('.color').on('input', function(e) {
        light = $(e.target).attr('light');
        var red = $('.red[light=' + light + ']');
        var green = $('.green[light=' + light + ']');
        var blue = $('.blue[light=' + light + ']');
        socket.emit('color', {
            id: light,
            values: [red.val(), green.val(), blue.val()]
        });
    });
});
