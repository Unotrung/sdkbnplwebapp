const arrType_front = ["cccd_chip_front", "cccd_front", "cmnd_old_front"];
const arrType_back = ["cccd_chip_back", "cmnd_new_cccd_back", "cmnd_old_back"];

// Done +
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

// Done +
function onlyNumber(data) {
    var pin = /[^0-9]/gi;
    data.value = data.value.replace(pin, "");
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
        "<form id='formValuePhone' class='ng-untouched ng-pristine ng-invalid formValue'>" +
        "<div class='mobile'>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='phone'>Vui lòng nhập số điện thoại để để tiếp tục</label>" +
        "<input type='phone' id='phone' class='form__input input-global ng-pristine ng-invalid ng-touched' />" +
        "</div>" +

        "<button type='button' id='btnSubmitPhone' class='payment-button'>Tiếp tục</button>" +

        "</div>" +
        "</form>";
    $(element).html(html);

    //custom show
    configUi({
        element: element,
        logo: true,
        intro: true
    });

    // show list productions
    listProductions({
        element: "#test",
        items: true,
        dataItems: pData
    });

    $('#btnSubmitPhone').click(function () {
        let data = $('#phone').val();
        localStorage.setItem('phone', data);
        if (data !== null && data !== '') {
            let result = checkPhoneExists(data);
            console.log('Check phone exists: ', result);
            if (result.errCode === 1000) {
                let step = result.data.step;
                if (step === 4) {
                    showFormPincode(element, data, 'SHOW_TENOR');
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
        "<form id='formValueNid' class='formValue ng-untouched ng-pristine ng-invalid'>" +
        "<div class='mobile'" +

        "<label for='nid'>Vui lòng nhập số CMND/CCCD</label>" +
        "<input type='number' id='nid' class='input-global ng-pristine ng-invalid ng-touched' />" +

        "<h3>Chụp ảnh chân dung</h3>" +
        "<button type='button' id='callHP' class='btnCapture'></button>" +
        "<button type='button' id='btnSubmitNid' class='payment-button'>Tiếp tục</button>" +

        "</div>" +
        "</form>";
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
            console.log('Check nid exists: ', result);
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
            alert('Vui lòng nhập data nid !');
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

        "</div>" +
        "</form>";
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
            alert('Vui lòng chụp cmnd mặt trước rùi mới chụp mặt sau !');
            return;
        }
    })

    $('#btnSubmit').click(function () {
        let adn = JSON.parse(localStorage.getItem('allDataNid'));
        if (adn !== null && adn !== '') {
            let fn = adn?.front_nid_customer;
            let bn = adn?.back_nid_customer;
            if (fn !== null && fn !== '' && bn !== null && bn !== '') {
                let personal = new Personal(fn.name, fn.gender, localStorage.getItem('phone'), fn.dob, fn.idNumber, bn.doi, fn.doe, fn.province, fn.district, fn.ward, fn.street);
                showDataInform('#test', personal);
            }
            else if (fn === null) {
                alert('Không tìm thấy thông tin cmnd mặt trước');
                return;
            }
            else if (bn === null) {
                alert('Không tìm thấy thông tin cmnd mặt sau');
                return;
            }
        }
    })
}

// Done +
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

// Done +
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

// Done +
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

// Done +
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
                let province = details?.province?.value;
                let idNumber = details?.idNumber?.value;
                let name = details?.name?.value;
                let dob = details?.dob?.value;
                let homeTown = details?.homeTown?.value;
                let permanentAddress = details?.permanentAddress?.value;
                let street = details?.permanentAddress?.value.split(',')[0] || '';
                let ward = details?.permanentAddress?.value.split(',')[1] || '';
                let district = details?.permanentAddress?.value.split(',')[2] || '';
                let city = details?.permanentAddress?.value.split(',')[3] || '';
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
            if (arrType_back.includes(nidType) && nidType !== 'null') {
                let doi = details?.doi?.value;
                let placeOfIssue = details?.placeOfIssue?.value;
                back_nid_customer = {
                    doi: doi,
                    placeOfIssue: placeOfIssue
                }
                localStorage.setItem('back_nid_customer', JSON.stringify(back_nid_customer));
            }
            if (localStorage.getItem('front_nid_customer') !== null && localStorage.getItem('back_nid_customer') !== null) {
                let allDataNid = {
                    front_nid_customer: JSON.parse(localStorage.getItem('front_nid_customer')),
                    back_nid_customer: JSON.parse(localStorage.getItem('back_nid_customer'))
                }
                localStorage.setItem('allDataNid', JSON.stringify(allDataNid));
                return allDataNid;
            }
        }
        else {
            alert('Thông tin không tồn tại để cắt data');
            return;
        }
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
}

// Done +
function makeFaceMatchCall(faceImageBase64String, docImageBase64String) {
    callback = (HVError, HVResponse) => {
        if (HVError) {
            var errorCode = HVError.getErrorCode();
            var errorMessage = HVError.getErrorMessage();
        }
        if (HVResponse) {
            var apiResults = HVResponse.getApiResult();
            var apiHeaders = HVResponse.getApiHeaders();
            if (apiResults !== null && apiResults !== '') {
                const data = apiResults?.result;
                const matchFace = data.match;
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

// Done +
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

// Done +
async function LaunchDocumentCaptureScreen(side) {
    try {
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
                var errorMessage = HVError.getErrorMessage();
            }
            if (HVResponse) {
                var apiResults = HVResponse.getApiResult();
                var apiHeaders = HVResponse.getApiHeaders();
                var imageBase64 = HVResponse.getImageBase64();
                var attemptsCount = HVResponse.getAttemptsCount();
                if (imageBase64 !== '' && imageBase64 !== null) {
                    if (side === 'FRONT' && side !== '') {
                        localStorage.setItem('front-image', imageBase64);
                        postNationalID(imageBase64);
                        showCapture(imageBase64, "btnCaptureFront");
                        // alert('Lưu mặt trước CMND thành công !');
                        // $("#front_picture").attr("src", imageBase64);
                    }
                    else if (side === 'BACK' && side !== '') {
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

// Done +
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

// Done +
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
        <button type='button' class='btnSelectTenor' data-id='${tenors[i]._id}' onclick='selectTenor("${tenors[i]._id}")'>Select</button>
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
        <button type='button' class='btnSelectProvider' data-id='${providers[i]._id}' onclick='selectProvider("${providers[i]._id}")'><img src='${providers[i].url}' /></button>
        </div>`;
    }
    html += `</div>`;
    $(element).html(html);

    // show list productions
    listProductions({
        element: "#test",
        items: true,
        dataItems: pData
    });
};

// Done +
function selectTenor(id) {
    // console.log('Tenor Id: ', id);
    // alert('Tenor Id: ' + id);
    // localStorage.setItem('tenor', id);

    showFormPincode('#test', localStorage.getItem('phone'), 'SHOW_SUCCESS_PAGE');
}

// Done +
function selectProvider(id) {
    // console.log('Provider Id: ', id);
    // alert('Provider Id: ' + id);
    // localStorage.setItem('provider', id);

    showUICheckPhone('#test');
}

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

// Done +
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

// Done +
function showDataInform(element, personal) {
    var html =
        `<div class='form-card'>
            <h2>Nhập thông tin cá nhân</h2>
            <p class='desc'>Vui lòng điền các trường thông tin bên dưới</p>
            <form class=''>
                <div class="card">
                    <div class="card-head">
                        <h3>Thông tin cá nhân</h3>
                    </div>
                    <div class="card-body">
                        <div class='form-row'>
                            <label for='fullname'>Họ và tên</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type='text' id='fullname' name='fullname' value="${personal.fullname}" />
                        </div>
                        <div class='form-row'>
                            <label for='phone'>Số điện thoại</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type='phone' id="phone" name="phone" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" value="${personal.phone}" />
                        </div>
                        <div class='form-row'>
                            <label for='dob'>Ngày sinh</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type='date' id='dob' name='dob' value="${convertDateString(personal.dob)}" />
                        </div>
                        <div class='form-row'>
                            <label for='gender'>Giới tính</label>
                            <select id='gender' name='gender' class='input-global ng-pristine ng-invalid ng-touched '>
                                <option value="${personal.gender}">${personal.gender === 'M' ? 'Nam' : 'Nữ'}</option>
                        </select>
                        </div>
                        <div class='form-row'>
                            <label for='nid'>Số CMND/CCCD</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type='number' id='nid' name='nid' value="${personal.nid}"/>
                        </div>
                        <div class='form-row'>
                            <div class="form-cell">
                                <label for='doi'>Ngày cấp</label>
                                <input class='input-global ng-pristine ng-invalid ng-touched' type='date' id='doi' name='doi' value="${convertDateString(personal.doi)}"/>
                            </div>
                            <div class="form-cell">
                                <label for='doe'>Ngày hết hạn</label>
                                <input class='input-global ng-pristine ng-invalid ng-touched' type='date' id='doe' name='doe' value="${convertDateString(personal.doe)}"/>
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
                        <div class='form-row'>
                            <label for='city'>Thành phố/Tỉnh</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type='text' id='city' name='city' value="${personal.city}"/>
                        </div>
                        <div class='form-row'>
                            <label for='district'>Quận/Huyện</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type="text" id="district" name="district" value="${personal.district}" />
                        </div>
                        <div class='form-row'>
                            <label for='ward'>Phường</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type='text' id='ward' name='ward' value="${personal.ward}"/>
                        </div>
                        <div class='form-row'>
                            <label for='street'>Đường</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type='text' id='street' name='street' value="${personal.street}"/>
                        </div>
                    </div>
                    <div class="card-footer"></div>
                </div>
                <div class="card">
                    <div class="card-head">
                        <h3>Thông tin tham chiếu</h3>
                    </div>
                    <div class="card-body">
                        <div class='form-row'>
                            <label for='relationship'>Mối quan hệ </label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type='text' id='relationship' name='relationship'  />
                        </div>
                        <div class='form-row'>
                            <label for='fullname_ref'>Họ và tên</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type='text' id="fullname_ref" name="fullname_ref"   />
                        </div>
                        <div class='form-row'>
                            <label for='phone_ref'>Số điện thoại</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched ' type='phone' id='phone_ref' name='phone_ref' pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"  />
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
                        <input class='input-global ng-pristine ng-invalid ng-touched' type='text' id='city_permanent' name='city_permanent' />
                    </div>
                    <div class='form-row'>
                        <label for='district_permanent'>Quận/Huyện</label>
                        <input class='input-global ng-pristine ng-invalid ng-touched' type="text" id="district_permanent" name="district_permanent"  />
                    </div>
                    <div class='form-row'>
                        <label for='ward_permanent'>Phường</label>
                        <input class='input-global ng-pristine ng-invalid ng-touched' type='text' id='ward_permanent' name='ward_permanent' />
                    </div>
                    <div class='form-row'>
                        <label for='street_permanent'>Đường</label>
                        <input class='input-global ng-pristine ng-invalid ng-touched' type='text' id='street_permanent' name='street_permanent' />
                    </div>
                </div>
                <div class="card-footer"></div>
            </div>

                <button type='button' class='payment-button' id='btnContinue'>Tiếp tục</button>
            </form >
        </div > `;
    $(element).html(html);

    $('#btnContinue').click(function () {
        let fullname = document.getElementById('fullname').value.trim();
        let gender = document.getElementById('gender').value.trim();
        let phone = document.getElementById('phone').value.trim();
        let dob = document.getElementById('dob').value.trim();
        let nid = document.getElementById('nid').value.trim();
        let doi = document.getElementById('doi').value.trim();
        let doe = document.getElementById('doe').value.trim();
        let city = document.getElementById('city').value.trim();
        let district = document.getElementById('district').value.trim();
        let ward = document.getElementById('ward').value.trim();
        let street = document.getElementById('street').value.trim();
        let relationship = document.getElementById('relationship').value.trim();
        let fullname_ref = document.getElementById('fullname_ref').value.trim();
        let phone_ref = document.getElementById('phone_ref').value.trim();
        let city_permanent = document.getElementById('city_permanent').value.trim();
        let district_permanent = document.getElementById('district_permanent').value.trim();
        let ward_permanent = document.getElementById('ward_permanent').value.trim();
        let street_permanent = document.getElementById('street_permanent').value.trim();
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
            "name_ref": fullname_ref,
            "phone_ref": phone_ref,
            "temporaryCity": city_permanent,
            "temporaryDistrict": district_permanent,
            "temporaryWard": ward_permanent,
            "temporaryStreet": street_permanent,
            "expirationDate": doe
        }
        if (personal_all_info !== null) {
            localStorage.setItem('personal_all_info', JSON.stringify(personal_all_info));
            showConfirmDataInform(element, personal_all_info)
        }
    })
}

// Done +
function showConfirmDataInform(element, personal_all_info) {
    var html =
        `<div class='form-card'>
            <h2>Đối soát thông tin cá nhân</h2>
            <form class=''>
                <div class="card">
                    <div class="card-head">
                        <h3>Thông tin cá nhân</h3>
                    </div>
                    <div class="card-body">
                        <div class='form-row'>
                            <label for='name'>Họ và tên</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type='text' id='name' name='name' value="${personal_all_info.name}" />
                        </div>
                        <div class='form-row'>
                            <label for='phone'>Số điện thoại</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type='phone' id="phone" name="phone" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" value="${personal_all_info.phone}" />
                        </div>
                        <div class='form-row'>
                            <label for='birthday'>Ngày sinh</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type='date' id='birthday' name='birthday' value="${personal_all_info.birthday}" />
                        </div>
                        <div class='form-row'>
                            <label for='gender'>Giới tính</label>
                            <select id='sex' name='sex' class='input-global ng-pristine ng-invalid ng-touched '>
                                <option value="${personal_all_info.sex === 'M' ? 'Nam' : 'Nữ'}">${personal_all_info.sex === 'M' ? 'Nam' : 'Nữ'}</option>
                        </select>
                        </div>
                        <div class='form-row'>
                            <label for='citizenId'>Số CMND/CCCD</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type='number' id='citizenId' name='citizenId' value="${personal_all_info.citizenId}"/>
                        </div>
                        <div class='form-row'>
                            <div class="form-cell">
                                <label for='issueDate'>Ngày cấp</label>
                                <input class='input-global ng-pristine ng-invalid ng-touched' type='date' id='issueDate' name='issueDate' value="${personal_all_info.issueDate}"/>
                            </div>
                            <div class="form-cell">
                                <label for='doe'>Ngày hết hạn</label>
                                <input class='input-global ng-pristine ng-invalid ng-touched' type='date' id='doe' name='doe' value="${personal_all_info.expirationDate}"/>
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
                        <div class='form-row'>
                            <label for='city'>Thành phố/Tỉnh</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type='text' id='city' name='city' value="${personal_all_info.city}"/>
                        </div>
                        <div class='form-row'>
                            <label for='district'>Quận/Huyện</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type="text" id="district" name="district" value="${personal_all_info.district}" />
                        </div>
                        <div class='form-row'>
                            <label for='ward'>Phường</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type='text' id='ward' name='ward' value="${personal_all_info.ward}"/>
                        </div>
                        <div class='form-row'>
                            <label for='street'>Đường</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type='text' id='street' name='street' value="${personal_all_info.street}"/>
                        </div>
                    </div>
                    <div class="card-footer"></div>
                </div>
                <div class="card">
                    <div class="card-head">
                        <h3>Thông tin tham chiếu</h3>
                    </div>
                    <div class="card-body">
                        <div class='form-row'>
                            <label for='relationship'>Mối quan hệ </label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type='text' id='relationship' name='relationship' value="${personal_all_info.personal_title_ref}" />
                        </div>
                        <div class='form-row'>
                            <label for='name_ref'>Họ và tên</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched' type='text' id="name_ref" name="name_ref" value="${personal_all_info.name_ref}" />
                        </div>
                        <div class='form-row'>
                            <label for='phone_ref'>Số điện thoại</label>
                            <input class='input-global ng-pristine ng-invalid ng-touched ' type='phone' id='phone_ref' name='phone_ref' pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" value="${personal_all_info.phone_ref}" />
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
                        <input class='input-global ng-pristine ng-invalid ng-touched' type='text' id='city_permanent' name='city_permanent' value="${personal_all_info.temporaryCity}" />
                    </div>
                    <div class='form-row'>
                        <label for='district_permanent'>Quận/Huyện</label>
                        <input class='input-global ng-pristine ng-invalid ng-touched' type="text" id="district_permanent" name="district_permanent" value="${personal_all_info.temporaryDistrict}" />
                    </div>
                    <div class='form-row'>
                        <label for='ward_permanent'>Phường</label>
                        <input class='input-global ng-pristine ng-invalid ng-touched' type='text' id='ward_permanent' name='ward_permanent'  value="${personal_all_info.temporaryWard}" />
                    </div>
                    <div class='form-row'>
                        <label for='street_permanent'>Đường</label>
                        <input class='input-global ng-pristine ng-invalid ng-touched' type='text' id='street_permanent' name='street_permanent' value="${personal_all_info.temporaryStreet}" />
                    </div>
                </div>
                <div class="card-footer"></div>
            </div>

                <button type='button' class='payment-button' id='btnContinueConfirm'>Tiếp tục</button>
            </form >
        </div > `;
    $(element).html(html);

    $('#btnContinueConfirm').click(function () {
        showFormSetupPin(element);
    });
}

// Done +
function configUi(config) {
    var iHtml = "";
    if (config.logo) iHtml += "<div class='voolo-logo'></div>";
    if (config.intro) iHtml += `
    <div class='voolo-intro'>
        <h2 class='paragraph-text paragraph-text-bold header-2'>VOOLO giúp bạn:</h2>
        <ul>
            <li>Mua sắm không giới hạn </li>
            <li>Thanh toán linh hoạt </li>
            <li>Hoàn tiền ngay chỉ trong 1 ngày </li>
        </ul>
    </div>
    <div _ngcontent-gse-c77="" class="paragraph-text text-center margin-bottom-default"> <p class='font-w-5'>VOOLO</p> <p>Mua Trước Trả Sau Không khoản trả trước</p><p>Nhẹ nhàng với 0% lãi suất </p></div>`;
    $(config.element + " form").prepend(iHtml);
}

// Done +
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
    }
    lItems += `<div class='list-items'>
        <div class='card'>
            <div class='card-head'>Thông tin đơn hàng</div>
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

// Done +
function showCapture(base64, eId) {
    if (base64) {
        $('#' + eId).addClass("showImage");
        $('#' + eId).css({
            'background': 'url(' + base64 + ') no-repeat center',
            'background-size': 'cover'
        });

    }
}

// Done +
// this function convert string date dd-mm-yyyy to yyyy-mm-dd
function convertDateString(dateString) {
    if (dateString === '') return '';
    const dateParts = dateString.split("-");
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
}

// Done +
function showFormPincode(element, phone, screen) {
    var html =
        "<form id='formValuePassword'>" +

        "<div class='form__row'>" +
        "<label class='form__label' for='pincode'>Pin code</label>" +
        "<input type='password' id='pincode' class='form__input' placeholder='Please enter your pin code: ' />" +
        "</div>" +

        "<button type='button' id='btnSubmitPin'>Gửi</button>" +
        `<span>Forgot pin code?</span>  <button type='button' onclick='forgotPinPhone("${element}","${phone}")'>Click here</button>` +
        "</form>";
    $(element).html(html);

    $('#btnSubmitPin').click(function () {
        let pin = $('#pincode').val();
        if (pin !== null && pin !== '') {
            let result = login(phone, pin);
            console.log('Result Login: ', result);
            if (result.status === true && result.data.step === 4 && screen === 'SHOW_TENOR' && screen !== '') {
                showAllTenor(element);
            }
            else if (result.status === true && result.data.step === 4 && screen === 'SHOW_SUCCESS_PAGE' && screen !== '') {
                showMessage(element, 'BUY SUCCESSFULLY', 'fa-solid fa-check')
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

// Done +
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
            console.log('all_data_info: ', all_data_info);
            let result = addInfoPersonal(all_data_info.name, all_data_info.sex === 'M' ? 'Nam' : 'Nữ', all_data_info.birthday,
                all_data_info.phone, all_data_info.citizenId, all_data_info.issueDate,
                all_data_info.expirationDate, all_data_info.city, all_data_info.district,
                all_data_info.ward, all_data_info.street, all_data_info.temporaryCity,
                all_data_info.temporaryDistrict, all_data_info.temporaryWard, all_data_info.temporaryStreet,
                all_data_info.personal_title_ref, all_data_info.name_ref, all_data_info.phone_ref,
                all_data_info.pin, all_data_info.nid_front_image, all_data_info.nid_back_image, all_data_info.selfie_image);
            if (result.status === true) {
                alert(result.message);
            }
            else {
                alert('Add Infomation Personal Failure');
            }
        }
        else {
            alert('Mã pin không trùng khớp vui lòng thử lại !');
            return;
        }
    })
}

function forgotPinPhone(element, phone) {
    var html =
        "<div>" +
        "<h3>Phone Number</h3>" +
        "<input type='phone' value=" + phone + ">" +
        "<button id='btnContinue' type='button'>Continue</button>" +
        "</div>";
    $(element).html(html);
    $('#btnContinue').click(function () {
        forgotPinNid(element);
    });
}

function forgotPinNid(element) {
    var html =
        `<div>
            <h3>Id Card</h3>
            <input type='number' id='nid'/>
            <button id='btnSendOtp' type='button'>Send Otp</button>
        </div>`;
    $(element).html(html);
    $('#btnSendOtp').click(function () {
        let phone = localStorage.getItem('phone');
        let otp = sendOtp(phone);
        showFormVerifyOTP(element, phone, otp);
    })
}

function showFormVerifyOTP(element, phone, otp) {
    alert('Mã OTP của bạn là: ' + otp.otp);
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
            const data = verifyOtp(phone, otp);
            console.log('Data: ', data);
        }
        else {
            alert('Thiếu số điện thoại hoặc mã otp !');
            return;
        }
    })
}