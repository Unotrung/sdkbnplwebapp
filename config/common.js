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
function formatCurrency(money) {
    return money.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
}

// Done +++
function deleteStorageData() {
    // sessionStorage.clear();
}

// Done +++
function disableEnterKey() {
    document.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
        }
    })
}

// Done +++
function disabledEKey() {
    document.addEventListener('keypress', function (e) {
        if (e.key === 'e' || e.keyCode === 69) {
            e.preventDefault();
        }
    })
}

// Done +++
function resetPinCode() {
    var inputs = document.querySelectorAll('.pincode-input');
    inputs.forEach(input => input.value = '');
}