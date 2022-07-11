const arrType_front = ["cccd_chip_front", "cccd_front", "cmnd_old_front"];
const arrType_back = ["cccd_chip_back", "cmnd_new_cccd_back", "cmnd_old_back"];
let billTotal = 0;
let customer = { avatar: './assets/img/avatar.png', limit: '50000000', name: 'Trung' };
let btnSelActive, btnFrontActive, btnBackActive = false;

// Done +++
function Personal(fullname, gender, phone, dob, nid, doi, doe, city, district, ward, street) {
    this.fullname = fullname;
    this.gender = gender;
    this.phone = phone;
    this.dob = dob;
    this.nid = nid;
    this.doi = doi;
    this.doe = doe;
    this.city = city;
    this.district = district;
    this.ward = ward;
    this.street = street;
}

// Done +++
function showProgressbar(element) {
    var html = `<div class='progress'> 
                    <div class='progress__fill'></div> 
                    <span class='progress__text'>0%</span> 
                </div>`;
    $(element).html(html);
}

// Done +++
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

// Done +++
function showCircularProgressbar(element) {
    var html = `<div class='box showCircularProgressbar' style='margin-top:200px'>
                    <div class='paragraph-text text-center margin-bottom-default'>
                    <div class="imgloading-140"></div>
                    <h2 class='sub2'>Đang trong tiến trình xác minh thông tin</h2>
                    <p style='text-align: center;'>
                    Lưu ý: Tiến trình xác minh hồ sơ có thể mất từ 5-15 phút
                    </p> 
                    </div> 
                </div>`;
    $(element).html(html);
    showProcessPipeline(4,true);
    $("body").removeClass("loading");

    var myInterval = setInterval(function () {
        let phone = localStorage.getItem('phone');
        let result = checkPhoneExists(phone);
        if (result.errCode === 1000 && result.status === true) {
            let step = result.data.step;
            if (step === 4) {
                clearInterval(myInterval);
                messageScreen(element, { screen: "successScreen", pipeline: true });
            }
        }
    }, 5000);
}

// Done +++
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

// Done +++
function formatStyleCorrectInput(data, errorMessage) {
    data.style.borderColor = '#197DDE';
    errorMessage.innerHTML = '';
    errorMessage.style.visibility = 'hidden';
    errorMessage.style.opacity = '0';
    // btn.disabled = false;
    // btn.style.backgroundColor = '#000000';
}

// Done +++
function formatStyleWrongInput(data, errorMessage, content) {
    data.style.borderColor = '#EE4D2D';
    errorMessage.innerHTML = content;
    errorMessage.style.visibility = 'visible';
    errorMessage.style.opacity = '1';
    // btn.disabled = true;
    // btn.style.backgroundColor = 'rgba(154, 147, 147, 0.1)';
}

// Done +++
function showUICheckPhone(element) {
    setRoute("showUICheckPhone");
    var html = `<form id='formValuePhone' class='formValue showUICheckPhone'>
                    <div class='mobile'>
                        <div class='form__row'>
                            <h5>Số điện thoại</h5>
                            <label for='phone' class='text-b-m'>Vui lòng nhập số điện thoại để tiếp tục</label>
                            <input type='phone' id='phone' class='form__input input-global' />
                            <span class='error_message'></span>
                        </div>

                        <button type='button' id='btnSubmitPhone' class='payment-button'>Tiếp tục</button>

                    </div>
                </form>`;
    $(element).html(html);

    //custom show
    configUi({
        element: element,
        logo: true,
        intro: true
    });

    // show list productions
    listProductions({
        element: element,
        items: true,
        dataItems: pData
    });

    var dataPhone = document.querySelector('#phone');
    var errorMessage = document.querySelector('.error_message');
    var btnSubmitPhone = document.querySelector('#btnSubmitPhone');
    btnSubmitPhone.disabled = true;

    $("#phone").on('input', function () {

        const regexPhone = /^(09|03|07|08|05)+([0-9]{8}$)/;
        let isPhoneErr = !regexPhone.test(dataPhone.value);

        if (dataPhone.value !== null && dataPhone.value !== '') {
            if (!isPhoneErr) {
                btnSubmitPhone.disabled = false;
                formatStyleCorrectInput(dataPhone, errorMessage);
            }
            else {
                btnSubmitPhone.disabled = true;
                formatStyleWrongInput(dataPhone, errorMessage, 'Số điện thoại không hợp lệ');
            }
        }
        else {
            btnSubmitPhone.disabled = true;
            formatStyleWrongInput(dataPhone, errorMessage, 'Vui lòng nhập số điện thoại');
        }
    });

    $('#btnSubmitPhone').click(function () {
        let data = dataPhone.value;
        localStorage.setItem('phone', data);
        let result = checkPhoneExists(data);
        console.log('Check phone exists: ', result);
        if (result.errCode === 1000 && result.status === true) {
            let step = result.data.step;
            if (step === 4) {
                showFormPincode(element, data, 'VERIFY_PIN');
            }
            else if (step === 2) {
                showContract(element);
            }
            else if (step === 3) {
                showCircularProgressbar(element);
            }
            else if (step === 0) {
                showMessage(element, "<h3>Đang chờ xác minh...</h3>", "ico-success");
            }
        }
        else if (result.errCode === 1003 && result.status === false) {
            showUICheckNid(element);
        }
        else if (result.errorCode === 8000 && result.status === false) {
            formatStyleWrongInput(dataPhone, errorMessage, 'Định dạng số điện thoại không hợp lệ');
            return;
        }
        else if (result.errCode === 1008 && result.status === false) {
            formatStyleWrongInput(dataPhone, errorMessage, 'Bạn đã nhập sai otp 5 lần. Vui lòng đợi 60 phút để thử lại !');
            return;
        }
        else if (result.errCode === 1004 && result.status === false) {
            formatStyleWrongInput(dataPhone, errorMessage, 'Bạn đã đăng nhập thất bại 5 lần. Vui lòng đợi 60 phút để thử lại !');
            return;
        }
    });
}

// Done +++
function showUICheckNid(element) {
    setRoute("showUICheckNid");
    var html = `<form id='formValueNid' class='formValue showUICheckNid'>
                    <div class='mobile'>

                        <div class='form__row'>
                            <label for='nid'>Vui lòng nhập số CMND/CCCD</label>
                            <input type='number' id='nid' class='input-global' />
                            <span class='error_message'></span>
                        </div>

                        <label>Chụp ảnh chân dung</label>
                        <button type='button' id='callHP' class='btnCapture'></button>
                        <button type='button' id='btnSubmitNid' class='payment-button'>Tiếp tục</button>

                    </div>
                </form>`;
    $(element).html(html);
    pageTitle(element,"<h4 class='pageTitle'>Chụp ảnh chân dung</h4>");

    $('#callHP').click(function () {
        showUseGuideSelfy();
        // runFaceCaptureScreen();
    });

    $('#selfie_image').click(function () {
        deleteImage('SELFIE');
    });

    var dataNid = document.querySelector('#nid');
    var errorMessage = document.querySelector('.error_message');
    var btnSubmitNid = document.querySelector('#btnSubmitNid');
    btnSubmitNid.disabled = true;

    let isNidErr = false;
    let isActive = false;

    $("#nid").on('input', function () {
        if (dataNid.value !== null && dataNid.value !== '') {
            const regexNid = /^\d{12}$|^\d{9}$/;
            isNidErr = !regexNid.test(dataNid.value);
            if (!isNidErr) {
                isActive = true;
                formatStyleCorrectInput(dataNid, errorMessage);
            }
            else {
                isActive = false;
                formatStyleWrongInput(dataNid, errorMessage, 'Số CMND/CCCD không hợp lệ');
            }
        }
        else {
            isActive = false;
            formatStyleWrongInput(dataNid, errorMessage, 'Vui lòng nhập CMND/CCCD');
        }

        if (isActive && btnSelActive) {
            btnSubmitNid.disabled = false;
        }
        else {
            btnSubmitNid.disabled = true;
        }
    });

    $('#btnSubmitNid').click(function () {
        let data = $('#nid').val();
        localStorage.setItem('nid', data);
        var checkSelfieImage = localStorage.getItem('selfie-image');
        let result = checkNidExists(data);
        console.log('Check nid exists: ', result);
        if (result.statusCode === 1000 && result.status === true && checkSelfieImage !== null) {
            formatStyleWrongInput(dataNid, errorMessage, 'CMND/CCCD đã được đăng ký.');
        }
        else if (result.statusCode === 900 && result.status === false && checkSelfieImage !== null) {
            captureNidFrontAndBack(element);
            let checkCustomer = {
                phone: localStorage.getItem('phone'),
                nid: localStorage.getItem('nid'),
                selfieImage: localStorage.getItem('selfie-image')
            };
            localStorage.setItem('checkCustomer', JSON.stringify(checkCustomer));
        }
        else if (result.errorCode === 8000 && result.status === false) {
            formatStyleWrongInput(dataNid, errorMessage, 'Số CMND/CCCD không hợp lệ !');
        }
    })
}

// Done +++
function captureNidFrontAndBack(element) {
    setRoute("captureNidFrontAndBack");
    var html = `<form class='formValue captureNidFrontAndBack' id="formValueNid">
                    <div class='buttons mobile'>
                        <label for='' class='title'>Chụp ảnh CMND/CCCD</label>
                        <div>
                        <button type='button' id='btnCaptureFront' class='btnCapture'><label class='caption'>CMND mặt trước</label></button>
                        <button type='button' id='btnCaptureBack' class='btnCapture'><label class='caption'>CMND mặt sau</label></button>
                        </div>
                        <button type='button' id='btnSubmit' class='payment-button'>Tiếp tục</button>
                    </div>
                </form> `;
    $(element).html(html);
    showProcessPipeline(1,true,'captureNid');
    pageTitle(element,"<h4 class='pageTitle'>Chụp ảnh CMND/CCCD</h4>");

    $('#front_image').click(function () {
        deleteImage('FRONT');
    });

    $('#back_image').click(function () {
        deleteImage('BACK');
    });

    $('#btnCaptureFront').click(function () {
        showUseGuideNid();
        // runDocumentCaptureScreen('FRONT');
    })

    $('#btnCaptureBack').click(function () {
        let front_image = localStorage.getItem('front-image');
        if (front_image !== null && front_image !== '' && front_image !== undefined) {
            runDocumentCaptureScreen('BACK');
        }
        else {
            alert('Vui lòng chụp cmnd mặt trước rùi mới chụp mặt sau !');
            return;
        }
    })

    let btnCaptureFront = document.querySelector('#btnCaptureFront');
    let btnCaptureBack = document.querySelector('#btnCaptureBack');
    let btnSubmit = document.querySelector('#btnSubmit');
    btnSubmit.disabled = true;

    let frontImage = localStorage.getItem('front-image');
    let backImage = localStorage.getItem('back-image');

    if (btnFrontActive && btnBackActive) {
        btnSubmit.disabled = false;
    }
    else {
        btnSubmit.disabled = true;
    }

    $('#btnSubmit').click(function () {
        let adn = JSON.parse(localStorage.getItem('allDataNid'));
        if (adn !== null && adn !== '') {
            let fn = adn?.front_nid_customer;
            let bn = adn?.back_nid_customer;
            let phone = localStorage.getItem('phone');
            if (fn !== null && bn !== null) {
                let personal = new Personal(fn.name, fn.gender, phone, fn.dob, fn.idNumber, bn.doi, fn.doe, fn.province, fn.district, fn.ward, fn.street);
                showDataInform('#voolo', personal);
            }
            else if (fn === null) {
                alert('Không tìm thấy thông tin cmnd mặt trước ! Vui lòng thử lại !');
                return;
            }
            else if (bn === null) {
                alert('Không tìm thấy thông tin cmnd mặt sau ! Vui lòng thử lại !');
                return;
            }
        }
    })
}

async function matchField(value1, value2) {
    let data = $.ajax({
        type: "POST",
        url: "https://apac.docs.hyperverge.co/v1/matchFields",
        async: false,
        headers: {
            appId: "abe84d",
            appKey: "7d2c0d7e1690c216458c",
            transactionId: "822bc277-0d58-42d8-84d0-ae17006c0d22"
        },
        data: JSON.stringify({
            "id_number": {
                "value1": value1,
                "value2": value2
            }
        }),
        contentType: "application/json",
        // complete: function (data) {
        //     let result = data.responseJSON.result;
        //     let idNumber = result?.id_number;
        //     let all = result?.all;
        //     console.log('idNumber: ', idNumber);
        //     console.log('all: ', all);
        //     if (idNumber && all) {
        //         return true;
        //     }
        //     else {
        //         return false;
        //     }
        // }
    });
    return data.responseJSON;
}

// Done +++
async function fetchToken() {
    try {
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

// Done +++
async function getHV() {
    try {
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
function cutStringData(infomation) {
    try {
        if (infomation !== null && infomation !== '' && infomation !== undefined) {
            const { status, statusCode, result } = infomation;
            const details = result?.details[0]?.fieldsExtracted;
            const nidType = result?.details[0]?.type;
            let front_nid_customer = '';
            let back_nid_customer = '';
            // FRONT NID IMAGE
            if (arrType_front.includes(nidType) && nidType !== null) {
                localStorage.setItem('typeFrontNid', nidType);
                let province = details?.province?.value || '';
                let idNumber = details?.idNumber?.value || '';
                let name = details?.name?.value || '';
                let dob = details?.dob?.value || '';
                let homeTown = details?.homeTown?.value || '';
                let permanentAddress = details?.permanentAddress?.value;
                let street = details?.permanentAddress?.value.split(',')[0] ? details?.permanentAddress?.value.split(',')[0] : '';
                let ward = details?.permanentAddress?.value.split(',')[1] ? details?.permanentAddress?.value.split(',')[1] : '';
                let district = details?.permanentAddress?.value.split(',')[2] ? details?.permanentAddress?.value.split(',')[2] : '';
                let city = details?.permanentAddress?.value.split(',')[3] ? details?.permanentAddress?.value.split(',')[3] : '';
                let gender = details?.gender?.value || '';
                let doe = details?.doe?.value || '';
                let nationality = details?.nationality?.value || '';
                let nid = localStorage.getItem('nid');
                matchField(nid, idNumber).then((data) => {
                    console.log('Data Match Field: ', data);
                    let idNumberCheck = data?.result?.id_number;
                    let all = data?.result?.all;
                    console.log('idNumber: ', idNumberCheck);
                    console.log('all: ', all);
                    if (idNumberCheck && all) {
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
                        showUseGuideBackNid();
                    }
                    else {
                        localStorage.removeItem('front-image');
                        $("#btnCaptureFront").attr("style", "background-image: url(./assets/img/camera.png) center no-repeat");
                        $("#btnCaptureFront").removeClass("showImage");
                        alert('Chứng minh nhân dân mặt trước và chứng minh nhân dân nhập tay không trùng khớp');
                        runDocumentCaptureScreen('FRONT');
                    }
                });
            }
            // BACK NID IMAGE
            if (arrType_back.includes(nidType) && nidType !== null) {
                let typeFrontNid = localStorage.getItem('typeFrontNid');
                if ((typeFrontNid === 'cccd_chip_front' && nidType === 'cccd_chip_back') || (typeFrontNid === 'cccd_front' && nidType === 'cmnd_new_cccd_back') || (typeFrontNid === 'cmnd_old_front' && nidType === 'cmnd_back_front')) {
                    let doi = details?.doi?.value || '';
                    let placeOfIssue = details?.placeOfIssue?.value || '';
                    back_nid_customer = {
                        doi: doi,
                        placeOfIssue: placeOfIssue
                    }
                    localStorage.setItem('back_nid_customer', JSON.stringify(back_nid_customer));
                }
                else {
                    alert('Hai mặt chứng minh nhân dân không phù hợp và trùng khớp ! Vui lòng thử lại !');
                    return;
                }
            }
        }

        let fnc = JSON.parse(localStorage.getItem('front_nid_customer'));
        let bnc = JSON.parse(localStorage.getItem('back_nid_customer'));

        if (fnc !== null && bnc !== null) {
            let allDataNid = {
                front_nid_customer: fnc,
                back_nid_customer: bnc
            }
            localStorage.setItem('allDataNid', JSON.stringify(allDataNid));
        }
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
}

// Done +++
function makeFaceMatchCall(faceImageBase64String, docImageBase64String) {
    callback = (HVError, HVResponse) => {
        if (HVError) {
            var errorCode = HVError.getErrorCode();
            var errorMessage = HVError.getErrorMessage();
        }
        if (HVResponse) {
            var apiResults = HVResponse.getApiResult();
            var apiHeaders = HVResponse.getApiHeaders();
            if (apiResults !== null) {
                const data = apiResults?.result;
                const matchFace = data?.match;
                if (matchFace === 'no') {
                    alert('The face and the image of the identity card on the front side do not match');
                    return false;
                }
                else {
                    alert('The face and the image of the identity card on the front side match');
                    return true;
                }
            }
        }
    };
    HVNetworkHelper.makeFaceMatchCall(faceImageBase64String, docImageBase64String, {}, {}, callback);
}

// Done +++
async function LaunchFaceCaptureScreen() {
    try {
        var hvFaceConfig = new HVFaceConfig();
        hvFaceConfig.setShouldShowInstructionPage(false);
        hvFaceConfig.faceTextConfig.setFaceCaptureTitle('Chụp ảnh chân dung');
        hvFaceConfig.faceTextConfig.setFaceCaptureBottomDescription('Bạn đang chụp ảnh chân dung để đăng ký tài khoản (KYC). Vui lòng sử dụng số điện thoại và thiết bị của bạn.');
        hvFaceConfig.faceTextConfig.setFaceNotDetectedDescription('Vui lòng KHÔNG đội nón, đeo kính, khẩu trang, chọn nơi có đủ ánh sáng để chụp ảnh');
        hvFaceConfig.faceTextConfig.setFaceTooBigDescription('Cách xa camera');
        hvFaceConfig.faceTextConfig.setFaceDetectedDescription('Chụp ảnh ngay');
        hvFaceConfig.faceTextConfig.setFaceCaptureReviewTitle('faceCaptureReviewTitle');
        hvFaceConfig.faceTextConfig.setFaceCaptureReviewBottomDescription('Bạn đang chụp ảnh chân dung để đăng ký tài khoản (KYC). Vui lòng sử dụng số điện thoại và thiết bị của bạn.');

        callback = (HVError, HVResponse) => {
            if (HVError) {
                var errorCode = HVError.getErrorCode();
                var errorMessage = HVError.getErrorMessage();
                if (errorCode === '013') {
                    return;
                }
                if (errorCode === 401) {
                    console.error(errorMessage);
                    return;
                }
            }
            if (HVResponse) {
                var apiResults = HVResponse.getApiResult();
                var apiHeaders = HVResponse.getApiHeaders();
                var imageBase64 = HVResponse.getImageBase64();
                var attemptsCount = HVResponse.getAttemptsCount();
                console.log(apiResults);
                if (imageBase64 !== '' && imageBase64 !== null && imageBase64 !== undefined) {
                    $('.guideslide').remove();
                    $("#formValueNid").show();
                    $('body').find('.pageTitle').text("Chụp ảnh chân dung");
                    localStorage.setItem('selfie-image', imageBase64);
                    showCapture(imageBase64, 'callHP');
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

// Done +++
async function LaunchDocumentCaptureScreen(side) {
    try {
        var hvDocConfig = new HVDocConfig();
        hvDocConfig.setShouldShowInstructionPage(false);
        hvDocConfig.setShouldShowDocReviewScreen(false);
        // hvDocConfig.docTextConfig.setDocCaptureBottomDescription('Chụp ảnh mặt trước')
        hvDocConfig.docTextConfig.setDocCaptureReviewTitle('Chụp ảnh CMND/CCCD');
        hvDocConfig.docTextConfig.setDocCaptureBottomDescription('Chọn nơi đủ ánh sáng và đưa cmnd/cccd trong khung hình');

        let applyFrontNid = side === 'FRONT' && side !== 'BACK' && side !== '';
        let applyBackNid = side === 'BACK' && side !== 'FRONT' && side !== '';
        if (applyFrontNid) {
            hvDocConfig.docTextConfig.setDocCaptureTitle('Chụp ảnh mặt trước');
            hvDocConfig.setOCRDetails("https://vnm-docs.hyperverge.co/v2/nationalID", hvDocConfig.DocumentSide.FRONT, {}, {});
        }
        else if (applyBackNid) {
            hvDocConfig.docTextConfig.setDocCaptureTitle('Chụp ảnh mặt sau');
            hvDocConfig.setOCRDetails("https://vnm-docs.hyperverge.co/v2/nationalID", hvDocConfig.DocumentSide.BACK, {}, {});
        }
        callback = (HVError, HVResponse) => {
            if (HVError) {
                var errorCode = HVError.getErrorCode();
                var errorMessage = HVError.getErrorMessage();
                if (errorCode) {
                    console.log('errorCode: ', errorCode);
                }
                if (errorCode === '013') {
                    console.log('errorCode: ', errorCode);
                    return
                }
                if (errorCode === 401) {
                    console.log('errorCode: ', errorCode);
                    console.log('errorMessage: ', errorMessage);
                    return;
                }
            }
            if (HVResponse) {
                var apiResults = HVResponse.getApiResult();
                var apiHeaders = HVResponse.getApiHeaders();
                var imageBase64 = HVResponse.getImageBase64();
                var attemptsCount = HVResponse.getAttemptsCount();
                if (apiResults['result']['summary']['action'] !== 'pass') {
                    alert(apiResults.error);
                    return
                }

                if (imageBase64 !== '' && imageBase64 !== null) {
                    $('.guideslide').remove();
                    $('.guideslideback').remove();
                    $("#formValueNid").show();
                    $('body').find('.pageTitle').text("Chụp ảnh CMND/CCCD");
                    if (applyFrontNid) {
                        localStorage.setItem('front-image', imageBase64);
                        postNationalID(imageBase64);
                        showCapture(imageBase64, "btnCaptureFront")
                        // alert('Lưu mặt trước CMND thà công !');
                        // $("#front_picture").attr("src", imageBase64);
                    }
                    else if (applyBackNid) {
                        localStorage.setItem('back-image', imageBase64);
                        postNationalID(imageBase64);
                        showCapture(imageBase64, "btnCaptureBack");
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

// Done +++
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

// Done +++
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

// Done +++
function showAllTenor(element, nCount = 0) {
    setRoute("showAllTenor");
    let html = '';
    if(customer.limit < totalBillNumber){
        customerInfo(element,false);
        return;
    }
    console.log(totalBillNumber);
    const data = getAllTenor();
    let tenors = data.data;
    count = nCount === 0 ? tenors.length : nCount;
    html += `<form class='formValue orderTop box-mobile box-tenor'> <div style="margin-bottom:24px" class='sub2'>Vui lòng chọn kì hạn thanh toán</div>`;
    for (var i = 0; i < count; i++) {
        html += `
        <div class='voolo-intro tenor-list' data-id='${tenors[i]._id}' onclick='selectTenor(this)'>
            <div class='tenor-item'>
                <div class="tenor-head">
                    <div class='sub4'>KÌ HẠN 1</div class='sub4'>
                    <h5 class='totalprice'>${formatCurrency(parseInt(totalBillNumber)+parseInt(tenors[i].convertFee))}</h5>
                </div>
                    <ul>
                        <li>Giá sản phẩm: ${formatCurrency(billTotal)}</li>
                        <li>Phí chuyển đổi: ${formatCurrency(tenors[i].convertFee)}</li>
                        <li>Thời gian thanh toán: ${tenors[i].paymentSchedule} ngày</li>
                    </ul>
                <p></p>
            </div>
        </div>`
    }
    if (count <= 3 && tenors.length > 3) html += `<a onclick='showAllTenor("${element}",0)' class='ahref'>Hiển thị thêm</a>`;
    html += `<button type='button' id='btnContinue' class='payment-button medium'>Tiếp tục</button></form>`;
    $(element).html(html);

    //validation button
    var btnSubmitPin = document.querySelector('#btnContinue');
    btnSubmitPin.disabled = true;

    
    // show list productions
    listProductions({
        element: element,
        items: true,
        dataItems: pData
    });
    customerInfo(element);
    

    $('#btnContinue').click(function () {
        let phone = localStorage.getItem('phone');
        showFormPincode(element, phone, 'BUY_SUCCESS');
    });
};

// Done +++
function showAllProvider(element) {
    let html = `<div class='box'> <div class='paragraph-text text-center margin-bottom-default'><h6>Chọn nhà cung cấp BNPL</h6></div>`;
    const data = getAllProviders();
    let providers = data.data;
    for (var i = 0; i < providers.length; i++) {
        html += `
        <div class='list-provider'>
            <button type='button' class='btnSelectProvider' data-id='${providers[i]._id}' onclick='selectProvider("${providers[i]._id}")'><img src='${providers[i].url}' /></button>
        </div> `;
    }
    html += `</div>`;
    $(element).html(html);

    // show list productions
    listProductions({
        element: element,
        items: true,
        dataItems: pData
    });
};

// Done +++
function selectTenor(el) {
    $(".tenor-list").removeClass("active");
    $(el).closest('div.tenor-list').addClass("active");
    //validation button
    var btnSubmitPin = document.querySelector('#btnContinue');
    btnSubmitPin.disabled = false;
    return;
}

// Done +++
function selectProvider() {
    showUICheckPhone('#voolo');
}

// Done +++
/*
* icon : "ico-success", "ico-unsuccess"
* message : html "<h3>Cập nhật mã PIN không thành công</h3><p>Vui lòng thử lại hoặc liên hệ 1900xxx để được hỗ trợ.</p>"
*/

// Done +++
function showMessage(element, message, icon) {
    var html = `<div class='box showMessage'>
                    <div class='paragraph-text text-center margin-bottom-default'>
                        <div class='${icon}'></div>
                        ${message}
                        <p style='text-align: center;'>
                        Bấm vào <a class="ahref" href="${DOMAIN}" style='width:auto'>đây</a> để quay trở lại. Tự động trở lại trang mua hàng sau 5s.
                        </p>
                    </div> 
                </div> `;
    $(element).html(html);
}

// Done +++
// function showStatusPage(element, message, imagePath, desc, step) {
//     $(element).empty();
//     showHeader();
//     showProcessPipeline(step);
//     var html = `<div class='container-status-page'>
//                     <img src='${imagePath}' class='container-status-page-img'/>
//                     <h1 class='container-status-page-title'>${message}</h1>
//                     ${desc !== null && desc !== '' ? `<p class='container-status-page-desc'>${desc}</p>` : ''} 
//                 </div> `;
//     $(element).prepend(html);

//     $('body').click(function () {
//         showStatusPage(element, 'Bạn đã đăng ký thành công', './assets/img/Success.png', 'Bấm vào đây để quay trở lại. Tự động trở lại trang mua hàng sau 5s.', 4);
//     })
// }

// Done +++
function deleteImage(side) {
    try {
        if (side === 'SELFIE') {
            if (localStorage.getItem('selfie-image') !== null) {
                localStorage.removeItem('selfie-image');
                $("#selfie_picture").attr("src", "");
                alert('Xóa ảnh selfie thành công !');
            }
            else {
                alert('Không tìm thấy ảnh để xóa !');
            }
        }
        else if (side === 'FRONT') {
            if (localStorage.getItem('front_image') !== null) {
                localStorage.removeItem('front-image');
                $("#front_picture").attr("src", "");
                alert('Xóa mặt trước selfie thành công !');
            }
            else {
                alert('Không tìm thấy ảnh để xóa !');
            }
        }
        else {
            if (localStorage.getItem('back_image') !== null) {
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

// Done +++
function postNationalID(ImageURL) {
    try {
        var block = ImageURL.split(";");
        var contentType = block[0].split(":")[1];
        var realData = block[1].split(",")[1];
        var blob = b64toBlob(realData, contentType);

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

// Done +++
function showErrorMessage(input, message) {
    let parent = input.parentElement;
    let inputEle = parent.querySelector('input');
    let selectEle = parent.querySelector('select');
    if (inputEle) {
        inputEle.style.border = '1px solid #EE4D2D';
    }
    if (selectEle) {
        selectEle.style.border = '1px solid #EE4D2D';
    }
    let spanError = parent.querySelector('span');
    spanError.innerText = message;
    spanError.style.marginTop = '10px';
    spanError.style.textAlign = 'left';
    spanError.style.marginLeft = '0px';
    spanError.style.visibility = 'visible';
    spanError.style.opacity = '1';
}

// Done +++
function showSuccessMessage(input) {
    let parent = input.parentElement;
    let inputEle = parent.querySelector('input');
    let selectEle = parent.querySelector('select');
    if (inputEle) {
        inputEle.style.border = '1px solid #e4e2e2';
    }
    if (selectEle) {
        selectEle.style.border = '1px solid #e4e2e2';
    }
    let spanError = parent.querySelector('span');
    spanError.innerText = '';
    spanError.style.visibility = 'hidden';
    spanError.style.opacity = '0';
    spanError.style.marginTop = '0px';
    spanError.style.marginLeft = '0px';
}

// Done +++
function onChangeValidation(input, message) {
    let element = document.querySelector(input);
    let value = element.value.trim();
    let parent = element.parentElement;
    let span = parent.querySelector('span');
    console.log('Input: ', input);
    console.log('Element: ', element);
    console.log('Value: ', value);
    console.log('Span: ', span);
    if (value) {
        element.style.border = '1px solid #197DDE';
        span.innerText = '';
        span.style.marginTop = '0px';
        span.style.visibility = 'hidden';
        span.style.opacity = '0';
    }
    else {
        element.style.border = '1px solid #EE4D2D';
        span.innerText = message;
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
            showSuccessMessage(input);
        }
        else {
            isEmptyError = true;
            showErrorMessage(input, 'Vui lòng nhập thông tin');
        }
    });
    return isEmptyError;
}

// Done +++
function showDataInform(element, personal) {
    setRoute("showDataInform");
    let adn = JSON.parse(localStorage.getItem('allDataNid'));
    if (adn !== null && adn !== '') {
        let fn = adn?.front_nid_customer;
        let bn = adn?.back_nid_customer;
        if (fn !== null && bn !== null) {
            personal = new Personal(fn.name, fn.gender, localStorage.getItem('phone'), fn.dob, fn.idNumber, bn.doi, fn.doe, fn.province, fn.district, fn.ward, fn.street);
        }
        else if (fn === null) {
            alert('Không tìm thấy thông tin cmnd mặt trước ! Vui lòng thử lại !');
            return;
        }
        else if (bn === null) {
            alert('Không tìm thấy thông tin cmnd mặt sau ! Vui lòng thử lại !');
            return;
        }
    }
    let cities = getAllCity();
    let referencesRelation = getAllReferenceRelation();
    showHeader();
    let fullname = personal.fullname;
    let conditionFullname = personal.fullname !== null && personal.fullname !== '' && personal.fullname !== undefined;
    let phone = personal.phone;
    let conditionPhone = personal.phone !== null && personal.phone !== '' && personal.phone !== undefined;
    let dob = convertDateString(personal.dob);
    let conditionDob = convertDateString(personal.dob) !== null && convertDateString(personal.dob) !== '' && convertDateString(personal.dob) !== undefined;
    let gender = personal.gender;
    var genM = (gender === 'M') ? "selected" : '';
    var genF = (gender === 'F') ? "selected" : '';
    let conditionGender = personal.gender !== null && personal.gender !== '' && personal.gender !== undefined;
    let nid = personal.nid;
    let conditionNid = personal.nid !== null && personal.nid !== '';
    let doi = convertDateString(personal.doi);
    let conditionDoi = convertDateString(personal.doi) !== null && convertDateString(personal.doi) !== '' && convertDateString(personal.doi) !== undefined;
    let doe = convertDateString(personal.doe);
    let conditionDoe = convertDateString(personal.doe) !== null && convertDateString(personal.doe) !== '' && convertDateString(personal.doe) !== undefined;
    let city = personal.city;
    let conditionCity = personal.city !== null && personal.city !== '' && personal.city !== undefined;
    let district = personal.district;
    let conditionDistrict = personal.district !== null && personal.district !== '' && personal.district !== undefined;
    let ward = personal.ward;
    let conditionWard = personal.ward !== null && personal.ward !== '' && personal.ward !== undefined;
    let street = personal.street;
    let conditionStreet = personal.street !== null && personal.street !== '' && personal.street !== undefined;
    var html = `<div class='form-card form-showdata'>
                    <h4 class='form-showdata-title'>Nhập thông tin cá nhân</h4>
                    <p class='form-showdata-desc'>Vui lòng điền các trường thông tin bên dưới</p>
                    <form class='' id='formDataValue'>
                        <div class="card">
                            <div class="card-head">
                                <h3 class='form-showdata-info sub4'>Thông tin cá nhân</h3>
                            </div>
                            <div class="card-body">
                                <div class='form-row'>
                                    <label for='fullname'>Họ và tên</label>
                                    <input class='input-global' type='text' id='fullname' name='fullname' onchange='onChangeValidation("#fullname")' value="${conditionFullname ? fullname : ''}" ${conditionFullname ? 'disabled' : ''} />
                                    <span class='error_fullname error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='phone'>Số điện thoại</label>
                                    <input class='input-global' type='phone' id="phone" name="phone"  onchange='onChangeValidation("#phone")' value="${conditionPhone ? phone : ''}"  ${conditionPhone ? 'disabled' : ''} />
                                    <span class='error_phone error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='dob'>Ngày sinh</label>
                                    <input class='input-global' type='date' id='dob' name='dob' onchange='onChangeValidation("#dob")' value="${conditionDob ? dob : ''}" ${conditionDob ? 'disabled' : ''} style='max-width:191px'/>
                                    <span class='error_dob error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='gender'>Giới tính</label>
                                    <select id='gender' name='gender' class='input-global' onchange='onChangeValidation("#gender")' ${conditionGender ? 'disabled' : ''} style='max-width:139px'>
                                    <option value="" >Vui lòng chọn</option>
                                    <option value="M" ${genM}>Nam</option>
                                    <option value="F" ${genF}>Nữ</option>
                                    </select>
                                    <span class='error_gender error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='nid'>Số CMND/CCCD</label>
                                    <input class='input-global' type='number' id='nid' name='nid' onchange='onChangeValidation("#nid")' value="${conditionNid ? nid : ''}" ${conditionNid ? 'disabled' : ''}/>
                                    <span class='error_nid error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <div class='mobile-cell'>
                                        <div class="form-cell">
                                            <label for='doi'>Ngày cấp</label>
                                            <input class='input-global' type='date' id='doi' name='doi' onchange='onChangeValidation("#doi")' value="${conditionDoi ? doi : ''}" ${conditionDoi ? 'disabled' : ''}/>
                                            <span class='error_doi error_message'></span>
                                        </div>
                                    </div>
                                    <div class='mobile-cell'>
                                        <div class="form-cell">
                                            <label for='doe'>Ngày hết hạn</label>
                                            <input class='input-global' type='date' id='doe' name='doe' onchange='onChangeValidation("#doe")' value="${conditionDoe ? doe : ''}" ${conditionDoe ? 'disabled' : ''} />
                                            <span class='error_doe error_message'></span>
                                        </div>
                                    </div>
                                </div>
                            </div >
                            <div class="card-footer"></div>
                        </div >
                        <div class="card">
                            <div class="card-head">
                                <h3 class='form-showdata-info'>Địa chỉ hiện tại</h3>
                            </div>
                            <div class="card-body">
                                <div class='form-row sCity'>
                                    <label for='city'>Thành phố/Tỉnh</label>
                                    <input class='input-global' type='text' id='city' name='city' onchange='onChangeValidation("#city")' value="${conditionCity ? city : ''}" ${conditionCity ? 'disabled1' : ''}/>
                                    <span class='error_city error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='district'>Quận/Huyện</label>
                                    <input class='input-global' type='text' id='district' name='district' onchange='onChangeValidation("#district")' value="${conditionDistrict ? district : ''}" ${conditionDistrict ? 'disabled1' : ''}/>
                                    <span class='error_district error_message'></span>
                                </div >
                                <div class='form-row'>
                                    <label for='ward'>Phường</label>
                                    <input class='input-global' type='text' id='ward' name='ward' onchange='onChangeValidation("#ward")' value="${conditionWard ? ward : ''}" ${conditionWard ? 'disabled1' : ''} />
                                    <span class='error_ward error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='street'>Đường</label>
                                    <input class='input-global' type='text' id='street' name='street' onchange='onChangeValidation("#street")' value="${conditionStreet ? street : ''}" ${conditionStreet ? 'disabled1' : ''} />
                                    <span class='error_street error_message'></span>
                                </div>
                            </div >
                            <div class="card-footer"></div>
                        </div >
                        <div class="card">
                        <div class="card-head">
                            <h3 class='form-showdata-info'>Địa chỉ tạm trú</h3>
                        </div>
                        <div class="card-body">
                            <div class='form-row'>
                                <label for='city_permanent'>Thành phố/Tỉnh</label>
                                <input class='input-global' type='text' id='city_permanent' name='city_permanent' onchange='onChangeValidation("#city_permanent")'/>
                                <span class='error_city_permanent error_message'></span>
                            </div>
                            <div class='form-row'>
                                <label for='district_permanent'>Quận/Huyện</label>
                                <input class='input-global' type='text' id='district_permanent' name='district_permanent' onchange='onChangeValidation("#district_permanent")'/>
                                <span class='error_district_permanent error_message'></span>
                            </div>
                            <div class='form-row'>
                                <label for='ward_permanent'>Phường</label>
                                <input class='input-global' type='text' id='ward_permanent' name='ward_permanent' onchange='onChangeValidation("#ward_permanent")'/>
                                <span class='error_ward_permanent error_message'></span>
                            </div>
                            <div class='form-row'>
                                <label for='street_permanent'>Đường</label>
                                <input class='input-global' type='text' id='street_permanent' name='street_permanent' onchange='onChangeValidation("#street_permanent")'/>
                                <span class='error_street_permanent error_message'></span>
                            </div>
                        </div>
                        <div class="card-footer"></div>
                    </div>
                        <div class="card">
                            <div class="card-head">
                                <h3 class='form-showdata-info'>Thông tin tham chiếu</h3>
                            </div>
                            <div class="card-body">
                                <div class='form-row'>
                                    <label for='relationship'>Mối quan hệ </label>
                                    <select class='input-global' type='text' id='relationship' name='relationship'>
                                        ${referencesRelation.data.map((reference, index) => (`<option key='${index}' value='${reference['Value']}'>${reference['Text']}</option>`))}
                                    </select>
                                    <span class='error_relationship error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='fullname_ref'>Họ và tên</label>
                                    <input class='input-global' type='text' id="fullname_ref" name="fullname_ref" onchange='onChangeValidation("#fullname_ref")'/>
                                    <span class='error_fullname_ref error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='phone_ref'>Số điện thoại</label>
                                    <input class='input-global ' type='phone' id='phone_ref' name='phone_ref' onchange='onChangeValidation("#phone_ref")'/>
                                    <span class='error_phone_ref error_message'></span>
                                </div>
                            </div>
                            <div class="card-footer"></div>
                        </div>
                        <button type='submit' class='payment-button medium' id='btnContinue'>Tiếp tục</button>
                    </form >
                </div > `;
    $(element).html(html).removeClass('captureNid');

    //show progress bar
    showProcessPipeline(1,true,"showDataInform");
    pageTitle(element,"<h4 class='pageTitle'>Chụp ảnh chân dung</h4>",'non-pageTitle');

    const formDataValue = document.querySelector('#formDataValue');

    formDataValue.addEventListener('submit', function (e) {
        e.preventDefault();
        let fullnameEle = document.getElementById('fullname');
        let fullname = fullnameEle.value.trim();

        let genderEle = document.getElementById('gender');
        let gender = genderEle.value.trim();

        let phoneEle = document.getElementById('phone');
        let phone = phoneEle.value.trim();

        let dobEle = document.getElementById('dob');
        let dob = dobEle.value.trim();

        let nidEle = document.getElementById('nid');
        let nid = nidEle.value.trim();

        let doiELe = document.getElementById('doi');
        let doi = doiELe.value.trim();

        let doeEle = document.getElementById('doe');
        let doe = doeEle.value.trim();

        let cityEle = document.getElementById('city');
        let city = cityEle.value.trim();

        let districtEle = document.getElementById('district');
        let district = districtEle.value.trim();

        let wardEle = document.getElementById('ward');
        let ward = wardEle.value.trim();

        let streetEle = document.getElementById('street');
        let street = streetEle.value.trim();

        let relationshipEle = document.getElementById('relationship');
        let relationship = relationshipEle.value.trim();

        let fieldRelationship = document.getElementById('relationship');
        var relationshipUI = fieldRelationship.options[fieldRelationship.selectedIndex].text;


        let fullname_refEle = document.getElementById('fullname_ref');
        let fullname_ref = fullname_refEle.value.trim();

        let phone_refEle = document.getElementById('phone_ref');
        let phone_ref = phone_refEle.value.trim();

        let city_permanentEle = document.getElementById('city_permanent');
        let city_permanent = city_permanentEle.value.trim();

        let district_permanentEle = document.getElementById('district_permanent');
        let district_permanent = district_permanentEle.value.trim();

        let ward_permanentEle = document.getElementById('ward_permanent');
        let ward_permanent = ward_permanentEle.value.trim();

        let street_permanentEle = document.getElementById('street_permanent');
        let street_permanent = street_permanentEle.value.trim();

        let isCheckEmpty = checkEmptyError([fullnameEle, genderEle, phoneEle, dobEle, nidEle, doiELe, doeEle, cityEle, districtEle, wardEle, streetEle, relationshipEle, fullname_refEle, phone_refEle, city_permanentEle, district_permanentEle, ward_permanentEle, street_permanentEle])
        console.log('isCheckEmpty: ', isCheckEmpty);
        let isPhoneError = checkPhoneValidate(phoneEle);
        console.log('isPhoneError: ', isPhoneError);
        let isPhoneRefError = checkPhoneRefValidate(phone_refEle);
        console.log('isPhoneRefError: ', isPhoneRefError);
        let isNidError = checkNidValidate(nidEle);
        console.log('isNidError: ', isNidError);

        let personal_all_info = {
            name: fullname,
            sex: gender,
            birthday: dob,
            phone: phone,
            citizenId: nid,
            issueDate: doi,
            city: city,
            district: district,
            ward: ward,
            street: street,
            "personal_title_ref": relationship,
            "personal_title_ref_ui": relationshipUI,
            "name_ref": fullname_ref,
            "phone_ref": phone_ref,
            "temporaryCity": city_permanent,
            "temporaryDistrict": district_permanent,
            "temporaryWard": ward_permanent,
            "temporaryStreet": street_permanent,
            "expirationDate": doe
        }

        if (!isCheckEmpty) {
            if (!isPhoneError && !isPhoneRefError && !isNidError) {
                if (personal_all_info !== null) {
                    localStorage.setItem('personal_all_info', JSON.stringify(personal_all_info));
                    $(element).removeClass("showDataInform");
                    showConfirmDataInform(element, personal_all_info);
                }
            }
        }
    })

}

// Done +++
function checkPhoneValidate(input) {
    const regexPhone = /^(09|03|07|08|05)+([0-9]{8}$)/;
    input.value = input.value.trim();
    let isPhoneErr = !regexPhone.test(input.value);
    if (regexPhone.test(input.value)) {
        showSuccessMessage(input);
    }
    else {
        showErrorMessage(input, 'Số điện thoại không hợp lệ');
    }
    return isPhoneErr;
}

// Done +++
function checkPhoneRefValidate(input) {
    const regexPhoneRef = /^(09|03|07|08|05|02)+([0-9]{8,9}$)/;
    input.value = input.value.trim();
    let isPhoneRefErr = !regexPhoneRef.test(input.value)
    if (regexPhoneRef.test(input.value)) {
        showSuccessMessage(input);
    }
    else {
        showErrorMessage(input, 'Số điện thoại người tham chiếu không hợp lệ');
    }
    return isPhoneRefErr;
}

// Done +++
function checkNidValidate(input) {
    const regexNid = /^\d{12}$|^\d{9}$/;
    input.value = input.value.trim();
    let isNidErr = !regexNid.test(input.value);
    if (regexNid.test(input.value)) {
        showSuccessMessage(input);
    }
    else {
        showErrorMessage(input, 'Chứng minh nhân dân không hợp lệ');
    }
    return isNidErr;
}

// Done +++
function checkPinValidate(input) {
    const regexPin = /^\d{4}$/;
    input.value = input.value.trim();
    let isPinErr = !regexPin.test(input.value);
    if (regexPin.test(input.value)) {
        showSuccessMessage(input);
    }
    else {
        showErrorMessage(input, 'Mã Pin không hợp lệ');
    }
    return isPinErr;
}

// Done +++
function handleChangeCity(ele1, ele2) {
    let districts = getAllDistrict();
    let results = [];
    let value = $(ele1).find(":selected").val();
    $(ele2).empty();
    districts.data.map((district, index) => {
        if (district['Parent_Value'] === value) {
            results.push(district);
        }
    });
    results.map((item, index) => {
        $(ele2).append(new Option(item['UI_Show'], item['Value']));
    });
}

// Done +++
function handleChangeWard(ele1, ele2) {
    let wards = getAllWard();
    let results = [];
    let value = $(ele1).find(":selected").val();
    $(ele2).empty();
    wards.data.map((ward, index) => {
        if (ward['Parent_Value'] === value) {
            results.push(ward);
        }
    });
    results.map((item, index) => {
        $(ele2).append(new Option(item['UI_Show'], item['Value']));
    });
}

// Done +++
function showConfirmDataInform(element, personal_all_info) {
    showHeader();
    var html = `<div class='form-card form-confirmdata'>
                    <h4 class='form-confirmdata-title'>Đối soát thông tin</h4>
                    <p class='form-confirmdata-desc'>Vui lòng xác nhận các thông tin bên dưới</p>
                    <form class=''>
                        <div class="card">
                            <div class="card-head">
                                <div class='form-showdata-info sub4'>Thông tin cá nhân</div>
                            </div>
                            <div class="card-body">
                                <div class='form-row form-verify'>
                                    <label for='name'>Họ và tên</label>
                                    <div id='name' class="info">${personal_all_info.name}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='phone'>Số điện thoại</label>
                                    <div id='phone' class="info">${personal_all_info.phone}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='birthday'>Ngày sinh</label>
                                    <div id='birthday' class="info">${personal_all_info.birthday}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='gender'>Giới tính</label>
                                    <div id='gender' class="info">${personal_all_info.sex === 'M' ? 'Nam' : 'Nữ'}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='citizenId'>Số CMND/CCCD</label>
                                    <div id='citizenId' class="info">${personal_all_info.citizenId}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='issueDate'>Ngày cấp</label>
                                    <div id='issueDate' class="info">${personal_all_info.issueDate}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='doe'>Ngày hết hạn</label>
                                    <div id='doe' class="info">${personal_all_info.expirationDate}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='address'>Địa chỉ hiện tại</label>
                                    <div id='address' class="info">${personal_all_info.street}, ${personal_all_info.ward}, ${personal_all_info.district}, ${personal_all_info.city}</div>
                                </div>
                            </div >
                            <div class="card-footer"></div>
                        </div >
                        <div class="card">
                            <div class="card-head">
                                <div class="form-showdata-info sub4">Địa chỉ tạm trú</div>
                            </div>
                            <div class="card-body">
                                <div class='form-row form-verify'>
                                    <label for='city_permanent'>Thành phố/Tỉnh</label>
                                    <div id='city_permanent' class="info">${personal_all_info.temporaryCity}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='district_permanent'>Quận/Huyện</label>
                                    <div id='district_permanent' class="info">${personal_all_info.temporaryDistrict}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='ward_permanent'>Phường</label>
                                    <div id='ward_permanent' class="info">${personal_all_info.temporaryWard}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='street_permanent'>Đường</label>
                                    <div id='street_permanent' class="info">${personal_all_info.temporaryStreet}</div>
                                </div>
                            </div>
                            <div class="card-footer"></div>
                        </div>
                        <div class="card">
                            <div class="card-head">
                                <div class="form-showdata-info sub4">Thông tin tham chiếu</div>
                            </div>
                            <div class="card-body">
                                <div class='form-row form-verify'>
                                    <label for='relationship'>Mối quan hệ </label>
                                    <div id='relationship' class="info">${personal_all_info.personal_title_ref_ui}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='name_ref'>Họ và tên</label>
                                    <div id='name_ref' class="info">${personal_all_info.name_ref}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='phone_ref'>Số điện thoại</label>
                                    <div id='phone_ref' class="info">${personal_all_info.phone_ref}</div>
                                </div>
                            </div>
                            <div class="card-footer"></div>
                        </div>
                    </form>
                    <div class="form-row" style="width: 100%;padding: 0;display: flex;margin-bottom: 36px;margin-top: 12px;">
                        <a href='#' class="btn-previous" onclick='showDataInform("${element}")'><c style="font-size:1.3em">&#8249;</c> Quay lại</a>
                        <button type='submit' class='payment-button medium' id='btnContinueConfirm' style="margin-right:0;width:149px">Xác nhận</button>
                        </div>
                </div>`;
    $(element).html(html);
    showProcessPipeline(1,true,"showConfirmDataInform");
    pageTitle(element,"<h4 class='pageTitle'>Nhập thông tin cá nhân</h4>");
    $(window).scrollTop(0);

    let name = document.getElementById('name');
    let phone = document.getElementById('phone');
    let birthday = document.getElementById('birthday');
    let gender = document.getElementById('gender');
    let citizenId = document.getElementById('citizenId');
    let issueDate = document.getElementById('issueDate');
    let doe = document.getElementById('doe');
    let address = document.getElementById('address');
    let relationship = document.getElementById('relationship');
    let name_ref = document.getElementById('name_ref');
    let phone_ref = document.getElementById('phone_ref');
    let city_permanent = document.getElementById('city_permanent');
    let district_permanent = document.getElementById('district_permanent');
    let ward_permanent = document.getElementById(' ward_permanent');
    let street_permanent = document.getElementById('street_permanent');

    const formConfirmdata = document.querySelector('#form-confirmdata');

    let btnContinueConfirm = document.querySelector('#btnContinueConfirm');

    $('#btnContinueConfirm').click(function () {
        showFormSetupPin(element, 'SHOW_LOGIN');
    });
}

// Done +++
function configUi(config) {
    var iHtml = "";
    if (config.logo) iHtml += "<div class='voolo-logo'></div>";
    if (config.intro) iHtml += `
    <div _ngcontent-gse-c77="" class="paragraph-text text-center margin-bottom-default"> 
        <p>Mua trước Trả sau Không khoản trả trước</p><p>Nhẹ nhàng với 0% lãi suất </p>
    </div>
    <div class='voolo-intro'>
        <div class='sub4 sub3-mobile'>VOOLO giúp bạn:</div>
        <ul>
            <li>Mua sắm không giới hạn </li>
            <li>Thanh toán linh hoạt </li>
            <li>Hoàn tiền ngay chỉ trong 1 ngày </li>
        </ul>
    </div>`;
    $(config.element + " form").prepend(iHtml);
}

// Done +++
let totalBillNumber = 0;
function listProductions(config) {
    //show list items
    var list = "";
    if (config.dataItems != null) {
        var lItems = "";
        var total = 0;
        config.dataItems.forEach(e => {
            list += `<div class='list'>
            <div class='image'><img src='`+ e.imgUrl + `'/></div>
            <div class='info'>
                <p class='compact ellipsis'>`+ e.product + `</p>
                <p class='text-space-gray'>`+ e.descript + `</p>
                <p class='text-space-black'>`+ e.quantity + `</p>
            </div>
            <div class='price compact'>`+ e.priceShow + `</div>
        </div>`;
            total += parseInt(e.price);
        });
        var sTotal = total.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });

        //set total local
        billTotal = sTotal;
        totalBillNumber = total;
    }
    lItems += `<div class='list-items'>
        <div class='card'>
            <div class='card-head'><span class='sub4 sub4-mobile'>Thông tin đơn hàng</span></div>
            <div class='card-body'>
                ${list}
                <div class='area-cost'>
                    <div class='item tag' style=''>
                        Thêm mã giảm giá hoặc thẻ quà tặng
                    </div>
                </div>
                <div class='area-cost quote'>
                    <div class='item' style='margin-bottom: 14px;'>
                        <span class='pTitle'>Thành tiền</span>
                        <span class='pPrice compact-16'>${sTotal}</span>
                    </div>
                    <div class='item'>
                        <span class='pTitle'>Phí vận chuyển</span>
                        <span class='pPrice compact-16'>0 đ</span>
                    </div>
                </div>
            </div>
            <div class='card-footer'>
                <span>Tổng cộng</span>
            <span class='total-price'>`+ sTotal + ` </span></div>
        </div>
    </div>`;
    if (config.items) $(config.element).prepend(lItems);
}

// Done +++
function showCapture(base64, eId) {
    if (base64 !== null && base64 !== '' && base64 !== undefined) {
        $('#' + eId).addClass("showImage");
        $('#' + eId).css({
            'background': 'url(' + base64 + ') no-repeat center',
            'background-size': 'cover'
        });
        if (eId !== null && eId !== '' && eId !== undefined) {
            if (eId === 'btnCaptureFront') {
                btnFrontActive = true;
            }
            if (eId === 'btnCaptureBack') {
                btnBackActive = true;
            }
            if (btnFrontActive && btnBackActive) {
                $("#btnSubmit").attr("disabled", false);
            }
            else {
                $("#btnSubmit").attr("disabled", true);
            }

            if (eId === 'callHP') {
                btnSelActive = true;
                if (btnSelActive) {
                    $("#btnSubmitNid").attr("disabled", false);
                }
                else {
                    $("#btnSubmitNid").attr("disabled", true);
                }
            }
        }
        else {
            alert('Không tìm thấy máy ảnh ! Vui lòng kiểm tra lại !');
        }
    }
    else {
        alert('Không tìm thấy ảnh ! Vui lòng kiểm tra lại !');
    }
}

// Done +++
// this function convert string date dd-mm-yyyy to yyyy-mm-dd
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
function forgotPinPhone(element, phone) {
    var html = `<form id='formValuePhone' class='formValue forgotPinPhone'>
                    <div class='mobile'>

                        <div class='form__row m-top-16'>
                            <h4 style="margin-bottom:40px">Số điện thoại</h4>
                            <label for='phone_reset'>Vui lòng nhập số điện thoại để tiếp tục</label>
                            <input type='phone' id='phone_reset' class='form__input input-global' value="${phone}" />
                            <span class='error_message'></span>
                        </div>
                        <button type='button' id='btnContinue' class='payment-button'>Tiếp tục</button>

                    </div>
                </form>`;
    $(element).html(html);

    var dataPhone = document.querySelector('#phone_reset');
    var errorMessage = document.querySelector('.error_message');
    var btnContinue = document.querySelector('#btnContinue');

    //custom show
    configUi({
        element: element,
        logo: true,
        intro: false
    });

    $("#phone_reset").on('input', function () {
        const regexPhone = /^(09|03|07|08|05)+([0-9]{8}$)/;
        let isPhoneErr = !regexPhone.test(dataPhone.value);
        if (dataPhone.value !== null && dataPhone.value !== '') {
            if (!isPhoneErr) {
                formatStyleCorrectInput(dataPhone, errorMessage);
                btnContinue.disabled = false;
            }
            else {
                formatStyleWrongInput(dataPhone, errorMessage, 'Số điện thoại không hợp lệ');
                btnContinue.disabled = true;
            }
        }
        else {
            formatStyleWrongInput(dataPhone, errorMessage, 'Vui lòng nhập số điện thoại');
            btnContinue.disabled = true;
        }
    });

    $('#btnContinue').click(function () {
        let phone_reset = $('#phone_reset').val().trim();
        localStorage.setItem('phone_reset', phone_reset);
        forgotPinNid(element);
    });
}

// Done +++
function forgotPinNid(element) {
    var html = `<form class='formValue forgotPinPhone' >
                    <div class='mobile'>

                        <div class='form__row m-top-16'>
                            <h4 style="margin-bottom:40px">Số CMND/CCCD</h4>
                            <label for='nid_reset'>Vui lòng nhập số CMND/CCCD</label>
                            <input type='number' id='nid_reset' class='form__input input-global' />
                            <span class='error_message'></span>
                        </div>
                        <button type='button' id='btnSendOtp' class='payment-button'>Tiếp tục</button>

                    </div>
                </form>`;
    $(element).html(html);

    //custom show
    configUi({
        element: element,
        logo: true,
        intro: false
    });

    var dataNid = document.querySelector('#nid_reset');
    var errorMessage = document.querySelector('.error_message');
    var btnSendOtp = document.querySelector('#btnSendOtp');
    btnSendOtp.disabled = true;

    $("#nid_reset").on('input', function () {
        if (dataNid.value !== null && dataNid.value !== '') {
            const regexNid = /^\d{12}$|^\d{9}$/;
            let isNidErr = !regexNid.test(dataNid.value);
            if (!isNidErr) {
                formatStyleCorrectInput(dataNid, errorMessage);
                btnSendOtp.disabled = false;
            }
            else {
                formatStyleWrongInput(dataNid, errorMessage, 'Số CMND/CCCD không hợp lệ');
                btnSendOtp.disabled = true;
            }
        }
        else {
            formatStyleWrongInput(dataNid, errorMessage, 'Vui lòng nhập CMND/CCCD');
            btnSendOtp.disabled = true;
        }
    });

    $('#btnSendOtp').click(function () {
        localStorage.setItem('nid_reset', $('#nid_reset').val().trim());
        let phone_reset = localStorage.getItem('phone_reset');
        let nid_reset = localStorage.getItem('nid_reset');
        console.log('phone_reset: ', phone_reset);
        console.log('nid_reset: ', nid_reset);
        let data = sendOtpPin(phone_reset, nid_reset);
        console.log('Result Send Otp Pin: ', data);
        if (data.status === true) {
            showFormVerifyOTP(element, phone_reset, data.otp, 'RESET_PIN');
            $('body').addClass('popup');
        }
        else if (data.status === false && data.message === 'Send otp failure') {
            formatStyleWrongInput(dataNid, errorMessage, 'Mã Otp không chính xác');
            return;
        }
        else if (data.status === false && data.statusCode === 1002) {
            formatStyleWrongInput(dataNid, errorMessage, 'Số điện thoại không chính xác');
            return;
        }
        else if (data.status === false && data.statusCode === 1001) {
            formatStyleWrongInput(dataNid, errorMessage, 'Chứng minh nhân dân không chính xác');
            return;
        }
        else if (data.status === false && data.errorCode === 8000) {
            formatStyleWrongInput(dataNid, errorMessage, 'Định dang data không hợp lệ');
            return;
        }
    })
}

// Done +++
function addBorderRed(data) {
    $(".pincode-input").val("");
    if (data === 'otp') {
        for (i = 1; i <= 6; i++) {
            $("#otp" + i).addClass('error_otpcode_red');
        }
    }
    else if (data === 'pin') {
        for (i = 1; i <= 4; i++) {
            $("#pin" + i).addClass('error_pincode_red');
        }
    }
    $('.pincode-input').removeClass('pincode-input--filled');
}

// Done +++
function addBorderGray(data) {
    $(".pincode-input").val("");
    if (data === 'otp') {
        for (i = 1; i <= 6; i++) {
            $("#otp" + i).addClass('error_otpcode_gray');
        }
    }
    else if (data === 'pin') {
        for (i = 1; i <= 4; i++) {
            $("#pin" + i).addClass('error_pincode_gray');
        }
    }
    $('.pincode-input').removeClass('pincode-input--filled');
}

// Done +++
function showFormPincode(element, phone, screen) {
    var html = `
        <div class='box form-card-pincode'>
            <div class='voolo-logo'></div>
            <form id='formSetupPinCode' class="box-mobile m-top-16">
                    <div class=''>
                        <div class='text-center form-pincode'>
                            <h4>Nhập mã PIN</h4>
                            <p class=''>${screen === 'SHOW_TENOR' ? 'Vui lòng nhập mã PIN để thanh toán' : 'Vui lòng nhập mã PIN để xác thực thông tin'}</p>
                            <div class='sub4'>Mã PIN</div>
                            <div id='pincode'></div>
                            <span class='error_message error_message_pin'></span>
                        </div>
                    </div>
                    <button type='button' id='btnSubmitPin' class='payment-button medium'>Tiếp tục</button>
                    <p style='text-align: center;' class='txt-note'>Quên mã PIN? <a class="ahref" onclick='forgotPinPhone("${element}","${phone}")' style='width:auto'>Nhấn vào đây</a></p>
            </form>
        </div>`;

    $(element).html(html);

    var btnSubmitPin = document.querySelector('#btnSubmitPin');
    btnSubmitPin.disabled = true;

    new PincodeInput("#pincode", {
        count: 4,
        secure: true,
        pattern: '[0-9]*',
        previewDuration: -1,
        inputId: 'pin',
        onInput: (value) => {
            if (value.length === 4) {
                btnSubmitPin.disabled = false;
            }
            else {
                $('.pincode-input').removeClass('error_pincode_gray');
                btnSubmitPin.disabled = true;
            }
        }
    });

    var pincode = document.querySelector('#pincode');
    var errorMessage = document.querySelector('.error_message');

    $('#btnSubmitPin').click(function () {
        var pin = $('#pin1').val().trim() + $('#pin2').val().trim() + $('#pin3').val().trim() + $('#pin4').val().trim();
        let result = login(phone, pin);
        console.log('Result Show Form Pin code: ', result);

        if (result.status === true && result.data.step === 4) {
            switch (screen) {
                default:
                    showMessage(element, '<h3>something wrong...</h3>', 'ico-unsuccess');
                case "SHOW_TENOR":
                    showAllTenor(element, 3);
                    break;
                case "SHOW_SUCCESS_PAGE":
                    messageScreen(element, { screen: "pincode_success", pipeline: false });
                    break;
                case "BUY_SUCCESS":
                    messageScreen(element, { screen: "buy_success", pipeline: false });
                    break;
                case "BUY_UNSUCCESS":
                    messageScreen(element, { screen: "buy_unsuccess", pipeline: false });
                    break;
            }
        }
        // else if (result.status === true && result.data.step === 3) {
        //     showCircularProgressbar(element);
        //     return;
        // }
        else if (result.status === false && result.statusCode === 1002) {
            formatStyleWrongInput(pincode, errorMessage, 'Số điện thoại không hợp lệ');
            return;
        }
        else if (result.status === false && result.statusCode === 1003) {
            if (result?.countFail !== 5) {
                formatStyleWrongInput(pincode, errorMessage, 'Mã pin không chính xác (' + result?.countFail + '/5)');
                addBorderGray('pin');
                btnSubmitPin.disabled = true;
            }
            else {
                formatStyleWrongInput(pincode, errorMessage, 'Mã pin không chính xác (5/5).\nTài khoản của bạn đã bị khóa, thử lại sau 60 phút.');
                addBorderRed('pin');
                for (i = 1; i <= 4; i++) {
                    $("#pin" + i).attr('disabled', true);
                }
                btnSubmitPin.disabled = true;
            }
        }
        else if (result.status === false && result.statusCode === 1004) {
            formatStyleWrongInput(pincode, errorMessage, 'Mã pin không chính xác (5/5).\nTài khoản của bạn đã bị khóa, thử lại sau 60 phút.');
            addBorderRed('pin');
            for (i = 1; i <= 4; i++) {
                $("#pin" + i).attr('disabled', true);
            }
            btnSubmitPin.disabled = true;
        }
    });
}

// Done +++
function showFormSetupPin(element, screen, token) {
    // showHeader();
    var html = `
    <div class='form-card showFormSetupPin ${screen}'>
    <form id='formSetupPinCode'>
    ${screen === 'SHOW_RESET_PIN' ? "<div class='voolo-logo'></div>":''}
        <div class=''>
            <div class=' no-line'></div>
                <div class='text-center form-pincode m-top-16'>
                    <h4 class='form-showdata-title'>${screen === 'SHOW_RESET_PIN' ? 'Cài đặt mã PIN của bạn' : 'Cài đặt mã PIN của bạn'}</h4>
                    <p class='sub4'>Mã PIN</p>
                    <div id='pincode'></div>
                    <p class='sub4'>Nhập lại mã PIN</p>
                    <div id='repincode'></div>
                </div>
        </div>
        <button type='button' id='btnSubmitPin' class='payment-button medium'>Tiếp tục</button>
    </form>
    </div>`;
    $(element).css("display","grid");
    $(element).html(html);
    if (screen !== '' && screen === 'SHOW_LOGIN') {
        //show progress bar
        showProcessPipeline(2,true);
    }
    pageTitle(element,'<h4 class="pageTitle">Cài đặt mã PIN của bạn</h4>','non-pageTitle');

    let iPut1, iPut2 = false;
    $('#btnSubmitPin').attr("disabled", true);

    new PincodeInput("#pincode", {
        count: 4,
        secure: true,
        pattern: '[0-9]*',
        previewDuration: -1,
        inputId: 'pin',
        onInput: (value) => {
            console.log(value);
            if (value.length == 4) {
                iPut1 = true;
                if (iPut1 && iPut2) {
                    $('#btnSubmitPin').attr("disabled", false);
                }
            }
        }
    });

    new PincodeInput("#repincode", {
        count: 4,
        secure: true,
        previewDuration: -1,
        inputId: 'pincf',
        onInput: (value) => {
            console.log(value);
            if (value.length == 4) {
                iPut2 = true;
                if (iPut1 && iPut2) {
                    $('#btnSubmitPin').attr("disabled", false);
                }
            }
        }
    });

    $('#btnSubmitPin').click(function () {
        // $("body").addClass("loading");
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
            if (screen === 'SHOW_LOGIN') {
                const data = JSON.parse(localStorage.getItem('personal_all_info'));
                const front_nid_image = localStorage.getItem('front-image');
                const back_nid_image = localStorage.getItem('back-image');
                const selfie_image = localStorage.getItem('selfie-image');
                let all_data_info = {
                    ...data,
                    pin: pin,
                    nid_front_image: front_nid_image,
                    nid_back_image: back_nid_image,
                    selfie_image: selfie_image
                }
                let result = addInfoPersonal(all_data_info.name, all_data_info.sex === 'M' ? 'Nam' : 'Nữ', all_data_info.birthday,
                    all_data_info.phone, all_data_info.citizenId, all_data_info.issueDate,
                    all_data_info.expirationDate, all_data_info.city, all_data_info.district,
                    all_data_info.ward, all_data_info.street, all_data_info.temporaryCity,
                    all_data_info.temporaryDistrict, all_data_info.temporaryWard, all_data_info.temporaryStreet,
                    all_data_info.personal_title_ref, all_data_info.name_ref, all_data_info.phone_ref,
                    all_data_info.pin, all_data_info.nid_front_image, all_data_info.nid_back_image, all_data_info.selfie_image);
                console.log('Result Set Up Pin: ', result);
                if (result.status === true) {
                    alert('Add Infomation Personal Success');
                    $("body").removeClass("loading");
                    showContract(element);
                }
                else {
                    alert('Add Infomation Personal Failure');
                    $("body").removeClass("loading");
                    return;
                }
            }
            else if (screen === 'SHOW_RESET_PIN') {
                let phone = localStorage.getItem('phone');
                let data = resetPin(phone, pin, token);
                console.log('Result Reset Pin: ', data);
                if (data.status === true) {
                    messageScreen(element, { screen: "pincode_success", pipeline: false });
                } else {
                    messageScreen(element, { screen: "pincode_unsuccess", pipeline: false });
                }
            }
            $("body").removeClass("loading");
        }
        else {
            alert('Mã pin không trùng khớp vui lòng thử lại !');
            $("body").removeClass("loading");
            return;
        }
    })
}

// Done +++
function showFormVerifyOTP(element, phone, otp, screen) {
    console.log('Mã OTP của bạn là: ' + otp);
    var html = `<div class="overlay-popup card-otpcode">
                    <div class="alert-box">
                    <span class='close'></span>
                        <form id='formSetupPinCode'>
                            <div class='card'>
                                <div class='card-head no-line'></div>
                                <div class='card-body text-center form-otpcode'>
                                    <h4>Nhập OTP</h4>
                                    <p class='compact-12'>Mã OTP đã được gửi đến số điện thoại <b>${phone.replaceAt(3, "****")}</b></p>
                                    <div id='otpcode'></div>
                                    <span class='error_message error_message_otp'></span>
                                </div>
                                <div class='card-footer' style="height:4px"></div>
                            </div>
                            <button type='button' id='btnSubmitVerifyOTP' class='payment-button'>Tiếp tục</button>
                            <p style='text-align: center;' class='compact-12'>Không nhận được OTP?  <a class="ahref" onclick='forgotPinPhone("${element}","${phone}")' style='width:auto'>Gửi lại OTP (<c id="timer"></c>)</a></p>
                        </form>
                    </div>
            </div>`;

    $(element).append(html);
    timer(60);

    var btnSubmitVerifyOTP = document.querySelector('#btnSubmitVerifyOTP');
    btnSubmitVerifyOTP.disabled = true;

    var otpcode = document.querySelector('#otpcode');
    var errorMessage = document.querySelector('.alert-box .error_message');

    new PincodeInput("#otpcode", {
        count: 6,
        secure: false,
        pattern: '[0-9]*',
        previewDuration: 100,
        inputId: 'otp',
        onInput: (value) => {
            if (value.length === 6) {
                btnSubmitVerifyOTP.disabled = false;
            }
            else {
                $('.pincode-input').removeClass('error_otpcode_gray');
                btnSubmitVerifyOTP.disabled = true;
            }
        }
    });

    //custom show
    // configUi({
    //     element: element,
    //     logo: true,
    //     intro: false
    // });
    $('span.close').click(function(){
        close_popup();
    });
    $('#btnSubmitVerifyOTP').click(function () {
        let otp1 = $('#otp1').val().trim();
        let otp2 = $('#otp2').val().trim();
        let otp3 = $('#otp3').val().trim();
        let otp4 = $('#otp4').val().trim();
        let otp5 = $('#otp5').val().trim();
        let otp6 = $('#otp6').val().trim();
        let otp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
        if (phone !== null && otp !== null) {
            if (screen === 'RESET_PIN' && screen !== '') {
                let phone_reset = localStorage.getItem('phone_reset');
                let nid_reset = localStorage.getItem('nid_reset');
                const data = verifyOtpPin(phone_reset, nid_reset, otp);
                console.log('Result Verify Otp Pin: ', data);
                if (data.status === true && data.token !== null) {
                    close_popup();
                    showFormSetupPin(element, 'SHOW_RESET_PIN', data.token);
                }
                else if (data.status === false && data.statusCode === 4000) {
                    if (data?.countFail !== 5) {
                        formatStyleWrongInput(otpcode, errorMessage, 'Mã OTP không chính xác (' + data?.countFail + '/5)');
                        addBorderGray('otp');
                        btnSubmitVerifyOTP.disabled = true;
                        return;
                    }
                    else {
                        formatStyleWrongInput(otpcode, errorMessage, 'Mã OTP không chính xác (5/5). Vui lòng thử lại sau 24 giờ');
                        addBorderRed('otp');
                        for (i = 1; i <= 6; i++) {
                            $("#otp" + i).attr('disabled', true);
                        }
                        btnSubmitVerifyOTP.disabled = true;
                        return;
                    }
                }
                else if (data.status === false && data.statusCode === 3000) {
                    formatStyleWrongInput(otpcode, errorMessage, 'Mã OTP đã hết hiệu lực. Vui lòng gửi lại OTP');
                    addBorderGray('otp');
                    btnSubmitVerifyOTP.disabled = true;
                    return;
                }
                else if (data.status === false && data.errorCode === 1004) {
                    formatStyleWrongInput(otpcode, errorMessage, 'Mã OTP không chính xác (5/5). Vui lòng thử lại sau 24 giờ');
                    addBorderRed('otp');
                    for (i = 1; i <= 6; i++) {
                        $("#otp" + i).attr('disabled', true);
                    }
                    btnSubmitVerifyOTP.disabled = true;
                    return;
                }
            }
            else if (screen === 'VERIFY_PHONE' && screen !== '') {
                var data = verifyOtp(phone, otp);
                console.log('Result Verify Phone', data);
                if (data.status === true) {
                    close_popup();
                    showCircularProgressbar('#voolo');
                    // showStatusPage(element, 'Đang trong tiến trình xác minh thông tin', './assets/img/Loading.png', '', 3);
                }
                else if (data.statusCode === 4000 && data.status === false) {
                    if (data?.countFail) {
                        formatStyleWrongInput(otpcode, errorMessage, 'Mã OTP không chính xác (' + data?.countFail + '/5)');
                        addBorderGray('otp');
                        btnSubmitVerifyOTP.disabled = true;
                    }
                    else {
                        formatStyleWrongInput(otpcode, errorMessage, 'Mã OTP không chính xác (5/5). Vui lòng thử lại sau 24 giờ');
                        addBorderRed('otp');
                        for (i = 1; i <= 6; i++) {
                            $("#otp" + i).attr('disabled', true);
                        }
                        btnSubmitVerifyOTP.disabled = true;
                    }
                    return;
                }
                else if (data.statusCode === 3000 && data.status === false) {
                    formatStyleWrongInput(otpcode, errorMessage, 'Mã OTP đã hết hiệu lực. Vui lòng gửi lại OTP');
                    addBorderGray('otp');
                    btnSubmitVerifyOTP.disabled = true;
                    return;
                }
                else if (data.errorCode === 1004 && data.status === false) {
                    formatStyleWrongInput(otpcode, errorMessage, 'Mã OTP không chính xác (5/5). Vui lòng thử lại sau 24 giờ');
                    addBorderRed('otp');
                    for (i = 1; i <= 6; i++) {
                        $("#otp" + i).attr('disabled', true);
                    }
                    btnSubmitVerifyOTP.disabled = true;
                    return;
                }
            }
        }
    })
}

/* Pin code ui */
var PincodeInput = function () {
    "use strict";
    return function () {
        function e(e, t) {
            var s = t.count,
                i = void 0 === s ? 4 : s,
                o = t.secure,
                l = void 0 !== o && o,
                n = t.previewDuration,
                u = void 0 === n ? 200 : n,
                c = t.numeric,
                r = void 0 === c || c,
                a = t.uppercase,
                h = void 0 === a || a,
                ipid = t.inputId;
            this.args = t, this.selector = document.querySelector(e), this.count = i, this.secure = l, this.previewDuration = u, this.numeric = r, this.uppercase = h, this.cells = [], this.focusedCellIdx = 0, this.value = "", this.ipid = ipid, this.setCells()
        }
        return e.prototype.setCells = function () {
            for (var e = 0; e < this.count; e++) {
                var t = document.createElement("input");
                var stt = e + 1;
                t.setAttribute("id", this.ipid + stt);
                t.classList.add("pincode-input"), this.numeric && t.setAttribute("inputmode", "numeric"), this.uppercase || (t.style.textTransform = "lowercase"), this.cells.push(t), this.selector.appendChild(t)
            }
            this.initCells()
        }, e.prototype.initCells = function () {
            var e = this;
            this.cells.forEach((function (t, s) {
                t.addEventListener("input", (function (t) {
                    var i = t.currentTarget.value;
                    e.onCellChanged(s, i)
                })), t.addEventListener("focus", (function () {
                    e.focusedCellIdx = s
                })), t.addEventListener("keydown", (function (t) {
                    e.onKeyDown(t, s), "ArrowLeft" !== t.key && "ArrowRight" !== t.key && "ArrowUp" !== t.key && "ArrowDown" !== t.key && "Backspace" !== t.key && "Delete" !== t.key && "Control" !== t.key && "Meta" !== t.key && e.cells[s].setAttribute("type", "text")
                })), t.addEventListener("focus", (function () {
                    t.classList.add("pincode-input--focused")
                })), t.addEventListener("blur", (function () {
                    t.classList.remove("pincode-input--focused")
                }))
            }))
        }, e.prototype.onCellChanged = function (e, t) {
            var s = this;
            if (!this.isTheCellValid(t)) return this.cells[e].classList.remove("pincode-input--filled"), this.cells[e].value = "", void this.getValue();
            this.cells[e].classList.add("pincode-input--filled"), this.secure && this.previewDuration && setTimeout((function () {
                s.cells[e].setAttribute("type", "password")
            }), this.previewDuration), this.getValue(), this.focusNextCell()
        }, e.prototype.onKeyDown = function (e, t) {
            switch (e.key) {
                case "ArrowLeft":
                    this.focusPreviousCell();
                    break;
                case "ArrowRight":
                    this.focusNextCell();
                    break;
                case "Backspace":
                    this.cells[t].value.length || this.onCellErase(t, e)
            }
        }, e.prototype.onCellErase = function (e, t) {
            this.cells[e].value.length || (this.focusPreviousCell(), t.preventDefault())
        }, e.prototype.focusPreviousCell = function () {
            this.focusedCellIdx && this.focusCellByIndex(this.focusedCellIdx - 1)
        }, e.prototype.focusNextCell = function () {
            this.focusedCellIdx !== this.cells.length - 1 && this.focusCellByIndex(this.focusedCellIdx + 1)
        }, e.prototype.focusCellByIndex = function (e) {
            void 0 === e && (e = 0);
            var t = this.cells[e];
            t.focus(), t.select(), this.focusedCellIdx = e
        }, e.prototype.isTheCellValid = function (e) {
            return this.numeric ? !!e.match("^\\d{1}$") : e.length <= 1
        }, e.prototype.getValue = function () {
            var e = this;
            this.value = "", this.cells.forEach((function (t) {
                e.value += e.uppercase ? t.value.toUpperCase() : t.value
            })), this.args.onInput && this.args.onInput(this.value)
        }, e
    }()
}();

/* countdown */
let timerOn = true;
function timer(remaining) {
    var m = Math.floor(remaining / 60);
    var s = remaining % 60;

    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    // m + ':' + s
    document.getElementById('timer').innerHTML = s + 's';
    remaining -= 1;

    if (remaining >= 0 && timerOn) {
        setTimeout(function () {
            timer(remaining);
        }, 1000);
        return;
    }

    if (!timerOn) {
        return;
    }
}

// Done +++
function showContract(element) {
    setRoute("showContract");
    let data = getContract();
    var html = `<div class='box contractForm formValue-mt'>
                    <div class='contract-title'><h2>Mẫu hợp đồng</h2></div>
                    <div style='display: block'  class='contract-detail'>
                        <h3>${data.title1}</h3>
                        <h3>${data.title2}</h3>
                        <p>${data.content}</p>
                    </div>
                    <div  class='contract-term'>
                        <input type='checkbox' name='confirm_contract' id='confirm_contract' />
                        <label for='confirm_contract' class='compact-12'>Tôi đồng ý với Điều kiện và Điều khoản hợp đồng</label>
                    </div>
                    <div  class='contract-term'>
                        <input type='checkbox' name='confirm_otp' id='confirm_otp'/> 
                        <label for='confirm_otp' class='compact-12'>Vui lòng gửi OTP xác nhận về số điện thoại đã đăng ký VOOLO của tôi</label>
                    </div>
                    <button type='button' id='btnContinue' class='payment-button medium'>Tiếp tục</button>
                    </div>
            </div>`;
    $(element).html(html).removeClass('non-flex');
    showProcessPipeline(3,true);

    var btnContinue = document.querySelector('#btnContinue');
    btnContinue.disabled = true;

    $('#confirm_contract').click(function () {
        if ($('#confirm_contract').is(":checked") && $('#confirm_otp').is(":checked")) {
            btnContinue.disabled = false;
        }
        else {
            btnContinue.disabled = true;
        }
    })

    $('#confirm_otp').click(function () {
        if ($('#confirm_contract').is(":checked") && $('#confirm_otp').is(":checked")) {
            btnContinue.disabled = false;
        }
        else {
            btnContinue.disabled = true;
        }
    })

    $('#btnContinue').click(function () {
        let confirm_contract = $('#confirm_contract').is(":checked");
        let confirm_otp = $('#confirm_otp').is(":checked");
        if (confirm_contract && confirm_otp) {
            let phone = localStorage.getItem('phone');
            var otp = sendOtp(phone);
            if (otp !== null) {
                showFormVerifyOTP(element, phone, otp.otp, 'VERIFY_PHONE');
                $('body').addClass('popup');
            }
        }
        else if (!confirm_contract && !confirm_otp) {
            alert('Vui lòng check 2 ô check box');
            return;
        }
        else if (!confirm_contract) {
            alert('Vui lòng check ô check box thứ 1');
            return;
        }
        else if (!confirm_otp) {
            alert('Vui lòng check ô check box thứ 2');
            return;
        }
    })
}

// Done +++
function customerInfo(element,status=true) {
    var strStatus = ``;
    if(status){
        strStatus = `<div class='ico-success'></div>
        <b>Chúc mừng bạn, với hạn mức tín dụng này bạn đủ điều kiện để hoàn tất đơn hàng.</b>`;
    }else{
        strStatus = `<div class='ico-unsuccess'></div>
        <b>Rất tiếc, với hạn mức tín dụng này bạn không đủ điều kiện để hoàn tất đơn hàng.</b>`
    }
    var str = `<div class="customer">
                <div class='voolo-logo'></div>
                <div id="customerInfo">
                    <div class="avatar"><img src="${customer.avatar}" /></div>
                    <div class='detail'>
                        <h3 style="font-weight:700;font-size:20px;">${customer.name}, <c>ơi!</c></h3>
                        <p class='limit-text'>Hạn mức tín dụng của bạn là : <span class='limit-number'>${formatCurrency(customer.limit * 1)}</span></p>
                        ${strStatus}
                    </div>
                </div>
            </div>`;
    if ($(window).width() < 700) {
        $(element).prepend(str);
        $(element).find(".avatar").css("display","none");
        $(element).find(".list-items").css("margin-top","212px");
        $(element).find(".detail h3").css({"font-weight":"600","font-size":"18px"});
    }
    else {
        $(element).prepend(str);
        $(element).find(".list-items").css({"margin-top":"410.5px","padding-top":"0"});
        $(element).find(".formValue").css("margin-top","410.5px");
        $(element).find(".avatar").css("display","none");
        $(element).find(".detail h3").css({"font-weight":"700","font-size":"20px"});
    }
}

// Done +++
function showProcessPipeline(step,logo = false,formName='') {
    var s1, s2, s3, s4, s5 = '';
    switch (step) {
        default:
        case 1:
            s1 = 'active';
            break;
        case 2:
            s1 = s2 = 'active';
            break;
        case 3:
            s1 = s2 = s3 = 'active';
            break;
        case 4:
            s1 = s2 = s3 = s4 = 'active';
            break;
        case 5:
            s5 = s1 = s2 = s3 = s4 = 'active';
            break;
    }
    var pipeline = `
        <div class='headrow'>
        ${(logo)?'<div class="voolo-logo"></div>':''}
            <div class='sub2'>Chào mừng bạn đến với quy trình đăng ký Mua trước Trả sau</div>
            <div class='line'>
                <span class='Tpipe ${(step !== 1) ? s1 : ""}'></span>
                <span class='Tpipe ${s3}'></span>
                <span class='Tpipe ${s4}'></span>
                <span class='Tpipe ${s5}'></span>
                <span class='Tpipe last'></span>
            </div>
            <div class='pipeline'>
                <span class='pipe ${s1}'>Thông tin khách hàng</span>
                <span class='pipe ${s2}'>Cài đặt PIN</span>
                <span class='pipe ${s3}'>Ký điện tử</span>
                <span class='pipe ${s4}'>Xác minh thông tin</span>
                <span class='pipe ${s5}'>Hoàn thành</span>
            </div>
        </div>`;

    $('#voolo').prepend(pipeline);
    if(formName!=='') $('#voolo').addClass(formName);
    $('.formValue').addClass("formValue-mt");
    $('.form-card').addClass("formValue-mt");
    $('.box').addClass("formValue-mt");
}

// Done +++
function showHeader() {
    var html = `<div class='header-voolo'>
                    <div id='header-voolo-logo'>
                        <img src='./assets/img/VOOLO_logo_horizontal.png' />
                    </div>
                    <h1 id='header-voolo-title'>Chào mừng bạn đến với quy trình đăng ký Mua trước Trả sau</h1>
                </div>`;
    return html;
}

// Done +++
function showLogo(mb) {
    var html = `<div id='img-voolo-logo' style='margin-bottom: ${mb}px'>
                <img src='./assets/img/VOOLO_logo_horizontal.png' />
            </div>`;
    return html;
};

// Done +++
// function showTitle(mb) {
//     var html = `<h1 id='voolo-title'>Chào mừng bạn đến với quy trình đăng ký Mua trước Trả sau</h1> `;
//     return html;
// };

function setRoute(func) {
    history.pushState({}, "Voolo Set Url", "#" + func);
}

function router(element) {
    var url = window.location.href;
    route = url.split('#')[1];
    switch (route) {
        default:
            showAllProvider(element);
        case undefined:
            showAllProvider(element);
            break;
        case "showUICheckPhone":
            showUICheckPhone(element);
            break;
        case "showUICheckNid":
            showUICheckNid(element);
            break;
        case "captureNidFrontAndBack":
            captureNidFrontAndBack(element);
            break;
        case "showDataInform":
            showDataInform(element);
            break;
        case "showContract":
            showContract(element);
            break;
        case "showAllTenor":
            showAllTenor(element, 3);
            break;

    }

}

/* 
* ex : messageScreen(element,{screen : "buy_success",pipeline:false});
*
**/

function messageScreen(element, config) {
    if (config.screen == 'successScreen') {
        html = `<div class='box showMessage formValue-mt'>
                    <div class='paragraph-text text-center margin-bottom-default'>
                        <div class='ico-success'></div>
                        <h3>Bạn đã đăng ký thành công</h3>
                        <p style='text-align: center;'>
                        Bấm vào <a class="ahref" href="${DOMAIN}" style='width:auto'>đây</a> để quay trở lại. Tự động trở lại trang mua hàng sau <c class='coutdown'>5</c>s.
                        </p>
                    </div> 
                </div>`;
    }

    if (config.screen == 'unsuccessScreen') {
        html = `<div class='box showMessage formValue-mt'>
                    <div class='paragraph-text text-center margin-bottom-default'>
                        <div class='ico-unsuccess'></div>
                        <h3>Đăng ký không thành công</h3>
                        <p style='text-align: center;'>
                        Bấm vào <a class="ahref" href="${DOMAIN}" style='width:auto'>đây</a> để quay trở lại. Tự động trở lại trang mua hàng sau <c class='coutdown'>5</c>s.
                        </p>
                    </div> 
                </div>`;
    }

    if (config.screen == 'pincode_unsuccess') {
        html = `<div class='box showMessage'>
                    <div class='paragraph-text text-center margin-bottom-default'>
                        <div class='ico-unsuccess'></div>
                        <h3>Cập nhật mã PIN không thành công</h3>
                        <p>Vui lòng thử lại hoặc liên hệ <b>1900xxx</b> để được hỗ trợ.</p>
                        <button class='payment-button' id="tryagain">Thử lại</button>
                    </div> 
                </div>`;
    }

    if (config.screen == 'pincode_success') {
        html = `<div class='box showMessage'>
                    <div class='paragraph-text text-center margin-bottom-default'>
                        <div class='ico-success'></div>
                        <h3>Cập nhật mã PIN thành công</h3>
                        <p style='text-align: center;'>
                        Bấm vào <a class="ahref" href="${DOMAIN}" style='width:auto'>đây</a> để quay trở lại. Tự động trở lại trang mua hàng sau <c class='coutdown'>5</c>s.
                        </p>
                    </div> 
                </div>`;
    }

    if (config.screen == 'buy_success') {
        html = `<div class='box showMessage'>
                    <div class='paragraph-text text-center margin-bottom-default'>
                        <div class='ico-success ico-150'></div>
                        <h3>Chúc mừng bạn đã mua hàng thành công</h3>
                        <div class='id_bill'>Mã thanh toán: <a class='link_id_bill'>ABC-200305-0306-F94C</a></div>
                        <p style='text-align: center;'>
                        Bấm vào <a class="ahref" href="${DOMAIN}" style='width:auto'>đây</a> để quay trở lại. Tự động trở lại trang mua hàng sau <c class='coutdown'>5</c>s.
                        </p>
                    </div>
                </div>`;
    }

    if (config.screen == 'buy_unsuccess') {
        html = `<div class='box showMessage'>
                    <div class='paragraph-text text-center margin-bottom-default'>
                        <div class='ico-unsuccess ico-150'></div>
                        <h3>Mua hàng không thành công</h3>
                        <p>Vui lòng thử lại hoặc liên hệ <b>1900xxx</b> để được hỗ trợ.</p>
                        <button class='payment-button' id="tryagain">Thử lại</button>
                    </div>
                </div>`;
    }

    $(element).removeClass("non-flex");
    $(element).html(html);
    if (config.pipeline) showProcessPipeline(5,true);
    var n = 5;
    var cInterval = setInterval(function () {
        $(".coutdown").html(n);
        console.log("time: ", n);
        if (n === 0) {
            if (config.screen == 'successScreen') {
                showAllTenor(element, 3);
            }
            if (config.screen == 'buy_success' || config.screen == 'pincode_success') {
                window.location.href = DOMAIN;
            }
            clearTimeout(cInterval);
        }
        n = n - 1;
    }, 1000);
}

function showUseGuideSelfy() {
    $('body').find('.guideslide').remove();
    $("#formValueNid").hide();
    $('body').append("<div class='guideslide'></div>");
    $('.guideslide').load('useguide.html');
    $('body').find('.pageTitle').text("Hướng dẫn chụp ảnh chân dung");
}

function showUseGuideNid() {
    $('body').find('.guideslide').remove();
    $("#formValueNid").hide();
    $('#voolo').append("<div class='guideslide nid-front' style=''></div>");
    $('.guideslide').load('useguidenid.html');
    $('body').find('.pageTitle').text("Hướng dẫn chụp ảnh CMND/CCCD");
}

function showUseGuideBackNid(){
    $('body').find('.guideslide').remove();
    $("#formValueNid").hide();
    $('#voolo').append("<div class='guideslideback' style=''></div>");
    var html = `<div class='box2 showMessage'>
                    <div class=''>
                        <div class='ico-success ico-120'></div>
                        <div class='statusTitle'>Chụp ảnh mặt trước thành công</div>
                        <div class='line'>
                            <span class='font-m'>Now</span>
                        </div>
                        <div class='refresh-ico'>
                            <img src='./assets/img/refresh-ico.png' width="20" height="20" />
                        </div>
                        <p style='text-align: center;'>
                            Lật mặt sau của card để tiếp tục chụp ảnh
                        </p>
                        <div class="angled-borders">
                            <div id="f1_container">
                                <div id="f1_card" class="shadow">
                                    <div class="front face">
                                        <img src='./assets/img/cccd.png' width="115"/>
                                    </div>
                                    <div class="back face center">
                                        <img src='./assets/img/cccd-2.png' width="115"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="width:100%">
                        <button class='payment-button' id="" style='margin-top:26px' onClick="runDocumentCaptureScreen('BACK')">Bắt đầu</button>
                        </div>
                    </div>
                </div>`;
        $('.guideslideback').html(html);
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

$("#tryagain").on("click", function () {
    window.location.href = DOMAIN;
});

function pageTitle(element,str = '',cls=''){
    if(str !=='') {
        $(element).prepend(str);
        $(element).addClass("non-flex");
        if(cls != '') $(element).addClass(cls);
    }

}

function close_popup(){
    $('body').removeClass('popup');
    $('body .overlay-popup').remove();
}