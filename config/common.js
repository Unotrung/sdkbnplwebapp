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
function formatCurrency(money) {
    return money.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
}

// Done +++
function deleteStorageData() {
    sessionStorage.removeItem('phone');
    sessionStorage.removeItem('nid');
    sessionStorage.removeItem('selfie-image');
    sessionStorage.removeItem('front-image');
    sessionStorage.removeItem('back-image');
    sessionStorage.removeItem('checkCustomer');
    sessionStorage.removeItem('allDataNid');
    sessionStorage.removeItem('typeFrontNid');
    sessionStorage.removeItem('front_nid_customer');
    sessionStorage.removeItem('back_nid_customer');
    sessionStorage.removeItem('allDataNid');
    sessionStorage.removeItem('personal_all_info');
    sessionStorage.removeItem('personal_all_infoConfirm');
}