function showUseGuideSelfy() {
    $('body').find('.guideslide').remove();
    $("#formValueNid").hide();
    $('#voolo').append("<div class='guideslide'></div>");
    $('.guideslide').load('useguide.html');
    $('body').find('.pageTitle').text(lang.showUseGuideSelfy.guide_take_portraits);
}

function showUseGuideNid() {
    $('body').find('.guideslide').remove();
    $("#formValueNid").hide();
    $('#voolo').append("<div class='guideslide nid-front' style=''></div>");
    $('.guideslide').load('useguidenid.html');
    $('body').find('.pageTitle').text(lang.showUseGuideNid.guide_take_nid);
}

function showUseGuideBackNid() {
    $('body').find('.guideslide').remove();
    $("#formValueNid").hide();
    $('#voolo').append("<div class='guideslideback' style=''></div>");
    close_popup();
    var html = `<div class='box2 showMessage'>
                    <div class=''>
                        <div class='ico-success ico-120'></div>
                        <div class='statusTitle'>${lang.showUseGuideBackNid.capture_front_success}</div>
                        <div class='line'>
                            <span class='font-m'>Now</span>
                        </div>
                        <div class='refresh-ico'>
                            <img src='./assets/img/refresh-ico.png' width="20" height="20" />
                        </div>
                        <p style='text-align: center;'>
                            ${lang.showUseGuideBackNid.back_card_continue}
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
                            <button class='payment-button' id="" style='margin-top:26px' onClick="runDocumentCaptureScreen('BACK')">${lang.showUseGuideBackNid.button_start}</button>
                        </div>
                    </div>
                </div> `;
    $('.guideslideback').html(html);
}