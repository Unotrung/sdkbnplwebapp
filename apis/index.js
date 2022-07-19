function checkPhoneExists(phone) {
    return callAjax({ phone: phone }, 'user/checkPhoneExists', 'POST');
}

function checkNidExists(nid) {
    return callAjax({ nid: nid }, 'user/checkNidExists', 'POST');
}

function checkNidPhoneExists(phone, nid) {
    return callAjax({ phone: phone, nid: nid }, 'user/checkNidPhoneExists', 'POST');
}

function login(phone, pin) {
    return callAjax({ phone: phone, pin: pin }, 'user/login', 'POST');
}

function addInfoPersonal(name, sex, birthday, phone, citizenId, issueDate, expirationDate, city, district, ward, street, temporaryCity, temporaryDistrict, temporaryWard, temporaryStreet, personal_title_ref, name_ref, phone_ref, pin, nid_front_image, nid_back_image, selfie_image) {
    return callAjax(
        {
            name: name,
            sex: sex,
            birthday: birthday,
            phone: phone,
            citizenId: citizenId,
            issueDate: issueDate,
            expirationDate: expirationDate,
            city: city,
            district: district,
            ward: ward,
            street: street,
            temporaryCity: temporaryCity,
            temporaryDistrict: temporaryDistrict,
            temporaryWard: temporaryWard,
            temporaryStreet: temporaryStreet,
            personal_title_ref: personal_title_ref,
            name_ref: name_ref,
            phone_ref: phone_ref,
            pin: pin,
            nid_front_image: nid_front_image,
            nid_back_image: nid_back_image,
            selfie_image: selfie_image
        },
        'personal/addInfoPersonal',
        'POST'
    );
}

function sendOtp(phone) {
    return callAjax({ phone: phone }, 'user/sendOtp', 'POST');
}

function verifyOtp(phone, otp) {
    return callAjax({ phone: phone, otp: otp }, 'user/verifyOtp', 'POST');
}

function sendOtpPin(phone, nid) {
    return callAjax({ phone: phone, nid: nid }, 'user/sendOtpPin', 'POST');
}

function verifyOtpPin(phone, nid, otp) {
    return callAjax({ phone: phone, nid: nid, otp: otp }, 'user/verifyOtpPin', 'POST');
}

function resetPin(phone, new_pin, token) {
    return callAjax({ phone: phone, new_pin: new_pin }, 'user/resetPin', 'PUT', token);
}

function updatePin(phone, pin, new_pin) {
    return callAjax({ phone: phone, pin: pin, new_pin: new_pin }, 'user/updatePin', 'PUT');
}

function getAllTenor() {
    return callAjax({}, 'common/getAllTenor', 'GET');
}

function getAllCity() {
    return callAjax({}, 'common/getAllCity', 'GET');
}

function getAllDistrict() {
    return callAjax({}, 'common/getAllDistrict', 'GET');
}

function getAllWard() {
    return callAjax({}, 'common/getAllWard', 'GET');
}

function getDetailWard(idParent) {
    return callAjax({ idParent: idParent }, 'common/getWard', 'POST');
}

function getDetailDistrict(idParent) {
    return callAjax({ idParent: idParent }, 'common/getDistrict', 'POST');
}

function getAllReferenceRelation() {
    return callAjax({}, 'common/getAllReferenceRelation', 'GET');
}

function getDetail(phone, token) {
    return callAjax({}, `personal/${phone}`, 'GET', token);
}

function addProvider(provider, nid) {
    return callAjax({ provider: provider, nid: nid }, 'personal/registerProvider', 'PUT');
}

function updateStep(phone, process) {
    return callAjax({ phone: phone, process: process }, 'common/updateStep', 'PUT');
}

function requestRefreshToken(refreshToken) {
    return callAjax({ refreshToken: refreshToken }, 'user/requestRefreshToken', 'PUT');
}

function getAllProviders() {
    try {
        let data = $.ajax({
            url: 'https://apieap.voolo.vn/v1/eap/common/generateProviders',
            type: 'GET',
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

function getContract() {
    try {
        let data = $.ajax({
            url: 'https://apieap.voolo.vn/v1/eap/common/generateContract',
            type: 'GET',
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

function callAjax($data, $url, $type, $token = '') {
    options.Authorization = `Bearer ` + $token;
    try {
        let data = $.ajax({
            url: `${baseURL}/` + $url,
            method: $type,
            data: JSON.stringify($data),
            headers: options,
            async: false,
            dataType: 'json',
            beforeSend: showLoading(),
            complete: close_popup()
        });
        return data.responseJSON;
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
};