function showUseGuideSelfy() {
    $('body').find('.guideslide').remove();
    $("#formValueNid").hide();
    $('#voolo').append("<div class='guideslide'></div>");
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

function showUseGuideBackNid() {
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
                                        <img src='./assets/img/cccd.png' width="115" />
                                    </div>
                                    <div class="back face center">
                                        <img src='./assets/img/cccd-2.png' width="115" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="width:100%">
                            <button class='payment-button' id="" style='margin-top:26px' onClick="runDocumentCaptureScreen('BACK')">Bắt đầu</button>
                        </div>
                    </div>
                </div> `;
    $('.guideslideback').html(html);
}