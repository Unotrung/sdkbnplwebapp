let baseURL = 'https://apibnpl.voolo.vn/v1/bnpl';
const DOMAIN = 'https://bnpl.voolo.vn';

let options = {
	'Content-Type': 'application/json',
	'appKey': appKey,
	'appId': appId
};

screen.orientation.lock("portrait")
	.then(function () {
		console.log('Locked');
	})
	.catch(function (error) {
		console.log(error);
	});

