const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
	it('should reject non-string values', () => {
		let nonString = 4;
		expect(isRealString(nonString)).toBe(false);
	});

	it('should reject stings with only spaces', () => {
		let spaces = '    ';
		expect(isRealString(spaces)).toBe(false);
	});

	it('should allow strings with non-space characters', () => {
		let string = 'this should be valid';
		expect(isRealString(string)).toBe(true);
	});
});
