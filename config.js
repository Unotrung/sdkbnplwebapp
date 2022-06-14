import { appKey, appId } from './keys.js';

export let baseURL = 'https://apibnpl.voolo.vn/v1/bnpl';

export let options = {
    'Content-Type': 'application/json',
    'appKey': appKey,
    'appId': appId
};