const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage, generateLocation} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

let app = express();
//need to configure express with http for socket.io
let server = http.createServer(app);
//creates a web socket server
let io = socketIO(server)
let users = new Users();

//Middleware
app.use(express.static(publicPath));


io.on('connection', (socket) => {
	console.log('New user connected');

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and room name are required');
		}

		//socket.join takes a string
		socket.join(params.room);
		//remove user from any previous rooms before adding to new one
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room);

		//only emits to specific room
		io.to(params.room).emit('updateUserList', users.getUserList(params.room));
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
		let user = users.removeUser(socket.id);

		if(user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the building.`));
		}
	});
});

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
