const axios = require('axios');


let getGif = (searchString) => {
	
	let giphyUrl = `https://api.giphy.com/v1/gifs/translate?api_key=WFYShEMluFwHlUXBJ7Kk7jhGbspo1CC7&s=${searchString}`;

	return axios.get(giphyUrl)
		.then((response) => {
			console.log(response.data.data.url);
			return response.data.data.url;
		})
		.catch((errObj) => {
			console.log('Error: ', errObj.message);
		});
};

module.exports = {getGif};



