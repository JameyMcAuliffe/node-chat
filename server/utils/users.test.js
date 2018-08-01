const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {

	let users;

	beforeEach(() => {
		users = new Users();
		users.users = [{
			id: 1,
			name: 'Test-1',
			room: 'Room-1'
		}, {
			id: 2,
			name: 'Test-2',
			room: 'Room-1'
		}, {
			id: 3,
			name: 'Test-3',
			room: 'Room-2'
		}];
	});

	it('should add new user', () => {
		let users = new Users();
		let user = {
			id: 'id',
			name: 'Name',
			room: 'Room'
		};

		let res = users.addUser(user.id, user.name, user.room);

		expect(users.users).toEqual([user]);
	});

	it('should return names for Room-1', () => {
		//users in this case is the seeded array
		let userList = users.getUserList('Room-1');

		expect(userList).toEqual(['Test-1', 'Test-2']);
	});

	it('should remove a user', () => {
		let userId = 1;
		let user = users.removeUser(userId);

		expect(user.id).toBe(userId);
		expect(users.users.length).toBe(2);
	});

	it('should not remove user', () => {
		let userId = 4;
		let user = users.removeUser(userId);

		expect(user).toNotExist;
		expect(users.users.length).toBe(3);
	});

	it('should find user', () => {
		let user = users.users[0];
		let foundUser = users.getUser(user.id);

		expect(foundUser).toEqual(user);
	});

	it('should not find user', () => {
		let user = users.getUser(4);

		expect(user).toBe(undefined);
	});
});
