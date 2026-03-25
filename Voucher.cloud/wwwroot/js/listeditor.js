/* Điều khiển cửa sổ thêm/sửa danh mục */
var _____controlid______Loading = new ItpOverlay("container______controlid_____", "partial-loading");
var _____controlid______AlertMessage = new AlertMessage("container______controlid_____");
var _____controlid______LastFocus = null;
var _____controlid______TextSearch = null;

$(function () {
    $("#desk______controlid_____ .popup-modal-background").appendTo("#desk______controlid_____ .popup-modal");

    $('#desk______controlid_____ .s3tcloud-prefix.form-container>.form-title .button-close').on('click', function (e) {
        RemoveTab('_____controlid_____', $('#desk______controlid_____').attr('parentcontrolid'));
    });

    $('#desk______controlid_____ .form-container .form-footer .button-add').on('click', function (e) {
        _____controlid______F2Key();
    });

    $('#desk______controlid_____ .form-container .form-footer .button-save').on('click', function (e) {
        _____controlid______CtrlEnter();
    });
})

async function _____controlid______FormSubmitCheckValidate() {
    return await FormElementValidate($("#desk______controlid_____"));    
}

async function _____controlid______F2Key() {
    if (!(await _____controlid______FormSubmitCheckValidate())) return;
     //Lưu dữ liệu
    let result = await _____controlid______OnSave();
    if (result == 0) {
        _____controlid______NewChecked = true;
		//_____parentid______S3Table.BuildCells();

        //Đặt con trỏ vào vị trí đầu và chuyển sang trạng thái thêm mới
        let screenInfo = JSON.parse($('#desk______controlid_____').data('screen-info'));
        let mainTitle = new Array();
        mainTitle.push(screenInfo.Title);

        let subTitle = new Array();
        subTitle.push(screenInfo.Title_E);

        await translator.translateWithKey($('#desk______controlid_____ .form-title .billingual-wrapper')[0], 'Common_Add_Title', mainTitle, subTitle);
        await translator.translateWithKey($('#tab______controlid_____ .billingual-wrapper')[0], 'Common_Add_Title', mainTitle, subTitle);
        _____controlid______OnAdd();
    }       
}

async function _____controlid______CtrlEnter() {
    if (!(await _____controlid______FormSubmitCheckValidate())) return;

    //Lưu dữ liệu
    let result = await _____controlid______OnSave();
    if (result != -1) {
        //Đóng cửa sổ thêm/sửa
        RemoveTab('_____controlid_____', $('#desk______controlid_____').attr('parentcontrolid'));
    } else if (_____controlid______LastFocus != null) {
        _____controlid______LastFocus.focus();
    }
}

async function _____controlid______InitControl(screenInfo) {
    initTextSearch($('#desk______controlid_____ .text-search'));
    initTextOption($("#desk______controlid_____ .text-option"));
    var mainTitle = new Array();
    mainTitle.push(screenInfo.Title);

    var subTitle = new Array();
    subTitle.push(screenInfo.Title_E);

    var key = screenInfo.NewChecked ? 'Common_Add_Title' : 'Common_Edit_Title';
    await translator.translateWithKey($('#desk______controlid_____ .form-title .billingual-wrapper')[0], key, mainTitle, subTitle);
    await translator.translateWithKey($('#tab______controlid_____ .billingual-wrapper')[0], key, mainTitle, subTitle);
    translateInput($('#desk______controlid_____'));
    _____controlid______NewChecked = screenInfo.NewChecked;
    _____controlid______CurrentRowIndex = -1;
    if (screenInfo.Element) {
        _____controlid______TextSearch = screenInfo.Element;
    }
}

async function _____controlid______AddCancelButton() {
    $('#desk______controlid_____ .s3tcloud-prefix.form-container>.form-footer .button-group').append("<div class='footer-button button-cancel'><div class='billingual-wrapper' data-i18n-layout='layout2' data-i18n-key='Common_Button_Cancel'></div></div>");
    await translator.translateElements($('#desk______controlid_____ .s3tcloud-prefix.form-container>.form-footer .button-group .button-cancel')[0]);
    $('#desk______controlid_____ .s3tcloud-prefix.form-container>.form-footer .button-group .button-cancel').on('click', function (e) {
        RemoveTab('_____controlid_____', $('#desk______controlid_____').attr('parentcontrolid'));
    });
}

$('#desk______controlid_____ .s3tcloud-prefix.form-container .form-title').on('mousedown', function (e) {
    if (e.target !== e.currentTarget)
    {
        return;
    }

    let $self = $('#desk______controlid_____');
    let $this = $('#desk______controlid_____ .s3tcloud-prefix.form-container');
    let $size = $self.offset();
    $size.width = $self.width();
    $size.height = $self.height();

    $(document).bind('mousemove', function (e) {
        let x = e.pageX - $size.left - $this.attr('offsetleft');
        let y = e.pageY - $size.top - $this.attr('offsettop');

        let x_allowed = x >= 4 && x <= $size.width - $this.width() - 8;
        let y_allowed = y >= 4 && y <= $size.height - $this.height() - 81;

        if (x_allowed) {
            $this.css({ 'margin-left': x + 'px' });
        } else {
            //fine tune tweaks
            if (x >= 0 && x != $size.width - $this.width() - 8) {
                $this.css({ 'margin-left': ($size.width - $this.width() - 8) + 'px' });
            }
            if (x <= ($size.width - $this.width()) && x != 4) {
                $this.css({ 'margin-left': '4px' });
            }
        }
        if (y_allowed) {
            $this.css({ 'top': y + 'px' });
        } else {
            //fine tune tweaks
            if (y >= 0 && y != $size.height - $this.height() - 81) {
                $this.css({ 'top': ($size.height - $this.height() - 81) + 'px' });
            }
            if (y <= ($size.height - $this.height() - 80) && y != 4) {
                $this.css({ 'top': '4px' });
            }
        }
    });
});
$(window).on('mouseup', function (e) {
    $(document).unbind('mousemove');
});
$('#desk______controlid_____ .form-title').on('mousedown', function (e) {
    $('#desk______controlid_____ .s3tcloud-prefix.form-container').attr('offsetleft', e.pageX - $(this).offset().left);
    $('#desk______controlid_____ .s3tcloud-prefix.form-container').attr('offsettop', e.pageY - $(this).offset().top);
});
