import { callAjax } from './common.js';

export function checkPhoneExists(phone) {
    return callAjax({ phone: phone }, 'user/checkPhoneExists', 'POST');
}

export function checkNidExists(nid) {
    return callAjax({ nid: nid }, 'user/checkNidExists', 'POST');
}

export function checkNidPhoneExists(phone, nid) {
    return callAjax({ phone: phone, nid: nid }, 'user/checkNidPhoneExists', 'POST');
}

export function login(phone, pin) {
    return callAjax({ phone: phone, pin: pin }, 'user/login', 'POST');
}

export function addInfoPersonal(name, sex, birthday, phone, citizenId, issueDate, city, district, ward, street, personal_title_ref, name_ref, phone_ref, pin) {
    return callAjax(
        {
            name: name,
            sex: sex,
            birthday: birthday,
            phone: phone,
            citizenId: citizenId,
            issueDate: issueDate,
            city: city,
            district: district,
            ward: ward,
            street: street,
            personal_title_ref: personal_title_ref,
            name_ref: name_ref,
            phone_ref: phone_ref,
            pin: pin
        },
        'personal/addInfoPersonal',
        'POST'
    );
}

export function sendOtp(phone) {
    return callAjax({ phone: phone }, 'user/sendOtp', 'POST');
}

export function verifyOtp(phone, otp) {
    return callAjax({ phone: phone, otp: otp }, 'user/verifyOtp', 'POST');
}

export function sendOtpPin(phone, nid) {
    return callAjax({ phone: phone, nid: nid }, 'user/sendOtpPin', 'POST');
}

export function verifyOtpPin(phone, nid, otp) {
    return callAjax({ phone: phone, nid: nid, otp: otp }, 'user/verifyOtpPin', 'POST');
}

export function resetPin(phone, new_pin, token) {
    return callAjax({ phone: phone, new_pin: new_pin }, 'user/resetPin', 'PUT', token);
}

export function updatePin(phone, pin, new_pin, token) {
    return callAjax({ phone: phone, pin: pin, new_pin: new_pin }, 'user/updatePin', 'PUT');
}

export function getAllUserCustomer() {
    return callAjax({}, 'user/getAllUser', 'GET');
}

export function getAllUserPersonal() {
    return callAjax({}, 'user/getAllBNPLInformation', 'GET');
}

export function getAllTenor() {
    return callAjax({}, 'common/getAllTenor', 'GET');
}

export function getAllCity() {
    return callAjax({}, 'common/getAllCity', 'GET');
}

export function getAllDistrict() {
    return callAjax({}, 'common/getAllDistrict', 'GET');
}

export function getAllWard() {
    return callAjax({}, 'common/getAllWard', 'GET');
}

export function getAllReferenceRelation() {
    return callAjax({}, 'common/getAllReferenceRelation', 'GET');
}

export function getDetail(phone, token) {
    return callAjax({}, `personal/${phone}`, 'GET', token);
}

export function addProvider(provider, nid) {
    return callAjax({ provider: provider, nid: nid }, 'personal/registerProvider', 'PUT');
}

export function updateStep(phone, process) {
    return callAjax({ phone: phone, process: process }, 'common/updateStep', 'PUT');
}

export function requestRefreshToken(refreshToken) {
    return callAjax({ refreshToken: refreshToken }, 'user/requestRefreshToken', 'PUT');
}



