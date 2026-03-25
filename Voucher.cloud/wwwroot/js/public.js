/* Các hàm dùng chung */
function GetScrollbarWidth() {
    var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div></div>');
    $('body').append(div);
    var w1 = $('div', div)[0].getBoundingClientRect().width;
    div.css('overflow-y', 'auto');
    var w2 = $('div', div)[0].getBoundingClientRect().width;

    $(div).remove();
    return (w1 - w2);
}

function Check_Code_InUsed(m__Table, m__Field, m__Value, m__Nested) {
    let model = {};

    model.Ma_File = m__Table;
    model.Ma_Field = m__Field;
    model.Value = m__Value;
    model.Nested = m__Nested;

    let result = false;
    $.ajax
        ({
            type: 'POST',
            url: 'api/Common/Check_Code_InUsed',
            async: false,
            data: JSON.stringify(model),
            contentType: 'application/json; charset =utf-8',
            success: function (data) {
                result = data.Code == 1;
            },

            error: function (result) {
                handleResponseError(alert, result);
            }
        });

    return result;
}

function NewDictionaryCode(alert, table, field, code) {
    var item = new Object();
    item.TableName = table;
    item.FieldName = field;
    item.CurrentCode = code;

    var result = null;
    $.ajax
        ({
            type: 'POST',
            url: 'api/Common/NewDictionaryCode',
            async: false,
            data: JSON.stringify(item),
            contentType: 'application/json; charset =utf-8',
            success: function (data) {
                result = data;
            },

            error: function (result) {
                handleResponseError(alert, result);
            }
        });

    return result;
}


function handleResponseError(alert, result, controlId) {
    if (result.status == 401) {
        let cb = function () {
            let a = document.createElement('a');
            a.href = "Account/Login";
            a.click();
            a.remove();
        };
        
        alert.showInfo("Common_Session_Expired", cb);
        return;
    }
    if (result.status == 423) {
        alert.showInfo("Common_Msg_NoPrivilege");
        if (controlId) RemoveTab(controlId);
        return;
    }
    alert.showError("Common_Msg_UnknownError");
}

function handleResponseApiCode(alert, data) {
    var key = "";
    switch (data.Code) {
        case -1:
            key = "Common_Msg_CodeExisted";
            break;
        case -2:
            key = "Common_Msg_DataChanged";
            break;
        case -3:
            key = "Common_Msg_ItemInUsed";
            break;
        case -4:
            key = "Common_Msg_DataLocked";
            break;
        case -8:
            key = "Common_Msg_DataBeforeEndDate";
            break;
        case -9:
            key = "Common_Msg_OpeningInUsed";
            break;
        case -10:
            key = "Common_Msg_InvoiceLocked";
            break;
        case -12:
            key = "Common_Msg_InvoiceUnLocked";
            break;
        case -13:
            key = "Common_Msg_InvoiceNoRightAdd";
            break;
        case -16:
            key = "Common_Msg_InvoiceNoRightEdit";
            break;
        case -19:
            key = "Common_Msg_InvoiceNoRightDelete";
            break;
        case -22:
            key = "Common_Msg_InvoiceNoRightClose";
            break;
        case -25:
            key = "Common_Msg_InvoiceNoRightCheck";
            break;
        case -28:
            key = "Common_Msg_InvoiceNoRightReject";
            break;
        case -31:
            key = "Common_Msg_InvoiceNoRightProposeApprove";
            break;
        case -34:
            key = "Common_Msg_InvoiceNoRightRejectApprove";
            break;
        case -37:
            key = "Common_Msg_InvoiceNoRightApprove";
            break;
        case -38:
            key = "Common_Msg_InvoiceNoRightLock";
            break;
        case -39:
            key = "Common_Msg_InvoiceNoRightUnLock";
            break;
        case -40:
            key = "Common_Msg_InvoiceMustBeFromStartDate";
            break;
        case -43:
            key = "Common_Msg_InvoiceMustBeAfterLockDate";
            break;
        case -46:
            key = "Common_Msg_InvoiceMadeFromOtherSection";
            break;
        case -49:
            key = "Common_Msg_InvoiceSelectFromOtherSection";
            break;
        case -52:
            key = "Common_Msg_InvoiceMaking";
            break;
        case -55:
            key = "Common_Msg_InvoiceWaitingInspection";
            break;
        case -58:
            key = "Common_Msg_InvoiceAreRejectInspection";
            break;
        case -61:
            key = "Common_Msg_InvoiceHasBeenDeniedInspection";
            break;
        case -64:
            key = "Common_Msg_InvoiceWaitingApprove";
            break;
        case -67:
            key = "Common_Msg_InvoiceAreDeniedApprove";
            break;
        case -70:
            key = "Common_Msg_InvoiceHasBeenDeniedApprove";
            break;
        case -73:
            key = "Common_Msg_InvoiceApproved";
            break;
        case -79:
            key = "Common_Msg_InvoicehasBeenCanceled";
            break;
        case -88:
            key = "Common_Msg_InvoiceIsPublished";
            break;
        case -89:
            key = "Common_Msg_InvoiceIsExisted";
            break;
        case -99:
            key = "Common_Msg_DataMustBeFromStartDate";
            break;
        case -100:
            key = "Common_Msg_UserLimit";
            break;
        case -8003: //Chưa tạo hóa đơn điện tử
            key = "CTHD_Msg_InvoiceNotMade";
            break;
        case -8013: //Không có quyền lập hóa đơn
            key = "CTHD_Msg_NoRightAdd";
            break;
        case -8037: //Không có quyền phát hành
            key = "CTHD_Msg_NoRightPublish";
            break;
        case -8019: //Không có quyền xóa bỏ hóa đơn
            key = "CTHD_Msg_NoRightDelete";
            break;
        case -8040: //Hóa đơn phải từ ngày bắt đầu hạch toán
            key = "CTHD_Msg_InvoiceMustBeFromStartDate";
            break;
        case -8043: //Hóa đơn phải sau ngày khoá dữ liệu
            key = "CTHD_Msg_InvoiceMustBeAfterLockDate";
            break;
        case -8053: //Chưa duyệt chứng từ kế toán
            key = "CTHD_Msg_VoucherNotApprove";
            break;
        case -8052: //Hóa đơn chưa phát hành
            key = "CTHD_Msg_InvoiceNoPublish";
            break;
        case -8073: //Hóa đơn đã phát hành
            key = "CTHD_Msg_InvoiceIsPublished";
            break;
        case -8079: //Hóa đơn đã bị xóa bỏ
            key = "CTHD_Msg_InvoiceIsDeleted";
            break;
        case -8089: //Ngày xóa bỏ hóa đơn không được trước ngày lập hóa đơn
            key = "CTHD_Msg_DeletedDateMustBeFromMakeDate";
            break;
        case -8099: //Hóa đơn bị thay thế đang được chọn từ phần hành khác
            key = "CTHD_Msg_InvoiceSelectFromOtherSection";
            break;
        case -9996: //Thay đổi ngày bắt đầu hạch toán nhưng đã có nhập số dư đầu
            key = "Common_Msg_No_Valid_Start_Date";
            break;
        case -9997: //Tài khoản giá thành không hợp lệ
            key = "Common_Msg_No_Valid_Account";
            break;
        case -9998:
            key = "UserProfile_Msg_VerificationFail";
            break;
        case -9999:
            key = "Common_Msg_SendMail";
            break;
        case 15:
            key = "Common_Msg_BaoCaoQuaHan";
            break;
        default:
            key = "Common_Msg_UnknownError";
            break;
    }
    alert.showInfo(key);
}

function translateOther(parent) {
    var lang = (parent == undefined ? $(".billingual-wrapper") : $(".billingual-wrapper", $(parent)));
    $.map(lang, function (element) {
        if ($(element).attr('data-i18n-layout')) {
            return;
        }
        if (ApplicationInstance.Uservar.BillingualLanguage == 2) {
            $('.main-language', $(element)).show();
            $('.sub-language', $(element)).show();
            $('.sub-additional', $(element)).show();
        } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) {
            $('.main-language', $(element)).show();
            $('.sub-language', $(element)).hide();
            $('.sub-additional', $(element)).hide();
        } else {
            $('.main-language', $(element)).hide();
            $('.sub-language', $(element)).show();
            $('.sub-additional', $(element)).hide();
        }
    });
}

function translateMenu(elm, index) {
    $(elm).css({ 'display': 'flex', 'flex-direction': 'column', 'justify-content': 'center', 'overflow': 'hidden', 'white-space': 'nowrap', 'min-height': '30px' });
    if (ApplicationInstance.Uservar.BillingualLanguage == 2) {
        $('.main-language', $(elm)).css({ 'overflow': 'hidden', 'text-overflow': 'ellipsis' });
        $('.sub-language', $(elm)).css({ 'overflow': 'hidden', 'text-overflow': 'ellipsis', 'padding-left': '10px' });

        $('.main-language', $(elm)).show();
        $('.main-language', $(elm)).css({ 'font-weight': 'bold' });
        $('.sub-language', $(elm)).show();
        $('.sub-language', $(elm)).css({ 'font-weight': 'normal' });
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) {
        $('.main-language', $(elm)).css({ 'overflow': 'hidden', 'text-overflow': 'ellipsis' });
        $('.main-language', $(elm)).show();
        $('.main-language', $(elm)).css({ 'font-weight': 'bold' });
        $('.sub-language', $(elm)).hide();
    } else {
        $('.sub-language', $(elm)).css({ 'overflow': 'hidden', 'text-overflow': 'ellipsis', 'padding-left': '0px' });
        $('.main-language', $(elm)).hide();
        $('.sub-language', $(elm)).show();
        $('.sub-language', $(elm)).css({ 'font-weight': 'bold' });
    }
}

function translateInput($parent) {
    $('.billingual-wrapper', $parent).each(function () {
        if (ApplicationInstance.Uservar.BillingualLanguage == 2) {
            var main = $('input.main-language', $(this));
            var sub = $('input.sub-language', $(this));
            if (main.length == 0 && sub.length == 0) return;
            var mainparent = $("<div class='modal-textbox'></div>");
            $(main).css({ 'padding-left': '24px' });
            $(mainparent).append(main);
            $(mainparent).append("<img src='../img/" + ApplicationInstance.Systemvar.MainLanguageId + ".png' alt='Google translate (F12)' title='Google translate (F12)' style='position:absolute; top:6px; left:5px; width:16px; height:12px; cursor:pointer;'/>");

            $("img[alt='Google translate (F12)']", $(mainparent)).on('click', function () {
                (async () => {
                    await googletranslator_OnTranslated($(main), $(sub), googletranslator_SourceLanguage, googletranslator_TargetLanguage);
                })();
            });

            var subparent = $("<div class='modal-textbox'></div>");
            $(sub).css({ 'padding-left': '24px' });
            $(subparent).append(sub);
            $(subparent).append("<img src='../img/" + ApplicationInstance.Systemvar.SubLanguageId + ".png' alt='Google translate (F12)' title='Google translate (F12)' style='position:absolute; top:6px; left:5px; width:16px; height:12px; cursor:pointer;'/>");

            $("img[alt='Google translate (F12)']", $(subparent)).on('click', function () {
                (async () => {
                    await googletranslator_OnTranslated($(sub), $(main), googletranslator_TargetLanguage, googletranslator_SourceLanguage);
                })();
            });

            $(this).empty().append(mainparent).append(subparent);
        } else {
            var main = $('input.main-language', $(this));
            var sub = $('input.sub-language', $(this));
            if (main.length == 0 && sub.length == 0) return;
            $(main).css({ 'padding-left': '2px' });
            $(sub).css({ 'padding-left': '2px' });
            $(this).empty().append(main).append(sub);
        }
    });
    if (ApplicationInstance.Uservar.BillingualLanguage == 2) {
        $('.billingual-wrapper input.main-language', $($parent)).show();
        $('.billingual-wrapper input.sub-language', $($parent)).show();
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) {
        $('.billingual-wrapper input.main-language', $($parent)).show();
        $('.billingual-wrapper input.sub-language', $($parent)).hide();
    } else {
        $('.billingual-wrapper input.main-language', $($parent)).hide();
        $('.billingual-wrapper input.sub-language', $($parent)).show();
    }
}

$.fn.extend({
    value: function (value) {
        if ($(this).is('td')) {
            if ($(this).hasClass('text-number')) {
                if (value === undefined) {
                    return $(this).attr('numericvalue') ? parseFloat($(this).attr('numericvalue')) : 0;
                } else {
                    if (value === null || value === '') {
                        $(this).attr('numericvalue', $(this).text());
                        if ($(this).attr('hidezero') == 'true' && parseFloat($(this).attr('numericvalue')) == 0) {
                            $(this).text('');
                        } else {
                            $(this).text(number_to_text(parseFloat($(this).text()), number_decimalscale($(this).attr('scale')), null, $(this).attr("decimal") ? parseInt($(this).attr("decimal")) : null));
                        }
                    } else {
                        $(this).attr('numericvalue', value);
                        if ($(this).attr('hidezero') == 'true' && parseFloat($(this).attr('numericvalue')) == 0) {
                            $(this).text('');
                        } else {
                            $(this).text(number_to_text(parseFloat(value), number_decimalscale($(this).attr('scale')), null, $(this).attr("decimal") ? parseInt($(this).attr("decimal")) : null));
                        }
                    }
                }
            }
        } else if ($(this).is('div.text-select')) {
            if (value === undefined) {
                return $(this).data('title').toString();
            } else {
                if (value === null) {
                    $(this).text('');
                } else {
                    let data = $(this).data("toggle");
                    if (data) {
                        let key = data.find(record => String(record.id) === String(value)).name;
                        if (key) {
                            $(this).text(typeof $(this).attr('translate') !== 'undefined' && $(this).attr('translate') == 'false' ? key : i18nLayout8(key));
                        } else {
                            $(this).text('');
                        }
                    } else {
                        $(this).text('');
                    }
                    $(this).data('title', value);
                    $(this).trigger('change');
                }
            }
        } else if ($(this).is('input')) {
            if (value === undefined) {
                if ($(this).is(':radio')) {
                    return $(this).filter(":checked").val();
                } else if ($(this).is(':checkbox')) {
                    return $(this).prop('checked');
                } else if ($(this).hasClass('text-number')) {
                    return $(this).attr('numericvalue') ? parseFloat($(this).attr('numericvalue')) : 0;
                } else if ($(this).hasClass('text-date')) {                    
                    return IsValidDate($(this).val()) ? ddmmyyyyToyyyymmddFormat($(this).val()) : null;
                } else {
                    return $(this).css('text-transform') == 'uppercase' ? $(this).val().trim().toUpperCase() : (($(this).css('text-transform') == 'lowercase') ? $(this).val().trim().toLowerCase() : $(this).val().trim());
                }
            }
            if ($(this).hasClass('text-search')) {
                var element = this;
                if (value === null || value === "") {
                    $(this).val('');
                    $(element).data('data-value', '');
                    var preClass = $(element).attr('data-prefix-class');
                    var destinationIds = $(element).attr('data-destination-id');
                    if (destinationIds) {
                        var ids = destinationIds.split(',');
                        $.map(ids, function (id, index) {
                            TextSearchClearInput(preClass, id);
                        });
                    }
                } else {
                    $(this).val(value);
                    var validateUrl = 'api/Common/ValidateSearch?value=' + value + '&table=' + $(element).attr('data-table') + '&column=' + $(element).attr('data-field-name') + '&firstFilter=' + $(element).attr('data-first-filter');
                    $.ajax({
                        url: validateUrl,
                        dataType: 'json',
                        type: 'GET',
                        async: false,
                        success: function (data) {
                            if (data == null) {
                                $(element).data('data-value', '');
                            } else {
                                $(element).attr('value-changed', false);
                                let item = data[0];
                                $(element).data('data-value', JSON.stringify(item));
                                TextSearchFillData(element, item);
                            }
                        },
                    });
                }
            } else if ($(this).hasClass('text-date')) {                
                if (value === null || value === '') {
                    $(this).val('__/__/____');
                } else {
                    $(this).val(datetimeToStringShort(value));
                }
                $(this).trigger('change');
            } else if ($(this).hasClass('text-option')) {
                if (value === null || value === '') {
                    $(this).val('');
                } else {
                    $(this).val(value);
                }
                $(this).trigger('change');
            } else if ($(this).hasClass('text-number')) {
                if (value === null || value === '') {
                    $(this).attr('numericvalue', $(this).val());
                    if ($(this).attr('hidezero') == "true" && parseFloat($(this).attr('numericvalue')) == 0) {
                        $(this).val('');
                    } else {
                        $(this).val(number_to_text(parseFloat(value), number_decimalscale($(this).attr('scale')), null, $(this).attr("decimal") ? parseInt($(this).attr("decimal")) : null));
                    }
                } else {
                    $(this).attr('numericvalue', value);
                    if ($(this).attr('hidezero') == "true" && parseFloat($(this).attr('numericvalue')) == 0) {
                        $(this).val('');
                    } else {
                        $(this).val(number_to_text(parseFloat(value), number_decimalscale($(this).attr('scale')), null, $(this).attr("decimal") ? parseInt($(this).attr("decimal")) : null));
                    }
                }
                $(this).trigger('change');
            } else if ($(this).is(':checkbox')) {
                if (value === true || value === 'true') {
                    $(this).prop('checked', true);
                } else if (value === false || value === 'false') {
                    $(this).prop('checked', false);
                }
                $(this).trigger('change');
            } else if ($(this).is(':radio')) {
                $(this).each(function () {
                    if (value === $(this).val() || (value + '') === $(this).val()) {
                        $(this).prop('checked', true);
                    } else {
                        $(this).prop('checked', false);
                    }
                });
                $(this).trigger('change');
            } else {
                if (value === null || value === '') {
                    $(this).val('');
                } else {
                    $(this).val(value);
                }
                $(this).trigger('change');
            }
        } else if ($(this).is('textarea')) {
            if (value === undefined) {
                return $(this).val();
            } else {
                if (value === null || value === '') {
                    $(this).val('');
                } else {
                    $(this).val(value);
                }
                $(this).trigger('change');
            }
        } else if ($(this).is('select')) {
            if ($(this).hasClass('text-multi-select')) {
                if (value === undefined) {
                    let value = $(this).chosen().val();
                    let text = $(this).chosen().find("option:selected").map(function () {
                        return $(this).text();
                    });
                    let result = new Array();
                    value != null && value.forEach(function (d, i) {
                        let obj = new Object();
                        obj.value = d;
                        obj.caption = text[i];
                        result.push(obj);
                    });
                    return result;
                } else {
                    let _value = new Array();;
                    value.forEach(function (v) {
                        _value.push(v.value);
                    });
                    $(this).val(_value);
                    $(this).chosen().trigger('chosen:updated');
                    
                }
            } else {
                if (value === undefined) {
                    return $(this).val();
                } else {
                    if (value === null || value === '') {
                        $(this).val('');
                    } else {
                        $(this).val(value);
                    }
                    $(this).trigger('change');
                }
            }
        }

        return $(this).length == 0 ? '' : $(this);
    }
});

number_decimalscale = function (type) {
    switch (type) {
        case 'CalculatorDecimals':
            return ApplicationInstance.Uservar.CalculatorDecimals;

        case 'QuantityDecimals':
            return ApplicationInstance.Uservar.QuantityDecimals;

        case 'NormQuantity':
            //return 1;//20230714
            return ApplicationInstance.Uservar.NormQuantity;//20230714

        case 'RatioFormat':
            return ApplicationInstance.Uservar.RatioFormat;

        case 'LCPriceDecimals':
            return ApplicationInstance.Systemvar.LCPriceDecimals;

        case 'FCPriceDecimals':
            return ApplicationInstance.Systemvar.FCPriceDecimals;

        case 'LCAmountDecimals':
            return ApplicationInstance.Systemvar.LCAmountDecimals;

        case 'FCAmountDecimals':
            return ApplicationInstance.Systemvar.FCAmountDecimals;

        case 'PercentDecimals':
            return ApplicationInstance.Systemvar.PercentDecimals;

        case 'VATPercentDecimals':
            return ApplicationInstance.Systemvar.VATPercentDecimals;

        case 'DiscountPercentDecimals':
            return ApplicationInstance.Systemvar.DiscountPercentDecimals;

        case 'ExchangeFormat':
            return ApplicationInstance.Systemvar.ExchangeFormat;

        default:
            return 0;
    }
}

text_to_number = function (number) {
    if (number == null || !number.trim())
        return 0;

    return parseFloat(number.replace(new RegExp('\\' + ApplicationInstance.Uservar.GroupingSymbol, 'g'), '').replace(new RegExp('\\' + ApplicationInstance.Uservar.DecimalSymbol, 'g'), '.'));
}

number_to_text = function (number, decimalscale, hidezero, decimal) {
    number = (number == "" || number == null ? 0 : number);
    number = number.toFixed(decimalscale);

    var nstr = number.toString();
    nstr += '';
    x = nstr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? ApplicationInstance.Uservar.DecimalSymbol + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    if (decimal) {
        rgx = new RegExp("(\\d+)(\\d{" + decimal + "})");
    }
    while (rgx.test(x1))
        x1 = x1.replace(rgx, '$1' + ApplicationInstance.Uservar.GroupingSymbol + '$2');
    var num = x1 + x2;
    if (hidezero == true || hidezero == "true") {
        if (number == 0) {
            return "";
        }
    }
    return num;
}

number_keypress = function ($this, which, key, callback) {
    var length = $this.val().length;
    var selectionStart = $this.prop('selectionStart');
    var selectionEnd = $this.prop('selectionEnd');
    var number = $this.attr('numericvalue');
    var nvalue = $this.val();
    var decimalscale = number_decimalscale($this.attr('scale'));
    var decimal = $this.attr('decimal');
    var maxlength = $this.attr('maxlength');
    var right = length - selectionEnd;
    
    if ((selectionEnd > selectionStart || selectionEnd < length || decimalscale == 0) && which > 47 && which < 58) { // 0 -> 9
        if (length == (selectionEnd - selectionStart)) {
            nvalue = key;
            right = (decimalscale > 0 ? decimalscale + 1 : 0);
        } else {
            if (maxlength && maxlength == $this.val().length) return;
            nvalue = nvalue.substring(0, selectionStart) + key + nvalue.substring(selectionEnd, nvalue.length);

            if (length - selectionEnd <= decimalscale)
                right--;
        }
    } else if (which == 44 || which == 46) { // .,
        if (maxlength && maxlength == $this.val().length) return;
        right = decimalscale;
    }

    number = parseFloat(nvalue.replace(new RegExp('\\' + ApplicationInstance.Uservar.GroupingSymbol, 'g'), '').replace(new RegExp('\\' + ApplicationInstance.Uservar.DecimalSymbol, 'g'), '.'));
    $this.val(number_to_text(number, decimalscale, null, decimal));
    $this.attr('numericvalue', number);

    $this.prop('selectionStart', $this.val().length - right);
    $this.prop('selectionEnd', $this.val().length - right);

    //Update clusterize
    $this.trigger("input");
    $this.trigger("change");
}

number_keydown = function ($this, which, key, callback) {

    var length = $this.val().length;
    var selectionStart = $this.prop('selectionStart');
    var selectionEnd = $this.prop('selectionEnd');
    var number = $this.attr('numericvalue');
    var nvalue = $this.val();
    var decimalscale = number_decimalscale($this.attr('scale'));
    var decimal = $this.attr('decimal');
    var right = length - selectionEnd;

    if ((which == 8 || which == 46)) { // Backspace Delete
        if (selectionStart < selectionEnd) {
            if (length - selectionEnd <= decimalscale) {
                if (length - selectionStart > decimalscale) {
                    nvalue = nvalue.substring(0, selectionStart) + ApplicationInstance.Uservar.DecimalSymbol + "0".repeat(decimalscale + length - selectionEnd) + nvalue.substring(selectionEnd, length);
                } else {
                    nvalue = nvalue.substring(0, selectionStart) + "0".repeat(selectionEnd - selectionStart) + nvalue.substring(selectionEnd, length);
                }
            } else {
                nvalue = nvalue.substring(0, selectionStart) + nvalue.substring(selectionEnd, length);
            }

            if (nvalue == "" || parseFloat(nvalue.replace(new RegExp('\\' + ApplicationInstance.Uservar.GroupingSymbol, 'g'), '').replace(new RegExp('\\' + ApplicationInstance.Uservar.DecimalSymbol, 'g'), '.')) == 0) {
                right = (decimalscale > 0 ? decimalscale + 1 : 0);
            }
        } else if (which == 8 && (nvalue.substring(selectionStart - 1, selectionStart) == ApplicationInstance.Uservar.DecimalSymbol || nvalue.substring(selectionStart - 1, selectionStart) == ApplicationInstance.Uservar.GroupingSymbol)) {
            right++;
        } else if (which == 46 && (nvalue.substring(selectionStart + 1, selectionStart) == ApplicationInstance.Uservar.DecimalSymbol || nvalue.substring(selectionStart + 1, selectionStart) == ApplicationInstance.Uservar.GroupingSymbol)) {
            right--;
        } else if (which == 8) { // Key Backspace = 8
            nvalue = nvalue.substring(0, (selectionStart == 0 ? selectionStart : selectionStart - 1)) + nvalue.substring(selectionEnd, length);

            if (length - selectionEnd <= decimalscale && decimalscale != 0) {
                right++;
            }
        } else { // Key Delete = 46
            if (length - selectionEnd <= decimalscale) {
                nvalue = nvalue.substring(0, selectionStart) + "0" + nvalue.substring((selectionEnd == length ? selectionEnd : selectionEnd + 1), length);
                right--;
            } else {
                nvalue = nvalue.substring(0, selectionStart) + nvalue.substring((selectionEnd == length ? selectionEnd : selectionEnd + 1), length);
            }
        }
    } else if (which == 86 || which == 88) { // ^V ^X
    } else if (which == 189) { // Minus
        if (number > 0) {
            nvalue = "-" + nvalue;
        } else {
            nvalue = nvalue.replace('-', '');
        }
    }

    nvalue = (nvalue == "" || nvalue == "-" || nvalue == ApplicationInstance.Uservar.DecimalSymbol ? "0" : nvalue);
    number = parseFloat(nvalue.replace(new RegExp('\\' + ApplicationInstance.Uservar.GroupingSymbol, 'g'), '').replace(new RegExp('\\' + ApplicationInstance.Uservar.DecimalSymbol, 'g'), '.'));
    $this.val(number_to_text(number, decimalscale, null, decimal));
    $this.attr('numericvalue', number);

    if ($this.val().length - right > 0 && right > 0) {
        $this.prop('selectionStart', $this.val().length - right);
        $this.prop('selectionEnd', $this.val().length - right);
    } else if ($this.val().length - right == 0 && right > 0) {
        $this.prop('selectionStart', $this.val().length - right + 1);
        $this.prop('selectionEnd', $this.val().length - right + 1);
    } else if ($this.val().length - right < 0) {
        $this.prop('selectionStart', 0);
        $this.prop('selectionEnd', 0);
    } else if (right <= 0) {
        $this.prop('selectionStart', $this.val().length);
        $this.prop('selectionEnd', $this.val().length);
    }
    //Update clusterize
    $this.trigger("change");
}

function customtextselect_blink_play(e) {
    if (e.propertyName == "background-color") {
        if ($(e.target).hasClass("stateTwo")) {
            $(e.target).removeClass("stateTwo").addClass("stateOne");
        } else {
            $(e.target).removeClass("stateOne").addClass("stateTwo");
        }
    }
}

function customtextselect_blink_stop(elem) {
    $(elem)[0].removeEventListener("transitionend", customtextselect_blink_play, false);
    $(elem).removeClass("stateTwo").removeClass("stateOne");
}

function customtextselect_blink_start(elem) {
    $(elem)[0].addEventListener("transitionend", customtextselect_blink_play, false);
    $(elem).addClass("stateTwo");
}

function customtextselect_scroll(element, isUp) {
    if (element.length == 0) return;
    let scroll = $(element.closest("div"));
    let scrollHeight = scroll[0].getBoundingClientRect().height;
    let elementTop = element[0].getBoundingClientRect().top - scroll[0].getBoundingClientRect().top;
    let elementHeight = element[0].getBoundingClientRect().height;

    if (isUp == false) {// key down
        let index = $("li", $(element).closest("ul")).index(element);
        if (index == 0) {
            scroll[0].scrollTop = 0;
            return;
        }

        if (elementTop + 2 * elementHeight > scrollHeight) {
            scroll[0].scrollTop += elementTop + 2 * elementHeight - scrollHeight + 1;
        }
    } else {// key up
        if (elementTop - elementHeight < 0) {
            scroll[0].scrollTop += elementTop - elementHeight + 1;
        }
    }
}

function sortByKey(array, key, condition) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        if (condition === "DESC") {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        } else {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
    });
}

function ShowCenterModal(controlId, isHide) {
    ShowModalCenterOfParent('desk_' + controlId, 'desk_' + controlId + ' .s3tcloud-prefix.form-container', 'modal_' + controlId + ' .popup-modal-form', isHide);
}

function ShowModalCenterOfParent(parent, container, modal, isHide) {
    //TableClearFocus($('#' + container + " table"));
    TableClearFocus($('#' + parent + ' table'));
    DisableResizeTable($('#' + parent + ' table'));

    let width1 = $('#' + container).width();
    let height1 = $('#' + container).height();

    let width2 = $('#' + modal).width();
    let height2 = $('#' + modal).height();

    $('#' + modal).css({ 'left': (width1 / 2 - width2 / 2) + 'px', 'top': (height1 / 2 - height2 / 2) + 'px' });

    if (isHide != true) {
        $('#' + parent + " .popup-modal-background").show();
        $('#' + parent + " .popup-modal-background").focus();
        $('#' + modal).show();
        $('#' + modal).focus();
    }
}

function Modal_OnShow(modalInfo) {
    var t = new Date().getMilliseconds();
    $.ajax({
        url: "./html/" + modalInfo.HtmlId + ".html?t=" + t,
        type: "GET",
        dataType: "html",

        success: function (code) {
            code = code.replace(/\_____controlid_____/g, modalInfo.ControlId);
            code = code.replace(/\_____parentid_____/g, modalInfo.ParentId);

            $('#modal_' + modalInfo.ParentId + ' .popup-modal-background').empty()
                .append(code)
                .ready(function () {
                    ShowCenterModal(modalInfo.ParentId);

                    let init = modalInfo.ControlId + "_Init";
                    init = eval(init);
                    init(modalInfo);
                });
        },

        error: function (e) {
            let id = modalInfo.ParentId + "_AlertMessage";
            let alert = eval(id);
            alert.showError("Common_Msg_UnknownError");
        }
    });
}

function ShowChildTreeTable(clusterize_data, row) {
    let screenInfo = $(row).closest('table').data('screen-info');
    let id = $(row).find('th').attr('clusterize_row_id');
    let controlId = $(row).closest('table').attr('controlid');
    let htmlId = $(row).closest('table').attr('htmlid');

    let currentRowIndex = clusterize_data.data.findIndex(function (o) {
        return o.Id === id;
    })
    if (screenInfo) {
        screenInfo = JSON.parse(screenInfo);
        screenInfo.Code = clusterize_data.data[currentRowIndex][window[controlId + "_TableColumnCode"]];
        screenInfo.DataSource = JSON.stringify(clusterize_data.data[currentRowIndex]);
        screenInfo.TabId = GetElementScreenInfo(row).TabId + screenInfo.Id;
        AddTab(screenInfo, true, screenInfo.Code);
    } else {
        let index = ApplicationInstance.Menu.findIndex(function (o) {
            return o.ControlId === htmlId;
        });
        screenInfo = new Object();
        let childId = ApplicationInstance.Menu[index].ChildId;
        index = ApplicationInstance.Menu.findIndex(function (o) {
            return o.Id === childId;
        })
        if (index != -1) {
            screenInfo.Title = ApplicationInstance.Menu[index].Bar;
            screenInfo.Title_E = ApplicationInstance.Menu[index].Bar_E;
            screenInfo.Id = ApplicationInstance.Menu[index].ControlId;
            screenInfo.TabId = GetElementScreenInfo(row).TabId + screenInfo.Id;
            screenInfo.Type = ApplicationInstance.Menu[index].ControlType;
            screenInfo.Dock = ApplicationInstance.Menu[index].DockStyle;
            screenInfo.ChildId = ApplicationInstance.Menu[index].ChildControlId;
            screenInfo.RightId = ApplicationInstance.Menu[index].SubId;
            screenInfo.RightType = ApplicationInstance.Menu[index].Type;
            screenInfo.Code = clusterize_data.data[currentRowIndex][window[controlId + "_TableColumnCode"]];
            screenInfo.DataSource = JSON.stringify(clusterize_data.data[currentRowIndex]);
            AddTab(screenInfo, true, screenInfo.Code);
        }
    }
}

function TableClearFocus(table) {
    // deselect everything select table
    $(table).each(function (i, e) {
        if ($(this).attr("controlid")) {
            let s3table = eval($(this).attr("controlid") + "_S3Table");
            if (s3table)
                s3table.ClearFocus();
        }

    })
}

function DisableResizeTable(table) {
    //disable resize when show modal    
    $(table).closest('.clusterize-scroll').find('.JCLRgrip').addClass('JCLRdisabledGrip JCLRdisabledResize').unbind('touchstart mousedown');

}

async function ExportReportToPDF(report) {
    let pdfData = await new Promise((render) => {
        report.renderAsync(async () => {
            // Export to PDF
            let pdfData = await new Promise((resolve) => {
                report.exportDocumentAsync((pdfData) => {
                    resolve(pdfData);
                }, Stimulsoft.Report.StiExportFormat.Pdf);
            })
            render(pdfData);
        });
    });
    return pdfData;
}

function getFile(file) {
    var reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onerror = () => { reader.abort(); reject(new Error("Error parsing file")); }
        reader.onload = function () {

            //This will result in an array that will be recognized by C#.NET WebApi as a byte[]
            let bytes = Array.from(new Uint8Array(this.result));

            //if you want the base64encoded file you would use the below line:
            let base64StringFile = btoa(bytes.map((item) => String.fromCharCode(item)).join(""));

            //Resolve the promise with your custom file structure
            resolve({
                bytes: bytes,
                base64StringFile: base64StringFile,
                fileName: file.name,
                fileType: file.type
            });
        }
        reader.readAsArrayBuffer(file);
    });
}

function isEmpty(value) {
    if (value === null || value === undefined) {
        return true;
    }
    if (typeof value === 'string' && value.trim() === '') {
        return true;
    }
    if (Array.isArray(value) && value.length === 0) {
        return true;
    }
    if (typeof value === 'object' && Object.keys(value).length === 0) {
        return true;
    }
    if (typeof value === 'number' && isNaN(value)) {
        return true;
    }
    return false;
}

function base64ToFile(base64String, fileName) {
    if (!base64String || typeof base64String !== 'string') {
        throw new Error('base64String không hợp lệ hoặc rỗng');
    }

    if (!fileName || typeof fileName !== 'string') {
        throw new Error('fileName không hợp lệ hoặc rỗng');
    }

    let mime = 'application/octet-stream'; 
    let data = base64String;

    if (base64String.includes('base64,')) {
        const arr = base64String.split(',');
        if (arr.length < 2) {
            throw new Error('Chuỗi base64 không đúng định dạng');
        }
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (mimeMatch && mimeMatch[1]) {
            mime = mimeMatch[1];
            data = arr[1];
        }
    } else {
        const ext = fileName.split('.').pop().toLowerCase();
        const mimeTypes = {
            pdf: 'application/pdf',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            txt: 'text/plain',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        };
        mime = mimeTypes[ext] || 'application/octet-stream';
    }

    let bstr;
    try {
        bstr = atob(data);
    } catch (error) {
        throw new Error('Lỗi giải mã base64: ' + error.message);
    }

    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    let i = n;
    while (i--) {
        u8arr[i] = bstr.charCodeAt(i);
    }

    return new File([u8arr], fileName, { type: mime });
}

function setFileToInput(inputId, base64String, fileName) {
    const input = document.getElementById(inputId);
    if (!input) {
        console.error('Input không tồn tại');
        return;
    }
    const file = base64ToFile(base64String, fileName);
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    input.files = dataTransfer.files;
    const event = new Event('change', { bubbles: true });
    input.dispatchEvent(event);
}


function DownloadFile(base64String, fileName, fileType) {

    if (!base64String || typeof base64String !== 'string') {
        console.error('base64String không hợp lệ hoặc rỗng');
        return;
    }
    if (!fileName || typeof fileName !== 'string') {
        console.error('fileName không hợp lệ hoặc rỗng');
        return;
    }
    let mime = fileType || 'application/octet-stream';
    if (!fileType) {
        const ext = fileName.split('.').pop().toLowerCase();
        const mimeTypes = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            pdf: 'application/pdf',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
        mime = mimeTypes[ext] || 'application/octet-stream';
    }

    const base64WithHeader = base64String.startsWith('data:')
        ? base64String
        : `data:${mime};base64,${base64String}`;

    try {
        const link = document.createElement('a');
        link.href = base64WithHeader;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Lỗi khi tải xuống file:', error.message);
    }
}

async function dataFromUrl(url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let reader = new FileReader();
            reader.onloadend = function () {
                resolve(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    });
}

function displayFileInfo(base64String, fileName,elementId,fileType) {
    if (!base64String || typeof base64String !== 'string') {
        console.error('base64String không hợp lệ hoặc rỗng');
        return;
    }

    if (!fileName || typeof fileName !== 'string') {
        console.error('fileName không hợp lệ hoặc rỗng');
        return;
    }

    const inputElement = document.getElementById(elementId);
    if (!inputElement) {
        console.error(`Không tìm thấy input với id: ${elementId}`);
        return;
    }
    const existingDiv = inputElement.nextSibling;
    if (existingDiv && existingDiv.tagName === 'DIV' && existingDiv.textContent.startsWith('File đã tải lên')) {
        existingDiv.remove();
    }
    const fileInfoDiv = document.createElement('div');
    fileInfoDiv.style.margin = '10px';
    //fileInfoDiv.textContent = `File đã tải lên: ${fileName}`;
    const divtext = document.createElement('div');
    divtext.textContent = `File đã tải lên: ${fileName}`;
    fileInfoDiv.appendChild(divtext);
    let mime = fileType || 'application/octet-stream';
    if (!fileType) {
        const ext = fileName.split('.').pop().toLowerCase();
        const mimeTypes = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            pdf: 'application/pdf',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
        mime = mimeTypes[ext] || 'application/octet-stream';
    }

    const base64WithHeader = base64String.startsWith('data:')
        ? base64String
        : `data:${mime};base64,${base64String}`;

    if (mime.startsWith('image/')) {
        // Preview cho ảnh
        const img = document.createElement('img');
        img.src = base64WithHeader;
        img.style.maxWidth = '200px';
        img.style.marginTop = '10px';
        fileInfoDiv.appendChild(img);
    } else if (mime === 'application/pdf') {
        // Preview cho PDF
        const iframe = document.createElement('iframe');
        iframe.src = base64WithHeader;
        iframe.style.width = '100%';
        iframe.style.height = '300px';
        iframe.style.marginTop = '10px';
        fileInfoDiv.appendChild(iframe);
    } else if (mime === 'application/msword' || mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Hiển thị thông báo cho Word
        const message = document.createElement('p');
        message.textContent = 'Tệp Word không hỗ trợ xem trước trực tiếp.Chỉ hỗ trợ xem trước với tài liệu PDF,Image. Tải xuống để xem nội dung.';
        message.style.color = 'blue';
        fileInfoDiv.appendChild(message);
        // Tạo liên kết tải xuống
        const downloadLink = document.createElement('a');
        downloadLink.href = base64WithHeader;
        downloadLink.download = fileName;
        downloadLink.textContent = 'Tải xuống tệp Word';
        downloadLink.style.display = 'block';
        downloadLink.style.marginTop = '10px';
        fileInfoDiv.appendChild(downloadLink);
    } else if (mime === 'application/vnd.ms-excel' || mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // Hiển thị thông báo cho Excel
        const message = document.createElement('p');
        message.textContent = 'Tệp Excel không hỗ trợ xem trước trực tiếp. Chỉ hỗ trợ xem trước với tài liệu PDF,Image. Tải xuống để xem nội dung.';
        message.style.color = 'blue';
        fileInfoDiv.appendChild(message);
        // Tạo liên kết tải xuống
        const downloadLink = document.createElement('a');
        downloadLink.href = base64WithHeader;
        downloadLink.download = fileName;
        downloadLink.textContent = 'Tải xuống tệp Excel';
        downloadLink.style.display = 'block';
        downloadLink.style.marginTop = '10px';
        fileInfoDiv.appendChild(downloadLink);
    } else {
        // Hiển thị thông báo cho các loại file không hỗ trợ preview
        const message = document.createElement('p');
        message.textContent = 'Loại tệp không hỗ trợ xem trước.Chỉ hỗ trợ xem trước với tài liệu PDF,Image';
        message.style.color = 'gray';
        fileInfoDiv.appendChild(message);
    }
    // Thêm fileInfoDiv ngay sau inputElement
    inputElement.parentNode.insertBefore(fileInfoDiv, inputElement.nextSibling);
}

async function dataFromUrl(url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            let reader = new FileReader();
            reader.onloadend = function() {
                resolve(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    });
}

function base64ToArrayBuffer(data) {
    var bString = window.atob(data);
    var bLength = bString.length;
    var bytes = new Uint8Array(bLength);
    for (var i = 0; i < bLength; i++) {
        var ascii = bString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
};

function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
}

function SelectDataRow(table, column, value) {
    let result = null;
    if (table && column && value) {
        var validateUrl = 'api/Common/ValidateSearch?value=' + value + '&table=' + table + '&column=' + column;
        $.ajax({
            url: validateUrl,
            dataType: "json",
            type: "GET",
            async: false,
            success: function (data) {
                if (data && data.length > 0)
                    result = data[0];
            },
        });
    }
    return result;
}

function SelectExchangeRate(currencyCode, exchangeRate) {
    let result = new Object();

    if (currencyCode == ApplicationInstance.Systemvar.DefaultCurrency) {
        result.Ma_Tte = currencyCode;
        result.Loai_Tte = 0;
        result.Ty_Gia = 1;
        result.Ty_Gia_Ht = 1;
    } else {
        result = SelectDataRow('DmTte', 'Ma_Tte', currencyCode);

        if (result != null) {
            if (exchangeRate != undefined && exchangeRate != 0) {
                result.Ty_Gia = exchangeRate;
            }

            if (parseInt(result.Loai_Tte) == 0) {
                result.Ty_Gia_Ht = result.Ty_Gia;
            } else {
                result.Ty_Gia_Ht = 1 / result.Ty_Gia;
            }
        } else {
            result = new Object();

            result.Ma_Tte = currencyCode;
            result.Loai_Tte = 0;
            result.Ty_Gia = exchangeRate == undefined ? 1 : exchangeRate;
            result.Ty_Gia_Ht = exchangeRate == undefined ? 1 : exchangeRate;
        }
    }

    return result;
}

function GetElementScreenInfo(element) {
    let oScreenInfo = $(element).closest(".main-desktop").data('screen-info');

    if (oScreenInfo) {
        oScreenInfo = JSON.parse(oScreenInfo)
    } else {
        oScreenInfo = new Object();
        oScreenInfo.TabId = CreateUUIDNoSaperate();
    }
    return oScreenInfo;
}

/* autocomplete*/
$.widget('custom.tableAutocomplete', $.ui.autocomplete, {
    _create: function () {
        this._super();
        this.widget().menu("option", "items", ".ui-menu-item");
    },
    _renderMenu: function (ul, data) {
        let self = this;
        let $table = $('<table class="table-autocomplete">'),
            $tbody = $('<tbody>');
        $table.append($tbody);

        ul.html($table);
        let columns = data[1];
        let items = data[2];
        $(this.element[0]).attr("autocomplete-id", ul.attr('id'));
        let fieldName = $(this.element[0]).attr('data-field-name');
        if (!fieldName) {
            fieldName = data[0].value.trim();
            $(this.element[0]).attr('data-field-name', fieldName);
        }

        var arrayItems = $.map(items, function (value, index) {
            return [value];
        });
        if (arrayItems.length > 0) {
            $.each(arrayItems, function (index, item) {
                self._renderItemData(ul, ul.find("table tbody"), item, columns);
            });
        }
    },
    _renderItemData: function (ul, table, item, columns) {
        return this._renderItem(table, item, columns).data("ui-autocomplete-item", item);
    },
    _renderItem: function (table, item, columns) {
        var $tr = $('<tr class="ui-menu-item" role="presentation">');

        $.each(columns, function (index, value) {
            var field = value.trim();
            if (field.toLowerCase() === "id") {
                return; // skip vòng lặp này
            }

            var cellContent = !item[field] ? '' : item[field];
            if (typeof cellContent == "number") {
                $("<td style='text-align:right;'>").text(number_to_text(cellContent, 2)).appendTo($tr);
            } else {
                $("<td>").text(cellContent).appendTo($tr);
            }
        });

        return $tr.appendTo(table);
    }
});

function selectItem(_this, ui) {
    if (ui.item != undefined && !goolgeautocomplete_Searching) {
        $(_this).data('data-value', JSON.stringify(ui.item));

        $(_this).val(ui.item[$(_this).attr('data-field-name')]);
        $(_this)[0].setSelectionRange(0, $(_this).val().length);

        var callback = $(_this).data('callback');
        if (eval("typeof " + callback + " === 'function'")) {
            var cb = eval(callback);
            cb(ui.item, _this);
        }
        $.powerTip.closeTip(_this, true);
    }
}

function textSearchCustomScroll(id, event) {
    var hasVerticalScrollbar = $("#" + id)[0].scrollHeight > $("#" + id)[0].clientHeight;
    if (hasVerticalScrollbar) {
        var focused = $("#" + id + " .table-autocomplete .ui-menu-item.ui-state-focus");

        if (event.keyCode == 38) {
            textSearchScrollVertical(id, focused, true);
        } else if (event.keyCode == 40) {
            textSearchScrollVertical(id, focused, false);
        }
    }
}

function textSearchScrollVertical(id, element, isUp) {
    let table = element.closest("table");
    let scroll = $("#" + id);

    let headerHeight = (table.find("thead").length != 0 ? table.find("thead")[0].getBoundingClientRect().height : 0);
    let scrollHeight = scroll[0].getBoundingClientRect().height - headerHeight -
        (table.parent()[0].scrollWidth > table.parent()[0].clientWidth ? ApplicationInstance.ScrollbarWidth : 0);
    let elementTop = element[0].getBoundingClientRect().top - scroll[0].getBoundingClientRect().top - headerHeight;
    let elementHeight = element[0].getBoundingClientRect().height;

    if (isUp == false) {// key down
        let index = $("tr", $(element).closest("table")).index(element);
        if (index == 0) {
            scroll[0].scrollTop = 0;
            return;
        }

        if (elementTop + elementHeight > scrollHeight) {
            scroll[0].scrollTop += elementTop + elementHeight - scrollHeight + 1;
            $("#" + id).attr("first-focus", "true");
        }
    } else {// key up
        if (elementTop < 0) {
            scroll[0].scrollTop += elementTop + 1;
            $("#" + id).attr("first-focus", "true");
        }
    }
}

function textSearchOpen(event) {
    $('.ui-autocomplete .ui-menu-item:first').trigger('mouseover');
    let id = $(event.target).attr('autocomplete-id');
    let myself = { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };

    myself.width = ($(event.target).parent().is("td") ? $(event.target).parent().outerWidth() : $(event.target).outerWidth());
    myself.height = ($(event.target).parent().is("td") ? $(event.target).parent().outerHeight() : $(event.target).outerHeight());
    myself.top = $(event.target).offset().top - ($(event.target).parent().is("td") ? parseFloat($(event.target).parent().css("padding-top")) + parseFloat($(event.target).css("margin-top")) + 3 : 0);
    myself.left = $(event.target).offset().left - ($(event.target).parent().is("td") ? parseFloat($(event.target).parent().css("padding-left")) + parseFloat($(event.target).css("margin-left")) + 1 : 0);
    myself.bottom = $("#" + id).offset().top + ($(event.target).parent().is("td") ? parseFloat($(event.target).parent().css("padding-bottom")) + parseFloat($(event.target).css("margin-bottom")) + 3 : 0); //myself.top + myself.height;
    myself.right = myself.left + myself.width + 1;
    myself.tableWidth = $("#" + id + " table").outerWidth();
    myself.tableHeight = $("#" + id + " table").outerHeight();
    myself.ulWidth = $("#" + id).outerWidth();
    myself.ulHeight = $("#" + id).outerHeight();
    myself.ulTop = myself.bottom;
    myself.ulLeft = myself.left;

    if (myself.tableHeight <= window.innerHeight - myself.bottom) {
        //Chiều cao Table nhỏ hơn phía dưới => BOTTOM

    } else if (myself.top > window.innerHeight - myself.top) {
        //Chiều cao của Table lớn hơn phía dưới, mà chiều cao của phía trên lớn hơn chiều cao phía dưới => TOP

        if (myself.bottom >= myself.tableHeight) {
            //Nếu chiều cao phía trên lớn hơn hoặc bằng Table, thì chỉnh vị trí trên của thẻ UL
            myself.ulTop = myself.top - myself.ulHeight;
        } else {
            //Nếu chiều cao phía trên nhỏ hơn Table, thì chỉnh chiều cao của thẻ UL
            myself.ulTop = 0;
            $("#" + id).css({ "max-height": myself.top });
        }
    } else {
        //Chiều cao của Table lớn hơn phía dưới, đồng thời, chiều cao của phía trên nhỏ hơn chiều cao phía dưới => BOTTOM
        $("#" + id).css({ "max-height": window.innerHeight - myself.bottom });
    }

    if (myself.tableWidth <= window.innerWidth - myself.left) {
        //Độ rộng của Table nhỏ hơn phía phải => RIGHT

    } else if (myself.right > window.innerWidth - myself.left) {
        //Độ rộng của Table lớn hơn phía phải, mà độ rộng của phía trái lớn hơn độ rộng phía phải => LEFT

        if (myself.right >= myself.tableWidth) {
            //Nếu phía trái lớn hơn hoặc bằng Table, thì chỉnh vị trí trái của thẻ UL
            myself.ulLeft = myself.right - myself.ulWidth;
        } else {
            //Nếu phía trái nhỏ hơn Table, thì chỉnh độ rộng của thẻ UL
            myself.ulLeft = 0;
            $("#" + id).css({ "max-width": myself.right });
        }
    } else {
        //Độ rộng của Table lớn hơn phía phải, đồng thời, độ rộng của phía trái nhỏ hơn độ rộng phía phải => RIGHT
        $("#" + id).css({ "max-width": window.innerWidth - myself.left });
    }

    //Thiết lập vị trí hiển thị kết quả tìm kiếm
    $("#" + id).offset({ top: myself.ulTop, left: myself.ulLeft });

    let hasVerticalScrollbar = $("#" + id)[0].scrollHeight > $("#" + id)[0].clientHeight;
    if (hasVerticalScrollbar) {
        let scroll = $("#" + id);
        scroll[0].scrollTop = 0;
    }
}

function getTextSearchField(element, column) {
    var data = $(element).data('data-value');

    if (data) {
        data = JSON.parse(data);
        if (column) {
            return data[column];
        } else {
            return data;
        }
    } else {
        if ($(element).val() == "") return "";
        var result = "";
        var validateUrl = 'api/Common/ValidateSearch?value=' + $(element).val() + '&table=' + $(element).attr('data-table') + '&column=' + $(element).attr('data-field-name') + '&firstFilter=' + $(element).attr('data-first-filter');
        $.ajax({
            url: validateUrl,
            dataType: "json",
            type: "GET",
            async: false,
            success: function (data) {
                if (data) {
                    var item = data[0];
                    $(element).data('data-value', JSON.stringify(item));
                    result = item[column];
                    if (column) {
                        result = item[column];
                    } else {
                        result = item;
                    }
                } else {
                    $(element).data('data-value', "");
                }
            },
        });
        return result;
    }
}

function initTextMultiSelect(element) {
    element.each(function () {
        let input = $(this);
        let table = input.attr("table");
        let captionField = input.attr("caption-field");
        let valueField = input.attr("value-field");
        let url = 'api/Common/MultiSelect?table=' + table + '&captionField=' + captionField + '&valueField=' + valueField;
        let disableSearch = input.attr("disable-search") == "true";
        $.ajax({
            url: url,
            dataType: "json",
            type: "GET",
            async: false,
            success: function (data) {
                if (data && data.length > 0) {
                    data.forEach(function (d, i) {
                        input.append('<option value="' + d.value + '">' + d.caption + '</option>');
                    });
                }
            },
        });

        input.chosen({ no_results_text: 'Oops, nothing found!', width: '95%' });
        if (disableSearch == true) {
            $(input).next().find(".chosen-drop").remove();
            $(input).next().find(".chosen-search-input").attr("readonly", true);
        }
    });
}

function initTextSearch(element) {
    element.each(function () {
        let input = $(this);
        let build = function (input) {
            if (!input.parent().is('td')) {
                let width = input.outerWidth();
                let parentWidth = input.parent().outerWidth();
                let percent = Math.round(100 * width / parentWidth);
                if (percent == 100) {
                    input.wrap("<div class='modal-textbox' style='width:100%;'></div>");
                } else {
                    input.wrap("<div class='modal-textbox'></div>");
                    input.parent().width(input.outerWidth());
                }
            }

            $(input).tableAutocomplete({
                position: { my: "left top", at: "left bottom" },
                source: function (request, response) {
                    if (!request.term) {
                        response(null);
                    }
                    let fieldName = input.attr("data-field-name");
                    let startPos = parseInt(input.attr("data-start-position"));
                    if (fieldName == undefined || !fieldName || request.term.length < startPos) {
                        response(null);
                    }

                    let filterType = input.attr('data-filter-type') == undefined ? false : input.attr('data-filter-type') == 'true';
                    let filterFields = input.attr("data-filter-fields") == undefined ? "" : input.attr("data-filter-fields");
                    let displayFields = input.attr("data-display-fields") == undefined ? "" : input.attr("data-display-fields");
                    let orderFields = input.attr("data-order-fields") == undefined ? "" : input.attr("data-order-fields");
                    let maxRows = input.attr("data-max-rows") == undefined ? 0 : input.attr("data-max-rows");
                    let firstFilter = input.attr("data-first-filter");
                    let searchUrl = 'api/Common/Search?table=' + input.attr('data-table');
                    //20230516 Start
                    let txtID = input.attr('id') == undefined ? '' : input.attr('id');
                    //alert(txtID);

                    if (txtID == 'txtSearchDuAnRole')
                        searchUrl = 'api/Common/Search2?table=' + input.attr('data-table');
                    //20230516 End
                    
                    $.ajax({
                        url: searchUrl,
                        dataType: "json",
                        type: "GET",
                        //async: false,
                        data: { term: request.term.replace(/^\s+/, ""), fieldName: fieldName, filterType: filterType, filterFields: filterFields, displayFields: displayFields, orderFields: orderFields, maxRows: maxRows, firstFilter: firstFilter },
                        success: function (data) {
                            if (data.displayFields && !displayFields) {
                                fieldName = data.fieldName;
                                displayFields = data.displayFields;

                                $(input).attr('data-field-name', data.fieldName);
                                $(input).attr('data-filter-type', data.filterType);
                                $(input).attr('data-filter-fields', data.filterFields);
                                $(input).attr('data-display-fields', data.displayFields);
                                $(input).attr('data-order-fields', data.orderFields);
                                $(input).attr('data-max-rows', data.maxRows);
                            }

                            let dataout = {};

                            dataout.fieldName = fieldName;
                            dataout.columns = displayFields.split(',');
                            dataout.rows = data.rows;
                            response(dataout);
                        },
                        complete: () => {
                            goolgeautocomplete_Searching = false;
                        }
                    });
                },
                columns: [],
                delay: 200,
                autoFocus: true,
                select: function (event, ui) {
                    selectItem(this, ui);                    
                    return false;
                },
                close: function (event) {
                    $('.ui-autocomplete').empty();
                },
                open: function (event) {
                    textSearchOpen(event);
                },
                focus: function (event, ui) {
                    if (event.type === "tableautocompletefocus") {
                        textSearchCustomScroll($(this).attr('autocomplete-id'), event);
                    }
                    return false;
                }
            });
            if (input.attr("no-add") == true || input.attr("no-add") == "true") {

            } else {
                $(input).css("padding-right", "20px");
                if (!input.parent().is('td')) {
                    //$("<img class='input-group-add-button' src='../img/Add.png?1' style='position:absolute; top:6px; right:5px; width:10px; height:10px;'>").insertAfter(input);//20230519
                    $("<img class='input-group-add-button' style='display:none;'>").insertAfter(input);//20230519
                } else {
                    //$("<img class='input-group-add-button' src='../img/Add.png?1' style='display:none; position: relative; top:3px; right:7px; width:10px; height:10px;'>").insertAfter(input);//20230519
                    $("<img class='input-group-add-button' style='display:none;'>").insertAfter(input);//20230519
                }

                if (input.attr('readonly') == "readonly" || input.attr('readonly') == "true" || input.attr('readonly') === true) {

                } else {
                    let addButton = input.parent()[0].querySelector('.input-group-add-button');
                    let addFunction = input.attr("add-function");
                    if (!$(addButton).data('powertip')) {
                        $(addButton).data('powertip', 'Ctrl +');
                        $(addButton).powerTip({
                            placement: $(this).attr('placement') ? $(this).attr('placement') : 's',
                        });
                    }
                    $(addButton).on("mousedown", function () {
                        if (addFunction) {
                            $(input).focus();
                            eval(addFunction);
                        }
                    });
                }
            }

            $(input).on('input', function (e) {
                $(this).attr("value-changed", true);
                $(this).attr("user-value-changed", true);

                //Prevent select item
                goolgeautocomplete_Searching = true;
            }).on('dragstart', function (e) {
                e.preventDefault();
            }).on('focus', function (e) {
                e.preventDefault();
                $(this).attr("user-value-changed", false);
            });
        };

        build(input);
    });
}

function initTextOption(elements, defaultCode) {
    let getOptionCode = function (data) {
        let options = [];
        let temp = data.split(',');
        $.each(temp, function (index, value) {
            options.push(value.trim());
        });

        return options;
    }

    $.map($(elements), function (element, index) {
        if ($(element).attr("option-code")) {
            var optionCode = getOptionCode($(element).attr("option-code"));
        } else {
            if (defaultCode) {
                var optionCode = getOptionCode(defaultCode);
            } else {
                return;
            }
        }

        var defaultValue = $(element).attr("default-value");
        var value = $(element).val();
        if (!value || optionCode.findIndex(code => code == value) == -1) {
            if (defaultValue) {
                $(element).val(defaultValue);
            } else {
                $(element).val(optionCode[0]);
            }

            $(element).trigger("change");
        }
        var optionCodeFisrChar = optionCode.map(x => x.charAt(0));
        $(element)
            .off('dragstart')
            .on('dragstart', function (event) {
                event.preventDefault();
            })
            //.off('focus')
            .on('focus', function (event) {
                if ($(this).closest("td").length == 0) {
                    event.target.setSelectionRange(0, 0);
                }
            })
            .on('change', function (e) {
                if ($(this).attr('oldvalue') == undefined) return;

                $(this).data('data-value', "");

                let callback = $(this).attr('callback');
                if (callback && eval("typeof " + callback + " === 'function'")) {
                    var cb = eval(callback);
                    cb($(this));
                }
            })
            //.off('keypress')
            .on('keypress', function (evt) {
                if ($(this).attr('readonly') != 'readonly') {
                    evt.preventDefault();
                }
            })
            //.off('keydown')
            .on('keydown', function (event) {
                if ($(this).attr('readonly') != 'readonly') {
                    if (event.which == 32) {// space                        
                        event.preventDefault();
                        $(this).attr('oldvalue', $(this).val());// save old value
                        var index = optionCode.indexOf($(this).val());
                        if (index > -1 && index < optionCode.length - 1) {
                            $(this).val(optionCode[index + 1]);
                        } else {
                            $(this).val(optionCode[0]);
                        }
                        event.target.setSelectionRange(0, 0);
                        $(this).closest("td").addClass("active-nobg");
                        if (($(element).attr("search") == true || $(element).attr("search") == "true")) {
                            $(this).trigger("input");
                        } else {
                            $(this).trigger('change');
                        }
                    } else if ((event.which > 64 && event.which < 91) //a-z
                        || (event.which >= 48 && event.which <= 57) //0-9
                        || (event.which >= 96 && event.which <= 105)) {//0-9 
                        let code = event.which;
                        if (code >= 96 && code <= 105) {
                            // Numpad keys
                            code -= 48;
                        }
                        event.preventDefault();
                        $(this).attr('oldvalue', $(this).val());// save old value
                        var index = optionCode.indexOf($(this).val());
                        var input = String.fromCharCode(code).toUpperCase();
                        var indexInput = optionCodeFisrChar.indexOf(input);
                        if ($(this).val().startsWith(input)) {
                            if (typeof optionCode[index + 1] !== "undefined" && optionCode[index + 1].startsWith(input)) {
                                $(this).val(optionCode[index + 1]);
                            } else {
                                $(this).val(optionCode[indexInput]);
                            }
                        } else {
                            if (indexInput != -1)
                                $(this).val(optionCode[indexInput]);
                        }
                        event.target.setSelectionRange(0, 0);
                        $(this).closest("td").addClass("active-nobg");
                        if (($(element).attr("search") == true || $(element).attr("search") == "true")) {
                            $(this).trigger("input");
                        } else {
                            $(this).trigger('change');
                        }
                    } else if (event.which == 13 || event.which == 9 || event.which == 16) {

                    } else {
                        event.preventDefault();
                    }
                }
            });

        if ($(element).attr("search") == true || $(element).attr("search") == "true") {
            let positionTopFlag = false;
            if (window.innerHeight - $(element).offset().top - $("#maintaskbar").innerHeight() > S3TTableRowHeight * 10) {
                var position = { my: "left top", at: "left bottom" };
            } else {
                var position = { my: "left bottom", at: "left top" };
                positionTopFlag = true;
            }
            $(element).tableAutocomplete({
                position: position,
                source: function (request, response) {
                    let searchUrl = 'api/Common/SearchTienTe';
                    let model = eval($(element).attr("build-model"));
                    $.ajax({
                        url: searchUrl,
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(model(element)),
                        success: function (data) {
                            response(JSON.parse(data));
                        }
                    });
                },
                columns: [],
                delay: 200,
                autoFocus: true,
                select: function (event, ui) {
                    TienTeSelectItem(this, ui);
                    return false;
                },
                close: function (event) {
                    $('.ui-autocomplete').empty();
                },
                open: function (event) {
                    textSeachOpen(event, positionTopFlag, true);
                },
                focus: function (event, ui) {
                    if (event.type === "tableautocompletefocus") {
                        textSearchCustomScroll($(this).attr('autocomplete-id'), event);
                    }
                    return false;
                }
            });

        }
    });
}

//#endregion Text search custom

function getCursorPosition(element) {
    var el = $(element).get(0);
    var pos = 0;
    if ('selectionStart' in el) {
        pos = el.selectionStart;
    } else if ('selection' in document) {
        el.focus();
        var Sel = document.selection.createRange();
        var SelLength = document.selection.createRange().text.length;
        Sel.moveStart('character', -el.value.length);
        pos = Sel.text.length - SelLength;
    }
    return pos;
}

function buildToolTipImage(elements) {
    $.each(elements, function () {
        $(this).empty();
        var image = $(this).data("image-path");
        if (image == null || image == "" || image.trim() == "null") {
            return;
        }
        var t = (new Date()).getTime();
        $(this).append("<i class='fa fa-file-image-o'/>");
        $(this).data('powertip', $([
            '<img class="image-tooltip" src="' + image + "?" + t + '" />'].join('\n')));
        $(this).powerTip({
            placement: 'e',
        });
    });
}

function buildToolTip(elements) {
    $.each(elements, function () {
        if (!$(this).data('powertip')) {
            $(this).powerTip({
                placement: $(this).attr('placement') ? $(this).attr('placement') : 's',
            });
        }

        let html = '';

        if ($(this).attr('data-hot-key')) {
            html = "<div style='display:flex; flex-direction:row;'><div style='display:flex; flex-direction:row; align-items:center; padding-right:6px;'><div>";
            html += $(this).attr('data-tooltip-value') ? $(this).attr('data-tooltip-value') : $(this).attr('data-mainlanguage') ? i18nLayoutTooltip($(this).attr('data-mainlanguage'), $(this).attr('data-sublanguage')) : i18nLayout6(translator._getValueFromJSON($(this).attr('data-tooltip-key'), applicationDictionary, false));
            html += "</div></div><div style='display:flex; flex-direction:row; align-items:center; padding-left:6px; border-left:1px solid white'><div>" + $(this).attr('data-hot-key') + "</div></div></div>";
        } else {
            html = $(this).attr('data-tooltip-value') ? $(this).attr('data-tooltip-value') : $(this).attr('data-mainlanguage') ? i18nLayoutTooltip($(this).attr('data-mainlanguage'), $(this).attr('data-sublanguage')) : i18nLayout6(translator._getValueFromJSON($(this).attr('data-tooltip-key'), applicationDictionary, false));
        }

        $(this).data('powertip', html);
    });
}

function buildToolTip2(elements) {
    $.each(elements, function () {
        if (!$(this).data('powertip')) {
            $(this).powerTip({
                placement: $(this).attr('placement') ? $(this).attr('placement') : 's',
            });
        }

        let html = '';

        if ($(this).attr('data-hot-key')) {
            html = "<div style='display:flex; flex-direction:row;'><div style='display:flex; flex-direction:row; align-items:center; padding-right:6px;'><div>";
            html += $(this).attr('data-tooltip-value');
            html += "</div></div><div style='display:flex; flex-direction:row; align-items:center; padding-left:6px; border-left:1px solid white'><div>" + $(this).attr('data-hot-key') + "</div></div></div>";
        } else {
            html = $(this).attr('data-tooltip-value');
        }

        $(this).data('powertip', html);
    });
}

/*
 * Get excel data when cell with fomular
 */
function ExcelFomularToArray(data) {
    let array = [];
    let index = 0;
    let row = new Object();
    for (let i = 0; i < data.length; i++) {
        let id = parseInt(data[i].match(/\d+/)[0]);
        if (id != index) {
            array.push(row);
            row = new Object();
            index = id;
        }
        let column = data[i].split("" + id)[0];
        let celldata = data[i].replace(column + id + "=", "");

        if (celldata.length != 0 && celldata.substr(0, 1) == "'") {
            celldata = celldata.substr(1);
        }

        row[column] = celldata.replaceAll("'", "''").trim();
    }
    array.push(row);
    array.shift();

    return array;
}

/*
 * Get excel data when cell is date
 */
function ExcelDateToJSDate(serial) {
    let utc_days = Math.floor(serial - 25569);
    let utc_value = utc_days * 86400;
    let date_info = new Date(utc_value * 1000);

    let fractional_day = serial - Math.floor(serial) + 0.0000001;

    let total_seconds = Math.floor(86400 * fractional_day);

    let seconds = total_seconds % 60;

    total_seconds -= seconds;

    let hours = Math.floor(total_seconds / (60 * 60));
    let minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

function ExcelDateToSQLDate(data) {
    let utc_days = Math.floor(data - 25569);
    let utc_value = utc_days * 86400;
    let date_info = new Date(utc_value * 1000);

    let fractional_day = data - Math.floor(data) + 0.0000001;

    let total_seconds = Math.floor(86400 * fractional_day);

    let seconds = total_seconds % 60;

    total_seconds -= seconds;

    let hours = Math.floor(total_seconds / (60 * 60));
    let minutes = Math.floor(total_seconds / 60) % 60;

    return date_info.getFullYear().toString().padStart(4, '0') + "/" + (date_info.getMonth() + 1).toString().padStart(2, '0') + "/" + date_info.getDate().toString().padStart(2, '0') + " " +
        hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0') + ".000";
}

/*
 * excelInfo:
 * Title: Title
 * Title_E: English title
 * TableFormat: Clone table to export
 * TableData: Data to export
 * Conditions: Array of conditions
 */

function ExportToExcel(excelInfo, controlid) {
    //getting values of current time for generating the file name
    let loading = eval(controlid + "_Loading");
    loading.show();

    let tableData = "";
    setTimeout(() => {
        let exportToExcelThread = MT.process(
            function (array, arrayData, index, lang, isMulti) {
                let delay = function () {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve();
                        }, 1000);
                    });
                }

                let itemRunner = async function () {
                    await delay();
                }

                tableData = "";
                let processTasks = async function (array, arrayData) {
                    let i = 0;
                    array.forEach(async (item, index) => {
                        if (arrayData[index].IsToggleTreeHidden == true) return;
                        let row = item;
                        let remove = null;
                        if (lang == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
                            remove = item.match(/<td[^>]+sub-language.*?<\/td>/g);

                        } else if (lang == 1) { /* Chỉ hiển thị ngôn ngữ thứ hai */
                            remove = item.match(/<td[^>]+main-language.*?<\/td>/g);
                        }
                        if (remove) {
                            remove.forEach((r) => {
                                row = row.replace(r, "");
                            });
                        }

                        let hide = row.match(/<td class='hide (.*?)<\/td>/g);
                        if (hide) {
                            hide.forEach((r) => {
                                row = row.replace(r, "");
                            });
                        }

                        let number = row.match(/<td style='mso-number-format(.*?)<\/td>/g);
                        if (number) {
                            number.forEach((td) => {
                                let value = td.match(/numericvalue=\'(.*?)\'/);
                                let style = td.match(/style=\'(.*?)\'/);

                                if (value && style) {
                                    row = row.replace(td, "<td " + style[0] + ">" + (value[1] == "0" ? "" : value[1]) + "</td>");
                                } else {
                                    row = row.replace(td, "<td></td>");
                                }
                            });
                        }

                        tableData += row;
                        i++;
                        if (i == 999) {
                            i = 0;
                            await itemRunner();
                        }

                    })
                }
                //tableData = "</tbody>";
                processTasks(array, arrayData);
                let result = new Object();
                result.tableData = tableData;
                result.index = index;
                result.isMulti = isMulti;

                return result;
            },
            function (data) {
                tableData += data.tableData;
                if (data.isMulti == true) {
                    if (data.index < 5) {
                        let l = excelInfo.TableData.row_data.length;
                        let count = Math.floor(l / 5);

                        let start = (data.index + 1) * count;
                        let length = start + count;
                        if (data.index == 4) length = l;
                        exportToExcelThread(excelInfo.TableData.row_data.slice(start, length), data.index + 1, data.isMulti);
                        return;
                    }
                }

                tableData += "</tbody>";
                let dt = new Date();
                let day = dt.getDate();
                let month = dt.getMonth() + 1;
                let year = dt.getFullYear();
                let hour = dt.getHours();
                let mins = dt.getMinutes();
                let postfix = day + "." + month + "." + year + "_" + hour + "." + mins;
                let fileName = "";

                let caption_container = $('<caption></caption>');
                if (ApplicationInstance.Uservar.BillingualLanguage == 2) { /* Song ngữ */
                    caption_container.append("<div style='font-weight:bold;font-size:20px;'>" + excelInfo.Title.toUpperCase() + "</div>");
                    caption_container.append("<div style='font-weight:bold;font-size:20px;'>" + excelInfo.Title_E.toUpperCase() + "</div>");
                    fileName = excelInfo.Title + "(" + excelInfo.Title_E + ")" + '_' + postfix + '.xls';
                } else {
                    caption_container.append("<div style='font-weight:bold;font-size:20px;'>" + excelInfo.Title.toUpperCase() + "</div>");
                    fileName = excelInfo.Title + '_' + postfix + '.xls';
                }

                if (excelInfo.Conditions) {
                    excelInfo.Conditions.forEach((row) => {
                        caption_container.append('<div>' + row + '</div>');
                    });
                }

                caption_container.append('<div>&nbsp;</div>');

                $(excelInfo.TableHtml).first().prepend(caption_container);

                let table_container = $('<div style="width:100%;height:100%;overflow:hidden;position:absolute;top:-200%;left:-200%;"></div>');
                //table_container.append("<div style='font-weight:bold;font-size:16px;'>" + ApplicationInstance.Dvcsvar.Company_Name + "</div>");
                //table_container.append("<div style='font-weight:bold;font-size:16px;'>" + ApplicationInstance.Dvcsvar.Company_Address + "</div>");
                table_container.append(excelInfo.TableHtml);

                excelInfo.TableHtml.find('tbody').find('tr').remove();
                excelInfo.TableHtml.find('.hide').remove();
                excelInfo.TableHtml.find('*[style*="display: none"]').remove();
                let langIcons = excelInfo.TableHtml.find('img[s3t-image-lang]');
                langIcons.each((i, icon) => {
                    $(icon).attr("src", $(icon).attr("src").replace("..", location.origin));
                });

                if (excelInfo.TableHtml.find('.Ma_Loai1').length == 0)
                    excelInfo.TableHtml.find('.Ma_Loai').attr("rowspan", excelInfo.TableHtml.find('thead tr:first td').attr("rowspan"));

                let table_html = table_container.html();
                table_html = table_html.replace("</tbody>", tableData);
                table_container.remove();

                let css_html = '<style>td { border: 0.5pt solid #c0c0c0; vertical-align: middle; }' +
                    '.text-align-center { text-align: center; mso-number-format:"\@"; }' + // format all cell as string
                    '.main-language { mso-number-format:"\@"; }' + // format all cell as string
                    '.sub-language { mso-number-format:"\@"; }' + // format all cell as string
                    '.no-format { mso-number-format:"\@"; }' +
                    '.text-bold { font-weight: bold; }' +
                    '.text-italic { font-style: italic; }' +
                    '.center { text-align: center; }' +
                    '.text-number { text-align: right; }' +
                    '</style>';

                let blob = new Blob(['<html><head>' + css_html + '</' + 'head><body>' + table_html + '</body></html>'], { type: "data:application/vnd.ms-excel;charset=utf-8" });
                table_html = "";
                tableData = "";
                let a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = fileName;
                a.click();
                a.remove();
                loading.hide();
            }
        );
        let l = excelInfo.TableData.row_data.length;
        let count = Math.floor(l / 5);
        let length = count;
        let start = 0;
        if (l > 50000) {
            exportToExcelThread(excelInfo.TableData.row_data.slice(start, length), excelInfo.TableData.data.slice(start, length), 0, ApplicationInstance.Uservar.BillingualLanguage, true);
        } else {
            exportToExcelThread(excelInfo.TableData.row_data, excelInfo.TableData.data, 0, ApplicationInstance.Uservar.BillingualLanguage, false);
        }
    }, 100);
}

function checkFileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();

    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}

function setReportParameters(report, title, title_E, serial) {
    if (ApplicationInstance.Systemvar.DEMOString) {
        report.pages.list.forEach(function (page) {
            page.watermark.text = ApplicationInstance.Systemvar.DEMOString;
        });
    }

    if (report.dictionary.variables.contains('ReportTitle')) report.dictionary.variables.getByName('ReportTitle').valueObject = MergeReportString(title.toUpperCase(), title_E.toUpperCase(), false);
    if (report.dictionary.variables.contains('ReportTitle_E')) report.dictionary.variables.getByName('ReportTitle_E').valueObject = title_E.toUpperCase();

    if (serial) {
        if (report.dictionary.variables.contains('TheDecisionNumber')) report.dictionary.variables.getByName('TheDecisionNumber').valueObject = GetReportString('Report_Var_TheDecisionNumber') + ": " + serial;
        if (report.dictionary.variables.contains('TheFirstRowDecision')) report.dictionary.variables.getByName('TheFirstRowDecision').valueObject = TheFirstRowDecision();
        if (report.dictionary.variables.contains('TheSecondRowDecision')) report.dictionary.variables.getByName('TheSecondRowDecision').valueObject = TheSecondRowDecision();
        if (report.dictionary.variables.contains('TheThirdRowDecision')) report.dictionary.variables.getByName('TheThirdRowDecision').valueObject = '';
    }

    if (report.dictionary.variables.contains('CompanyLogoPicture')) report.dictionary.variables.getByName('CompanyLogoPicture').valueObject = Stimulsoft.System.Drawing.Image.fromFile('../Metadata/' + ApplicationInstance.CompanyCode + '/DmDvcs/' + ApplicationInstance.Dvcsvar.Id + '.jpg');
    if (report.dictionary.variables.contains('CompanyName')) report.dictionary.variables.getByName('CompanyName').valueObject = ApplicationInstance.Dvcsvar.Company_Name;
    if (report.dictionary.variables.contains('CompanyName_E')) report.dictionary.variables.getByName('CompanyName_E').valueObject = ApplicationInstance.Dvcsvar.Company_Name_E;
    if (report.dictionary.variables.contains('CompanyBranchName')) report.dictionary.variables.getByName('CompanyBranchName').valueObject = '';
    if (report.dictionary.variables.contains('CompanyBranchName_E')) report.dictionary.variables.getByName('CompanyBranchName_E').valueObject = '';
    if (report.dictionary.variables.contains('CompanyAddress')) report.dictionary.variables.getByName('CompanyAddress').valueObject = ApplicationInstance.Dvcsvar.Company_Address;
    if (report.dictionary.variables.contains('CompanyPhones')) report.dictionary.variables.getByName('CompanyPhones').valueObject = ApplicationInstance.Dvcsvar.Company_Phone;
    if (report.dictionary.variables.contains('CompanyFaxes')) report.dictionary.variables.getByName('CompanyFaxes').valueObject = ApplicationInstance.Dvcsvar.Company_Fax;
    if (report.dictionary.variables.contains('CompanyWebsite')) report.dictionary.variables.getByName('CompanyWebsite').valueObject = ApplicationInstance.Dvcsvar.Company_Website;
    if (report.dictionary.variables.contains('CompanyEmail')) report.dictionary.variables.getByName('CompanyEmail').valueObject = ApplicationInstance.Dvcsvar.Company_Email;
    if (report.dictionary.variables.contains('CompanyBankAccount')) report.dictionary.variables.getByName('CompanyBankAccount').valueObject = ApplicationInstance.Dvcsvar.Company_BankAccount;
    if (report.dictionary.variables.contains('CompanyBankName')) report.dictionary.variables.getByName('CompanyBankName').valueObject = ApplicationInstance.Dvcsvar.Company_BankName;
    if (report.dictionary.variables.contains('CompanyBankCity')) report.dictionary.variables.getByName('CompanyBankCity').valueObject = ApplicationInstance.Dvcsvar.Company_BankCapital;
    if (report.dictionary.variables.contains('CompanyTaxcode')) report.dictionary.variables.getByName('CompanyTaxcode').valueObject = ApplicationInstance.Dvcsvar.Company_Taxcode;
    if (report.dictionary.variables.contains('DateTime_String')) report.dictionary.variables.getByName('DateTime_String').valueObject = GetDateTime_String();
    if (report.dictionary.variables.contains('Print_Sign_Checked')) report.dictionary.variables.getByName('Print_Sign_Checked').valueObject = ApplicationInstance.Systemvar.ShowSignatures;
    if (report.dictionary.variables.contains('Director_Position')) report.dictionary.variables.getByName('Director_Position').valueObject = MergeReportString(ApplicationInstance.Dvcsvar.Director_Position, ApplicationInstance.Dvcsvar.Director_Position_E);
    if (report.dictionary.variables.contains('Director_Name')) report.dictionary.variables.getByName('Director_Name').valueObject = ApplicationInstance.Dvcsvar.Director_Name;
    if (report.dictionary.variables.contains('Chief_Accountant_Position')) report.dictionary.variables.getByName('Chief_Accountant_Position').valueObject = MergeReportString(ApplicationInstance.Dvcsvar.Chief_Accountant_Position, ApplicationInstance.Dvcsvar.Chief_Accountant_Position_E);
    if (report.dictionary.variables.contains('Chief_Accountant')) report.dictionary.variables.getByName('Chief_Accountant').valueObject = ApplicationInstance.Dvcsvar.Chief_Accountant;
    if (report.dictionary.variables.contains('Cashier_Position')) report.dictionary.variables.getByName('Cashier_Position').valueObject = MergeReportString(ApplicationInstance.Dvcsvar.Cashier_Position, ApplicationInstance.Dvcsvar.Cashier_Position_E);
    if (report.dictionary.variables.contains('Cashier_Name')) report.dictionary.variables.getByName('Cashier_Name').valueObject = ApplicationInstance.Dvcsvar.Cashier_Name;
    if (report.dictionary.variables.contains('Stock_Keeper_Position')) report.dictionary.variables.getByName('Stock_Keeper_Position').valueObject = MergeReportString(ApplicationInstance.Dvcsvar.Stock_Keeper_Position, ApplicationInstance.Dvcsvar.Stock_Keeper_Position_E);
    if (report.dictionary.variables.contains('Stock_Keeper')) report.dictionary.variables.getByName('Stock_Keeper').valueObject = ApplicationInstance.Dvcsvar.Stock_Keeper;
    if (report.dictionary.variables.contains('Creator_Position')) report.dictionary.variables.getByName('Creator_Position').valueObject = MergeReportString(translator._getValueFromJSON("CTKTLister_Var_Post_User.main", applicationDictionary, false), translator._getValueFromJSON("CTKTLister_Var_Post_User.sub", applicationDictionary, false));
    if (report.dictionary.variables.contains('Creator_Name')) report.dictionary.variables.getByName('Creator_Name').valueObject = ApplicationInstance.FullName;
    if (report.dictionary.variables.contains('Name_Signature')) report.dictionary.variables.getByName('Name_Signature').valueObject = MergeReportString(translator._getValueFromJSON("Common_Var_Name_Signature.main", applicationDictionary, false), translator._getValueFromJSON("Common_Var_Name_Signature.sub", applicationDictionary, false));
    if (report.dictionary.variables.contains('Name_Signature_Stemp')) report.dictionary.variables.getByName('Name_Signature_Stemp').valueObject = MergeReportString(translator._getValueFromJSON("Common_Var_Name_Signature_Stemp.main", applicationDictionary, false), translator._getValueFromJSON("Common_Var_Name_Signature_Stemp.sub", applicationDictionary, false));

    if (report.dictionary.variables.contains('DecimalSymbol')) report.dictionary.variables.getByName('DecimalSymbol').valueObject = ApplicationInstance.Uservar.DecimalSymbol;
    if (report.dictionary.variables.contains('GroupingSymbol')) report.dictionary.variables.getByName('GroupingSymbol').valueObject = ApplicationInstance.Uservar.GroupingSymbol;

    // The example displays the following output:
    //       Default:             -1,234.00
    //       Pattern 0:           (1,234.00)
    //       Pattern 1:           -1,234.00
    //       Pattern 2:           - 1,234.00
    //       Pattern 3:           1,234.00-
    //       Pattern 4:           1,234.00 -
    if (report.dictionary.variables.contains('NegativePattern')) report.dictionary.variables.getByName('NegativePattern').valueObject = 0;

    if (report.dictionary.variables.contains('PTy_Gia_Decim')) report.dictionary.variables.getByName('PTy_Gia_Decim').valueObject = ApplicationInstance.Systemvar.ExchangeFormat;
    if (report.dictionary.variables.contains('PTram_Decim')) report.dictionary.variables.getByName('PTram_Decim').valueObject = ApplicationInstance.Systemvar.PercentDecimals;
    if (report.dictionary.variables.contains('PSo_Luong_Decim')) report.dictionary.variables.getByName('PSo_Luong_Decim').valueObject = ApplicationInstance.Uservar.QuantityDecimals;
    if (report.dictionary.variables.contains('PSo_LuongDM_Decim')) report.dictionary.variables.getByName('PSo_LuongDM_Decim').valueObject = ApplicationInstance.Uservar.NormQuantity;
    if (report.dictionary.variables.contains('PSo_LuongHS_Decim')) report.dictionary.variables.getByName('PSo_LuongHS_Decim').valueObject = ApplicationInstance.Uservar.RatioFormat;
    if (report.dictionary.variables.contains('PGia_Decim')) report.dictionary.variables.getByName('PGia_Decim').valueObject = ApplicationInstance.Systemvar.LCPriceDecimals;
    if (report.dictionary.variables.contains('PGia_Nt_Decim')) report.dictionary.variables.getByName('PGia_Nt_Decim').valueObject = ApplicationInstance.Systemvar.FCPriceDecimals;
    if (report.dictionary.variables.contains('PTien_Decim')) report.dictionary.variables.getByName('PTien_Decim').valueObject = ApplicationInstance.Systemvar.LCAmountDecimals;
    if (report.dictionary.variables.contains('PTien_Nt_Decim')) report.dictionary.variables.getByName('PTien_Nt_Decim').valueObject = ApplicationInstance.Systemvar.FCAmountDecimals;
}

function TheFirstRowDecision() {
    if (ApplicationInstance.Uservar.BillingualLanguage != 2) {
        return GetReportString('Report_Var_TheFirstRowDecision_' + ApplicationInstance.Systemvar.Decision_200_133);
    }
    else {
        return translator._getValueFromJSON("Report_Var_TheFirstRowDecision_" + ApplicationInstance.Systemvar.Decision_200_133 + ".main", applicationDictionary, false) + " " +
            translator._getValueFromJSON("Report_Var_TheSecondRowDecision_" + ApplicationInstance.Systemvar.Decision_200_133 + ".main", applicationDictionary, false);
    }
}

function TheSecondRowDecision() {
    if (ApplicationInstance.Uservar.BillingualLanguage != 2) {
        return GetReportString('Report_Var_TheSecondRowDecision_' + ApplicationInstance.Systemvar.Decision_200_133);
    }
    else {
        return translator._getValueFromJSON("Report_Var_TheFirstRowDecision_" + ApplicationInstance.Systemvar.Decision_200_133 + ".sub", applicationDictionary, false) + " " +
            translator._getValueFromJSON("Report_Var_TheSecondRowDecision_" + ApplicationInstance.Systemvar.Decision_200_133 + ".sub", applicationDictionary, false);
    }
}

function GetReportString(key, type) {
    return MergeReportString(translator._getValueFromJSON(key + ".main", applicationDictionary, false), translator._getValueFromJSON(key + ".sub", applicationDictionary, false), type);
}

function GetDateTime_String() {
    if (ApplicationInstance.Uservar.BillingualLanguage == 0) {
        return translator._getValueFromJSON("Common_Var_Day.main", applicationDictionary, false) + " ..... " +
            translator._getValueFromJSON("Common_Var_MonthLower.main", applicationDictionary, false).toLowerCase() + " ..... " +
            translator._getValueFromJSON("Common_Var_YearLower.main", applicationDictionary, false).toLowerCase() + " ........";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) {
        return translator._getValueFromJSON("Common_Var_Day.sub", applicationDictionary, false) + " ..... " +
            translator._getValueFromJSON("Common_Var_MonthLower.sub", applicationDictionary, false).toLowerCase() + " ..... " +
            translator._getValueFromJSON("Common_Var_YearLower.sub", applicationDictionary, false).toLowerCase() + " ........";
    } else {
        return translator._getValueFromJSON("Common_Var_Day.main", applicationDictionary, false) +
            " (" +
            translator._getValueFromJSON("Common_Var_Day.sub", applicationDictionary, false).toLowerCase() + ") " +
            " ..... " +
            translator._getValueFromJSON("Common_Var_MonthLower.main", applicationDictionary, false).toLowerCase() +
            " (" +
            translator._getValueFromJSON("Common_Var_MonthLower.sub", applicationDictionary, false).toLowerCase() + ") " +
            " ..... " +
            translator._getValueFromJSON("Common_Var_YearLower.main", applicationDictionary, false).toLowerCase() +
            " (" +
            translator._getValueFromJSON("Common_Var_YearLower.sub", applicationDictionary, false).toLowerCase() + ") " +
            " ........";
    }
}

function MergeReportString(ps_First_String, ps_Second_String, type) {
    if (ApplicationInstance.Uservar.BillingualLanguage == 0 || ps_Second_String == "") {
        return ps_First_String;
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) {
        return ps_Second_String
    } else {
        return type ? (ps_First_String + "\n" + ps_Second_String) : (ps_First_String + " - " + ps_Second_String);
    }
}

function ReportParameterDateLayout1(key, from, key2, to) {
    return GetReportString(key) + ' ' + datetimeToStringShort(from.value()) + ' ' + GetReportString(key2) + ' ' + datetimeToStringShort(to.value());
}

function ReportParameterDateLayout2(key, date) {
    return ' ' + GetReportString(key) + ' ' + datetimeToStringShort(date.value());
}

function ReportParameterDateLayout3(key, from, key2, to) {
    return GetReportString(key) + ' ' + from + ' ' + GetReportString(key2) + ' ' + to;
}

function ReportParameterLayout1(key, code, name, nameE) {
    return GetReportString(key) + ': ' + MergeReportString(name, nameE) + ' (' + code + ')';
}

function ReportParameterLayout2(key, code, name) {
    return GetReportString(key) + ': ' + name + ' (' + code + ')';
}

function numToWord(numberDecimal, currency) {
    let amountInWords = '';
    let amountInWords_E = '';

    if (ApplicationInstance.Systemvar.MainLanguageId == 'VN') {
        amountInWords = numToWordVN(numberDecimal, currency);
    } else if (ApplicationInstance.Systemvar.MainLanguageId == 'EN') {
        amountInWords = numToWordEN(numberDecimal, currency);
    } else if (ApplicationInstance.Systemvar.MainLanguageId == 'CN') {
        amountInWords = numToWordCN(numberDecimal, currency);
    } else if (ApplicationInstance.Systemvar.MainLanguageId == 'JP') {
        amountInWords = numToWordJP(numberDecimal, currency);
    } else {
        amountInWords = numToWordKR(numberDecimal, currency);
    }

    if (ApplicationInstance.Systemvar.SubLanguageId == 'VN') {
        amountInWords_E = numToWordVN(numberDecimal, currency);
    } else if (ApplicationInstance.Systemvar.SubLanguageId == 'EN') {
        amountInWords_E = numToWordEN(numberDecimal, currency);
    } else if (ApplicationInstance.Systemvar.SubLanguageId == 'CN') {
        amountInWords_E = numToWordCN(numberDecimal, currency);
    } else if (ApplicationInstance.Systemvar.SubLanguageId == 'JP') {
        amountInWords_E = numToWordJP(numberDecimal, currency);
    } else {
        amountInWords_E = numToWordKR(numberDecimal, currency);
    }

    if (ApplicationInstance.Uservar.BillingualLanguage == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
        return amountInWords;
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) { /* Chỉ hiển thị ngôn ngữ thứ hai */
        return amountInWords_E;
    } else { /* Song ngữ */

        return MergeReportString(amountInWords, amountInWords_E, true);
    }
}

//#region numToWordVN(numberDecimal, currency)

function numToWordVN(numberDecimal, currency) {
    var returnWords = "";
    var signal = "";
    var maxGroups = 8;

    if (numberDecimal == null || numberDecimal == 0) {
        returnWords = "không đồng";
    } else {
        var TAB = "trăm mươi tỷ   trăm mươi triệutrăm mươi ngàn trăm mươi tỷ   trăm mươi triệutrăm mươi ngàn trăm mươi đồng trăm mươi xu   ";
        var NUM = "một hai ba  bốn năm sáu bảy tám chín";
        var SPACE = " ";
        var decimalSymbol = "."; //System.Globalization.NumberFormatInfo.CurrentInfo.NumberDecimalSeparator;

        if (numberDecimal < 0) {
            signal = "trừ ";
            numberDecimal = numberDecimal * -1;
        }

        var totalNumber = numberConvert(numberDecimal, maxGroups * 3, 2);

        for (var index = 0; index < maxGroups; index++) {
            var threeNumber = totalNumber.substr(index * 3, 3);
            var words = "";

            if (threeNumber.trim()) {
                if (threeNumber == "000") {
                    if (index == maxGroups - 2) {
                        words = "đồng ";
                    }
                }
                else if (threeNumber == decimalSymbol + "00") {
                    words = "";
                }
                else {
                    var firstDigit = threeNumber.substr(0, 1);
                    var secondDigit = threeNumber.substr(1, 1);
                    var thirdDigit = threeNumber.substr(2, 1);

                    for (var subIndex = 0; subIndex < 3; subIndex++) {
                        var trans = "";
                        var number = 0;
                        if (!threeNumber.substr(subIndex, 1).includes(decimalSymbol)) {
                            number = parseInt(threeNumber.substr(subIndex, 1));
                        }

                        if (number > 0) {
                            trans = NUM.substr((number - 1) * 4, 4).trim() + SPACE + TAB.substr(
                                index * 15 + subIndex * 5, 5).trim() + SPACE;
                        }

                        if (subIndex == 1 && number == 1) {
                            trans = "mười ";
                        }
                        else if (subIndex == 2 && number == 0 && threeNumber != "  0") {
                            trans = TAB.substr(index * 15 + subIndex * 5, 5).trim() + SPACE;
                        }
                        else if (subIndex == 2 && number == 5 && !" 0".includes(secondDigit)) {
                            trans = "l" + trans.substr(1);
                        }
                        else if (subIndex == 2 && number == 1 && secondDigit == "1") {
                            trans = "một " + trans.substr(4);
                        }
                        else if (subIndex == 2 && number == 1 && !" 0".includes(secondDigit)) {
                            trans = "mốt " + trans.substr(4);
                        }
                        else if (subIndex == 1 && number == 0 && thirdDigit != "0" && (returnWords + words)) {
                            if ("123456789".includes(firstDigit) || firstDigit == "0") {
                                trans = "lẻ ";
                            }
                        }
                        else if (subIndex == 0 && number == 0 && (returnWords + words) && index != maxGroups - 1) {
                            trans = "không" + SPACE + TAB.substr(index * 15 + subIndex * 5, 5).trim() + SPACE;
                        }

                        words = words + trans;
                    }
                }

                returnWords = returnWords + words;
            }
        }
    }

    returnWords = signal + returnWords;
    returnWords = returnWords.trim();

    if (currency != "VND") {
        let mrow = SelectDataRow("DMTTE", "MA_TTE", currency);
        returnWords = returnWords.replace("đồng", (mrow != null && mrow["Ten_Tte"] ? mrow["Ten_Tte"] : currency));
    }

    return returnWords.substr(0, 1).toUpperCase() + returnWords.substr(1) + ".";
}

//#endregion numToWordVN

//#region numToWordEN(numberDecimal, currency)

function numToWordEN(numberDecimal, currency) {
    var returnWords = "";
    var signal = "";
    var maxGroups = 8;

    if (numberDecimal == null || numberDecimal == 0) {
        returnWords = "Zero only";
    }
    else {
        var TAB = "billion million thousandbillion million thousand";
        var NUM = "one  two  threefour five six  seveneightnine ";
        var TEEN = "twenty thirty fourty fifty  sixty  seventyeighty ninety ";
        var SPACE = " ";
        var decimalSymbol = "."; //System.Globalization.NumberFormatInfo.CurrentInfo.NumberDecimalSeparator;

        if (numberDecimal < 0) {
            signal = "minus ";
            numberDecimal = numberDecimal * -1;
        }

        var totalNumber = numberConvert(numberDecimal, maxGroups * 3, 2);

        for (var index = 0; index < maxGroups; index++) {
            var threeNumber = totalNumber.substr(index * 3, 3);
            var words = "";
            var trans = "";

            if (threeNumber.trim()) {
                if (threeNumber == "000") {
                    if (index == maxGroups - 2) {
                        words = currency;
                    }
                }
                else {
                    var firstDigit = threeNumber.substr(0, 1);
                    var secondDigit = threeNumber.substr(1, 1);
                    var thirdDigit = threeNumber.substr(2, 1);
                    var rightTwo = threeNumber.substr(1, 2);

                    var transFirst = "";
                    if (firstDigit != decimalSymbol && parseInt(firstDigit) > 0) {
                        transFirst = NUM.substr((parseInt(firstDigit) - 1) * 5, 5).trim() + SPACE;
                    }

                    var transSecond = "";
                    if (parseInt(secondDigit) > 1) {
                        transSecond = TEEN.substr((parseInt(secondDigit) - 2) * 7, 7).trim() + SPACE;
                    }

                    var transRightTwo = "";
                    if (rightTwo == "10") {
                        transRightTwo = "ten ";
                    }
                    else if (rightTwo == "11") {
                        transRightTwo = "eleven ";
                    }
                    else if (rightTwo == "12") {
                        transRightTwo = "twelve ";
                    }
                    else if (rightTwo == "13") {
                        transRightTwo = "thirteen ";
                    }
                    else if (rightTwo == "15") {
                        transRightTwo = "fifteen ";
                    }
                    else if (secondDigit == "1") {
                        if (parseInt(thirdDigit) > 0) {
                            transRightTwo = NUM.substr((parseInt(thirdDigit) - 1) * 5, 5).trim() + "teen ";
                        }
                    }
                    else {
                        if (parseInt(thirdDigit) > 0) {
                            transRightTwo = NUM.substr((parseInt(thirdDigit) - 1) * 5, 5).trim();
                        }
                    }

                    transFirst = transFirst + (!(transFirst) ? "" : (rightTwo == "00" ? "hundred " : "hundred and "));

                    if (threeNumber == decimalSymbol + "00") {
                        trans = SPACE + currency + SPACE + "only";
                    }
                    else if (threeNumber.includes(decimalSymbol)) {
                        words = " cent";
                        trans = SPACE + currency + SPACE + "and" + SPACE + transSecond + transRightTwo + words;
                    }
                    else {
                        words = SPACE + (index * 8 + 8 <= TAB.length ? TAB.substr(index * 8, 8).trim() : "");
                        trans = SPACE + transFirst + transSecond + transRightTwo + words;
                    }
                }
            }

            returnWords = returnWords + trans;
        }
    }

    returnWords = signal + returnWords;
    returnWords = returnWords.trim().replace("  ", " ").replace("  ", " ").replace("  ", " ").replace("  ", " ");
    return returnWords.substr(0, 1).toUpperCase() + returnWords.substr(1) + ".";
}

//#endregion numToWordEN

//#region numToWordCN(numberDecimal, currency)

var a_strNumber = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
var a_strModify = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千'];

function numToWordCN(numberDecimal, currency) {
    if (numberDecimal == null || numberDecimal == 0) {
        return a_strNumber[0];
    }

    var strTemp = numberDecimal.toString(); //((decimal)numberDecimal).ToString('#.#########');
    return getSignCN(strTemp) + getIntegerCN(strTemp) + getDotCN(strTemp) + getFractionCN(strTemp) + currency.toUpperCase();
}

function getSignCN(strDecimal) {
    return strDecimal.indexOf('-') == 0 ? '负' : '';
}

function getFractionCN(strDecimal) {
    var intDotPos = strDecimal.indexOf('.'); //strDecimal.indexOf(System.Globalization.NumberFormatInfo.CurrentInfo.NumberDecimalSeparator);

    if (intDotPos == -1) {
        return '';
    }

    var strFraction = strDecimal.substring(intDotPos + 1);
    var sbResult = '';

    for (i = 0; i < strFraction.length; i++) {
        sbResult += a_strNumber[strFraction.charCodeAt(i) - 48];
    }

    return sbResult;
}

function getIntegerCN(strDecimal) {
    var intDotPos = strDecimal.indexOf('.'); //strDecimal.indexOf(System.Globalization.NumberFormatInfo.CurrentInfo.NumberDecimalSeparator);
    var intSignPos = strDecimal.indexOf('-');

    if (intDotPos == -1) {
        intDotPos = strDecimal.length;
    }
    intDotPos = intDotPos - (intSignPos != -1 ? intSignPos + 1 : 0);

    var sbResult = '';
    var strInteger = strDecimal.substring(intSignPos + 1, intDotPos);
    strInteger = reverse(strInteger);

    for (var i = 0; i < strInteger.length; i++) {
        sbResult += a_strModify[i];

        if (((i == 1 || i == 5 || i == 9) && strInteger.charCodeAt(i) - 48 != 1) || (i != 1 && i != 5 && i != 9)) {
            sbResult += a_strNumber[strInteger.charCodeAt(i) - 48];
        }
    }

    sbResult = reverse(sbResult);

    //Thêm dòng này để sửa lỗi trăm triệu, bị thừa chữ vạn
    sbResult.replace('零千零百零十零万零千零百零十零', '');
    //Dòng này trở xuống không đổi.
    sbResult.replace('零十', '零');
    sbResult.replace('零百', '零');
    sbResult.replace('零千', '零');
    sbResult.replace('零万', '万');
    sbResult.replace('零亿', '亿');

    sbResult.replace('零零', '零');
    sbResult.replace('零零零', '零');
    sbResult.replace('零零零零万', '');
    sbResult.replace('零零零零', '');

    sbResult.replace('壹十亿', '十亿');
    sbResult.replace('壹十万', '十万');

    if (sbResult.length > 0 && sbResult.charCodeAt(sbResult.length - 1) == '零' && sbResult.length != 1) {
        sbResult.substr(0, sbResult.Length - 1);
    }

    if (strInteger.length == 2) {
        sbResult.replace('壹拾', '拾');
    }

    var TiHuan = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
    for (var i = 0; i < 9; i++) {
        if (sbResult == '一十' || sbResult == '一十' + TiHuan[i]) {
            sbResult.replace('一十', '十');
        }
    }

    return sbResult;
}

function getDotCN(strDecimal) {
    return (strDecimal.indexOf('.') != -1 ? '点' : ''); //strDecimal.indexOf(System.Globalization.NumberFormatInfo.CurrentInfo.NumberDecimalSeparator) != -1 ? '点' : '';
}

function reverse(strDecimal) {
    // Step 1. Use the split() method to return a new array
    var splitString = strDecimal.split(""); // var splitString = "hello".split("");
    // ["h", "e", "l", "l", "o"]

    // Step 2. Use the reverse() method to reverse the new created array
    var reverseArray = splitString.reverse(); // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
    // ["o", "l", "l", "e", "h"]

    // Step 3. Use the join() method to join all elements of the array into a string
    var joinArray = reverseArray.join(""); // var joinArray = ["o", "l", "l", "e", "h"].join("");
    // "olleh"

    // Step 4. Return the reversed string
    return joinArray; // "olleh"
}

function numberConvert(numberDecimal, totalDigits, decimalDigits) {
    var templateNumber = numberDecimal.toFixed(decimalDigits); //numberDecimal.ToString();
    var decimalSymbol = "."; //System.Globalization.NumberFormatInfo.CurrentInfo.NumberDecimalSeparator;
    var intNumber = "";
    var decNumber = "";

    if (templateNumber.includes(decimalSymbol)) {
        intNumber = templateNumber.substr(0, templateNumber.indexOf(decimalSymbol));
        decNumber = templateNumber.substr(templateNumber.indexOf(decimalSymbol) + 1, decimalDigits);
    }
    else {
        intNumber = templateNumber;
    }

    return intNumber.padStart(totalDigits - decimalDigits - 1, '0') + decimalSymbol + decNumber.padEnd(decimalDigits, '0');
}

//#endregion numToWordCN

//#region numToWordJP(numberDecimal, currency)

function numToWordJP(numberDecimal, currency) {
    if (numberDecimal == null || numberDecimal == 0) {
        return '零';
    }

    var adNumber = Math.abs(numberDecimal);

    var ss = ['', '万', '億', '兆'];
    var tt = ['', '十', '百', '千'];
    var nn = ['', '', '二', '三', '四', '五', '六', '七', '八', '九'];

    var s = '';
    var k = 0;
    while (adNumber > 0.00000001) {
        var m = parseInt(adNumber % 10000);
        adNumber /= 10000;
        var t = '';
        var l = 0;

        while (m > 0) {
            var u = tt[l++];
            var q = parseInt(m % 10);
            if (q == 0) u = '';
            else if (q == 1 && l == 1) u = '一';
            t = nn[parseInt(q)] + u + t;
            m = parseInt(m / 10);
        }

        s = t + (!t ? '' : ss[k]) + s;
        k++;
    }
    return (numberDecimal < 0 ? 'マイナス' : '') + (!s ? '零' : s) + currency.toUpperCase();
}

//#endregion numToWordJP

//#region numToWordKR(numberDecimal, currency)

var NumberChar0 = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
var NumberChar1 = ['공', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
var LevelChar = ['', '십', '백', '천'];
var DecimalChar = ['', '만', '억', '조', '경'];

function numToWordKR(numberDecimal, currency) {
    if (numberDecimal == null || numberDecimal == 0) {
        return NumberChar1[0];
    }

    var strTemp = numberDecimal.toString(); //((decimal)numberDecimal).ToString('#.#########');
    return getSignKR(strTemp) + getIntegerKR(strTemp) + getDotKR(strTemp) + getFractionKR(strTemp) + (currency.toUpperCase() == "WON" ? "원" : currency);
}

function getSignKR(strDecimal) {
    return strDecimal.indexOf('-') == 0 ? '영하' : '';
}

function getIntegerKR(strDecimal) {
    var strInteger = null;
    var intDotPos = strDecimal.indexOf('.'); //strDecimal.indexOf(System.Globalization.NumberFormatInfo.CurrentInfo.NumberDecimalSeparator);
    var intSignPos = strDecimal.indexOf('-');

    if (intDotPos == -1) {
        intDotPos = strDecimal.length;
    }
    else if (intDotPos != -1) {
        intDotPos = intDotPos - 1;
    }

    if (intSignPos != -1) {
        intDotPos = intDotPos - 1;
    }

    strInteger = strDecimal.substr(intSignPos + 1, intDotPos);

    var i = 0;
    var Level = 0;

    var NumToKorea = '';
    var UseDecimal = false;

    for (var i = 0; i < strInteger.length; i++) {
        Level = strInteger.length - i;
        if (strInteger.substr(i, 1) != '0') {
            UseDecimal = true;
            if (((Level - 1) % 4) == 0) {
                NumToKorea = NumToKorea + NumberChar0[parseInt(strInteger.substr(i, 1))] + DecimalChar[parseInt((Level - 1) / 4)];
                UseDecimal = false;
            } else {
                if (strInteger.substr(i, 1) == '1') {
                    NumToKorea = NumToKorea + LevelChar[(Level - 1) % 4];
                } else {
                    NumToKorea = NumToKorea + NumberChar0[parseInt(strInteger.substr(i, 1))] + LevelChar[(Level - 1) % 4];
                }
            }
        }
        else {
            if ((Level % 4 == 0) && UseDecimal) {
                NumToKorea = NumToKorea + DecimalChar[parseInt(Level / 4)];
                UseDecimal = false;
            }
        }
    }

    return NumToKorea;
}

function getDotKR(strDecimal) {
    return strDecimal.indexOf('.') != -1 ? ' 점 ' : ''; //strDecimal.indexOf(System.Globalization.NumberFormatInfo.CurrentInfo.NumberDecimalSeparator) != -1 ? ' 점 ' : '';
}

function getFractionKR(strDecimal) {
    var strFraction = null;
    var intDotPos = strDecimal.indexOf('.'); //strDecimal.indexOf(System.Globalization.NumberFormatInfo.CurrentInfo.NumberDecimalSeparator);

    if (intDotPos == -1) {
        return '';
    }

    strFraction = strDecimal.substr(intDotPos + 1);
    var sbResult = '';

    for (var i = 0; i < strFraction.length; i++) {
        sbResult += NumberChar1[strFraction.charCodeAt(i) - 48];
    }

    return sbResult;
}

//#endregion numToWordKR

function dateInWord(date) {
    if (ApplicationInstance.Uservar.BillingualLanguage == 0) {
        return translator._getValueFromJSON("Common_Var_Day.main", applicationDictionary, false) + " " + date.substr(8, 2)
            + " " + translator._getValueFromJSON("Common_Var_MonthLower.main", applicationDictionary, false).toLowerCase() + " " + date.substr(5, 2)
            + " " + translator._getValueFromJSON("Common_Var_YearLower.main", applicationDictionary, false).toLowerCase() + " " + date.substr(0, 4);
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) {
        return translator._getValueFromJSON("Common_Var_Day.sub", applicationDictionary, false) + " " + date.substr(8, 2)
            + " " + translator._getValueFromJSON("Common_Var_MonthLower.sub", applicationDictionary, false).toLowerCase() + " " + date.substr(5, 2)
            + " " + translator._getValueFromJSON("Common_Var_YearLower.sub", applicationDictionary, false).toLowerCase() + " " + date.substr(0, 4);
    } else {
        return translator._getValueFromJSON("Common_Var_Day.main", applicationDictionary, false) +
            " (" +
            translator._getValueFromJSON("Common_Var_Day.sub", applicationDictionary, false).toLowerCase() + ") " +
            date.substr(8, 2) + " " +
            translator._getValueFromJSON("Common_Var_MonthLower.main", applicationDictionary, false).toLowerCase() +
            " (" +
            translator._getValueFromJSON("Common_Var_MonthLower.sub", applicationDictionary, false).toLowerCase() + ") " +
            date.substr(5, 2) + " " +
            translator._getValueFromJSON("Common_Var_YearLower.main", applicationDictionary, false).toLowerCase() +
            " (" +
            translator._getValueFromJSON("Common_Var_YearLower.sub", applicationDictionary, false).toLowerCase() + ") " +
            date.substr(0, 4);
    }
}

function dateToString(date) {
    let d = date.getDate();
    let m = date.getMonth() + 1; //Month from 0 to 11
    let y = date.getFullYear();
    return (d <= 9 ? '0' + d : d) + "/" + (m <= 9 ? '0' + m : m) + "/" + y;
}

function iOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

function isFirefox() {   
    return navigator.userAgent.includes("irefox");
}

function getIOSSaveDateObj(dateString) {
    var dateString2 = dateString.toString();
    if (dateString2.indexOf('-') > 0) {
        var arr = dateString2.split(/[- :]/);
        var date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
    }
    else if (dateString2.indexOf('/') > 0) {
        var arr = dateString2.split(/[/ :]/);
        var date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
    } else {
        date = new Date(dateString2);
    }
    return date;
}

function datetimeToStringShort(dateStr) {
    
    if (!dateStr) return "";
    let date = new Date(dateStr);

    if (iOS() || isFirefox()) {//20230612: Firefox loi ngay
        date = getIOSSaveDateObj(dateStr);
    }
    
    let d = date.getDate();
    let m = date.getMonth() + 1; //Month from 0 to 11
    let y = date.getFullYear();
    return (d <= 9 ? '0' + d : d) + "/" + (m <= 9 ? '0' + m : m) + "/" + y;
}

function datetimeToStringMedium(dateStr) {
    if (!dateStr) return "";
    let date = new Date(dateStr);

    if (iOS() || isFirefox()) {//20230612: Firefox loi ngay
        date = getIOSSaveDateObj(dateStr);
    }

    let d = date.getDate();
    let m = date.getMonth() + 1; //Month from 0 to 11
    let y = date.getFullYear();
    let h = date.getHours();
    let M = date.getMinutes();
    return (d <= 9 ? '0' + d : d) + "/" + (m <= 9 ? '0' + m : m) + "/" + y + " " + (h <= 9 ? '0' + h : h) + ":" + (M <= 9 ? '0' + M : M);
}

function datetimeToStringFull(date) {
    let d = date.getDate();
    let m = date.getMonth() + 1; //Month from 0 to 11
    let y = date.getFullYear();
    let M = date.getMinutes();
    let h = date.getHours();
    return y + "/" + (m <= 9 ? '0' + m : m) + "/" + (d <= 9 ? '0' + d : d) + " " +
        (h <= 9 ? '0' + h : h) + ":" + (M <= 9 ? '0' + M : M) + ":00.000";
}

function dateToYYYYMMDDHHMMSS(dateStr) {
    let d = new Date(dateStr);

    if (iOS() || isFirefox()) {//20230612: Firefox loi ngay
        d = getIOSSaveDateObj(dateStr);
    }

    return d.getFullYear() + (d.getMonth() + 1).toString().padStart(2, '0') + (d.getDate()).toString().padStart(2, '0') +
               (d.getHours()).toString().padStart(2, '0') + (d.getMinutes()).toString().padStart(2, '0') + (d.getSeconds()).toString().padStart(2, '0');
}

//function ddmmyyyyToyyyymmddFormat(dateStr) {
//    return dateStr.substring(6, 10) + "/" + dateStr.substring(3, 5) + "/" + dateStr.substring(0, 2) + " 00:00:00.000";
//}

function ddmmyyyyToyyyymmddFormat(dateStr) {
    
    if (!dateStr) return "";

    let date = new Date(dateStr);

    if (iOS() || isFirefox()) {//20230627: Firefox loi ngay
        date = getIOSSaveDateObj(dateStr);
    }

    return dateStr.substring(6, 10) + "/" + dateStr.substring(3, 5) + "/" + dateStr.substring(0, 2) + " 00:00:00.000";
}

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == "") return '';
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
}
