// Done +++
function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

// Done +++
function convertDateString(dateString) {
    if (dateString === '' || dateString === null) return '';
    const dateParts = dateString.split("-");
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
}

// Done +++
function convertDateString2(dateString) {
    if (dateString === '' || dateString === null) return '';
    const dateParts = dateString.split("-");
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
}

// Done +++
function convertDateString3(dateString) {
    if (dateString === '' || dateString === null) return '';
    const dateParts = dateString.split("-");
    return `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
}

// Done +++
function formatCurrency(money) {
    return money.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
}

// Done +++
function deleteStorageData() {
    sessionStorage.removeItem('nid');
    sessionStorage.removeItem('selfie-image');
    sessionStorage.removeItem('allDataNid');
    sessionStorage.removeItem('front-image');
    sessionStorage.removeItem('back-image');
    sessionStorage.removeItem('typeBackNid');
    sessionStorage.removeItem('typeFrontNid');
    sessionStorage.removeItem('back_nid_customer');
    sessionStorage.removeItem('front_nid_customer');
    sessionStorage.removeItem('phone_reset');
    sessionStorage.removeItem('nid_reset');
    sessionStorage.removeItem('personal_all_info');
}

// Done +++
function disableEnterKey() {
    document.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13 || e.which === 13 || e.code === 'Enter') {
            e.preventDefault();
            return false;
        }
    })
}

// Done +++
function disabledEKey() {
    document.addEventListener('keypress', function (e) {
        if (e.key === 'e' || e.keyCode === 69 || e.which === 69 || e.code === 'e') {
            e.preventDefault();
            return false;
        }
    })
}

// Done +++
function resetPinCode() {
    var inputs = document.querySelectorAll('.pincode-input');
    inputs.forEach(input => input.value = '');
}

// Done +++
function checkAllDataSame(data) {
    var first = data % 10;
    while (data) {
        if (data % 10 !== first) {
            return false;
        }
        data = Math.floor(data / 10);
    }
    return true;
}

// Done +++
function debounce(fn, delay) {
    delay = delay || 0;
    let timerId;
    return () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        timerId = setTimeout(() => {
            fn();
        }, delay);
    }
}

// Done +++
function throttle(fn, delay) {
    delay = delay || 0;
    let last = 0;
    return () => {
        const now = new Date().getTime();
        if (now - last < delay) {
            return;
        }
        last = now;
        fn();
    }
}

// Done +++
function handlePaste(e) {
    const paste = e.clipboardData.getData('text');
    inputs.foreach((input) => { input.value = paste[i] || '' });
}