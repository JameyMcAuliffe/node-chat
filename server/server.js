const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

let app = express();
//need to configure express with http for socket.io
let server = http.createServer(app);
//creates a web socket server
let io = socketIO(server)

//Middleware
app.use(express.static(publicPath));

//register event listener
//event type is 1st arg
io.on('connection', (socket) => {
	console.log('New user connected');

	socket.emit('newMessage', {
		from: 'Admin',
		text: 'Welcome to the chat',
		createdAt: new Date().getTime()
	});

	socket.broadcast.emit('newMessage', {
		from: 'Admin',
		text: 'New User Joined',
		createdAt: new Date().getTime()
	});

	socket.on('createMessage', (message) => {
		//emits a signal to every connection
		io.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
		});

		// emits message to everyone but the sender 
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });
	});

	socket.on('disconnect', () => {
		console.log('Client was disconnected');
	});
});

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
