//moved from node_modules to libs folder
const moment = require('../../public/js/libs/moment');


let generateMessage = (from, text) => {
	return {
		from,
		text,
		createdAt: moment().valueOf() //returns current timestamp
	};
};

let generateGif = (from, url) => {
	return {
		from,
		url,
		createdAt: moment().valueOf()
	}
};

let generateLocation = (from, lat, long) => {
	return {
		from,
		url: `https://www.google.com/maps?q=${lat},${long}`,
		createdAt: moment().valueOf()
	};
};

module.exports = {generateMessage, generateLocation, generateGif};
