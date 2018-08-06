const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage, generateLocation} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const {Rooms} = require('./utils/rooms');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

let app = express();
//need to configure express with http for socket.io
let server = http.createServer(app);
//creates a web socket server
let io = socketIO(server)
let users = new Users();
let rooms = new Rooms();

//Middleware
app.use(express.static(publicPath));


io.on('connection', (socket) => {
	console.log('New user connected');

	socket.on('join', (params, callback) => {
		let room = params.room.toLowerCase();

		if (!isRealString(params.name) || !isRealString(room)) {
			return callback('Name and room name are required');
		} 

		users.getUserList(room).map((user) => {
			if(user === params.name) {
				return callback('Name already exists, please choose another');
			}
		});

		//socket.join takes a string
		socket.join(room);
		//remove user from any previous rooms before adding to new one
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, room);
		
		if(!rooms.rooms.includes(room)) {
			rooms.addRoom(room);
		}
		console.log('Rooms:', rooms.getRooms());

		//only emits to specific room
		io.to(room).emit('updateUserList', users.getUserList(room));
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
		socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `User ${params.name} has joined.`));

		callback();
	});

	socket.on('createMessage', (message, callback) => {
		let user = users.getUser(socket.id);

		if(user && isRealString(message.text)) {
			//emits a signal to every connection
			io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
		}
		//callback is the acknowledged callback from emitted event
		callback();
	});

	socket.on('createLocationMessage', (coords) => {
		let user = users.getUser(socket.id);

		if(user) {
			io.to(user.room).emit('newLocationMessage', generateLocation(user.name, coords.latitude, coords.longitude));		
		}
	});

	socket.on('disconnect', () => {
		let user = users.removeUser(socket.id);
		let roomKeys = Object.keys(socket.adapter.rooms);
		// console.log('socket: ', JSON.stringify(socket.adapter.rooms, undefined, 2));
		// console.log('Keys:', roomKeys);


		rooms.getRooms().map((room) => {
			if(!roomKeys.includes(room)) {
				rooms.removeRoom(room);
				console.log('After remove: ', rooms.getRooms());
			}
		});

		if(user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the building.`));
		}
	});
});

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
