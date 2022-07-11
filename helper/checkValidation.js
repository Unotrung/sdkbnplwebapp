// Done +++
function checkPhoneValidate(input) {
    const regexPhone = /^(09|03|07|08|05)+([0-9]{8}$)/;
    input.value = input.value.trim();
    let isPhoneErr = !regexPhone.test(input.value);
    if (regexPhone.test(input.value)) {
        showMessageStatus(input, '', 'SUCCESS');
    }
    else {
        showMessageStatus(input, 'Số điện thoại không hợp lệ', 'ERROR');
    }
    return isPhoneErr;
}

// Done +++
function checkNidValidate(input) {
    const regexNid = /^\d{12}$|^\d{9}$/;
    input.value = input.value.trim();
    let isNidErr = !regexNid.test(input.value);
    if (regexNid.test(input.value)) {
        showMessageStatus(input, '', 'SUCCESS');
    }
    else {
        showMessageStatus(input, 'Chứng minh nhân dân không hợp lệ', 'ERROR');
    }
    return isNidErr;
}

// Done +++
function checkPinValidate(input) {
    const regexPin = /^\d{4}$/;
    input.value = input.value.trim();
    let isPinErr = !regexPin.test(input.value);
    if (regexPin.test(input.value)) {
        showMessageStatus(input, '', 'SUCCESS');
    }
    else {
        showMessageStatus(input, 'Mã Pin không hợp lệ', 'ERROR');
    }
    return isPinErr;
}

// Done +++
function onChangeValidation(input, message) {
    let element = document.querySelector(input);
    let value = element.value.trim();
    let parent = element.parentElement;
    let span = parent.querySelector('span');
    if (value !== null && value !== '') {
        element.style.border = 'none';
        span.innerText = '';
        span.style.marginTop = '0px';
        span.style.visibility = 'hidden';
        span.style.opacity = '0';
    }
    else {
        element.style.border = '1px solid #EE4D2D';
        span.innerText = message ? message : 'Vui lòng nhập thông tin';
        span.style.visibility = 'visible';
        span.style.opacity = '1';
        span.style.marginTop = '0px';
        span.style.marginLeft = '0px';
    }
}

// Done +++
function checkEmptyError(listInput) {
    let isEmptyError = false;
    listInput.forEach(input => {
        input.value = input.value.trim();
        if (input.value) {
            isEmptyError = false;
            showMessageStatus(input, '', 'SUCCESS');
        }
        else {
            isEmptyError = true;
            showMessageStatus(input, 'Vui lòng nhập thông tin', 'ERROR');
        }
    });
    return isEmptyError;
}