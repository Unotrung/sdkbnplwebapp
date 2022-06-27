const arrType_front = ["cccd_chip_front", "cccd_front", "cmnd_old_front"];
const arrType_back = ["cccd_chip_back", "cmnd_new_cccd_back", "cmnd_old_back"];
let billTotal = 0;
let customer = { avatar: './assets/img/avatar.png', limit: '50000000', name: 'Trung' };

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
    var html = `<div class='box' style='margin-top:200px'>
                    <div class='paragraph-text text-center margin-bottom-default'>
                    <div class="imgloading-140"></div>
                    <h2>Đang trong tiến trình xác minh thông tin</h2>
                    <p style='text-align: center;'>
                        <a class="ahref" href="#showmess" style='width:auto'>Trở lại thành công</a>
                    </p> 
                    </div> 
                </div>`;
    $(element).html(html);
    showProcessPipeline(4);
    $("body").removeClass("loading");
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
function formatStyleCorrectInput(data, errorMessage, btn) {
    data.style.borderColor = '#197DDE';
    errorMessage.innerHTML = '';
    errorMessage.style.visibility = 'hidden';
    errorMessage.style.opacity = '0';
    btn.style.backgroundColor = '#000000';
    btn.disabled = false;
}

// Done +++
function formatStyleWrongInput(data, errorMessage, btn, content) {
    data.style.borderColor = '#EE4D2D';
    errorMessage.innerHTML = content;
    errorMessage.style.visibility = 'visible';
    errorMessage.style.opacity = '1';
    btn.disabled = true;
    btn.style.backgroundColor = 'rgba(154, 147, 147, 0.1)';
}

// Done +++
function showUICheckPhone(element) {
    setRoute("showUICheckPhone");
    var html = `<form id='formValuePhone' class='formValue'>
                    <div class='mobile'>

                        <div class='form__row'>
                            <label for='phone'>Vui lòng nhập số điện thoại để để tiếp tục</label>
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

    dataPhone.oninput = function () {
        if (dataPhone.value !== null && dataPhone.value !== '') {
            formatStyleCorrectInput(dataPhone, errorMessage, btnSubmitPhone);
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
                    formatStyleWrongInput(dataPhone, errorMessage, btnSubmitPhone, 'Định dạng số điện thoại không hợp lệ');
                    return;
                }
                else if (result.errCode === 1008 && result.status === false) {
                    formatStyleWrongInput(dataPhone, errorMessage, btnSubmitPhone, 'Bạn đã nhập sai otp 5 lần. Vui lòng đợi 60 phút để thử lại !');
                    return;
                }
                else if (result.errCode === 1004 && result.status === false) {
                    formatStyleWrongInput(dataPhone, errorMessage, btnSubmitPhone, 'Bạn đã đăng nhập thất bại 5 lần. Vui lòng đợi 60 phút để thử lại !');
                    return;
                }
            })
        }
        else {
            formatStyleWrongInput(dataPhone, errorMessage, btnSubmitPhone, 'Vui lòng nhập số điện thoại');
        }
    }
}

// Done +++
function showUICheckNid(element) {
    setRoute("showUICheckNid");
    var html = `<form id='formValueNid' class='formValue '>
                    <div class='mobile'>

                        <div class='form__row'>
                            <label for='nid'>Vui lòng nhập số CMND/CCCD</label>
                            <input type='number' id='nid' class='input-global' />
                            <span class='error_message'></span>
                        </div>

                        <h3>Chụp ảnh chân dung</h3>
                        <button type='button' id='callHP' class='btnCapture'></button>
                        <button type='button' id='btnSubmitNid' class='payment-button'>Tiếp tục</button>

                    </div>
                </form>`;
    $(element).html(html);

    $('#callHP').click(function () {
        runFaceCaptureScreen();
    })

    $('#selfie_image').click(function () {
        deleteImage('SELFIE');
    });

    var dataNid = document.querySelector('#nid');

    var errorMessage = document.querySelector('.error_message');

    var btnSubmitNid = document.querySelector('#btnSubmitNid');
    btnSubmitNid.disabled = true;

    var checkSelfieImage = localStorage.getItem('selfie-image');

    var btnCapture = document.querySelector('#callHP');

    dataNid.oninput = function () {
        if (dataNid.value !== null && dataNid.value !== '') {
            // if (btnCapture.clicked === true) {
            formatStyleCorrectInput(dataNid, errorMessage, btnSubmitNid);
            $('#btnSubmitNid').click(function () {
                let data = $('#nid').val();
                localStorage.setItem('nid', data);
                let result = checkNidExists(data);
                console.log('Check nid exists: ', result);
                if (result.statusCode === 1000 && result.status === true && checkSelfieImage !== null) {
                    formatStyleWrongInput(dataNid, errorMessage, btnSubmitNid, 'Chứng minh nhân dân này đã tồn tại trong hệ thống !');
                    return;
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
                    formatStyleWrongInput(dataNid, errorMessage, btnSubmitNid, 'Định dạng chứng minh nhân dân không hợp lệ !');
                    return;
                }
            })
            // }
            // else {
            //     alert('Vui lòng chụp ảnh selfie');
            // }
        }
        else {
            formatStyleWrongInput(dataNid, errorMessage, btnSubmitNid, 'Vui lòng nhập CMND/CCCD');
        }
    }
}

// Done +++
function captureNidFrontAndBack(element) {
    setRoute("captureNidFrontAndBack");
    var html = `<form class='formValue'>
                    <div class='buttons mobile'>
                        <label for=''>Chụp ảnh CMND/CCCD 2 mặt</label>
                        <div>
                        <button type='button' id='btnCaptureFront' class='btnCapture'><label class='caption'>CMND mặt trước</label></button>
                        <button type='button' id='btnCaptureBack' class='btnCapture'><label class='caption'>CMND mặt sau</label></button>
                        </div>
                        <button type='button' id='btnSubmit' class='payment-button'>Tiếp tục</button>
                    </div>
                </form> `;
    $(element).html(html);
    showProcessPipeline(1);

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
            alert('Vui lòng chụp cmnd mặt trước rùi mới chụp mặt sau !');
            return;
        }
    })

    let btnCaptureFront = document.querySelector('#btnCaptureFront');
    let btnCaptureBack = document.querySelector('#btnCaptureBack');
    let btnSubmit = document.querySelector('#btnSubmit');
    btnSubmit.disabled = true;
    btnSubmit

    let frontImage = localStorage.getItem('front-image');
    let backImage = localStorage.getItem('back-image');

    // if (btnCaptureFront.clicked === true && btnCaptureBack.clicked === true) {
    btnSubmit.disabled = false;
    $('#btnSubmit').click(function () {
        let adn = JSON.parse(localStorage.getItem('allDataNid'));
        if (adn !== null && adn !== '') {
            let fn = adn?.front_nid_customer;
            let bn = adn?.back_nid_customer;
            if (fn !== null && bn !== null) {
                let personal = new Personal(fn.name, fn.gender, localStorage.getItem('phone'), fn.dob, fn.idNumber, bn.doi, fn.doe, fn.province, fn.district, fn.ward, fn.street);
                showDataInform('#test', personal);
            }
            else if (fn === null) {
                alert('Không tìm thấy thông tin cmnd mặt trước !');
                return;
            }
            else if (bn === null) {
                alert('Không tìm thấy thông tin cmnd mặt sau !');
                return;
            }
        }
    })
    // }
    // else {
    //     btnSubmit.disabled = true;
    //     alert('Vui lòng chụp đủ 2 mặt chứng minh nhân dân');
    //     return;
    // }
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
        if (infomation !== null) {
            const { status, statusCode, result } = infomation;
            const details = result?.details[0]?.fieldsExtracted;
            const nidType = result?.details[0]?.type;
            let front_nid_customer = '';
            let back_nid_customer = '';
            // FRONT NID IMAGE
            if (arrType_front.includes(nidType) && nidType !== null) {
                localStorage.setItem('typeFrontNid', nidType);
                let province = details?.province?.value;
                let idNumber = details?.idNumber?.value;
                let name = details?.name?.value;
                let dob = details?.dob?.value;
                let homeTown = details?.homeTown?.value;
                let permanentAddress = details?.permanentAddress?.value;
                let street = details?.permanentAddress?.value.split(',')[0] ? details?.permanentAddress?.value.split(',')[0] : '';
                let ward = details?.permanentAddress?.value.split(',')[1] ? details?.permanentAddress?.value.split(',')[1] : '';
                let district = details?.permanentAddress?.value.split(',')[2] ? details?.permanentAddress?.value.split(',')[2] : '';
                let city = details?.permanentAddress?.value.split(',')[3] ? details?.permanentAddress?.value.split(',')[3] : '';
                let gender = details?.gender?.value;
                let doe = details?.doe?.value;
                let nationality = details?.nationality?.value;
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
            if (arrType_back.includes(nidType) && nidType !== null) {
                let typeFrontNid = localStorage.getItem('typeFrontNid');
                if ((typeFrontNid === 'cccd_chip_front' && nidType === 'cccd_chip_back') || (typeFrontNid === 'cccd_front' && nidType === 'cmnd_new_cccd_back') || (typeFrontNid === 'cmnd_old_front' && nidType === 'cmnd_back_front')) {
                    let doi = details?.doi?.value;
                    let placeOfIssue = details?.placeOfIssue?.value;
                    back_nid_customer = {
                        doi: doi,
                        placeOfIssue: placeOfIssue
                    }
                    localStorage.setItem('back_nid_customer', JSON.stringify(back_nid_customer));
                }
                else {
                    alert('Hai mặt chứng minh nhân dân không phù hợp và trùng khớp !');
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
            return allDataNid;
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
                if (imageBase64 !== '' && imageBase64 !== null) {
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
        let applyFrontNid = side === 'FRONT' && side !== 'BACK' && side !== '';
        let applyBackNid = side === 'BACK' && side !== 'FRONT' && side !== '';
        if (applyFrontNid) {
            hvDocConfig.setOCRDetails("https://vnm-docs.hyperverge.co/v2/nationalID", hvDocConfig.DocumentSide.FRONT, {}, {});
        }
        else if (applyBackNid) {
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
                if (imageBase64 !== '' && imageBase64 !== null) {
                    if (applyFrontNid) {
                        localStorage.setItem('front-image', imageBase64);
                        postNationalID(imageBase64);
                        showCapture(imageBase64, "btnCaptureFront");
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
    const data = getAllTenor();
    let tenors = data.data;
    count = nCount === 0 ? tenors.length : nCount;
    html += `<form class='formValue orderTop'> `;
    for (var i = 0; i < count; i++) {
        html += `
        < div class='voolo-intro tenor-list' data - id='${tenors[i]._id}' onclick = 'selectTenor(this)' >
            <div class'tenor-item' >
                <h3>KÌ HẠN 1</h3>
                    <ul>
                        <li>Giá sản phẩm: ${formatCurrency(billTotal)}</li>
                        <li>Phí chuyển đổi: ${formatCurrency(tenors[i].convertFee)}</li>
                        <li>Thời gian thanh toán: ${tenors[i].paymentSchedule} ngày</li>
                    </ul>
                <p></p>
                <p></p>
            </div >
        </ > `
    }
    if (count <= 3 && tenors.length > 3) html += `< a onclick = 'showAllTenor("${element}",0)' class='ahref' > Hiển thị thêm</ > `;
    html += `< button type = 'button' id = 'btnContinue' class='payment-button' > Tiếp tục</ ></form > `;
    $(element).html(html);

    // show list productions
    listProductions({
        element: element,
        items: true,
        dataItems: pData
    });

    customerInfo(element);

    $('#btnContinue').click(function () {
        let phone = localStorage.getItem('phone');
        showFormPincode(element, phone, 'SHOW_TENOR');
    });
};

// Done +++
function showAllProvider(element) {
    let html = `<div class='box'> <div class='paragraph-text text-center margin-bottom-default'><h3>Chọn nhà cung cấp BNPL</h3><p>Mua trước Trả sau cùng</p></div>`;
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
    return;
}

// Done +++
function selectProvider() {
    showUICheckPhone('#test');
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
                        Bấm vào <a class="ahref" href="/" style='width:auto'>đây</a> để quay trở lại. Tự động trở lại trang mua hàng sau 5s.
                        </p>
                    </div> 
                </div> `;
    $(element).html(html);
}

// Done +++
function showStatusPage(element, message, imagePath, desc, step) {
    $(element).empty();
    showHeader();
    showProcessPipeline(step);
    var html = `< div class='container-status-page' >
                    <img src='${imagePath}' class='container-status-page-img'/>
                    <h1 class='container-status-page-title'>${message}</h1>
                    ${desc !== null && desc !== '' ? `<p class='container-status-page-desc'>${desc}</p>` : ''} 
                </ > `;
    $(element).prepend(html);

    $('body').click(function () {
        showStatusPage(element, 'Bạn đã đăng ký thành công', './assets/img/Success.png', 'Bấm vào đây để quay trở lại. Tự động trở lại trang mua hàng sau 5s.', 4);
    })
}

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

function showErrorMessage(input, message) {
    console.log('showErrorMessage');
    let parent = input.parentElement;
    console.log('Parent: ', parent);
    let inputEle = parent.querySelector('input');
    console.log('Input Ele: ', inputEle);
    inputEle.style.borderColor = '#EE4D2D';
    let spanError = parent.querySelector('span');
    console.log('Span Error: ', spanError);
    spanError.innerText = message;
    spanError.style.visibility = 'visible';
    spanError.style.opacity = '1';
}

function showSuccessMessage(input) {
    console.log('showSuccessMessage');
    let parent = input.parentElement;
    console.log('Parent: ', parent);
    let inputEle = parent.querySelector('input');
    if (inputEle !== null && inputEle !== undefined) {
        console.log('Input Ele: ', inputEle);
        inputEle.style.borderColor = '#197DDE';
    }
    let spanError = parent.querySelector('span');
    console.log('Span Error: ', spanError);
    spanError.innerText = '';
    spanError.style.visibility = 'hidden';
    spanError.style.opacity = '0';;
}

function checkEmptyError(listInput) {
    console.log('LIST INPUT: ', listInput);
    let isEmptyError = false;
    listInput.forEach(input => {
        console.log('Input: ', input);
        input.value = input.value.trim();
        if (input.value === null && input.value === '') {
            isEmptyError = true;
            showErrorMessage(input, 'Vui lòng không để trống');
        }
        else {
            showSuccessMessage(input);
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
            alert('Không tìm thấy thông tin cmnd mặt trước !');
            return;
        }
        else if (bn === null) {
            alert('Không tìm thấy thông tin cmnd mặt sau !');
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
                    <p class='form-showdata-title'>Nhập thông tin cá nhân</p>
                    <p class='form-showdata-desc'>Vui lòng điền các trường thông tin bên dưới</p>
                    <form class='' id='formDataValue'>
                        <div class="card">
                            <div class="card-head">
                                <h3 class='form-showdata-info'>Thông tin cá nhân</h3>
                            </div>
                            <div class="card-body">
                                <div class='form-row'>
                                    <label for='fullname'>Họ và tên</label>
                                    <input class='input-global' type='text' id='fullname' name='fullname' value="${conditionFullname ? fullname : ''}" ${conditionFullname ? 'disabled' : ''} />
                                    <span class='error_fullname error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='phone'>Số điện thoại</label>
                                    <input class='input-global' type='phone' id="phone" name="phone" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" value="${conditionPhone ? phone : ''}"  ${conditionPhone ? 'disabled' : ''} />
                                    <span class='error_phone error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='dob'>Ngày sinh</label>
                                    <input class='input-global' type='date' id='dob' name='dob' value="${conditionDob ? dob : ''}" ${conditionDob ? 'disabled' : ''} />
                                    <span class='error_dob error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='gender'>Giới tính</label>
                                    <select id='gender' name='gender' class='input-global' ${conditionGender ? 'disabled' : ''}>
                                        <option value="${conditionGender ? personal.gender : ''}">${(gender === 'M' ? 'Nam' : 'Nữ') ? (gender === 'M' ? 'Nam' : 'Nữ') : ''}</option>
                                    </select>
                                    <span class='error_gender error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='nid'>Số CMND/CCCD</label>
                                    <input class='input-global' type='number' id='nid' name='nid' value="${conditionNid ? nid : ''}" ${conditionNid ? 'disabled' : ''}/>
                                    <span class='error_nid error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <div class="form-cell">
                                        <label for='doi'>Ngày cấp</label>
                                        <input class='input-global' type='text' id='doi' name='doi' value="${conditionDoi ? doi : ''}" ${conditionDoi ? 'disabled' : ''}/>
                                        <span class='error_doi error_message'></span>
                                    </div>
                                    <div class="form-cell">
                                        <label for='doe'>Ngày hết hạn</label>
                                        <input class='input-global' type='text' id='doe' name='doe' value="${conditionDoe ? doe : ''}" ${conditionDoe ? 'disabled' : ''} />
                                        <span class='error_doe error_message'></span>
                                    </div>
                                </div>
                            </div >
                            <div class="card-footer"></div>
                        </div >
                        <div class="card">
                            <div class="card-head">
                                <h3>Địa chỉ hiện tại</h3>
                            </div>
                            <div class="card-body">
                                <div class='form-row sCity'>
                                    <label for='city'>Thành phố/Tỉnh</label>
                                    <input class='input-global' type='text' id='city' name='city' value="${conditionCity ? city : ''}" ${conditionCity ? 'disabled' : ''}/>
                                    <span class='error_city error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='district'>Quận/Huyện</label>
                                    <input class='input-global' type='text' id='district' name='district' value="${conditionDistrict ? district : ''}" ${conditionDistrict ? 'disabled' : ''}/>
                                    <span class='error_district error_message'></span>
                                </div >
                                <div class='form-row'>
                                    <label for='ward'>Phường</label>
                                    <input class='input-global' type='text' id='ward' name='ward' value="${conditionWard ? ward : ''}" ${conditionWard ? 'disabled' : ''} />
                                    <span class='error_ward error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='street'>Đường</label>
                                    <input class='input-global' type='text' id='street' name='street' value="${conditionStreet ? street : ''}" ${conditionStreet ? 'disabled' : ''} />
                                    <span class='error_street error_message'></span>
                                </div>
                            </div >
                            <div class="card-footer"></div>
                        </div >
                        <div class="card">
                            <div class="card-head">
                                <h3>Thông tin tham chiếu</h3>
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
                                    <input class='input-global' type='text' id="fullname_ref" name="fullname_ref"/>
                                    <span class='error_fullname_ref error_message'></span>
                                </div>
                                <div class='form-row'>
                                    <label for='phone_ref'>Số điện thoại</label>
                                    <input class='input-global ' type='phone' id='phone_ref' name='phone_ref' pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"/>
                                    <span class='error_phone_ref error_message'></span>
                                </div>
                            </div>
                            <div class="card-footer"></div>
                        </div>

                    <div class="card">
                        <div class="card-head">
                            <h3>Địa chỉ tạm trú</h3>
                        </div>
                        <div class="card-body">
                            <div class='form-row'>
                                <label for='city_permanent'>Thành phố/Tỉnh</label>
                                <input class='input-global' type='text' id='city_permanent' name='city_permanent' />
                                <span class='error_city_permanent error_message'></span>
                            </div>
                            <div class='form-row'>
                                <label for='district_permanent'>Quận/Huyện</label>
                                <input class='input-global' type='text' id='district_permanent' name='district_permanent' />
                                <span class='error_district_permanent error_message'></span>
                            </div>
                            <div class='form-row'>
                                <label for='ward_permanent'>Phường</label>
                                <input class='input-global' type='text' id='ward_permanent' name='ward_permanent' />
                                <span class='error_ward_permanent error_message'></span>
                            </div>
                            <div class='form-row'>
                                <label for='street_permanent'>Đường</label>
                                <input class='input-global' type='text' id='street_permanent' name='street_permanent' />
                                <span class='error_street_permanent error_message'></span>
                            </div>
                        </div>
                        <div class="card-footer"></div>
                    </div>
                        <button type='submit' class='payment-button' id='btnContinue'>Tiếp tục</button>
                    </form >
                </div > `;
    $(element).html(html);
    //show progress bar
    showProcessPipeline(1);

    // var text1 = personal.city;
    // $("#city").filter(function () {
    //     //may want to use $.trim in here
    //     return $(this).text() == text1;
    // }).prop('selected', true);

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

        if (isCheckEmpty) {
            if (personal_all_info !== null) {
                localStorage.setItem('personal_all_info', JSON.stringify(personal_all_info));
                showConfirmDataInform(element, personal_all_info);
            }
            else {
                alert('Không tìm thấy thông tin người dùng ! Vui lòng kiểm tra lại');
                return;
            }
        }

    })

    // $('#btnContinue').click(function () {

    // })
}

// Done +++
function handleChangeCity(ele1, ele2) {
    // $('body').addClass('loading');
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
    // $('body').removeClass('loading');
}

// Done +++
function handleChangeWard(ele1, ele2) {
    // $('body').addClass('loading');
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
    // $('body').removeClass('loading');
}

// Done +++
function showConfirmDataInform(element, personal_all_info) {
    showHeader();
    var html = `<div class='form-card form-confirmdata'>
                    <p class='form-confirmdata-title'>Đối soát thông tin</p>
                    <p class='form-confirmdata-desc'>Vui lòng xác nhận các thông tin bên dưới</p>
                    <form class=''>
                        <div class="card">
                            <div class="card-head">
                                <h3 class='form-confirmdata-info'>Thông tin cá nhân</h3>
                            </div>
                            <div class="card-body">
                                <div class='form-row form-verify'>
                                    <label for='name'>Họ và tên</label>
                                    <div class="info">${personal_all_info.name}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='phone'>Số điện thoại</label>
                                    <div class="info">${personal_all_info.phone}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='birthday'>Ngày sinh</label>
                                    <div class="info">${personal_all_info.birthday}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='gender'>Giới tính</label>
                                    <div class="info">${personal_all_info.sex === 'M' ? 'Nam' : 'Nữ'}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='citizenId'>Số CMND/CCCD</label>
                                    <div class="info">${personal_all_info.citizenId}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='issueDate'>Ngày cấp</label>
                                    <div class="info">${personal_all_info.issueDate}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='doe'>Ngày hết hạn</label>
                                    <div class="info">${personal_all_info.expirationDate}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='doe'>Địa chỉ hiện tại</label>
                                    <div class="info">${personal_all_info.street}, ${personal_all_info.ward}, ${personal_all_info.district}, ${personal_all_info.city}</div>
                                </div>
                            </div >
                            <div class="card-footer"></div>
                        </div >
                        <div class="card">
                            <div class="card-head">
                                <h3>Thông tin tham chiếu</h3>
                            </div>
                            <div class="card-body">
                                <div class='form-row form-verify'>
                                    <label for='relationship'>Mối quan hệ </label>
                                    <div class="info">${personal_all_info.personal_title_ref_ui}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='name_ref'>Họ và tên</label>
                                    <div class="info">${personal_all_info.name_ref}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='phone_ref'>Số điện thoại</label>
                                    <div class="info">${personal_all_info.phone_ref}</div>
                                </div>
                            </div>
                            <div class="card-footer"></div>
                        </div>

                        <div class="card">
                            <div class="card-head">
                                <h3>Địa chỉ tạm trú</h3>
                            </div>
                            <div class="card-body">
                                <div class='form-row form-verify'>
                                    <label for='city_permanent'>Thành phố/Tỉnh</label>
                                    <div class="info">${personal_all_info.temporaryCity}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='district_permanent'>Quận/Huyện</label>
                                    <div class="info">${personal_all_info.temporaryDistrict}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='ward_permanent'>Phường</label>
                                    <div class="info">${personal_all_info.temporaryWard}</div>
                                </div>
                                <div class='form-row form-verify'>
                                    <label for='street_permanent'>Đường</label>
                                    <div class="info">${personal_all_info.temporaryStreet}</div>
                                </div>
                            </div>
                            <div class="card-footer"></div>
                        </div>
                        <div class="form-row" style="width: 100%;padding: 0;display: flex;">
                        <a href='#' class="btn-previous" onclick='showDataInform("${element}")'><c style="font-size:1.3em">&#8249;</c> Quay lại</a>
                        <button type='button' class='payment-button' id='btnContinueConfirm' style="margin-right:0;width:149px">Xác nhận</button>
                        </div>
                    </form>
                </div>`;
    $(element).html(html);
    //show progress bar
    showProcessPipeline(1);
    $(window).scrollTop(0);
    $('#btnContinueConfirm').click(function () {
        showFormSetupPin(element, 'SHOW_LOGIN');
    });
}

// Done +++
function configUi(config) {
    var iHtml = "";
    if (config.logo) iHtml += "<div class='voolo-logo'></div>";
    if (config.intro) iHtml += `
    <div class='voolo-intro'>
        <h2 class=''>VOOLO giúp bạn:</h2>
        <ul>
            <li>Mua sắm không giới hạn </li>
            <li>Thanh toán linh hoạt </li>
            <li>Hoàn tiền ngay chỉ trong 1 ngày </li>
        </ul>
    </div>
    <div _ngcontent-gse-c77="" class="paragraph-text text-center margin-bottom-default"> <p class='font-w-5'>VOOLO</p> <p>Mua trước Trả sau Không khoản trả trước</p><p>Nhẹ nhàng với 0% lãi suất </p></div>`;
    $(config.element + " form").prepend(iHtml);
}

// Done +++
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
                <p class='head-w-6 ellipsis'>`+ e.product + `</p>
                <p>`+ e.descript + `</p>
                <p>`+ e.quantity + `</p>
            </div>
            <div class='price head-w-6'>`+ e.priceShow + `</div>
        </div>`;
            total += parseInt(e.price);
        });
        var sTotal = total.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });

        //set total local
        billTotal = sTotal;
    }
    lItems += `<div class='list-items'>
        <div class='card'>
            <div class='card-head'><h2>Thông tin đơn hàng</h2></div>
            <div class='card-body'>
                `+ list + `
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
    if (base64) {
        $('#' + eId).addClass("showImage");
        $('#' + eId).css({
            'background': 'url(' + base64 + ') no-repeat center',
            'background-size': 'cover'
        });

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
function showFormPincode(element, phone, screen) {
    showLogo(63);
    var html = `
        < div class='form-card form-card-pincode' >
            <form id='formSetupPinCode'>
                <div class='card'>
                    <div class='card-head no-line'></div>
                    <div class='card-body text-center form-pincode'>
                        <h2>Nhập mã PIN</h2>
                        <p class=''>${screen === 'SHOW_TENOR' ? 'Vui lòng nhập mã PIN để thanh toán' : 'Vui lòng nhập mã PIN để xác thực thông tin'}</p>
                        <p class='paragraph-text-bold'>Mã PIN</p>
                        <div id='pincode'></div>
                    </div>
                    <div class='card-footer ' style='height:32px'></div>
                </div>
                <button type='button' id='btnSubmitPin' class='payment-button'>Tiếp tục</button>
                <p style='text-align: center;'>Quên mã PIN? <a class="ahref" onclick='forgotPinPhone("${element}","${phone}")' style='width:auto'>Nhấn vào đây</a></p>
            </form>
    </ > `;

    $(element).html(html);
    // $("body").removeClass("loading");

    new PincodeInput("#pincode", {
        count: 4,
        secure: true,
        pattern: '[0-9]*',
        previewDuration: 1,
        inputId: 'pin',
        onInput: (value) => {
            console.log(value)
        }
    });

    $('#btnSubmitPin').click(function () {

        // $("body").addClass("loading");

        let pin = $('#pin1').val().trim() + $('#pin2').val().trim() + $('#pin3').val().trim() + $('#pin4').val().trim();
        if (pin !== null && pin !== '') {
            let result = login(phone, pin);
            console.log('Result Show Form Pin code: ', result);

            //set cus info
            // customer.name = result.data.phone;
            // customer.limit = result.data.limit;
            // customer.avatar = result.data.avatar;
            //end set cus info

            if (result.status === true && result.data.step === 4) {
                switch (screen) {
                    default:
                        showMessage(element, '<h3>something wrong...</h3>', 'ico-unsuccess');
                    case "SHOW_TENOR":
                        showAllTenor(element, 3);
                        break;
                    case "SHOW_SUCCESS_PAGE":
                        showMessage(element, '<h3>Cập nhật mã PIN thành công</h3>', 'ico-success');
                        break;
                    case "BUY_SUCCESS":
                        showMessage(element, '<h3>Chúc mừng bạn đã mua hàng thành công</h3>', 'ico-success');
                        break;
                    case "BUY_UNSUCCESS":
                        showMessage(element, '<h3>Bạn đã mua hàng thất bại</h3>', 'ico-unsuccess');
                        break;
                }
            }
            // else if (result.status === true && result.data.step === 3) {
            //     showCircularProgressbar(element);
            //     return;
            // }
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
        // $("body").removeClass("loading");
    })
}

// Done +++
function showFormSetupPin(element, screen, token) {
    showHeader();
    var html = `
    <div class='form-card'>
    <form id='formSetupPinCode'>
        <div class=''>
            <div class=' no-line'></div>
                <div class='text-center form-pincode'>
                    <h2>${screen === 'SHOW_RESET_PIN' ? 'Reset lại mã PIN của bạn' : 'Cài đặt mã PIN của bạn'}</h2>
                    <p>Mã PIN</p>
                    <div id='pincode'></div>
                    <p>Nhập lại mã PIN</p>
                    <div id='repincode'></div>
                </div>
            <div class='' style="height: 39px;"></div>
        </div>
        <button type='button' id='btnSubmitPin' class='payment-button'>Tiếp tục</button>
    </form>
    </div>`;

    $(element).html(html);
    if (screen !== '' && screen === 'SHOW_LOGIN') {
        //show progress bar
        showProcessPipeline(2);
    }

    new PincodeInput("#pincode", {
        count: 4,
        secure: true,
        pattern: '[0-9]*',
        previewDuration: 1,
        inputId: 'pin',
        onInput: (value) => {
            console.log(value)
        }
    });

    new PincodeInput("#repincode", {
        count: 4,
        secure: true,
        previewDuration: 1,
        inputId: 'pincf',
        onInput: (value) => {
            console.log(value)
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
                    showMessage(element, "<h3>Cập nhật mã pin thành công</h3>", "ico-success");
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
function forgotPinPhone(element, phone) {
    var html = `< form id = 'formValuePhone' class='formValue' >
            <div class='mobile'>
                <div class='form__row'>
                    <h2 style="margin-bottom:40px">Số điện thoại</h2>
                    <label for='phone_reset'>Vui lòng nhập số điện thoại để để tiếp tục</label>
                    <input type='phone' id='phone_reset' class='form__input input-global' value="${phone}" />
                </div>
                <button type='button' id='btnContinue' class='payment-button'>Tiếp tục</button>

            </div>
                </ > `;
    $(element).html(html);

    //custom show
    configUi({
        element: element,
        logo: true,
        intro: false
    });

    $('#btnContinue').click(function () {
        let phone_reset = $('#phone_reset').val().trim();
        localStorage.setItem('phone_reset', phone_reset);
        forgotPinNid(element);
    });
}

// Done +++
function forgotPinNid(element) {
    var html = `< form class='formValue' >
            <div class='mobile'>

                <div class='form__row'>
                    <h2 style="margin-bottom:40px">Số CMND/CCCD</h2>
                    <label for='nid_reset'>Vui lòng nhập số CMND/CCCD</label>
                    <input type='number' id='nid_reset' class='form__input input-global' />
                </div>
                <button type='button' id='btnSendOtp' class='payment-button'>Tiếp tục</button>

            </div>
    </ > `;
    $(element).html(html);

    //custom show
    configUi({
        element: element,
        logo: true,
        intro: false
    });

    $('#btnSendOtp').click(function () {
        $("body").addClass("loading");
        localStorage.setItem('nid_reset', $('#nid_reset').val().trim());
        let phone_reset = localStorage.getItem('phone_reset');
        let nid_reset = localStorage.getItem('nid_reset');
        let data = sendOtpPin(phone_reset, nid_reset);
        console.log('Result Send Otp Pin: ', data);
        if (data.status === true) {
            showFormVerifyOTP(element, phone_reset, data.otp, 'RESET_PIN');
        }
        else if (data.status === false && data.message === 'Send otp failure') {
            alert('Mã Otp không hợp lệ. Vui lòng kiểm tra lại !');
            return;
        }
        else if (data.status === false && data.statusCode === 1002) {
            alert('Số điện thoại không hợp lệ. Vui lòng kiểm tra lại !');
            return;
        }
        else if (data.status === false && data.statusCode === 1001) {
            alert('Chứng minh nhân dân không hợp lệ. Vui lòng kiểm tra lại !');
            return;
        }
        else if (data.status === false && data.errorCode === 8000) {
            alert('Định dang data không hợp lệ. Vui lòng kiểm tra lại !');
            return;
        }
        $("body").removeClass("loading");
        return;
    })
}

// Done +++
function showFormVerifyOTP(element, phone, otp, screen) {
    console.log('Mã OTP của bạn là: ' + otp);
    var html = `<div class='form-card card-otpcode'>
                    <form id='formSetupPinCode'>
                        <div class='card'>
                            <div class='card-head no-line'></div>
                            <div class='card-body text-center form-otpcode'>
                                <h2>Nhập OTP</h2>
                                <p style="margin-bottom:32px">Mã OTP đã được gửi đến số điện thoại 090xxxx463</p>
                                <div id='otpcode'></div>
                            </div>
                            <div class='card-footer' style="height:32px"></div>
                        </div>
                        <button type='button' id='btnSubmitVerifyOTP' class='payment-button'>Tiếp tục</button>
                        <p style='text-align: center;'>Không nhận được OTP?  <a class="ahref" onclick='forgotPinPhone("${element}","${phone}")' style='width:auto'>Gửi lại OTP (<c id="timer"></c>)</a></p>
                    </form>
            </div>`;

    $(element).html(html);
    timer(60);
    new PincodeInput("#otpcode", {
        count: 6,
        secure: false,
        pattern: '[0-9]*',
        previewDuration: 100,
        inputId: 'otp',
        onInput: (value) => {
            console.log(value)
        }
    });

    //custom show
    configUi({
        element: element,
        logo: true,
        intro: false
    });

    $('#btnSubmitVerifyOTP').click(function () {
        // $("body").addClass("loading");
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
                    showFormSetupPin(element, 'SHOW_RESET_PIN', data.token);
                }
                else if (data.status === false && data.statusCode === 4000) {
                    alert('Mã OTP không hợp lệ !');
                    return;
                }
                else if (data.status === false && data.statusCode === 3000) {
                    alert('Mã OTP đã hết hạn !');
                    return;
                }
                else if (data.status === false && data.errorCode === 8000) {
                    alert('Định dạng số điện thoại không hợp lệ !');
                    return;
                }
            }
            else if (screen === 'VERIFY_PHONE' && screen !== '') {
                var data = verifyOtp(phone, otp);
                console.log('Result Verify Phone', data);
                if (data.status === true) {
                    showCircularProgressbar('#test');
                    // showStatusPage(element, 'Đang trong tiến trình xác minh thông tin', './assets/img/Loading.png', '', 3);
                }
                else if (data.statusCode === 4000 && data.status === false) {
                    alert("Bạn đã nhập OTP sai " + data?.countFail + " lần");
                    return;
                }
                else if (data.statusCode === 3000 && data.status === false) {
                    alert("Otp đã hết hạn ! Vui lòng gửi lại OTP");
                    return;
                }
            }
        }
        else {
            alert('Thiếu số điện thoại hoặc mã otp !');
            // $("body").removeClass("loading");
            return;
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
                    e.onKeyDown(t, s), "ArrowLeft" !== t.key && "ArrowRight" !== t.key && "ArrowUp" !== t.key && "ArrowDown" !== t.key && "Backspace" !== t.key && "Delete" !== t.key && e.cells[s].setAttribute("type", "text")
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
        // Do validate stuff here
        return;
    }
    // Do timeout stuff here
    // alert('Timeout for otp');
}

// Done +++
function showContract(element) {
    setRoute("showContract");
    let data = getContract();
    var html = `<div class='box formValue-mt'>
    <div style = 'display: block'>
                    <h1>${data.title1}</h1>
                    <h2>${data.title2}</h2>
                    <h2>${data.content}</h2>
                </div>
            <div style='display: block'>
                <input type='checkbox' name='confirm_contract' id='confirm_contract' />
                <span>Tôi đồng ý với Điều kiện và Điều khoản hợp đồng</span>
                <div/>
                <div style='display: block'>
                <input type='checkbox' name='confirm_otp' id='confirm_otp'/> 
                <span>Vui lòng gửi OTP xác nhận về số điện thoại đã đăng ký VOOLO của tôi</span>
                <div/>
                <button type='button' id='btnContinue'>Tiếp tục</button>
                </div></div>`;
    $(element).html(html);
    showProcessPipeline(3);
    $('#btnContinue').click(function () {
        let confirm_contract = $('#confirm_contract').is(":checked");
        let confirm_otp = $('#confirm_otp').is(":checked");
        if (confirm_contract && confirm_otp) {
            let phone = localStorage.getItem('phone');
            var otp = sendOtp(phone);
            if (otp !== null) {
                showFormVerifyOTP(element, phone, otp.otp, 'VERIFY_PHONE');
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
function customerInfo(element) {
    showLogo(56);
    var str = `<div class='voolo-logo'></div>
                <div id="customerInfo">
                    <div class="avatar"><img src="${customer.avatar}" /></div>
                    <div class='detail'>
                        <h3>${customer.name} ơi!</h3>
                        <p>Hạn mức tín dụng của bạn là :</p>
                        <h2>${formatCurrency(customer.limit * 1)}</h2>
                    </div>
                </div>`;
    if ($(window).width() < 700) {
        $(element).prepend(str);
    }
    else {
        $('.formValue').prepend(str);
    }
}

// Done +++
function showProcessPipeline(step) {
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
        <div class='voolo-logo'></div>
            <h3 style="margin-bottom:32px; font-size:24px">Chào mừng bạn đến với quy trình đăng ký Mua trước Trả sau</h3>
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

    $('#test').prepend(pipeline);
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
    var html = `<div id='img-voolo-logo' style='margin-bottom: ' ${mb}'px>
                <img src='./assets/img/VOOLO_logo_horizontal.png' />
            </div>`;
    return html;
};

// Done +++
function showTitle(mb) {
    var html = `<h1 id = 'voolo-title' > Chào mừng bạn đến với quy trình đăng ký Mua trước Trả sau</h1> `;
    return html;
};

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
            showAllTenor(element);
            break;

    }

}

/* 
* ex : messageScreen(element,{screen : "successScreen",pipeline:true});
*
**/

function messageScreen(element, config) {
    if (config.screen == 'successScreen') {
        html = `<div class='box showMessage formValue-mt'>
                    <div class='paragraph-text text-center margin-bottom-default'>
                        <div class='ico-success'></div>
                        <h3>Bạn đã đăng ký thành công</h3>
                        <p style='text-align: center;'>
                        Bấm vào <a class="ahref" href="/" style='width:auto'>đây</a> để quay trở lại. Tự động trở lại trang mua hàng sau 5s.
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
                        Bấm vào <a class="ahref" href="/" style='width:auto'>đây</a> để quay trở lại. Tự động trở lại trang mua hàng sau 5s.
                        </p>
                    </div> 
                </div>`;
    }
    if (config.screen == 'pincode_unsuccess') {
        html = `<div class='box showMessage formValue-mt'>
                    <div class='paragraph-text text-center margin-bottom-default'>
                        <div class='ico-unsuccess'></div>
                        <h3>Cập nhật mã PIN không thành công</h3>
                        <p>Vui lòng thử lại hoặc liên hệ <b>1900xxx</b> để được hỗ trợ.</p>
                        <button class='payment-button' id="tryagain">Thử lại</button>
                    </div> 
                </div>`;
    }
    if (config.screen == 'pincode_success') {
        html = `<div class='box showMessage formValue-mt'>
                    <div class='paragraph-text text-center margin-bottom-default'>
                        <div class='ico-success'></div>
                        <h3>Cập nhật mã PIN thành công</h3>
                        <p>Vui lòng thử lại hoặc liên hệ <b>1900xxx</b> để được hỗ trợ.</p>
                        <button class='payment-button' id="tryagain">Thử lại</button>
                    </div> 
                </div>`;
    }
    $(element).html(html);
    if (config.pipeline) showProcessPipeline(5);
}