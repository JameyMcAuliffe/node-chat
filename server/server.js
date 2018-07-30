const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage, generateLocation} = require('./utils/message');
const {isRealString} = require('./utils/validation');

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

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			callback('Name and room name are required');
		}

		//socket.join takes a string
		socket.join(params.room);

		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `User ${params.name} has joined.`));

		callback();
	});

	socket.on('createMessage', (message, callback) => {
		//emits a signal to every connection
		io.emit('newMessage', generateMessage(message.from, message.text));
		//callback is the acknowledged callback from emitted event
		callback();
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
