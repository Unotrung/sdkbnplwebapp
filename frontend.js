/*
*
*
* */
const arrType_front = ["cccd_chip_front", "cccd_front","cmnd_old_front"];
const arrType_back = ["cccd_chip_back", "cccd_back","cmnd_old_back", "cmnd_new_cccd_back"];
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

// Done +
function showUICheckPhone(element) {
    var html =
        "<form id='formValuePhone' class='ng-untouched ng-pristine ng-invalid formValue'><div class='mobile'>" +
        "<div class='form__row'>" +
        "<label class='form__label'  for='phone'>Vui lòng nhập số điện thoại để để tiếp tục</label>" +
        "<input type='phone' id='phone' class='form__input input-global ng-pristine ng-invalid ng-touched' />" +
        "</div>" +
        "<button type='button' id='btnSubmitPhone' class='payment-button' >Tiếp tục</button>" +
        "</div></form>";
    $(element).html(html);

    //custom show
    configUi({
        element:element,
        logo:true,
        intro:true
    });
    // show list productions
    listProductions({
        element:"#test",
        items:true,
        dataItems:pData 
    });



    $('#btnSubmitPhone').click(function () {
        let data = $('#phone').val();
        localStorage.setItem('phone', data);
        if (data !== null && data !== '') {
            let result = checkPhoneExists(data);
            if (result.errCode === 1000) {
                let step = result.data.step;
                if (step === 4) {

                }
                else if (step === 2) {

                }
                else if (step === 3) {

                }
                else if (step === 0) {

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
            alert('Vui lòng nhập data phone !');
            return;
        }
    })
}

// Done +
function showUICheckNid(element) {
    var html =
        "<form id='formValueNid' class='formValue ng-untouched ng-pristine ng-invalid'><div class='mobile'" +
        "<label for='nid'>Vui lòng nhập số CMND/CCCD</label>" +
        "<input type='number' id='nid' class='input-global ng-pristine ng-invalid ng-touched' />" +
        "<h3>Chụp ảnh chân dung</h3>" +
        "<button type='button' id='callHP' class='btnCapture'></button>" +
        "<button type='button' id='btnSubmitNid' class='payment-button'>Tiếp tục</button>" +
        "</div></form>";
    $(element).html(html);

    $('#callHP').click(function () {
        runFaceCaptureScreen();
    })

    $('#selfie_image').click(function () {
        deleteImage('SELFIE');
    });

    $('#btnSubmitNid').click(function () {
        let data = $('#nid').val();
        localStorage.setItem('nid', data);
        if (data !== null && data !== '') {
            let result = checkNidExists(data);
            let checkSelfieImage = localStorage.getItem('selfie-image');
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
            alert('Vui lòng nhập data nid!');
            return;
        }
    })
}

// Done +
function captureNidFrontAndBack(element) {
    var html =
        "<form class='formValue'>" +
        "<div class='buttons mobile'>" +
        "<label for='nid'>Vui lòng nhập số CMND/CCCD</label>" +
        "<button type='button' id='btnCaptureFront' class='btnCapture'><label class='caption'>CMND mặt trước</label></button>" +
        "<button type='button' id='btnCaptureBack' class='btnCapture'><label class='caption'>CMND mặt sau</label></button>" +
        "<button type='button' id='btnSubmit' class='payment-button'>Tiếp tục</button>" +
        "</div></form>";
    $(element).html(html);

    $('#front_image').click(function () {
        deleteImage('FRONT');
    });

    $('#back_image').click(function () {
        deleteImage('BACK');
    });

    $('#btnCaptureFront').click(function () {
        runDocumentCaptureScreen('FRONT');
    })

    $('#btnCaptureBack').click(function () {
        let front_image = localStorage.getItem('front-image');
        if (front_image !== null && front_image !== '' && front_image !== undefined) {
            runDocumentCaptureScreen('BACK');
        }
        else {
            alert('Vui lòng chụp cmnd mặt trước trước !');
            return;
        }
    })

    $('#btnSubmit').click(function () {
        let fnc = localStorage.getItem('front_nid_customer');
        let bnc = localStorage.getItem('back_nid_customer');
        let adn = JSON.parse(localStorage.getItem('allDataNid'));
        if (fnc !== null && fnc !== '' && bnc !== null && bnc !== '' && adn !== null && adn !== '') {
            let fn = adn?.front_nid_customer;
            let bn = adn?.back_nid_customer;
            console.log('fn: ', fn);
            console.log('bn: ', bn);
            console.log('Typeof fn: ', typeof fn);
            console.log('Typeof bn: ', typeof bn);
            if (fn !== null && fn !== '' && bn !== null && bn !== '') {
                showDataInform('#test', fn.name, fn.gender === 'M' ? 'Nam' : 'Nữ', localStorage.getItem('phone'), fn.dob, fn.idNumber, bn.doi, fn.province, fn.district, fn.ward, fn.street, 'Ông', 'Nguyễn Hồng Quân', '0981234567', 'city_permanent', 'district_permanent', 'wards_permanent', 'street_permanent', adn)
            }
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
            let front_nid_customer = '';
            let back_nid_customer = '';
            // FRONT NID IMAGE
            if (arrType_front.includes(nidType) && nidType !== 'null') {
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
                let street = details?.permanentAddress?.value.split(',')[0];
                console.log('street: ', street);
                let ward = details?.permanentAddress.value.split(',')[2];
                console.log('ward: ', ward);
                let district = details?.permanentAddress.value.split(',')[3];
                console.log('district: ', district);
                let city = details?.permanentAddress.value.split(',')[4];
                console.log('city: ', city);
                let gender = details?.gender?.value;
                console.log('gender: ', gender);
                let doe = details?.doe?.value;
                console.log('doe: ', doe);
                let nationality = details?.nationality?.value;
                console.log('nationality: ', nationality);
                front_nid_customer = {
                    province: province,
                    idNumber: idNumber,
                    name: name,
                    dob: dob,
                    homeTown: homeTown,
                    street: street,
                    ward: ward,
                    district: district,
                    city: city,
                    gender: gender,
                    doe: doe,
                    nationality: nationality
                }
                localStorage.setItem('front_nid_customer', JSON.stringify(front_nid_customer));
            }
            // BACK NID IMAGE
            if (arrType_back.includes(nidType) && nidType !== 'null') {
                let doi = details?.doi?.value;
                console.log('doi: ', doi);
                let placeOfIssue = details?.placeOfIssue?.value;
                console.log('placeOfIssue: ', placeOfIssue);
                back_nid_customer = {
                    doi: doi,
                    placeOfIssue: placeOfIssue
                }
                localStorage.setItem('back_nid_customer', JSON.stringify(back_nid_customer));
            }
            if (localStorage.getItem('front_nid_customer') !== null && localStorage.getItem('back_nid_customer') !== null && localStorage.getItem('front_nid_customer') !== '' && localStorage.getItem('back_nid_customer') !== '') {
                let allDataNid = {
                    front_nid_customer: JSON.parse(localStorage.getItem('front_nid_customer')),
                    back_nid_customer: JSON.parse(localStorage.getItem('back_nid_customer'))
                }
                localStorage.setItem('allDataNid', JSON.stringify(allDataNid));
                return allDataNid;
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
            // console.log('Api Results Make Face Match Call: ', apiResults);
            var apiHeaders = HVResponse.getApiHeaders();
            // console.log('Api Headers Make Face Match Call: ', apiHeaders);
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
                    localStorage.setItem('selfie-image', imageBase64);
                    showCapture(imageBase64,'callHP');
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
                // console.log('Api Results Document Capture Screen: ', apiResults);
                var apiHeaders = HVResponse.getApiHeaders();
                // console.log('Api Headers Document Capture Screen: ', apiHeaders);
                var imageBase64 = HVResponse.getImageBase64();
                // console.log('Image Base64 Document Capture Screen: ', imageBase64);
                var attemptsCount = HVResponse.getAttemptsCount();
                // console.log('Attempt Count Document Capture Screen: ', attemptsCount);
                base64 = imageBase64;
                if (imageBase64 !== '' && imageBase64 !== null) {
                    if (side === 'FRONT' && side !== '') {
                        localStorage.setItem('front-image', imageBase64);
                        postNationalID(base64);
                        showCapture(imageBase64,"btnCaptureFront");
                        // alert('Lưu mặt trước CMND thành công !');
                        // $("#front_picture").attr("src", imageBase64);
                    }
                    else if (side === 'BACK' && side !== '') {
                        localStorage.setItem('back-image', imageBase64);
                        postNationalID(base64);
                        showCapture(imageBase64,"btnCaptureBack");
                        // alert('Lưu mặt sau CMND thành công !');
                        // $("#back_picture").attr("src", imageBase64);
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
    let html = `<div class='box'><div class='paragraph-text text-center margin-bottom-default'><h3>Chọn nhà cung cấp BNPL</h3><p>Mua trước Trả sau cùng</p></div>`;
    const data = getAllProviders();
    let providers = data.data;
    for (var i = 0; i < providers.length; i++) {
        html += `
        <div class='list-provider'>
        <button type='button' class='btnSelectProvider' data-id='${providers[i]._id}'><img src='${providers[i].url}' /></button>
        </div>`;
    }
    html += `</div>`;
    $(element).html(html);

    // show list productions
    listProductions({
        element:"#test",
        items:true,
        dataItems:pData 
    });
};

// Done +
function showMessage(element, message, icon) {
    var html =
        "<div>" +
        "<icon class='" + icon + "'></icon>" +
        "<p>" + message + "</p>" +
        "</div>";
    $(element).html(html);
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

function deleteImage(side) {
    try {
        if (side === 'SELFIE') {
            if (localStorage.getItem('selfie-image') !== null || localStorage.getItem('selfie-image') !== '' && localStorage.getItem('selfie-image') !== undefined) {
                localStorage.removeItem('selfie-image');
                $("#selfie_picture").attr("src", "");
                alert('Xóa ảnh selfie thành công !');
            }
            else {
                alert('Không tìm thấy ảnh để xóa !');
            }
        }
        else if (side === 'FRONT') {
            if (localStorage.getItem('front_image') !== null || localStorage.getItem('front_image') !== '' && localStorage.getItem('front_image') !== undefined) {
                localStorage.removeItem('front-image');
                $("#front_picture").attr("src", "");
                alert('Xóa mặt trước selfie thành công !');
            }
            else {
                alert('Không tìm thấy ảnh để xóa !');
            }
        }
        else {
            if (localStorage.getItem('back_image') !== null || localStorage.getItem('back_image') !== '' && localStorage.getItem('back_image') !== undefined) {
                localStorage.removeItem('back-image');
                $("#back_picture").attr("src", "");
                alert('Xóa mặt sau selfie thành công !');
            }
            else {
                alert('Không tìm thấy ảnh để xóa !');
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

function postNationalID(ImageURL) {
    try {
        // Split the base64 string in data and contentType
        var block = ImageURL.split(";");
        // Get the content type of the image
        var contentType = block[0].split(":")[1];   // In this case "image/gif"
        // get the real base64 content of the file
        var realData = block[1].split(",")[1];      // In this case "R0lGODlhPQBEAPeoAJosM...."
        // Convert it to a blob to upload
        var blob = b64toBlob(realData, contentType);

        // Create a FormData and append the file with "image" as parameter name
        var formDataToUpload = new FormData();
        formDataToUpload.append("image", blob);

        var settings = {
            "url": "https://vnm-docs.hyperverge.co/v2/nationalID",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "appId": "abe84d",
                "appKey": "7d2c0d7e1690c216458c",
                "transactionId": "6bdec326-5eff-4492-b045-160816e61cea"
            },
            "async": false,
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": formDataToUpload
        };

        $.ajax(settings).done(function (response) {
            const data = JSON.parse(response);
            console.log("cutStringData : ", data);
            cutStringData(data);
        });
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
}

function showDataInform(element, fullname, gender, phone, dob, nid, doi, city, district, wards, street, relationship, fullname_ref, phone_ref, city_permanent, district_permanent, wards_permanent, street_permanent, allDataNid = localStorage.getItem('allDataNid')) {
    console.log(JSON.parse(allDataNid));
    allDataNid = JSON.parse(allDataNid);
    console.log("allDataNid : ", allDataNid.front_nid_customer.province);
    var html =
        `<div class='form-card'>
            <h2>Nhập thông tin cá nhân</h2>
            <p class='desc'>Vui lòng điền các trường thông tin bên dưới</p>
            <form class=''>
                <div class="card">
                    <div class="card-head">
                        <h3>Personal information</h3>
                    </div>
                    <div class="card-body">
                        <div class='form-row'>
                            <label for='fullname'>Họ và tên</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched ' type='text' id='fullname' name='fullname' value="`+allDataNid.front_nid_customer.name+`" />
                        </div>
                        <div class='form-row'>
                            <label for='phone'>Số điện thoại</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched ' type='phone' id='phone' name='phone' value="`+allDataNid.front_nid_customer.phone+`" />
                        </div>
                        <div class='form-row'>
                            <label for='phone'>Ngày sinh</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched ' type='text' id='dob' name='dob' value="`+allDataNid.front_nid_customer.phone+`" />
                        </div>
                        <div class='form-row'>
                            <label for='phone'>Giới tính</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched ' type='text' id='gender' name='gender' value="`+allDataNid.front_nid_customer.phone+`" />
                        </div>
                        <div class='form-row'>
                            <label for='phone'>Số CMND/CCCD</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched ' type='text' id='nid' name='nid' value="`+allDataNid.front_nid_customer.phone+`" />
                        </div>
                        <div class='form-row'>
                            <div class="form-cell">
                                <label for='phone'>Ngày cấp</label>
                                <input class='input-global ng-pristine ng-invalid ng-touched ' type='text' id='doi' name='doi' value="`+allDataNid.front_nid_customer.phone+`" />
                            </div>
                            <div class="form-cell">
                                <label for='phone'>Ngày hết hạn</label>
                                <input class='input-global ng-pristine ng-invalid ng-touched ' type='text' id='doe' name='doe' value="`+allDataNid.front_nid_customer.phone+`" />
                            </div>
                        </div>
                    </div>
                    <div class="card-footer"></div>
                </div>
            </form>
        </div>`;
/*
        "<h2>Enter personal information</h2>" +
        "<div class='list-items'>" + 
        "<form class='form-container'>" +

        ""+

        "<h3>Personal information</h3>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='fullname'>Full Name</label>" +
        "<input class='form__input' type='text' id='fullname' name='fullname' value=" + fullname + ">" +
        "</div>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='gender'>Gender</label>" +
        "<input class='form__input' type='text' id='gender' name='gender' value=" + gender + ">" +
        "</div>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='phone'>Phone number</label>" +
        "<input class='form__input' type='phone' id='phone' name='phone' value=" + phone + ">" +
        "</div>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='dob'>Date of birth</label>" +
        "<input class='form__input' type='text' id='dob' name='dob' value=" + dob + ">" +
        "</div>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='nid'>ID number</label>" +
        "<input class='form__input' type='text' id='nid' name='nid' value=" + nid + ">" +
        "</div>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='doi'>Date of issue</label>" +
        "<input class='form__input' type='text' id='doi' name='doi' value='" + allDataNid.back_nid_customer.doi + "'>" +
        "</div>" +

        "<h3>Current address</h3>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='city'>City/Province</label>" +
        "<input class='form__input' type='text' id='city' name='city' value='" + allDataNid.front_nid_customer.province + "'>" +
        "</div>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='district'>District</label>" +
        "<input class='form__input' type='text' id='district' name='district' value=" + district + ">" +
        "</div>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='wards'>Wards</label>" +
        "<input class='form__input' type='text' id='wards' name='wards' value=" + wards + ">" +
        "</div>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='street'>Street</label>" +
        "<input class='form__input' type='text' id='street' name='street' value=" + street + ">" +
        "</div>" +

        "<h3>Reference information</h3>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='relationship'>Relationship</label>" +
        "<input class='form__input' type='text' id='relationship' name='relationship' value=" + relationship + ">" +
        "</div>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='fullname_ref'>Full name</label>" +
        "<input class='form__input' type='text' id='fullname_ref' name='fullname_ref' value=" + fullname_ref + ">" +
        "</div>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='phone_ref'>Phone number</label>" +
        "<input class='form__input' type='text' id='phone_ref' name='phone_ref' value=" + phone_ref + ">" +
        "</div>" +

        "<h3>Permanent address</h3>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='city_permanent'>City/Province</label>" +
        "<input class='form__input' type='text' id='city_permanent' name='city_permanent' value=" + city_permanent + ">" +
        "</div>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='district_permanent'>District</label>" +
        "<input class='form__input' type='text' id='district_permanent' name='district_permanent' value=" + district_permanent + ">" +
        "</div>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='wards_permanent'>Wards</label>" +
        "<input class='form__input' type='text' id='wards_permanent' name='wards_permanent' value=" + wards_permanent + ">" +
        "</div>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='street_permanent'>Street</label>" +
        "<input class='form__input' type='text' id='street_permanent' name='street_permanent' value=" + street_permanent + ">" +
        "</div>" +

        "<span><b>Note:</b>*Compulsory information</span>" +

        "<button type='button'>Continue</button>" +
        "</form></div>";
*/
    $(element).html(html);
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
});

function configUi(config){
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
}

function listProductions(config){
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

function showCapture(base64, eId){
    if(base64){
        $('#'+eId).addClass("showImage");
        $('#'+eId).css({
            'background': 'url(' + base64 + ') no-repeat center',
             'background-size': 'cover'
        });

    }
}