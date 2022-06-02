import { baseURL, options } from './config.js';

export function callAjax($data, $url, $type, $token = '') {
    options.Authorization = `Bearer ` + $token;
    try {
        let data = $.ajax({
            url: `${baseURL}/` + $url,
            method: $type,
            data: JSON.stringify($data),
            headers: options,
            async: false,
            dataType: 'json',
        });
        return data.responseJSON;
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
}