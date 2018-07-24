const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage, generateLocation} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

let app = express();
//need to configure express with http for socket.io
let server = http.createServer(app);
//creates a web socket server
let io = socketIO(server)

//Middleware
app.use(express.static(publicPath));


io.on('connection', (socket) => {
	console.log('New user connected');

	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

	socket.on('createMessage', (message, callback) => {
		//emits a signal to every connection
		io.emit('newMessage', generateMessage(message.from, message.text));
		//callback is the acknowledged callback from emitted event
		callback('This is from the server');
	});

	socket.on('createLocationMessage', (coords) => {
		io.emit('newLocationMessage', generateLocation('User', coords.latitude, coords.longitude));
	});

	socket.on('disconnect', () => {
		console.log('Client was disconnected');
	});
});

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
