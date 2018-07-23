const expect = require('expect');

const {generateMessage} = require('./message');

describe('generateMessage', () => {
	it('should generate the correct message object', () => {
		let from = 'Test';
		let text = 'This is a test';
		let message = generateMessage(from, text);

		expect(message).toInclude({from, text});
		expect(message.createdAt).toBeA('number');
	});
});
