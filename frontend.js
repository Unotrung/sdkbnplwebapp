let selfieImage = localStorage.getItem('selfie-image') || '';
let frontNidImage = localStorage.getItem('front-image') || '';
let backNidImage = localStorage.getItem('back-image') || '';

let front_nid_user = JSON.parse(localStorage.getItem('front_nid_user')) || '';
let back_nid_user = JSON.parse(localStorage.getItem('back_nid_user')) || '';

// Done +
function generateObjectDraft(images, phone, citizenId) {
    let data = null;
    data = {
        'images': images,
        'name': 'Nguyễn Văn A',
        'sex': 'Nam',
        'birthday': '1990-09-21',
        'phone': phone,
        'citizenId': citizenId,
        'issueDate': '2021-01-30',
        'city': 'Bình Phước',
        'district': 'Đồng Phú',
        'ward': 'Tân Tiến',
        'street': 'Minh Tân Tân Tiến',
        'personal_title_ref': 'Bạn',
        'name_ref': 'Nguyễn Văn B',
        'phone_ref': '0987654321',
        'temporaryCity': 'Bình Phước',
        'temporaryDistrict': 'Đồng Phú',
        'temporaryWard': 'Tân Tiến',
        'temporaryStreet': 'Minh Tân Tân Tiến',
        'expirationDate': '2025-01-30'
    }
    return data;
}

// Done +
function showProgressbar(element) {
    var html =
        "<div class='progress'>" +
        "<div class='progress__fill'></div>" +
        "<span class='progress__text'>0%</span>" +
        "</div>";
    $(element).html(html);
}

// Done +
function updateProgressbar() {
    let progress__fill = document.querySelector('.progress__fill');
    let progress__text = document.querySelector('.progress__text');

    let startValue = 10;
    let finalValue = 100;
    let speed = 200;

    let progress = setInterval(() => {
        startValue++;
        progress__fill.style.width = startValue + '%';
        progress__text.textContent = startValue + '%';
        if (startValue === finalValue) {
            clearInterval(progress);
        }
    }, speed);
}

// Done +
function showCircularProgressbar(element) {
    var html =
        "<div class='circular__progress'>" +
        "<div class='circular__value'>0%<div>" +
        "</div>";
    $(element).html(html);
}

// Done +
function updateCircularProgressbar() {
    let circular__progress = document.querySelector('.circular__progress');
    let circular__value = document.querySelector('.circular__value');

    let startValue = 0;
    let finalValue = 100;
    let speed = 200;

    let progress = setInterval(() => {
        startValue++;
        circular__progress.style.background = `conic-gradient(#4d5bf9 ${startValue * 3.6}deg, #cadcff ${startValue * 3.6}deg)`;
        circular__value.textContent = startValue + '%';
        if (startValue === finalValue) {
            clearInterval(progress);
        }
    }, speed);
}

function captureNidFrontAndBack(element) {
    var html =
        "<div class='buttons'>" +
        "<button type='button' id='btnCaptureFront'>Chụp mặt trước</button>" +
        "<button type='button' id='btnCaptureBack'>Chụp mặt sau</button>" +
        "</div>";
    $(element).html(html);

    $('#btnCaptureFront').click(function () {
        runDocumentCaptureScreen('FRONT');
    })

    $('#btnCaptureBack').click(function () {
        if (localStorage.getItem('front-image') !== null && localStorage.getItem('front-image') !== '' && localStorage.getItem('front-image') !== undefined) {
            runDocumentCaptureScreen('BACK');
        }
        else {
            alert('Vui lòng chụp cmnd mặt trước trước !');
            return;
        }
    })
}

function showUICheckPhone(element) {
    var html =
        "<form id='formValue' class='ng-untouched ng-pristine ng-invalid'><div class='mobile'" +
        "<label for='phone'>Vui lòng nhập số điện thoại để để tiếp tục</label>" +
        "<input type='phone' id='phone' class='input-global ng-pristine ng-invalid ng-touched' />" +
        "<button type='button' id='btnSubmit' class='payment-button' >Tiếp tục</button>" +
        "</div></form>";
    $(element).html(html);

    $('#btnSubmitPhone').click(function () {
        let data = $('#phone').val();
        localStorage.setItem('phone', data);
        if (data !== null && data !== '') {
            let result = checkPhoneExists(data);
            if (result.errCode === 1000) {
                let step = result.data.step;
                if (step === 4) {
                    showFormPincode(element, result.data.phone);
                }
                else if (step === 2) {

                }
                else if (step === 3) {

                }
                else if (step === 0 || step !== 2 || step !== 3 || step !== 4) {

                }
            }
            else if (result.errCode === 1003) {
                showUICheckNid(element);
            }
            else if (result.errorCode === 8000) {
                alert('Định dạng số điện thoại không hợp lệ !');
                return;
            }
        }
        else {
            alert('Vui lòng nhập data !');
            return;
        }
    })
}

function showUICheckNid(element) {
    var html =
        "<form id='formValue'>" +
        "<label for='nid'>Nid</label>" +
        "<input type='number' id='nid' placeholder='Please enter your nid: ' />" +
        "<button type='button' id='callHP'>Call Hyperverge</button>" +
        "<button type='button' id='btnSubmitNid'>Gửi</button>" +
        "</form>";
    $(element).html(html);

    $('#callHP').click(function () {
        runFaceCaptureScreen();
    })

    $('#btnSubmitNid').click(function () {
        let data = $('#nid').val();
        localStorage.setItem('nid', data);
        if (data !== null && data !== '') {
            let result = checkNidExists(data);
            let checkSelfieImage = localStorage.getItem('selfie-image') || '';
            if (result.statusCode === 1000 && checkSelfieImage !== null) {
            }
            else if (result.statusCode === 900 && checkSelfieImage !== null) {
                captureNidFrontAndBack(element);
                let checkCustomer = {
                    phone: localStorage.getItem('phone'),
                    nid: localStorage.getItem('nid'),
                    selfieImage: localStorage.getItem('selfie-image')
                };
                localStorage.setItem('checkCustomer', JSON.stringify(checkCustomer));
            }
            else if (result.errorCode === 8000) {
                alert('Định dạng chứng minh nhân dân không hợp lệ !');
                return;
            }
        }
        else {
            alert('Vui lòng nhập data !');
        }
    })
}

function showFormPincode(element, phone) {
    var html =
        "<form id='formPassword'>" +
        "<label for='pincode'>Pin code</label>" +
        "<input type='password' id='pincode' placeholder='Please enter your pin code: ' />" +
        "<button type='button' id='btnSubmitPW'>Gửi</button>" +
        "</form>";
    $(element).html(html);

    $('#btnSubmitPW').click(function () {
        let pin = $('#password').val();
        if (pin !== null && pin !== '') {
            let result = login(phone, pin);
            if (result.status === true && result.step === 3) {
                showAllTenor(element);
            }
            else if (result.status === false && result.statusCode === 1002) {
                alert('Số điện thoại không hợp lệ !');
                return;
            }
            else if (result.status === false && result.statusCode === 1003) {
                alert('Mã pin không hợp lệ !');
                return;
            }
        }
        else {
            alert('Vui lòng nhập pin !');
            return;
        }
    })
}

function showFormSetupPin(element) {
    var html =
        "<h2>SET UP PIN CODE</h2>" +
        "<form id='formSetupPinCode'>" +
        "<div>" +
        "<input type='password' id='pin1'/>" +
        "<input type='password' id='pin2'/>" +
        "<input type='password' id='pin3'/>" +
        "<input type='password' id='pin4'/>" +
        "</div>" +
        "<div>" +
        "<input type='password' id='pincf1'/>" +
        "<input type='password' id='pincf2'/>" +
        "<input type='password' id='pincf3'/>" +
        "<input type='password' id='pincf4'/>" +
        "</div>" +
        "<button type='button' id='btnSubmitPin'>Gửi</button>" +
        "</form>";
    $(element).html(html);

    $('#btnSubmitPin').click(function () {
        let pin1 = $('#pin1').val().trim();
        let pin2 = $('#pin2').val().trim();
        let pin3 = $('#pin3').val().trim();
        let pin4 = $('#pin4').val().trim();

        let pincf1 = $('#pincf1').val().trim();
        let pincf2 = $('#pincf2').val().trim();
        let pincf3 = $('#pincf3').val().trim();
        let pincf4 = $('#pincf4').val().trim();

        let pin = pin1 + pin2 + pin3 + pin4;
        let pincf = pincf1 + pincf2 + pincf3 + pincf4;

        if (pin === pincf) {

        }
        else {
            alert('Mã pin không trùng khớp vui lòng thử lại !');
            return;
        }
    })
}

function showFormVerifyOTP(element, phone) {
    var html =
        "<h2>Verify OTP</h2>" +
        "<form id='formVerifyOTP'>" +
        "<input type='password' id='otp1'/>" +
        "<input type='password' id='otp2'/>" +
        "<input type='password' id='otp3'/>" +
        "<input type='password' id='otp4'/>" +
        "<input type='password' id='otp5'/>" +
        "<input type='password' id='otp6'/>" +
        "<button type='button' id='btnSubmitVerifyOTP'>Gửi</button>" +
        "</form>";
    $(element).html(html);

    $('#btnSubmitVerifyOTP').click(function () {
        let otp1 = $('#otp1').val().trim();
        let otp2 = $('#otp2').val().trim();
        let otp3 = $('#otp3').val().trim();
        let otp4 = $('#otp4').val().trim();
        let otp5 = $('#otp5').val().trim();
        let otp6 = $('#otp6').val().trim();
        let otp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
        if (phone !== null && otp !== null) {
            verifyOtp(phone, otp);
        }
        else {
            alert('Thiếu số điện thoại hoặc mã otp !');
            return;
        }
    })
}

async function fetchToken() {
    try {
        console.log('FETCH TOKEN');
        const url = 'https://apibnpl.voolo.vn/v1/bnpl/fec/getHVToken';
        const data = await fetch(url);
        const json = await data.json();
        const { token } = json;
        return token;
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
};

async function getHV() {
    try {
        console.log('GET HYPERVERGE');
        await fetchToken()
            .then((res) => {
                HyperSnapSDK.init(res, HyperSnapParams.Region.AsiaPacific);
                HyperSnapSDK.startUserSession();
            })
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
};

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

function cutStringData(infomation) {
    try {
        if (infomation) {
            const { status, statusCode, result } = infomation;
            const details = result?.details[0]?.fieldsExtracted;
            const nidType = result?.details[0]?.type;
            // FRONT NID IMAGE
            if (nidType === 'cccd_chip_front' && nidType !== 'null') {
                let province = details?.province?.value;
                console.log('province: ', province);
                let idNumber = details?.idNumber?.value;
                console.log('idNumber: ', idNumber);
                let name = details?.name?.value;
                console.log('name: ', name);
                let dob = details?.dob?.value;
                console.log('dob: ', dob);
                let homeTown = details?.homeTown?.value;
                console.log('homeTown: ', homeTown);
                let permanentAddress = details?.permanentAddress?.value;
                console.log('permanentAddress: ', permanentAddress);
                let gender = details?.gender?.value;
                console.log('gender: ', gender);
                let doe = details?.doe?.value;
                console.log('doe: ', doe);
                let nationality = details?.nationality?.value;
                console.log('nationality: ', nationality);
                const front_nid_user = {
                    province: province,
                    idNumber: idNumber,
                    name: name,
                    dob: dob,
                    homeTown: homeTown,
                    permanentAddress: permanentAddress,
                    gender: gender,
                    doe: doe,
                    nationality: nationality
                };
                let frontData = localStorage.setItem('front_nid_user', JSON.stringify(front_nid_user));
                return frontData;
            }
            // BACK NID IMAGE
            if (nidType === 'cccd_chip_back' && nidType !== 'null') {
                let doi = details?.doi?.value;
                console.log('doi: ', doi);
                let placeOfIssue = details?.placeOfIssue?.value;
                console.log('placeOfIssue: ', placeOfIssue);
                const back_nid_user = {
                    doi: doi,
                    placeOfIssue: placeOfIssue
                }
                let backData = localStorage.setItem('back_nid_user', JSON.stringify(back_nid_user));
                return backData;
            }
        }
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
}

function makeFaceMatchCall(faceImageBase64String, docImageBase64String) {
    console.log('faceImageBase64String: ', faceImageBase64String);
    console.log('docImageBase64String: ', docImageBase64String);
    callback = (HVError, HVResponse) => {
        if (HVError) {
            var errorCode = HVError.getErrorCode();
            console.log('error code make face match call: ', errorCode);
            var errorMessage = HVError.getErrorMessage();
            console.log('error message make face match call: ', errorMessage);
        }
        if (HVResponse) {
            var apiResults = HVResponse.getApiResult();
            console.log('Api Results Make Face Match Call: ', apiResults);
            var apiHeaders = HVResponse.getApiHeaders();
            console.log('Api Headers Make Face Match Call: ', apiHeaders);
            if (apiResults !== null && apiResults !== '') {
                const data = apiResults?.result;
                console.log('Data: ', data);
                const matchFace = data.match;
                console.log('Match Face: ', matchFace);
                if (matchFace === 'no') {
                    alert('The face and the image of the identity card on the front side do not match');
                }
                else {
                    alert('The face and the image of the identity card on the front side match')
                }
            }
        }
    };
    HVNetworkHelper.makeFaceMatchCall(faceImageBase64String, docImageBase64String, {}, {}, callback);
}

async function LaunchFaceCaptureScreen() {
    try {
        console.log('Launch Face Capture Screen');
        var hvFaceConfig = new HVFaceConfig();
        hvFaceConfig.setShouldShowInstructionPage(false);
        callback = (HVError, HVResponse) => {
            if (HVError) {
                var errorCode = HVError.getErrorCode();
                console.log('error code Face Capture Screen: ', errorCode);
                var errorMessage = HVError.getErrorMessage();
                console.log('error message Face Capture Screen: ', errorMessage);
            }
            if (HVResponse) {
                var apiResults = HVResponse.getApiResult();
                console.log('Api Results Face Capture Screen: ', apiResults);
                var apiHeaders = HVResponse.getApiHeaders();
                console.log('Api Headers Face Capture Screen: ', apiHeaders);
                var imageBase64 = HVResponse.getImageBase64();
                console.log('Image Base64 Face Capture Screen: ', imageBase64);
                var attemptsCount = HVResponse.getAttemptsCount();
                console.log('Attempt Count Face Capture Screen: ', attemptsCount);
                if (imageBase64 !== '' && imageBase64 !== null) {
                    let selfie_image = localStorage.setItem('selfie-image', imageBase64);
                    selfieImage = selfie_image;
                    alert('Lưu ảnh Selfie thành công !');
                }
            }
        };
        HVFaceModule.start(hvFaceConfig, callback);
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
};

async function LaunchDocumentCaptureScreen(side) {
    try {
        console.log('Launch Document Capture Screen');
        var hvDocConfig = new HVDocConfig();
        hvDocConfig.setShouldShowInstructionPage(false);
        hvDocConfig.setShouldShowDocReviewScreen(false);
        if (side === 'FRONT' && side !== '') {
            hvDocConfig.setOCRDetails("https://vnm-docs.hyperverge.co/v2/nationalID", hvDocConfig.DocumentSide.FRONT, {}, {});
        }
        else if (side === 'BACK' && side !== '') {
            hvDocConfig.setOCRDetails("https://vnm-docs.hyperverge.co/v2/nationalID", hvDocConfig.DocumentSide.BACK, {}, {});
        }
        callback = (HVError, HVResponse) => {
            if (HVError) {
                var errorCode = HVError.getErrorCode();
                console.log('error code Document Capture Screen: ', errorCode);
                var errorMessage = HVError.getErrorMessage();
                console.log('error message Document Capture Screen: ', errorCode);
            }
            if (HVResponse) {
                var apiResults = HVResponse.getApiResult();
                console.log('Api Results Document Capture Screen: ', apiResults);
                var apiHeaders = HVResponse.getApiHeaders();
                console.log('Api Headers Document Capture Screen: ', apiHeaders);
                var imageBase64 = HVResponse.getImageBase64();
                console.log('Image Base64 Document Capture Screen: ', imageBase64);
                var attemptsCount = HVResponse.getAttemptsCount();
                console.log('Attempt Count Document Capture Screen: ', attemptsCount);
                base64 = imageBase64;
                if (imageBase64 !== '' && imageBase64 !== null) {
                    if (side === 'FRONT' && side !== '') {
                        let front_image_nid = localStorage.setItem('front-image', imageBase64);
                        frontNidImage = front_image_nid;
                        postNationalID(base64);
                        alert('Lưu mặt trước CMND thành công !');
                    }
                    else if (side === 'BACK' && side !== '') {
                        let back_image_nid = localStorage.setItem('back-image', imageBase64);
                        backNidImage = back_image_nid;
                        postNationalID(base64);
                        alert('Lưu mặt sau CMND thành công !');
                    }
                }
            }
        };
        HVDocsModule.start(hvDocConfig, callback);
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
}

function runFaceCaptureScreen() {
    try {
        getHV()
            .then(() => LaunchFaceCaptureScreen());
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
}

function runDocumentCaptureScreen(side) {
    try {
        getHV()
            .then(() => LaunchDocumentCaptureScreen(side))
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
}

// Done +
function showAllTenor(element) {
    let html = '';
    const data = getAllTenor();
    let tenors = data.data;
    for (var i = 0; i < tenors.length; i++) {
        html += `
        <div style='border: 3px solid black; margin: 10px auto; display: block'>
        <p>${tenors[i].convertFee}</p>
        <p>${tenors[i].paymentSchedule}</p>
        <button type='button' class='btnSelectTenor' data-id='${tenors[i]._id}'>Select</button>
        </div>
        `
    }
    $(element).html(html);
};

// Done +
function showAllProvider(element) {
    let html = '';
    const data = getAllProviders();
    let providers = data.data;
    for (var i = 0; i < providers.length; i++) {
        html += `
        <div style='border: 3px solid black; margin: 10px auto; display: block'>
        <img src='${providers[i].url}' />
        <p>${providers[i].provider}</p>
        <button type='button' class='btnSelectProvider' data-id='${providers[i]._id}'>Select</button>
        </div>
        `
    }
    $(element).html(html);
};

function showMessage(element, message, icon) {
    var html =
        "<div>" +
        "<icon class='" + icon + "'></icon>" +
        "<p>" + message + "</p>" +
        "</div>";
    $(element).html(html);
}

export function configUi(config){
    var iHtml = "";
    if(config.logo) iHtml += "<div class='voolo-logo'></div>";
    if(config.intro) iHtml += `
    <div class='voolo-intro'>
        <h2 class='paragraph-text paragraph-text-bold header-2'>VOOLO giúp bạn:</h2>
        <ul>
            <li>Mua sắm không giới hạn </li>
            <li>Thanh toán linh hoạt </li>
            <li>Hoàn tiền ngay chỉ trong 1 ngày </li>
        </ul>
    </div>
    <div _ngcontent-gse-c77="" class="paragraph-text text-center margin-bottom-default"> <p class='font-w-5'>VOOLO</p> <p>Mua Trước Trả Sau Không khoản trả trước</p><p>Nhẹ nhàng với 0% lãi suất </p></div>`;
    $(config.element+" form").prepend(iHtml);

    //show list items
    var list = "";
    if(config.dataItems != null){
        var lItems = "";
        var total = 0;
        config.dataItems.forEach(e => {
            list += `<div class='list'>
            <div class='image'><img src='`+e.imgUrl+`'/></div>
            <div class='info'>
                <p class='head-w-6 ellipsis'>`+e.product+`</p>
                <p>`+e.descript+`</p>
                <p>`+e.quantity+`</p>
            </div>
            <div class='price head-w-6'>`+e.priceShow+`</div>
        </div>`;
        total += parseInt(e.price);
        });
        var sTotal = total.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
          });
    }
    lItems += `<div class='list-items'>
        <div class='card'>
            <div class='card-head'>Thông tin đơn hàng</div>
            <div class='card-body'>
                `+list+`
            </div>
            <div class='card-footer'>
                <span>Tổng cộng</span>
            <span class='total-price'>`+sTotal+` </span></div>
        </div>
    </div>`;
    if(config.items) $(config.element).prepend(lItems);
}
// Done +
function selectTenor(id) {
    let tenor = localStorage.setItem('tenor', id);
}

// Done +
function selectProvider(id) {
    let provider = localStorage.setItem('provider', id);
    showUICheckPhone('#test');
}

// Done 
$('body').on('click', '.btnSelectTenor', function () {
    var val = $(this).attr("data-id");
    selectTenor(val);
})

// Done
$('body').on('click', '.btnSelectProvider', function () {
    var val = $(this).attr("data-id");
    selectProvider(val);
})