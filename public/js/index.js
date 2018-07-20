let socket = io();

//using pre-es6 function for cross browser compatibility
socket.on('connect', function() {
	console.log('Connected to server');
});

socket.on('disconnect', function() {
	console.log('Disconnected from server');
});

//custom event, receives message object from emitted event in server.js
socket.on('newMessage', function(message) {
	console.log('New Message: ', message);
});

socket.emit('createMessage', {
	from: 'Client',
	text: 'so much client'
});




