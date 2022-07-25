let baseURL = 'https://apibnpl.voolo.vn/v1/bnpl';
const DOMAIN = 'https://bnpl.voolo.vn';

let options = {
    'Content-Type': 'application/json',
    'appKey': appKey,
    'appId': appId
};
var myScreenOrientation = window.screen.orientation;
myScreenOrientation.lock("portrait");

