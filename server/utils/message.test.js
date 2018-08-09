const expect = require('expect');

const {generateMessage, generateGif} = require('./message');

describe('generateMessage', () => {
	it('should generate the correct message object', () => {
		let from = 'Test';
		let text = 'This is a test';
		let message = generateMessage(from, text);

		expect(message).toInclude({from, text});
		expect(message.createdAt).toBeA('number');
	});
});

describe('generateGif', () => {
	it('should generate the correct message object', () => {
		let from = 'Test';
		let url = 'https://someUrl.com';
		let message = generateGif(from, url);

		expect(message).toInclude({from, url});
		expect(message.createdAt).toBeA('number');
	})
});

// describe('generateLocation', () => {
// 	it('should generate correct location object', () => {
// 		let from = 'Test';
// 		let lat = 34;
// 		let long = -21;
// 		let url = `https://www.google.com/maps?q=${lat},${long}`
// 		let message = generateLocation(from, lat, long);

// 		expect(message).toInclude({from, url});
// 		expect(message.createdAt).toBeA('number');
// 	});
// });
