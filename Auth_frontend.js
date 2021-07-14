    socketIOConnectionUpdate('Requesting JWT Token from Laravel');


    $.ajax({
        url: 'http://localhost:8000/token?id=1'
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        socketIOConnectionUpdate('Something is wrong on ajax: ' + textStatus);
    })
    .done(function (result, textStatus, jqXHR) {


        /* 
        make connection with localhost 3000
        */
        var socket = io.connect('http://localhost:3000');


        /* 
        connect with socket io
        */
        socket.on('connect', function () {
            socketIOConnectionUpdate('Connected to SocketIO, Authenticating')
            socket.emit('authenticate', {token: result.token});


            socket.emit('public-my-message', {'msg': 'Hi, Every One.'});
        });


        /* 
        If token authenticated successfully then here will get message 
        */
        socket.on('authenticated', function () {
            socketIOConnectionUpdate('Authenticated');
        });


        /* 
        If token unauthorized then here will get message 
        */
        socket.on('unauthorized', function (data) {
            socketIOConnectionUpdate('Unauthorized, error msg: ' + data.message);
        });


        /* 
        If disconnect socketio then here will get message 
        */
        socket.on('disconnect', function () {
            socketIOConnectionUpdate('Disconnected');
        });


        /* 
        Get Userid by server side emit
        */
        socket.on('user-id', function (data) {
            $('#userid').html(data);
        });


        /* 
        Get Email by server side emit
        */
        socket.on('user-email', function (data) {
            $('#email').html(data);
        });


        /* 
        Get receive my message by server side emit
        */
        socket.on('receive-my-message', function (data) {
            $('#receive-my-message').html(data);
        });
    });
//});


/* 
Function for print connection message
*/
function socketIOConnectionUpdate(str) {
    $('#connection').html(str);
}