import { checkPhoneExists, checkNidExists, login, getAllTenor, getAllProviders } from './index.js';

// Done
export function showProgressbar(element) {
    var html =
        "<div class='progress'>" +
        "<div class='progress__fill'></div>" +
        "<span class='progress__text'>0%</span>" +
        "</div>";
    $(element).html(html);
}

// Done
export function updateProgressbar() {
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

// Done
export function showCircularProgressbar(element) {
    var html =
        "<div class='circular__progress'>" +
        "<div class='circular__value'>0%<div>" +
        "</div>";
    $(element).html(html);
}

// Done
export function updateCircularProgressbar() {
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

export function showUICheck(element, id, label) {
    var html =
        "<form id='formValue' class='ng-untouched ng-pristine ng-invalid'><div class='mobile'" +
        "<label for='" + id + "'>" + label + " </label>" +
        "<input type='text' id='" + id + "' class='input-global ng-pristine ng-invalid ng-touched'/>" +
        "<button type='button' id='btnSubmit' class='payment-button' >Tiếp tục</button>" +
        "</div></form>";
    $(element).html(html);

    $('#btnSubmit').click(function () {
        let data = $('#' + id).val();
        if (data !== null && data !== '') {
            if (id === 'phone') {
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
                    else if (step !== 0 || step !== 2 || step !== 3 || step !== 4) {

                    }
                }
            }
            else if (id === 'nid') {
                let result = checkNidExists(data);
                if (result.statusCode === 1000) {
                    showFormPincode(element, result.data.phone);
                }
            }
        }
        else {
            alert('Vui lòng nhập data !');
        }
    })
}

export function showFormPincode(element, phone) {
    var html =
        "<form id='formPassword'>" +
        "<label for='password'>Password</label>" +
        "<input type='password' id='password' placeholder='Please enter your pin code: ' />" +
        "<button type='button' id='btnSubmitPW'>Tiếp tục</button>" +
        "</form>";
    $(element).html(html);

    $('#btnSubmitPW').click(function () {
        let pin = $('#password').val();
        if (pin !== null && pin !== '') {
            let result = login(phone, pin);
            if (result.status === true) {
                showAllTenor(element);
            }
        }
        else {
            alert('Vui lòng nhập pin !');
        }
    })
}

export function showFormSetupPin(element) {
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

        console.log('Pin: ', pin);
        console.log('Confirm Pin: ', pincf);
    })
}

export function showFormVerifyOTP(element) {
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
        console.log('OTP: ', otp);
    })
}

// Done
export function showAllTenor(element) {
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

// Done
export function showAllProvider(element) {
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

// Done
export function selectTenor(id) {
    alert(id);
}

// Done
export function selectProvider(id) {
    alert(id);
}

export function showMessage(element, message, icon) {
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








