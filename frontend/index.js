const arrType_front = ["cccd_chip_front", "cccd_front", "cmnd_old_front"];
const arrType_back = ["cccd_chip_back", "cmnd_new_cccd_back", "cmnd_old_back"];
let billTotal = 0;
let customer = { avatar: './assets/img/avatar.png', limit: '50000000', name: 'Trung' };
let btnSelActive, fillInd, btnFrontActive, btnBackActive = false;

// Chỉ cho nhập số
// document.querySelector(".only-number").addEventListener("keypress", function (e) {
//     if (e.which != 8 && e.which != 0 && e.which < 48 || e.which > 57) {
//         e.preventDefault();
//     }
// });
// 0 for null values, 8 for backspace, 48-57 for 0-9 numbers

// Done +++
function disableEnterKey() {
    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    })
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
    showProcessPipeline(4, true);
    $("body").removeClass("loading");

    var myInterval = setInterval(function () {
        let phone = sessionStorage.getItem('phone');
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
function showUICheckPhone(element) {
    setRoute("showUICheckPhone");
    var html = `<form id='formValuePhone' class='formValue showUICheckPhone'>
                    <div class='mobile'>
                        <div class='form__row'>
                            <h5>Số điện thoại</h5>
                            <label for='phone' class='text-b-m'>Vui lòng nhập số điện thoại để tiếp tục</label>
                            <input autocomplete="off" type='number' id='phone' class='form__input input-global' />
                            <span class='error_message'></span>
                        </div>
                        <button type='button' id='btnSubmitPhone' class='payment-button'>Tiếp tục</button>
                    </div>
                </form>`;
    $(element).html(html);

    disableEnterKey();

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

    $("#phone").on('focus', function () {
        formatStyleFocus(dataPhone);
    })

    $("#phone").on('input', function () {
        const regexPhone = /^(09|03|07|08|05)+([0-9]{8}$)/;
        dataPhone.value = dataPhone.value.slice(0, 10);
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
        sessionStorage.setItem('phone', data);
        let result = checkPhoneExists(data);
        console.log('Check phone exists: ', result);
        if (result.errCode === 1000 && result.status === true) {
            let step = result?.data?.step;
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
            btnSubmitPhone.disabled = true;
        }
        else if (result.errCode === 1008 && result.status === false) {
            formatStyleWrongInput(dataPhone, errorMessage, 'Bạn đã nhập sai otp 5 lần. Vui lòng đợi 60 phút để thử lại !');
            btnSubmitPhone.disabled = true;
        }
        else if (result.errCode === 1004 && result.status === false) {
            formatStyleWrongInput(dataPhone, errorMessage, 'Bạn đã đăng nhập thất bại 5 lần. Vui lòng đợi 60 phút để thử lại !');
            btnSubmitPhone.disabled = true;
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
                            <input autocomplete="off" type='number' id='nid' class='input-global' />
                            <span class='error_message'></span>
                        </div>
                        <label>Chụp ảnh chân dung</label>
                        <button type='button' id='callHP' class='btnCapture'></button>
                        <button type='button' id='btnSubmitNid' class='payment-button'>Tiếp tục</button>
                    </div>
                </form>`;
    $(element).html(html);

    disableEnterKey();

    pageTitle(element, "<h4 class='pageTitle'>Chụp ảnh chân dung</h4>");

    $('#callHP').click(function () {
        showUseGuideSelfy();
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

    $("#nid").on('focus', function () {
        formatStyleFocus(dataNid);
    })

    $("#nid").on('input', function () {
        if (dataNid.value !== null && dataNid.value !== '') {
            const regexNid = /^\d{12}$|^\d{9}$/;
            dataNid.value = dataNid.value.slice(0, 12);
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
        fillInd = isActive;
        console.log(fillInd + " " + btnSelActive);
        if (isActive === true && btnSelActive === true) {
            btnSubmitNid.disabled = false;
        }
        else {
            btnSubmitNid.disabled = true;
        }
    });

    $('#btnSubmitNid').click(function () {
        let data = $('#nid').val();
        sessionStorage.setItem('nid', data);
        var checkSelfieImage = sessionStorage.getItem('selfie-image');
        let result = checkNidExists(data);
        console.log('Check nid exists: ', result);
        if (result.statusCode === 1000 && result.status === true && checkSelfieImage !== null) {
            formatStyleWrongInput(dataNid, errorMessage, 'CMND/CCCD đã được đăng ký.');
            btnSubmitNid.disabled = true;
        }
        else if (result.statusCode === 900 && result.status === false && checkSelfieImage !== null) {
            captureNidFrontAndBack(element);
            let checkCustomer = {
                phone: sessionStorage.getItem('phone'),
                nid: sessionStorage.getItem('nid'),
                selfieImage: sessionStorage.getItem('selfie-image')
            };
            sessionStorage.setItem('checkCustomer', JSON.stringify(checkCustomer));
        }
        else if (result.errorCode === 8000 && result.status === false) {
            formatStyleWrongInput(dataNid, errorMessage, 'Số CMND/CCCD không hợp lệ !');
            btnSubmitNid.disabled = true;
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

    disableEnterKey();

    showProcessPipeline(1, true, 'captureNid');
    pageTitle(element, "<h4 class='pageTitle'>Chụp ảnh CMND/CCCD</h4>");

    $('#front_image').click(function () {
        deleteImage('FRONT');
    });

    $('#back_image').click(function () {
        deleteImage('BACK');
    });

    $('#btnCaptureFront').click(function () {
        showUseGuideNid();
    })

    $('#btnCaptureBack').click(function () {
        let front_image = sessionStorage.getItem('front-image');
        if (front_image !== null && front_image !== '' && front_image !== undefined) {
            runDocumentCaptureScreen('BACK');
        }
    })

    let btnSubmit = document.querySelector('#btnSubmit');
    btnSubmit.disabled = true;

    if (btnFrontActive && btnBackActive) {
        btnSubmit.disabled = false;
    }
    else {
        btnSubmit.disabled = true;
    }

    $('#btnSubmit').click(function () {
        let adn = JSON.parse(sessionStorage.getItem('allDataNid'));
        if (adn !== null && adn !== '') {
            let fn = adn?.front_nid_customer;
            let bn = adn?.back_nid_customer;
            let phone = sessionStorage.getItem('phone');
            if (fn !== null && bn !== null) {
                let personal = new Personal(fn.name, fn.gender, phone, fn.dob, fn.idNumber, bn.doi, fn.doe, fn.province, fn.district, fn.ward, fn.street);
                showDataInform('#voolo', personal);
            }
        }
    })
}

// Done +++
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
function cutStringData(infomation) {
    try {
        if (infomation !== null && infomation !== '' && infomation !== undefined) {
            const { result } = infomation;
            const details = result?.details[0]?.fieldsExtracted;
            const nidType = result?.details[0]?.type;
            let front_nid_customer = '';
            let back_nid_customer = '';
            // FRONT NID IMAGE
            if (arrType_front.includes(nidType) && nidType !== null) {
                sessionStorage.setItem('typeFrontNid', nidType);
                let province = details?.province?.value || '';
                let idNumber = details?.idNumber?.value || '';
                let name = details?.name?.value || '';
                let dob = details?.dob?.value || '';
                let homeTown = details?.homeTown?.value || '';
                let permanentAddress = details?.permanentAddress?.value.split(',');
                let street = permanentAddress[-4] ? permanentAddress[-4] : '';
                let ward = permanentAddress[-3] ? permanentAddress[-3] : '';
                let district = permanentAddress[-2] ? permanentAddress[-2] : '';
                let city = permanentAddress[-1] ? permanentAddress[-1] : '';
                let gender = details?.gender?.value || '';
                let doe = details?.doe?.value || '';
                let nationality = details?.nationality?.value || '';
                let nid = sessionStorage.getItem('nid');
                console.log('City: ', city);
                console.log('District: ', district);
                console.log('Ward: ', ward);
                console.log('Street: ', street);
                console.log('Permanent Address: ', permanentAddress);
                makeFaceMatchCall(sessionStorage.getItem('selfie-image'), sessionStorage.getItem('front-image')).then((data) => {
                    if (data) {
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
                        sessionStorage.setItem('front_nid_customer', JSON.stringify(front_nid_customer));
                        showUseGuideBackNid();
                    }
                    else {
                        sessionStorage.removeItem('front-image');
                        $("#btnCaptureFront").attr("style", "background-image: url(./assets/img/camera.png) center no-repeat");
                        $("#btnCaptureFront").removeClass("showImage");
                        runDocumentCaptureScreen('FRONT');
                    }
                    if (nid !== idNumber) {
                        alert('Chứng minh nhân dân nhập tay với chứng minh nhân dân mặt trước không trùng khớp');
                        return;
                    }
                });
            }
            // BACK NID IMAGE
            if (arrType_back.includes(nidType) && nidType !== null) {
                sessionStorage.setItem('typeBackNid', nidType);
                let typeBackNid = sessionStorage.getItem('typeBackNid');
                let typeFrontNid = sessionStorage.getItem('typeFrontNid');
                if ((typeFrontNid === 'cccd_chip_front' && typeBackNid === 'cccd_chip_back') || (typeFrontNid === 'cccd_front' && typeBackNid === 'cmnd_new_cccd_back') || (typeFrontNid === 'cmnd_old_front' && typeBackNid === 'cmnd_back_front')) {
                    let doi = details?.doi?.value || '';
                    let placeOfIssue = details?.placeOfIssue?.value || '';
                    back_nid_customer = {
                        doi: doi,
                        placeOfIssue: placeOfIssue
                    }
                    sessionStorage.setItem('back_nid_customer', JSON.stringify(back_nid_customer));
                }
            }
        }

        let fnc = JSON.parse(sessionStorage.getItem('front_nid_customer'));
        let bnc = JSON.parse(sessionStorage.getItem('back_nid_customer'));

        if (fnc !== null && bnc !== null) {
            let allDataNid = {
                front_nid_customer: fnc,
                back_nid_customer: bnc
            }
            sessionStorage.setItem('allDataNid', JSON.stringify(allDataNid));
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
    $('body').addClass('loading');
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
                    return true;
                }
            }
        }
    };
    $('body').removeClass('loading');
    return HVNetworkHelper.makeFaceMatchCall(faceImageBase64String, docImageBase64String, {}, {}, callback);
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
            }
            if (HVResponse) {
                var apiResults = HVResponse.getApiResult();
                var apiHeaders = HVResponse.getApiHeaders();
                var imageBase64 = HVResponse.getImageBase64();
                var attemptsCount = HVResponse.getAttemptsCount();
                if (imageBase64 !== '' && imageBase64 !== null && imageBase64 !== undefined) {
                    $('.guideslide').remove();
                    $("#formValueNid").show();
                    $('body').find('.pageTitle').text("Chụp ảnh chân dung");
                    sessionStorage.setItem('selfie-image', imageBase64);
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
        hvDocConfig.docTextConfig.setDocCaptureReviewTitle('Chụp ảnh CMND/CCCD');
        hvDocConfig.docTextConfig.setDocCaptureBottomDescription('Chọn nơi đủ ánh sáng và đưa CMND/CCCD trong khung hình');

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
            }
            if (HVResponse) {
                var apiResults = HVResponse.getApiResult();
                var apiHeaders = HVResponse.getApiHeaders();
                var imageBase64 = HVResponse.getImageBase64();
                var attemptsCount = HVResponse.getAttemptsCount();
                if (apiResults['result']['summary']['action'] !== 'pass') {
                    return;
                }
                if (imageBase64 !== '' && imageBase64 !== null && imageBase64 !== undefined) {
                    $('.guideslide').remove();
                    $('.guideslideback').remove();
                    $("#formValueNid").show();
                    $('body').find('.pageTitle').text("Chụp ảnh CMND/CCCD");
                    if (applyFrontNid) {
                        console.log("apiResults front: ", apiResults['result']['details'][0]['fieldsExtracted']);
                        sessionStorage.setItem('front-image', imageBase64);
                        cutStringData(apiResults);
                        showCapture(imageBase64, "btnCaptureFront")
                    }
                    else if (applyBackNid) {
                        console.log("apiResults back: ", apiResults['result']['details'][0]['fieldsExtracted']);
                        sessionStorage.setItem('back-image', imageBase64);
                        cutStringData(apiResults);
                        showCapture(imageBase64, "btnCaptureBack");
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
    $(element).removeClass().removeAttr('style');
    let html = '';
    if (customer.limit < totalBillNumber) {
        customerInfo(element, false);
        return;
    }

    //calculator bill
    let sumBill = 0;
    pData.forEach(e => { sumBill = sumBill + parseInt(e.price) })

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
                    <h5 class='totalprice'>${formatCurrency(parseInt(sumBill) + parseInt(tenors[i].convertFee))}</h5>
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

    disableEnterKey();

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
        let phone = sessionStorage.getItem('phone');
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

    disableEnterKey();

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
    disableEnterKey();
}

// Done +++
function selectProvider() {
    showUICheckPhone('#voolo');
    disableEnterKey();
}

// Done +++
function deleteImage(side) {
    try {
        if (side === 'SELFIE') {
            if (sessionStorage.getItem('selfie-image') !== null) {
                sessionStorage.removeItem('selfie-image');
                $("#selfie_picture").attr("src", "");
                alert('Xóa ảnh selfie thành công !');
            }
            else {
                alert('Không tìm thấy ảnh để xóa !');
            }
        }
        else if (side === 'FRONT') {
            if (sessionStorage.getItem('front_image') !== null) {
                sessionStorage.removeItem('front-image');
                $("#front_picture").attr("src", "");
                alert('Xóa mặt trước selfie thành công !');
            }
            else {
                alert('Không tìm thấy ảnh để xóa !');
            }
        }
        else {
            if (sessionStorage.getItem('back_image') !== null) {
                sessionStorage.removeItem('back-image');
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
// function postNationalID(ImageURL) {
//     try {
//         var block = ImageURL.split(";");
//         var contentType = block[0].split(":")[1];
//         var realData = block[1].split(",")[1];
//         var blob = b64toBlob(realData, contentType);
//         var formDataToUpload = new FormData();
//         formDataToUpload.append("image", blob);
//         var settings = {
//             "url": "https://vnm-docs.hyperverge.co/v2/nationalID",
//             "method": "POST",
//             "timeout": 0,
//             "headers": {
//                 "appId": "abe84d",
//                 "appKey": "7d2c0d7e1690c216458c",
//                 "transactionId": "6bdec326-5eff-4492-b045-160816e61cea",
//             },
//             "async": false,
//             "processData": false,
//             "contentType": false,
//             "mimeType": "multipart/form-data",
//             "data": formDataToUpload
//         };
//         $.ajax(settings).done(function (response) {
//             const data = JSON.parse(response);
//             cutStringData(data);
//         });
//     }
//     catch (error) {
//         console.log(error);
//         return {
//             errorCode: error.status || 500,
//             errorMessage: error.message
//         }
//     }
// }

// Done +++
function showDataInform(element, personal) {
    disableEnterKey();
    setRoute("showDataInform");
    let adn = JSON.parse(sessionStorage.getItem('allDataNid'));
    if (adn !== null && adn !== '') {
        let fn = adn?.front_nid_customer;
        let bn = adn?.back_nid_customer;
        if (fn !== null && bn !== null) {
            personal = new Personal(fn.name, fn.gender, sessionStorage.getItem('phone'), fn.dob, fn.idNumber, bn.doi, fn.doe, fn.province, fn.district, fn.ward, fn.street);
        }
    }
    let cities = getAllCity();
    let districts = getAllDistrict();
    let wards = getAllWard();
    let referencesRelation = getAllReferenceRelation();
    showHeader();
    let fullname = personal.fullname || '';
    let conditionFullname = personal.fullname !== null && personal.fullname !== '' && personal.fullname !== undefined;
    let phone = personal.phone || '';
    let conditionPhone = personal.phone !== null && personal.phone !== '' && personal.phone !== undefined;
    let dob = convertDateString(personal.dob) || '';
    let conditionDob = convertDateString(personal.dob) !== null && convertDateString(personal.dob) !== '' && convertDateString(personal.dob) !== undefined;
    let gender = personal.gender || '';
    var genM = (gender === 'M') ? 'selected' : '';
    var genF = (gender === 'F') ? 'selected' : '';
    let conditionGender = personal.gender !== null && personal.gender !== '' && personal.gender !== undefined;
    let nid = personal.nid || '';
    let conditionNid = personal.nid !== null && personal.nid !== '';
    let doi = convertDateString(personal.doi) || '';
    let conditionDoi = convertDateString(personal.doi) !== null && convertDateString(personal.doi) !== '' && convertDateString(personal.doi) !== undefined;
    let doe = convertDateString(personal.doe) || '';
    let conditionDoe = convertDateString(personal.doe) !== null && convertDateString(personal.doe) !== '' && convertDateString(personal.doe) !== undefined;
    let city = personal.city || '';
    let conditionCity = personal.city !== null && personal.city !== '' && personal.city !== undefined;
    let district = personal.district || '';
    let conditionDistrict = personal.district !== null && personal.district !== '' && personal.district !== undefined;
    let ward = personal.ward || '';
    let conditionWard = personal.ward !== null && personal.ward !== '' && personal.ward !== undefined;
    let street = personal.street || '';
    let conditionStreet = personal.street !== null && personal.street !== '' && personal.street !== undefined;

    let cityName = '';
    let cityValue = '';
    let districtName = '';
    let districtValue = '';
    let wardName = '';
    let wardValue = '';
    let dtCity = null;
    let dtDistrict = null;
    let dtWard = null;
    console.log('conditionCity && conditionDistrict && conditionWard: ', conditionCity && conditionDistrict && conditionWard);
    console.log('conditionCity: ', conditionCity);
    console.log('conditionDistrict: ', conditionDistrict);
    console.log('conditionWard: ', conditionWard);
    console.log('city: ', city);
    console.log('district: ', district);
    console.log('ward: ', ward);
    if (conditionCity && conditionDistrict && conditionWard) {
        let dataAddress = handleGetDataAddress(city, district, ward);
        cityName = dataAddress.city.name;
        cityValue = dataAddress.city.value;
        districtName = dataAddress.district.name;
        districtValue = dataAddress.district.value;
        wardName = dataAddress.ward.name;
        wardValue = dataAddress.ward.value;
    }
    if (city) {
        dtCity = findCity(city);
        console.log('dtCity: ', dtCity);
    }
    if (district) {
        dtDistrict = findDistrict(district);
        console.log('dtDistrict: ', dtDistrict);
    }
    if (ward) {
        dtWard = findWard(ward);
        console.log('dtWard: ', dtWard);
    }

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
                                    <input class='input-global' type='text' id='fullname' name='fullname' oninput='onChangeValidation("#fullname")' value="${conditionFullname ? fullname : ''}" ${conditionFullname ? 'disabled' : ''} />
                                    <span class='error_fullname error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='phone'>Số điện thoại</label>
                                    <input class='input-global' type='number' id="phone" name="phone" oninput='onChangeValidation("#phone")' value="${conditionPhone ? phone : ''}"  ${conditionPhone ? 'disabled' : ''} />
                                    <span class='error_phone error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='dob'>Ngày sinh</label>
                                    <input class='input-global' type='date' id='dob' name='dob' oninput='onChangeValidation("#dob")' value="${conditionDob ? dob : ''}" ${conditionDob ? 'disabled' : ''} style='max-width:191px'/>
                                    <span class='error_dob error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='gender'>Giới tính</label>
                                    <select id='gender' name='gender' class='input-global' oninput='onChangeValidation("#gender")' ${conditionGender ? 'disabled' : ''} style='max-width:139px;'>
                                    <option value="" >Chọn</option>
                                    <option value="M" ${genM}>Nam</option>
                                    <option value="F" ${genF}>Nữ</option>
                                    </select>
                                    <span class='error_gender error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='nid'>Số CMND/CCCD</label>
                                    <input class='input-global' type='number' id='nid' name='nid' oninput='onChangeValidation("#nid")' value="${conditionNid ? nid : ''}" ${conditionNid ? 'disabled' : ''}/>
                                    <span class='error_nid error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <div class='mobile-cell'>
                                        <div class="form-cell">
                                            <label for='doi'>Ngày cấp</label>
                                            <input class='input-global' type='date' id='doi' name='doi' oninput='onChangeValidation("#doi")' value="${conditionDoi ? doi : ''}" ${conditionDoi ? 'disabled' : ''}/>
                                            <span class='error_doi error_message'></span>
                                        </div>
                                    </div>
                                    <div class='mobile-cell'>
                                        <div class="form-cell">
                                            <label for='doe'>Ngày hết hạn</label>
                                            <input class='input-global' type='date' id='doe' name='doe' oninput='onChangeValidation("#doe")' value="${conditionDoe ? doe : ''}" ${conditionDoe ? 'disabled' : ''} />
                                            <span class='error_doe error_message'></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer"></div>
                        </div >
                        <div class="card">
                            <div class="card-head">
                                <h3 class='form-showdata-info'>Địa chỉ hiện tại</h3>
                            </div>
                            <div class="card-body">
                                <div class='form-row'>
                                    <label for='city'>Thành phố/Tỉnh</label>
                                    <select id='city' name='city' class='input-global' oninput='onChangeValidation("#city")' onchange='handleChangeCity("#city", "#district")' value="${(conditionCity && dtCity) ? dtCity.Value : ''}">
                                        ${cities.data.map((city, index) => (`<option key=${index} value='${city.Value}' ${dtCity ? (dtCity.Value === city.Value) && 'selected' : ''}>${city.UI_Show}</option>`))}
                                    </select>
                                    <span class='error_city error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='district'>Quận/Huyện</label>
                                    <select id='district' name='district' class='input-global' oninput='onChangeValidation("#district")' onchange='handleChangeWard("#district", "#ward")' value="${(conditionDistrict && dtDistrict) ? dtDistrict.Value : ''}">   
                                        ${districts.data.map((district, index) => (`<option key=${index} value='${district.Value}' ${dtDistrict ? (dtDistrict.Value === district.Value) && 'selected' : ''}>${district.UI_Show}</option>`))}
                                    </select >
                                    <span class='error_district error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='ward'>Phường/Xã</label>
                                    <select id='ward' name='ward' class='input-global' oninput='onChangeValidation("#ward")'  value="${(conditionWard && dtWard) ? dtWard.Value : ''}">
                                        ${wards.data.map((ward, index) => (`<option key=${index} value='${ward.Value}' ${dtWard ? (dtWard.Value === ward.Value) && 'selected' : ''}>${ward.UI_Show}</option>`))}
                                    </select >
                                    <span class='error_ward error_message'></span>
                                </div >
                                <div class='form-row'>
                                    <label for='street'>Đường</label>
                                    <input class='input-global' type='text' id='street' name='street' oninput='onChangeValidation("#street")' value="${conditionStreet ? street : ''}" ${conditionStreet ? 'disabled' : ''} />
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
                                <select id='city_permanent' name='city_permanent' class='input-global' oninput='onChangeValidation("#city_permanent")' onchange='handleChangeCity("#city_permanent", "#district_permanent")'>
                                    ${cities.data.map((city, index) => ('<option key="' + index + '" value="' + city.Value + '">' + city.UI_Show + '</option>'))}
                                </select>
                                <span class='error_city_permanent error_message'></span>
                            </div>
                            <div class='form-row'>
                                <label for='district_permanent'>Quận/Huyện</label>
                                <select id='district_permanent' name='district_permanent' class='input-global' oninput='onChangeValidation("#district_permanent")' onchange='handleChangeWard("#district_permanent", "#ward_permanent")'>
                                    ${districts.data.map((district, index) => ('<option key="' + index + '" value="' + district.Value + '">' + district.UI_Show + '</option>'))}
                                </select>
                                <span class='error_district_permanent error_message'></span>
                            </div>
                            <div class='form-row'>
                                <label for='ward_permanent'>Phường/Xã</label>
                                <select id='ward_permanent' name='ward_permanent' class='input-global' oninput='onChangeValidation("#ward_permanent")'>
                                    ${wards.data.map((ward, index) => ('<option key="' + index + '" value="' + ward.Value + '">' + ward.UI_Show + '</option>'))}
                                </select>
                                <span class='error_ward_permanent error_message'></span>
                            </div>
                            <div class='form-row'>
                                <label for='street_permanent'>Đường</label>
                                <input class='input-global' type='text' id='street_permanent' name='street_permanent' oninput="onChangeValidation('#street_permanent')"/>
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
                                    <input class='input-global' type='text' id="fullname_ref" name="fullname_ref" oninput='onChangeValidation("#fullname_ref")'/>
                                    <span class='error_fullname_ref error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='phone_ref'>Số điện thoại</label>
                                    <input class='input-global' type='number' id='phone_ref' name='phone_ref' oninput='onChangeValidation("#phone_ref")'/>
                                    <span class='error_phone_ref error_message'></span>
                                </div>
                            </div>
                            <div class="card-footer"></div>
                        </div>
                        <button type='submit' class='payment-button medium' id='btnContinue'>Tiếp tục</button>
                    </form >
                </div> `;
    $(element).html(html).removeClass('captureNid');

    //show progress bar
    showProcessPipeline(1, true, "showDataInform");
    pageTitle(element, "<h4 class='pageTitle'>Chụp ảnh chân dung</h4>", 'non-pageTitle');

    let fullnameEle = document.getElementById('fullname');
    let genderEle = document.getElementById('gender');
    let phoneEle = document.getElementById('phone');
    let dobEle = document.getElementById('dob');
    let nidEle = document.getElementById('nid');
    let doiELe = document.getElementById('doi');
    let doeEle = document.getElementById('doe');
    let cityEle = document.getElementById('city');
    let districtEle = document.getElementById('district');
    let wardEle = document.getElementById('ward');
    let streetEle = document.getElementById('street');
    let relationshipEle = document.getElementById('relationship');
    let fullname_refEle = document.getElementById('fullname_ref');
    let phone_refEle = document.getElementById('phone_ref');
    let city_permanentEle = document.getElementById('city_permanent');
    let district_permanentEle = document.getElementById('district_permanent');
    let ward_permanentEle = document.getElementById('ward_permanent');
    let street_permanentEle = document.getElementById('street_permanent');

    let btnContinue = document.getElementById('btnContinue');
    btnContinue.disabled = true;

    let isActiveData = false;
    let isActivePhone = false;

    let fields = document.querySelectorAll('.input-global');
    $('.input-global').on('input', function () {
        let phone = '';
        let phone_ref = '';
        if ($(this).attr("id") === 'phone') {
            phone = $(this).val().slice(0, 10);
        }
        if ($(this).attr("id") === 'phone_ref') {
            phone_ref = $(this).val().slice(0, 10);
            if (phone_ref.length < 10) {
                isActivePhone = false;
                showMessageStatus(phone_refEle, 'Số điện thoại không hợp lệ', 'ERROR');
            }
            if (phone_ref.length === 0) {
                isActivePhone = false;
                showMessageStatus(phone_refEle, 'Vui lòng nhập thông tin', 'ERROR');
            }
        }

        let phoneData = $("#phone").val();
        let phoneRefData = $("#phone_ref").val();
        if (phoneData.length === 10 && phoneRefData.length === 10) {
            if (phoneRefData === phoneData) {
                isActivePhone = false;
                showMessageStatus(phone_refEle, 'Số điện thoại tham chiếu không được trùng với số điện thoại người dùng', 'ERROR');
            }
            else {
                isActivePhone = true;
                showMessageStatus(phone_refEle, '', 'SUCCESS');
            }
        }

        for (var i = 0; i < fields.length - 1; i++) {
            if (fields[i].value !== null && fields[i].value !== '' && fields[i].value !== undefined) {
                isActiveData = true;
            }
            else {
                isActiveData = false;
                break;
            }
        }

        if (isActiveData === true && isActivePhone === true) {
            btnContinue.disabled = false;
        }
        else {
            btnContinue.disabled = true;
        }
    });

    const formDataValue = document.querySelector('#formDataValue');

    formDataValue.addEventListener('submit', function (e) {
        e.preventDefault();

        let fullnameVal = fullnameEle.value.trim();
        let genderVal = genderEle.options[genderEle.selectedIndex].value;
        let phoneVal = phoneEle.value.trim();
        let dobVal = dobEle.value.trim();
        let nidVal = nidEle.value.trim();
        let doiVal = doiELe.value.trim();
        let doeVal = doeEle.value.trim();
        let cityVal = cityEle.options[cityEle.selectedIndex].value;
        let districtVal = districtEle.options[districtEle.selectedIndex].value;
        let wardVal = wardEle.options[wardEle.selectedIndex].value;
        let cityText = cityEle.options[cityEle.selectedIndex].text;
        let districtText = districtEle.options[districtEle.selectedIndex].text;
        let wardText = wardEle.options[wardEle.selectedIndex].text;
        let streetVal = streetEle.value.trim();
        var relationshipVal = relationshipEle.options[relationshipEle.selectedIndex].value;
        var relationshipText = relationshipEle.options[relationshipEle.selectedIndex].text;
        let fullname_refVal = fullname_refEle.value.trim();
        let phone_refVal = phone_refEle.value.trim();
        let city_permanentVal = city_permanentEle.options[city_permanentEle.selectedIndex].value;
        let district_permanentVal = district_permanentEle.options[district_permanentEle.selectedIndex].value;
        let ward_permanentVal = ward_permanentEle.options[ward_permanentEle.selectedIndex].value;
        let city_permanentText = city_permanentEle.options[city_permanentEle.selectedIndex].text;
        let district_permanentText = district_permanentEle.options[district_permanentEle.selectedIndex].text;
        let ward_permanentText = ward_permanentEle.options[ward_permanentEle.selectedIndex].text;
        let street_permanentVal = street_permanentEle.value.trim();

        let isCheckEmpty = checkEmptyError([fullnameEle, genderEle, phoneEle, dobEle, nidEle, doiELe, doeEle, cityEle, districtEle, wardEle, streetEle, relationshipEle, fullname_refEle, phone_refEle, city_permanentEle, district_permanentEle, ward_permanentEle, street_permanentEle])

        let isPhoneError = checkPhoneValidate(phoneEle);
        if (phoneEle.value === '') {
            showMessageStatus(phoneEle, 'Vui lòng nhập thông tin', 'ERROR');
        }
        if (isPhoneError) {
            showMessageStatus(phoneEle, 'Số điện thoại không hợp lệ', 'ERROR');
        }
        else {
            showMessageStatus(phoneEle, '', 'SUCCESS');
        }

        let isPhoneRefError = checkPhoneValidate(phone_refEle);
        if (phone_refEle.value === '') {
            showMessageStatus(phone_refEle, 'Vui lòng nhập thông tin', 'ERROR');
        }
        if (isPhoneRefError) {
            showMessageStatus(phone_refEle, 'Số điện thoại không hợp lệ', 'ERROR');
        }
        else {
            showMessageStatus(phone_refEle, '', 'SUCCESS');
        }

        let isNidError = checkNidValidate(nidEle);
        if (nidEle.value === '') {
            showMessageStatus(nidEle, 'Vui lòng nhập thông tin', 'ERROR');
        }
        if (isNidError) {
            showMessageStatus(nidEle, 'Định dạng CMND/CCCD không hợp lệ', 'ERROR');
        }
        else {
            showMessageStatus(nidEle, '', 'SUCCESS');
        }

        let personal_all_infoConfirm = {
            name: fullnameVal,
            sex: genderVal,
            birthday: dobVal,
            phone: phoneVal,
            citizenId: nidVal,
            issueDate: doiVal,
            city: {
                cityVal: cityVal,
                cityText: cityText
            },
            district: {
                districtVal: districtVal,
                districtText: districtText
            },
            ward: {
                wardVal: wardVal,
                wardText: wardText
            },
            street: streetVal,
            "personal_title_ref": {
                relationshipVal: relationshipVal,
                relationshipText: relationshipText
            },
            "name_ref": fullname_refVal,
            "phone_ref": phone_refVal,
            "temporaryCity": {
                city_permanentVal: city_permanentVal,
                city_permanentText: city_permanentText,
            },
            "temporaryDistrict": {
                district_permanentVal: district_permanentVal,
                district_permanentText: district_permanentText
            },
            "temporaryWard": {
                ward_permanentVal: ward_permanentVal,
                ward_permanentText: ward_permanentText
            },
            "temporaryStreet": street_permanentVal,
            "expirationDate": doeVal
        }


        if (!isCheckEmpty) {
            if (!isPhoneError && !isPhoneRefError && !isNidError && (phone_refVal !== phoneVal)) {
                if (personal_all_infoConfirm !== null) {
                    sessionStorage.setItem('personal_all_infoConfirm', JSON.stringify(personal_all_infoConfirm));
                    $(element).removeClass("showDataInform");
                    showConfirmDataInform(element, personal_all_infoConfirm);
                }
            }
        }
    })
}

// Done +++
function showConfirmDataInform(element, personal_all_infoConfirm) {
    disableEnterKey();
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
                                    <div id='name' class="info">${personal_all_infoConfirm.name}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='phone'>Số điện thoại</label>
                                    <div id='phone' class="info">${personal_all_infoConfirm.phone}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='birthday'>Ngày sinh</label>
                                    <div id='birthday' class="info">${convertDateString2(personal_all_infoConfirm.birthday)}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='gender'>Giới tính</label>
                                    <div id='gender' class="info">${personal_all_infoConfirm.sex === 'M' ? 'Nam' : 'Nữ'}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='citizenId'>Số CMND/CCCD</label>
                                    <div id='citizenId' class="info">${personal_all_infoConfirm.citizenId}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='issueDate'>Ngày cấp</label>
                                    <div id='issueDate' class="info">${convertDateString2(personal_all_infoConfirm.issueDate)}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='doe'>Ngày hết hạn</label>
                                    <div id='doe' class="info">${convertDateString2(personal_all_infoConfirm.expirationDate)}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='address'>Địa chỉ hiện tại</label>
                                    <div id='address' class="info">${personal_all_infoConfirm.street}, ${personal_all_infoConfirm.ward.wardText}, ${personal_all_infoConfirm.district.districtText}, ${personal_all_infoConfirm.city.cityText}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='address'>Địa chỉ tạm trú</label>
                                    <div id='address' class="info">${personal_all_infoConfirm.temporaryStreet}, ${personal_all_infoConfirm.temporaryWard.ward_permanentText}, ${personal_all_infoConfirm.temporaryDistrict.district_permanentText}, ${personal_all_infoConfirm.temporaryCity.city_permanentText}</div>
                                </div>
                            </div >
                            <div class="card-footer"></div>
                        </div >
                        <div class="card" style="display:none">
                            <div class="card-head">
                                <div class="form-showdata-info sub4">Địa chỉ tạm trú</div>
                            </div>
                            <div class="card-body">
                                <div class='form-row form-verify'>
                                    <label for='city_permanent'>Thành phố/Tỉnh</label>
                                    <div id='city_permanent' class="info">${personal_all_infoConfirm.temporaryCity.city_permanentText}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='district_permanent'>Quận/Huyện</label>
                                    <div id='district_permanent' class="info">${personal_all_infoConfirm.temporaryDistrict.district_permanentText}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='ward_permanent'>Phường</label>
                                    <div id='ward_permanent' class="info">${personal_all_infoConfirm.temporaryWard.ward_permanentText}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='street_permanent'>Đường</label>
                                    <div id='street_permanent' class="info">${personal_all_infoConfirm.temporaryStreet}</div>
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
                                    <div id='relationship' class="info">${personal_all_infoConfirm.personal_title_ref.relationshipText}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='name_ref'>Họ và tên</label>
                                    <div id='name_ref' class="info">${personal_all_infoConfirm.name_ref}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='phone_ref'>Số điện thoại</label>
                                    <div id='phone_ref' class="info">${personal_all_infoConfirm.phone_ref}</div>
                                </div>
                            </div>
                            <div class="card-footer"></div>
                        </div>
                    </form>
                </div> 
                <div class="form-row">
                        <button type='button' class='payment-button btn-previous' onclick='showDataInform("${element}")'>Quay lại</button>
                        <button type='submit' class='payment-button medium' id='btnContinueConfirm' >Xác nhận</button>
                </div> `;
    $(element).html(html);
    showProcessPipeline(1, true, "showConfirmDataInform");
    pageTitle(element, "<h4 class='pageTitle'>Nhập thông tin cá nhân</h4>");
    $(window).scrollTop(0);

    let personal_all_info = {
        name: personal_all_infoConfirm.name,
        sex: personal_all_infoConfirm.sex,
        birthday: personal_all_infoConfirm.birthday,
        phone: personal_all_infoConfirm.phone,
        citizenId: personal_all_infoConfirm.citizenId,
        issueDate: personal_all_infoConfirm.issueDate,
        city: personal_all_infoConfirm.city.cityVal,
        district: personal_all_infoConfirm.district.districtVal,
        ward: personal_all_infoConfirm.ward.wardVal,
        street: personal_all_infoConfirm.street,
        "personal_title_ref": personal_all_infoConfirm.personal_title_ref.relationshipVal,
        "name_ref": personal_all_infoConfirm.name_ref,
        "phone_ref": personal_all_infoConfirm.phone_ref,
        "temporaryCity": personal_all_infoConfirm.temporaryCity.city_permanentVal,
        "temporaryDistrict": personal_all_infoConfirm.temporaryDistrict.district_permanentVal,
        "temporaryWard": personal_all_infoConfirm.temporaryWard.ward_permanentVal,
        "temporaryStreet": personal_all_infoConfirm.street_permanentVal,
        "expirationDate": personal_all_infoConfirm.expirationDate
    }

    sessionStorage.setItem('personal_all_info', JSON.stringify(personal_all_info));

    $('#btnContinueConfirm').click(function () {
        showFormSetupPin(element, 'SHOW_LOGIN');
    });
}

// Done +++
function configUi(config) {
    disableEnterKey();
    var iHtml = "";
    if (config.logo) iHtml += "<div class='voolo-logo'></div>";
    if (config.intro) iHtml += `
        <div class="paragraph-text text-center margin-bottom-default" > 
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
    disableEnterKey();
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
                            <span class='total-price'>`+ sTotal + `</span>
                        </div>
                    </div>
                </div> `;
    if (config.items) $(config.element).prepend(lItems);
}

// Done +++
function showCapture(base64, eId) {
    disableEnterKey();
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
                if (fillInd === true && btnSelActive === true) {
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
function forgotPinPhone(element, phone) {
    disableEnterKey();
    var html = `<form id ='formValuePhone' class='formValue forgotPinPhone'>
                    <div class='mobile'>
                        <div class='form__row m-top-16'>
                            <h4 style="margin-bottom:40px">Số điện thoại</h4>
                            <label for='phone_reset'>Vui lòng nhập số điện thoại để tiếp tục</label>
                            <input autocomplete="off" type='number' id='phone_reset' class='form__input input-global' value="${phone}" />
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

    $("#phone_reset").prop("disabled", true);

    // $("#phone_reset").on('input', function () {
    //     const regexPhone = /^(09|03|07|08|05)+([0-9]{8}$)/;
    //     dataPhone.value = dataPhone.value.slice(0, 10);
    //     let isPhoneErr = !regexPhone.test(dataPhone.value);
    //     if (dataPhone.value !== null && dataPhone.value !== '') {
    //         if (!isPhoneErr) {
    //             formatStyleCorrectInput(dataPhone, errorMessage);
    //             btnContinue.disabled = false;
    //         }
    //         else {
    //             formatStyleWrongInput(dataPhone, errorMessage, 'Số điện thoại không hợp lệ');
    //             btnContinue.disabled = true;
    //         }
    //     }
    //     else {
    //         formatStyleWrongInput(dataPhone, errorMessage, 'Vui lòng nhập số điện thoại');
    //         btnContinue.disabled = true;
    //     }
    // });

    $('#btnContinue').click(function () {
        let phone_reset = $('#phone_reset').val().trim();
        sessionStorage.setItem('phone_reset', phone_reset);
        forgotPinNid(element);
    });
}

// Done +++
function forgotPinNid(element) {
    disableEnterKey();
    var html = `<form class='formValue forgotPinPhone'>
                    <div class='mobile'>
                        <div class='form__row m-top-16'>
                            <h4 style="margin-bottom:40px">Số CMND/CCCD</h4>
                            <label for='nid_reset'>Vui lòng nhập số CMND/CCCD</label>
                            <input autocomplete="off" type='number' id='nid_reset' class='form__input input-global' />
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

    $("#nid_reset").on('focus', function () {
        formatStyleFocus(dataNid);
    })

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
        sessionStorage.setItem('nid_reset', $('#nid_reset').val().trim());
        let phone_reset = sessionStorage.getItem('phone_reset');
        let nid_reset = sessionStorage.getItem('nid_reset');
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
            btnSendOtp.disabled = true;
        }
        else if (data.status === false && data.statusCode === 1002) {
            formatStyleWrongInput(dataNid, errorMessage, 'Số điện thoại không chính xác');
            btnSendOtp.disabled = true;
        }
        else if (data.status === false && data.statusCode === 1001) {
            formatStyleWrongInput(dataNid, errorMessage, 'Chứng minh nhân dân không chính xác');
            btnSendOtp.disabled = true;
        }
        else if (data.status === false && data.errorCode === 8000) {
            formatStyleWrongInput(dataNid, errorMessage, 'Định dang data không hợp lệ');
            btnSendOtp.disabled = true;
        }
    })
}

// Done +++
function showFormPincode(element, phone, screen) {
    disableEnterKey();
    var html = `<div class='box form-card-pincode'>
                    <div class='voolo-logo'></div>
                    <form id='formSetupPinCode' class="box-mobile m-top-16">
                            <div class='${screen}'>
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
            formatStyleWrongPincode(pincode, errorMessage, 'Số điện thoại không hợp lệ');
            btnSubmitPin.disabled = true;
        }
        else if (result.status === false && result.statusCode === 1003) {
            if (result?.countFail !== 5) {
                formatStyleWrongPincode(pincode, errorMessage, 'Mã pin không chính xác (' + result?.countFail + '/5)');
                addBorderStyle('pin', "RED");
                btnSubmitPin.disabled = true;
            }
            else {
                formatStyleWrongPincode(pincode, errorMessage, 'Mã pin không chính xác (5/5).\nTài khoản của bạn đã bị khóa, thử lại sau 60 phút.');
                addBorderStyle('pin', "RED");
                for (i = 1; i <= 4; i++) {
                    $("#pin" + i).attr('disabled', true);
                }
                btnSubmitPin.disabled = true;
            }
        }
        else if (result.status === false && result.statusCode === 1004) {
            formatStyleWrongPincode(pincode, errorMessage, 'Mã pin không chính xác (5/5).\nTài khoản của bạn đã bị khóa, thử lại sau 60 phút.');
            addBorderStyle('pin', "RED");
            for (i = 1; i <= 4; i++) {
                $("#pin" + i).attr('disabled', true);
            }
            btnSubmitPin.disabled = true;
        }
    });
}

// Done +++
function showFormSetupPin(element, screen, token) {
    disableEnterKey();
    // showHeader();
    var html = `<div class='form-card showFormSetupPin ${screen}' >
                    <form id='formSetupPinCode'>
                        ${screen === 'SHOW_RESET_PIN' ? "<div class='voolo-logo'></div>" : ''}
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
    $(element).css("display", "grid");
    $(element).html(html);
    if (screen !== '' && screen === 'SHOW_LOGIN') {
        showProcessPipeline(2, true);
    }
    pageTitle(element, '<h4 class="pageTitle">Cài đặt mã PIN của bạn</h4>', 'non-pageTitle');

    let iPut1, iPut2 = false;
    $('#btnSubmitPin').attr("disabled", true);

    new PincodeInput("#pincode", {
        count: 4,
        secure: true,
        pattern: '[0-9]*',
        previewDuration: -1,
        inputId: 'pin',
        onInput: (value) => {
            if (value.length == 4) {
                iPut1 = true;
                if (iPut1 && iPut2) {
                    $('#btnSubmitPin').attr("disabled", false);
                }
                else {
                    $('.pincode-input').removeClass('error_pincode_gray');
                    $('#btnSubmitPin').attr("disabled", true);
                }
            }
        }
    });

    new PincodeInput("#repincode", {
        count: 4,
        secure: true,
        pattern: '[0-9]*',
        previewDuration: -1,
        inputId: 'pincf',
        onInput: (value) => {
            if (value.length == 4) {
                iPut2 = true;
                if (iPut1 && iPut2) {
                    $('#btnSubmitPin').attr("disabled", false);
                }
                else {
                    $('.pincode-input').removeClass('error_pincode_gray');
                    $('#btnSubmitPin').attr("disabled", true);
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

        if (pin === pincf && pin !== null && pincf !== null) {
            if (screen === 'SHOW_LOGIN') {
                const data = JSON.parse(sessionStorage.getItem('personal_all_info'));
                const front_nid_image = sessionStorage.getItem('front-image');
                const back_nid_image = sessionStorage.getItem('back-image');
                const selfie_image = sessionStorage.getItem('selfie-image');
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
                if (result.status === true) {
                    alert('Add Infomation Personal Success');
                    $("body").removeClass("loading");
                    showContract(element);
                }
                else {
                    alert('Add Infomation Personal Failure');
                    $("body").removeClass("loading");
                }
            }
            else if (screen === 'SHOW_RESET_PIN') {
                let phone = sessionStorage.getItem('phone');
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
            var pincode = document.querySelector('#pincode');
            var errorMessage = document.querySelector('.error_message');
            formatStyleWrongPincode(pincode, errorMessage, 'Mã pin không trùng khớp vui lòng thử lại !');
            addBorderStyle('pin', "RED");
            $("body").removeClass("loading");
        }
    })
}

function resendOTP(phone) {
    let otp = sendOtp(phone);
    if (otp !== null) {
        console.log('Mã OTP của bạn là: ' + otp.otp);
    }
}

// Done +++
function showFormVerifyOTP(element, phone, otp, screen) {
    disableEnterKey();
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
                            <button type='button' id='btnSubmitVerifyOTP' class='payment-button'>Xác nhận</button>
                            <p style='text-align: center;' class='compact-12'>Không nhận được OTP?  <a class="ahref" onclick='resendOTP("${phone}")' style='width:auto'>Gửi lại OTP (<c id="timer"></c>)</a></p>
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

    $('span.close').click(function () {
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
                let phone_reset = sessionStorage.getItem('phone_reset');
                let nid_reset = sessionStorage.getItem('nid_reset');
                const data = verifyOtpPin(phone_reset, nid_reset, otp);
                console.log('Result Verify Otp Pin: ', data);
                if (data.status === true && data.token !== null) {
                    close_popup();
                    showFormSetupPin(element, 'SHOW_RESET_PIN', data.token);
                }
                else if (data.status === false && data.statusCode === 4000) {
                    if (data?.countFail !== 5) {
                        formatWrongOTP(errorMessage, 'Mã OTP không chính xác (' + data?.countFail + '/5)');
                        addBorderStyle('otp', 'RED');
                        btnSubmitVerifyOTP.disabled = true;
                    }
                    else {
                        formatWrongOTP(errorMessage, 'Mã OTP không chính xác (5/5). Vui lòng thử lại sau 60 phút');
                        addBorderStyle('otp', 'RED');
                        for (i = 1; i <= 6; i++) {
                            $("#otp" + i).attr('disabled', true);
                        }
                        btnSubmitVerifyOTP.disabled = true;
                    }
                }
                else if (data.status === false && data.statusCode === 3000) {
                    formatWrongOTP(errorMessage, 'Mã OTP đã hết hiệu lực. Vui lòng gửi lại OTP');
                    addBorderStyle('otp', 'RED');
                    btnSubmitVerifyOTP.disabled = true;
                }
                else if (data.status === false && data.errorCode === 1004) {
                    formatWrongOTP(errorMessage, 'Mã OTP không chính xác (5/5). Vui lòng thử lại sau 60 phút');
                    addBorderStyle('otp', 'RED');
                    for (i = 1; i <= 6; i++) {
                        $("#otp" + i).attr('disabled', true);
                    }
                    btnSubmitVerifyOTP.disabled = true;
                }
            }
            else if (screen === 'VERIFY_PHONE' && screen !== '') {
                var data = verifyOtp(phone, otp);
                console.log('Result Verify Phone', data);
                if (data.status === true) {
                    close_popup();
                    showCircularProgressbar('#voolo');
                }
                else if (data.statusCode === 4000 && data.status === false) {
                    if (data?.countFail !== 5) {
                        formatWrongOTP(errorMessage, 'Mã OTP không chính xác (' + data?.countFail + '/5)');
                        addBorderStyle('otp', 'RED');
                        btnSubmitVerifyOTP.disabled = true;
                    }
                    else {
                        formatWrongOTP(errorMessage, 'Mã OTP không chính xác (5/5). Vui lòng thử lại sau 60 phút');
                        addBorderStyle('otp', 'RED');
                        addBorderStyle('otp', 'RED');
                        for (i = 1; i <= 6; i++) {
                            $("#otp" + i).attr('disabled', true);
                        }
                        btnSubmitVerifyOTP.disabled = true;
                    }
                }
                else if (data.statusCode === 3000 && data.status === false) {
                    formatWrongOTP(errorMessage, 'Mã OTP đã hết hiệu lực. Vui lòng gửi lại OTP');
                    addBorderStyle('otp', 'RED');
                    btnSubmitVerifyOTP.disabled = true;
                }
                else if (data.errorCode === 1004 && data.status === false) {
                    formatWrongOTP(errorMessage, 'Mã OTP không chính xác (5/5). Vui lòng thử lại sau 60 phút');
                    addBorderStyle('otp', 'RED');
                    for (i = 1; i <= 6; i++) {
                        $("#otp" + i).attr('disabled', true);
                    }
                    btnSubmitVerifyOTP.disabled = true;
                }
            }
        }
    });
}

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
    disableEnterKey();
    setRoute("showContract");
    let data = getContract();
    var html = `<div class='contractForm'>
                    <div class='box form-card-2'>
                        <div class='contract-title'><h2>Mẫu hợp đồng</h2></div>
                        <div style='display: block'  class='contract-detail'>
                            <h3>${data.title1}</h3>
                            <h3>${data.title2}</h3>
                            <p>${data.content}</p>
                        </div>
                        <div class='contract-term'>
                            <label for='confirm_contract' class='compact-12'>
                                <input type='checkbox' name='confirm_contract' id='confirm_contract' />
                                Tôi đồng ý với Điều kiện và Điều khoản hợp đồng
                            </label>
                        </div>
                        <div class='contract-term'>
                            <label for='confirm_otp' class='compact-12'>
                                <input type='checkbox' name='confirm_otp' id='confirm_otp'/> 
                                Vui lòng gửi OTP xác nhận về số điện thoại đã đăng ký VOOLO của tôi
                            </label>
                        </div>
                    </div>
                    <button type='button' id='btnContinue' class='payment-button medium'>Tiếp tục</button>
            </div>`;
    $(element).html(html).removeClass('non-flex');
    showProcessPipeline(3, true);

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
            let phone = sessionStorage.getItem('phone');
            var otp = sendOtp(phone);
            if (otp !== null) {
                showFormVerifyOTP(element, phone, otp.otp, 'VERIFY_PHONE');
                $('body').addClass('popup');
            }
        }
    })
}

// Done +++
function customerInfo(element, status = true) {
    disableEnterKey();
    var strStatus = ``;
    if (status) {
        strStatus = `
        <div class='ico-success'></div >
        <b>Chúc mừng bạn, với hạn mức tín dụng này bạn đủ điều kiện để hoàn tất đơn hàng.</b>
        `;
    }
    else {
        strStatus = `
            <div class='ico-unsuccess'></div>
            <b>Rất tiếc, với hạn mức tín dụng này bạn không đủ điều kiện để hoàn tất đơn hàng.</b>
        `;
    }
    var str = `<div class="customer" >
                    <div class='voolo-logo'></div>
                    <div id="customerInfo">
                        <div class="avatar"><img src="${customer.avatar}" /></div>
                        <div class='detail'>
                            <h3 style="font-weight:700;font-size:20px;">${customer.name}, <c>ơi!</c></h3>
                            <p class='limit-text'>Hạn mức tín dụng của bạn là : <span class='limit-number'>${formatCurrency(customer.limit * 1)}</span></p>
                            ${strStatus}
                        </div>
                    </div>
                </div> `;
    if ($(window).width() < 700) {
        $(element).prepend(str);
        $(element).find(".avatar").css("display", "none");
        $(element).find(".list-items").css("margin-top", "212px");
        $(element).find(".detail h3").css({ "font-weight": "600", "font-size": "18px" });
    }
    else {
        $(element).prepend(str);
        $(element).find(".list-items").css({ "margin-top": "410.5px", "padding-top": "0" });
        $(element).find(".formValue").css("margin-top", "410.5px");
        $(element).find(".avatar").css("display", "none");
        $(element).find(".detail h3").css({ "font-weight": "700", "font-size": "20px" });
    }
}

// Done +++
function showProcessPipeline(step, logo = false, formName = '') {
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
        <div class='headrow' >
            ${(logo) ? '<div class="voolo-logo"></div>' : ''}
            <div class='sub2'>Chào mừng bạn đến với quy trình đăng ký Mua trước Trả sau</div>
            <div class='line'>
                <span class='Tpipe ${(step !== 1) ? s1 : ""}'></span>
                <span class='Tpipe ${s3}'></span>
                <span class='Tpipe ${s4}'></span>
                <span class='Tpipe ${s5}'></span>
                <span class='Tpipe last'></span>
            </div>
            <div class='pipeline'>
                <span class='pipe ${s1}'><span class='label-span'>Thông tin khách hàng</span></span>
                <span class='pipe ${s2}'><span class='label-span'>Cài đặt PIN</span></span>
                <span class='pipe ${s3}'><span class='label-span'>Ký điện tử</span></span>
                <span class='pipe ${s4}'><span class='label-span'>Xác minh thông tin</span></span>
                <span class='pipe ${s5}'><span class='label-span'>Hoàn thành</span></span>
            </div>
        </div>`;

    $('#voolo').prepend(pipeline);
    if (formName !== '') $('#voolo').addClass(formName);
    $('.formValue').addClass("formValue-mt");
    $('.form-card').addClass("formValue-mt");
    $('.box').addClass("formValue-mt");
}

// Done +++
function setRoute(func) {
    history.pushState({}, "Voolo Set Url", "#" + func);
}

// Done +++
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

// Done +++
function messageScreen(element, config) {
    if (config.screen == 'successScreen') {
        html = `<div class='box showMessage formValue-mt-315'>
                    <div class='paragraph-text text-center margin-bottom-default'>
                        <div class='ico-success ico-150'></div>
                        <h3>Bạn đã đăng ký thành công</h3>
                        <p style='text-align: center;' class='text-message'>
                            Bấm vào <a class="ahref" href="${DOMAIN}" style='width:auto'>đây</a> để quay trở lại. <span>Tự động trở lại trang mua hàng sau <c class='coutdown'>5</c>s.</span>
                        </p>
                    </div> 
                </div>`;
    }

    if (config.screen == 'unsuccessScreen') {
        html = `<div class='box showMessage formValue-mt-315'>
                    <div class='paragraph-text text-center margin-bottom-default'>
                        <div class='ico-unsuccess ico-150'></div>
                        <h3>Đăng ký không thành công</h3>
                        <p style='text-align: center;' class='text-message'>
                            Bấm vào <a class="ahref" href="${DOMAIN}" style='width:auto'>đây</a> để quay trở lại.<span> Tự động trở lại trang mua hàng sau <c class='coutdown'>5</c>s.</span>
                        </p>
                    </div> 
                </div>`;
    }

    if (config.screen == 'pincode_unsuccess') {
        html = `<div class='box showMessage'>
                    <div class='paragraph-text text-center margin-bottom-default'>
                        <div class='ico-unsuccess ico-150'></div>
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
        html = `<div class='box box-mobile showMessage ${config.screen}' >
                    <div class='paragraph-text text-center margin-bottom-default'>
                        <div class='ico-success ico-150'></div>
                        <h3>Chúc mừng bạn đã <span>mua hàng thành công</span></h3>
                        <div class='id_bill'>Mã thanh toán: <a class='link_id_bill'>ABC-200305-0306-F94C</a></div>
                        <p style='text-align: center;'>
                            Bấm vào <a class="ahref" href="${DOMAIN}" style='width:auto'>đây</a> để quay trở lại. <span>Tự động trở lại trang mua hàng sau <c class='coutdown'>5</c>s.</span>
                        </p>
                    </div>
                </div>`;
    }

    if (config.screen == 'buy_unsuccess') {
        html = `<div class='box box-mobile showMessage' >
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
    if (config.pipeline) showProcessPipeline(5, true);
    var n = 5;
    var cInterval = setInterval(function () {
        $(".coutdown").html(n);
        if (n === 0) {
            if (config.screen == 'successScreen') {
                showAllTenor(element, 3);
            }
            if (config.screen == 'buy_success' || config.screen == 'pincode_success') {
                // window.location.href = DOMAIN;
            }
            clearTimeout(cInterval);
        }
        n = n - 1;
    }, 1000);
};

// Done +++
String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

// Done +++
$("#tryagain").on("click", function () {
    window.location.href = DOMAIN;
});

// Done +++
function close_popup() {
    $('body').removeClass('popup');
    $('body .overlay-popup').remove();
}