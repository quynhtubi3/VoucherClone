/* Điều khiển các control căn bản */

var stiViewerOptions______controlid_____ = new Stimulsoft.Viewer.StiViewerOptions();
stiViewerOptions______controlid_____.appearance.scrollbarsMode = true;
stiViewerOptions______controlid_____.appearance.fullScreenMode = false;
stiViewerOptions______controlid_____.toolbar.showFullScreenButton = false;
stiViewerOptions______controlid_____.toolbar.viewMode = Stimulsoft.Viewer.StiWebViewMode.Continuous;

var stiViewer______controlid_____ = new Stimulsoft.Viewer.StiViewer(stiViewerOptions______controlid_____, "StiViewer______controlid_____", false);

$(function () {
    translateOther();

    $('#desk______controlid_____ .modal-label.billingual-wrapper[data-i18n-layout=layout7]').each(function () {
        if ($(this).prev().hasClass('modal-textbox')) {
            $(this).css('padding-left', '5px');
        }
        if ($(this).next().hasClass('modal-textbox')) {
            $(this).css({ 'text-align': 'right', 'padding-right': '5px' });
        }
    });

    $('#desk______controlid_____ .s3tcloud-prefix.form-container:first').on('keydown', function (e) {      
        if (e.ctrlKey && e.keyCode == 13 && typeof _____controlid______CtrlEnter !== "undefined") { //Ctrl + Enter
			e.preventDefault();
            _____controlid______CtrlEnter();
        }
    })

    $('#desk______controlid_____ .s3tcloud-prefix.form-container:first, #desk______controlid_____ .s3tcloud-prefix.popup-modal').on('keydown', function (e) {
        //check alert show
        if ($('#desk______controlid_____ .popup-alert .popup-alert-background').length > 0 || $("#main-alert").is(':visible')) {
            e.preventDefault(); //Thêm để không tác động tới ô đang focus

            if (!e.ctrlKey && (e.keyCode == 13 || e.keyCode == 32)) {// Enter Escape
                window.setTimeout(function () {
                    if ($("#main-alert").is(':visible')) {
                        $('#main-alert .popup-alert-background .active').click();
                    } else {
                        $('#desk______controlid_____ .popup-alert .popup-alert-background .active').click();
                    }                    
                });                
            } else if (e.keyCode == 37) { //Left
                if ($('#desk______controlid_____ .popup-alert .popup-alert-background .footer-button').length > 1 && $('#desk______controlid_____ .popup-alert .popup-alert-background .active').hasClass("button-cancel")) {
                    $('#desk______controlid_____ .popup-alert .popup-alert-background .button-cancel').removeClass("active");
                    $('#desk______controlid_____ .popup-alert .popup-alert-background .button-save').addClass("active");
                } 
            } else if (e.keyCode == 39) { //Right
                if ($('#desk______controlid_____ .popup-alert .popup-alert-background .footer-button').length > 1 && $('#desk______controlid_____ .popup-alert .popup-alert-background .active').hasClass("button-save")) {
                    $('#desk______controlid_____ .popup-alert .popup-alert-background .button-save').removeClass("active");
                    $('#desk______controlid_____ .popup-alert .popup-alert-background .button-cancel').addClass("active");
                } 
            } else if (e.keyCode == 27) { //Esc                
                if ($("#main-alert").is(':visible')) {
                    $('#main-alert .popup-alert-background .button-cancel').click();
                } else {
                    $('#desk______controlid_____ .popup-alert .popup-alert-background .button-cancel').click();
                } 
            }
        } else {
            if (e.keyCode == 32 && document.activeElement.tagName == 'DIV' && $('#desk______controlid_____ .s3tcloud-prefix div tbody tr.selected:first td.active input:checkbox').length > 0) { //Space
                e.preventDefault();
                $('#desk______controlid_____ .s3tcloud-prefix div tbody tr.selected:first td.active input:checkbox').click();
            } else if (e.keyCode == 115) { //F4
                _____controlid______SendKeyTable(e);
            } else if (e.keyCode == 33) { //PageUp
                _____controlid______SendKeyTable(e);
            } else if (e.keyCode == 34) { //PageDown
                _____controlid______SendKeyTable(e);
            } else if (e.keyCode == 35) { //End    
                _____controlid______SendKeyTable(e);
            } else if (e.keyCode == 36) { //Home
                _____controlid______SendKeyTable(e);
            } else if (e.keyCode == 27) { //Escape
                e.preventDefault();

                if ($(".ui-autocomplete:visible").length > 0) {
                    $(".ui-autocomplete:visible").empty();
                    $(".ui-autocomplete:visible").hide();
                } else if ($("#customtextselectbackground:visible").length > 0) {
                    $("#customtextselectbackground:visible").hide();
                } else if ($("#desk______controlid_____ .table-search").length > 0 && $("#desk______controlid_____ .table-search").is(":visible")) {
                    $("#desk______controlid_____ .table-search").hide();
                    $("#desk______controlid_____ .table-search").parent().focus();
                } else if ($("#desk______controlid_____ .chosen-with-drop").length == 0) {
                    if (!$(this).hasClass("popup-modal")) {
                        //20230831: Bo an ESC thi thoat form nhap
                        //RemoveTab('_____controlid_____', $('#desk______controlid_____').attr('parentcontrolid'));
                    }
                    if (typeof TableColumnFilter_ResetFilter != "undefined") {
                        TableColumnFilter_ResetFilter('_____controlid_____');
                    }
                }
            } else if (e.keyCode == 9) { //Tab
                if ($(".ui-autocomplete:visible").length > 0 || (!e.ctrlKey && !e.shiftKey && !e.altKey && (document.activeElement.tagName == 'DIV' ||
                    (document.activeElement.tagName == 'INPUT' && $(document.activeElement).closest('td').length > 0)))) {
                    e.preventDefault();
                }
            } else if (e.keyCode == 13) { //Enter
                _____controlid______SendKeyTable(e);
            } else if (e.keyCode == 37) { //Left
                _____controlid______SendKeyTable(e);
            } else if (e.keyCode == 39) { //Right
                _____controlid______SendKeyTable(e);
            } else if (e.keyCode == 38) { //Up
                _____controlid______SendKeyTable(e);
            } else if (e.keyCode == 40) { //Down
                _____controlid______SendKeyTable(e);
            } else if (e.keyCode == 113 && typeof _____controlid______F2Key !== "undefined") { //F2
				e.preventDefault();
                _____controlid______F2Key();
            } else if (e.ctrlKey && e.keyCode == 36) { //ctrl + Home
                _____controlid______SendKeyTable(e);
            } else if (e.ctrlKey && e.keyCode == 35) { //ctrl + End
                _____controlid______SendKeyTable(e);
            } else if (e.ctrlKey && e.keyCode == 65) { //ctrl + A
                _____controlid______SendKeyTable(e);
            } else if (e.ctrlKey && e.keyCode == 67) { //ctrl + C
                _____controlid______SendKeyTable(e);
            } else if (e.ctrlKey && e.keyCode == 70) { //ctrl + F
                e.preventDefault();
                _____controlid______SendKeyTable(e);
            } else if (e.ctrlKey && (e.keyCode == 187 || e.keyCode == 107)) { //Ctrl + +
                e.preventDefault();

                if ($(":focus").is('input') && $(":focus").hasClass("text-search") && $(":focus").attr("no-add") != true &&
                    $(":focus").attr("no-add") != "true" && $(":focus").attr("add-function")) {
                    eval($(":focus").attr("add-function"));
                }
            } else if (!e.ctrlKey && !e.shiftKey && !e.altKey && e.keyCode == 123 && $(':focus').is('input') && ($(':focus').hasClass('main-language') || $(':focus').hasClass('sub-language')) &&
                    $(':focus').closest('.modal-textbox.billingual-wrapper').find('.main-language').is(':visible') && $(':focus').closest('.modal-textbox.billingual-wrapper').find('.sub-language').is(':visible')) {
                e.preventDefault(); //Thêm để không tác động tới ô đang focus
                $("img[alt='Google translate (F12)']", $(':focus').parent()).click();
            }
        }
    });

//#endregion Table

    /* Input */

    $("#desk______controlid_____ .s3tcloud-prefix")
        .on('focus', "input:not('.text-number')", function (evt) {
            if ($(this).attr('readonly') != 'readonly' && ($(this).attr('auto-translate-f12-pressed') == undefined || $(this).attr('auto-translate-f12-pressed') == 'false')) {
                $(this).attr('oldvalue', $(this).value());
            }
        });

    /* textnumeric */

    $("#desk______controlid_____ .s3tcloud-prefix")
        .on('dragstart', '.text-number', function (event) {
            event.preventDefault();
        })
        .on('keypress', '.text-number', function (evt) {
            if ($(this).attr('readonly') != 'readonly') {
                evt.preventDefault();
                var callback = $(this).data('callback');
                if ((evt.which > 47 && evt.which < 58) || evt.which == 44 || evt.which == 46) // 0 -> 9 . ,
                    number_keypress($(this), evt.which, evt.key, callback);
            }
        })
        .on('keydown', '.text-number', function (evt) {
            if ($(this).attr('readonly') != 'readonly') {
                var callback = $(this).data('callback');
                if (evt.which == 8 || evt.which == 46 || evt.which == 189) { // Backspace Delete Minus
                    evt.preventDefault();
                    number_keydown($(this), evt.which, evt.key, callback);                    
                }
            }
        })
        .on('focus', '.text-number', function (evt) {
            if ($(this).attr("numericvalue") == undefined || !$(this).attr("numericvalue"))
                $(this).attr("numericvalue", 0);

            if ($(this).attr('readonly') != 'readonly') {
                $(this).val(number_to_text(parseFloat($(this).attr("numericvalue")), number_decimalscale($(this).attr('scale')), null, $(this).attr("decimal") ? parseInt($(this).attr("decimal")) : null));
                $(this).select();
                $(this).attr('oldnumericvalue', $(this).attr('numericvalue'));
            }
        })
        .on('input', '.text-number', function (evt) {
            if ($(this).attr('readonly') != 'readonly') {
                //$(this).attr('oldvalue', $(this).attr('numericvalue'));
                //$(this).attr('oldnumericvalue', $(this).attr('numericvalue'));
                $(this).removeAttr("validate-allow-move-next");
                $(this).removeAttr("validate-allow-move-next-1st");
            }
        })
        .on('change', '.text-number', function (evt) {
            if ($(this).attr('readonly') != 'readonly') {
                $(this).removeAttr("validate-allow-move-next");
                $(this).removeAttr("validate-allow-move-next-1st");
            }
        })
        .on('paste', ".text-number", function (e) {
            if ($(this).attr('readonly') != 'readonly') {
                var $this = $(this);
                setTimeout(function () {
                    number_keydown($this, 86, "");
                }, 0); //just break the callstack to let the event finish
            }
        })

        .on('cut', '.text-number', function (e) {
            if ($(this).attr('readonly') != 'readonly') {
                var $this = $(this);
                setTimeout(function () {
                    number_keydown($this, 88, "");
                }, 0); //just break the callstack to let the event finish
            }
        });

    /* text-select */
    $("#desk______controlid_____ .s3tcloud-prefix")
        .on('focus click', 'div.text-select:not([readonly])', function () {
            let _this = $(this);
            if (_this.attr("id") == $('#customtextselectbackground', $('body')).attr("click-target") && $('#customtextselectbackground', $('body')).attr("trigger-click") == "true") {
                $('#customtextselectbackground', $('body')).removeAttr("trigger-click");
                $('#customtextselectbackground', $('body')).removeAttr("click-target");
                return;
            }
            $('#customtextselectbackground', $('body')).removeAttr("trigger-click");
            $('#customtextselectbackground', $('body')).removeAttr("click-target");
            if ($('#customtextselectbackground', $('body')).length > 0 && !$("#customtextselectbackground").is(":hidden")) return;
        
            if (!$(_this).parent().is('td')) {
                customtextselect_blink_start($(this));
            }

            if ($('#customtextselectbackground', $('body')).length == 0) {
                $('body').append('<div id = "customtextselectbackground"><ul id="list"></ul></div>');
            }
            $('#list', $('#customtextselectbackground', $('body'))).empty();
            
            let data = $(this).data('toggle');
            let html = '';
            let translate = (typeof $(this).attr('translate') !== 'undefined' && $(this).attr('translate') == 'false' ? false : true);
            $.each(data, function (index, item) {
                if (translate) {
                    if ($(_this).data('title') == item.id) {
                        html += '<li class="billingual-wrapper selected" data-i18n-layout="layout8" data-i18n-key="' + item.name + '" data-title="' + item.id + '">' + (translate ? '' : item.name) + '</li>';
                    } else {
                        html += '<li class="billingual-wrapper" data-i18n-layout="layout8" data-i18n-key="' + item.name + '" data-title="' + item.id + '">' + (translate ? '' : item.name) + '</li>';
                    }
                } else {
                    if ($(_this).data('title') == item.id) {
                        html += '<li class="selected" data-title="' + item.id + '">' + item.name + '</li>';
                    } else {
                        html += '<li data-title="' + item.id + '">' + item.name + '</li>';
                    }
                }
            });

            $('#list', $('#customtextselectbackground', $('body')))
                .append(html)
                .ready(function () {
                    $('li', $('#customtextselectbackground', $('body'))).off('mousedown').mousedown(function (e) {
                        $($('#customtextselectbackground', $('body'))).attr("trigger-click", true);
                        $($('#customtextselectbackground', $('body'))).attr("click-target", _this.attr("id"));
                        $(_this).value($(this).data('title'));
                        let controlid = $(_this).closest("table").attr("controlid");
                        if (controlid) {
                            let s3ttable = eval(controlid + "_S3Table");
                            if (s3ttable) {
                                //s3ttable.KeyDown(new KeyboardEvent('keydown', { keyCode: 39 }));// move right   
                                s3ttable.UpdateClusterizeRow(_this);
                                customtextselect_blink_stop(_this);
                                $("#customtextselectbackground", $('body')).hide();
                                InputCallbackHandle(_this);
                            } else {
                                //$(_this).attr("tabindex", -1).blur();
                                customtextselect_blink_stop(_this);
                                $("#customtextselectbackground", $('body')).hide();
                                InputCallbackHandle(_this);
                            }
                        } else {
                            customtextselect_blink_stop(_this);
                            $("#customtextselectbackground", $('body')).hide();
                            InputCallbackHandle(_this);
                            //$(_this).attr("tabindex", -1).blur();
                            //$(_this).trigger('change');
                        } 
                                                            
                        e.preventDefault();                    
                    });
                    customtextselect_scroll($('li.selected', $('#customtextselectbackground', $('body'))), false);
                    //// scroll to selected
                    //$('#customtextselectbackground', $('body')).scrollTop = 234;

                    $(_this).off('keydown').on('keydown', function (e) {
                        if (e.ctrlKey || e.altKey || (e.shiftKey && e.key !== 'Tab')) {
                            return;
                        }

                        let elem = $('li.selected', $('#customtextselectbackground', $('body')));
                        switch (e.keyCode) {
                            case 13: //Enter
                                if ($("#customtextselectbackground").is(":hidden")) return;
                                $(_this).value($(elem).data('title'));
                                $('#customtextselectbackground', $('body')).hide();
                                customtextselect_blink_stop(_this);                            
                                if ($(_this).closest("td").length == 0) {
                                    $(_this).attr("trigger-blue", true);
                                    $(_this).attr("tabindex", -1).blur();                                
                                    $(_this).trigger('change');
                                } else {
                                    let controlid = $(_this).closest("table").attr("controlid");
                                    if (controlid) {
                                        let s3ttable = eval(controlid + "_S3Table");
                                        if (s3ttable) {
                                            s3ttable.UpdateClusterizeRow(_this);
                                        } 
                                    } 
                                    InputCallbackHandle(_this);
                                }
                                
                                break;
                            case 9: //Tab
                                $('#customtextselectbackground', $('body')).hide();
                                break;

                            case 40: //Down
                                if ($(elem).next().length > 0) {
                                    $(elem).removeClass('selected');
                                    $(elem).next().addClass('selected');
                                    $(_this).value($(elem.next()).data('title'));
                                    customtextselect_scroll($(elem), false);
                                    //$(_this).trigger('change');
                                }
                                break;

                            case 38: //Up
                                if ($(elem).prev().length > 0) {
                                    $(elem).removeClass('selected');
                                    $(elem).prev().addClass('selected');
                                    $(_this).value($(elem.prev()).data('title'));
                                    customtextselect_scroll($(elem), true);
                                    //$(_this).trigger('change');
                                }
                                break;

                            case 27: //ESC
                                //if (!e.ctrlKey && !e.shiftKey && !e.altKey) {
                                //    $('#customtextselectbackground', $('body')).hide();
                                //}
                                break;

                            default:
                                break;
                        }
                    })
                });

            translate && translator.translateById('customtextselectbackground');
            $(_this).val($('li.selected', $('#customtextselectbackground', $('body'))).text());
            $('#customtextselectbackground', $('body')).show();

            if ($('#mainbody')[0].getBoundingClientRect().height - $(this)[0].getBoundingClientRect().bottom < $('#customtextselectbackground', $('body'))[0].getBoundingClientRect().height &&
                    $('#mainbody')[0].getBoundingClientRect().height - $(this)[0].getBoundingClientRect().bottom < $('#mainbody')[0].getBoundingClientRect().height - $(this)[0].getBoundingClientRect().top) {
                $('#customtextselectbackground', $('body')).css('top', $(this)[0].getBoundingClientRect().top - $('#customtextselectbackground', $('body'))[0].getBoundingClientRect().height);
            } else {
                $('#customtextselectbackground', $('body')).css('top', $(this)[0].getBoundingClientRect().bottom);
            }
            $('#customtextselectbackground', $('body')).css('left', $(this)[0].getBoundingClientRect().left);
            $('#customtextselectbackground', $('body')).css('min-width', $(this)[0].getBoundingClientRect().width);

            window.setTimeout(function () {
                if ($(_this).parent().is("td")) {
                    if ($('#mainbody')[0].getBoundingClientRect().height - $(_this)[0].getBoundingClientRect().bottom < $('#customtextselectbackground', $('body'))[0].getBoundingClientRect().height &&
                        $('#mainbody')[0].getBoundingClientRect().height - $(_this)[0].getBoundingClientRect().bottom < $('#mainbody')[0].getBoundingClientRect().height - $(_this)[0].getBoundingClientRect().top) {
                        $('#customtextselectbackground', $('body')).css('top', $('#customtextselectbackground', $('body')).offset().top - parseInt($(_this).css("padding-top")) - parseInt($(_this).css("margin-top")));
                    } else {
                        $('#customtextselectbackground', $('body')).css('top', $('#customtextselectbackground', $('body')).offset().top + parseInt($(_this).css("padding-top")) + parseInt($(_this).css("margin-top")));
                    }
                    $('#customtextselectbackground', $('body')).css('left', $('#customtextselectbackground', $('body')).offset().left - parseInt($(_this).parent().css("padding-left")) - parseInt($(_this).css("margin-left")));
                    $('#customtextselectbackground', $('body')).css('min-width', $($(_this).parent())[0].getBoundingClientRect().width);
                }
            }, 0);   
            $(_this).attr("tabindex", -1).focus();
        })

        .on('blur', 'div.text-select', function (e) {
            customtextselect_blink_stop($(this));
            $("#customtextselectbackground", $('body')).hide();
            if ($(this).attr("trigger-blue") == "true") {
                $(this).attr("trigger-blue", false);
                InputCallbackHandle($(this));
                if ($(this).closest("td").length == 0) {
                    let parent = $($(this).closest('div[TabIndex="0"]'));
                    let input = $('input:visible:not(:disabled):not([tabindex="-1"]),select:visible,textarea:visible,div.text-select:visible:not(:disabled)', $(parent));
                    if (input.length > 0) {
                        //focus to next
                        let index = input.index(this) + 1;
                        if (index == input.length) index = 0;
                        if ($(input[index]).is("div.text-select")) {
                            $(input[index]).attr("tabindex", -1).focus();
                        } else {
                            input[index].focus();
                        }
                    }
                }
            } else {
                $(this).closest(".popup-modal-background").attr("tabindex", -1).focus();
            }        
        })

    /* textdate */
    $("#desk______controlid_____ .s3tcloud-prefix")
        .on('dragstart', '.text-date', function (event) {
            event.preventDefault();
        })
        .on('keypress', '.text-date', function (event) {
            if ($(this).attr('readonly') != 'readonly') {
                event.preventDefault();
            }
        })
        .on('keydown', '.text-date', function (event) {
            if ($(this).attr('readonly') != 'readonly') {
                $.powerTip.hide();
                if (event.ctrlKey) {
                    if (event.keyCode == 65 || event.keyCode == 97) { // 'A' or 'a'
                        event.target.setSelectionRange(0, 10);
                        event.preventDefault();
                        return false;
                    } else if (event.keyCode == 67) {
                        return;
                    }
                }

                //Nếu text-date nằm trong td mà td không có background-color thì bấm phím mũi tên hoặc tab sẽ đi qua ô này
                if ($(this).closest("td").length > 0 && !$(this).closest("td").hasClass("active-nobg") && (event.which == 37 || event.which == 39 || event.which == 9)) {
                    return;
                }

                $(this).closest("td").addClass("active-nobg");
                var selectRange = parseInt($(this).attr('select-index'));

                var value = $(this).val();
                var day = value.substring(0, 2);
                var month = value.substring(3, 5);
                var year = value.substring(6, 10);
                if (event.which == 8 || event.which == 46) { // remove
                    var start = event.target.selectionStart;
                    var end = event.target.selectionEnd;                
                    if (start == 0 && end == 10) {
                        $(this).val("__/__/____");
                        event.target.setSelectionRange(2, 2);
                        $(this).attr('select-index', 0);
                        event.preventDefault();  
                        $(this).trigger("change");
                        return;
                    }
                    switch (selectRange) {
                        case 0:
                            if (parseInt(day)) {
                                $(this).val("__" + "/" + month + "/" + year);
                                if (parseInt(year)) {
                                    event.target.setSelectionRange(6, 10);
                                } else {
                                    if ($(this).val() == "__/__/____") {
                                        event.target.setSelectionRange(2, 2);
                                        $(this).attr('select-index', 0);
                                        event.preventDefault();
                                        return;
                                    } else {
                                        event.target.setSelectionRange(10, 10);
                                    }
                                }
                                $(this).attr('select-index', 2);
                            } else {
                                if (day == "__") {
                                    if (parseInt(year)) {
                                        event.target.setSelectionRange(6, 10);
                                    } else {
                                        if ($(this).val() == "__/__/____") {
                                            event.target.setSelectionRange(2, 2);
                                            $(this).attr('select-index', 0);
                                            event.preventDefault();
                                            return;
                                        } else {
                                            event.target.setSelectionRange(10, 10);
                                        }
                                    }
                                    $(this).attr('select-index', 2);
                                } else {
                                    $(this).val("__" + "/" + month + "/" + year);
                                    event.target.setSelectionRange(2, 2);
                                    $(this).attr('select-index', 0);
                                }
                            }
                            break;
                        case 1:
                            if (parseInt(month)) {
                                $(this).val(day + "/" + "__" + "/" + year);
                                if (parseInt(day)) {
                                    event.target.setSelectionRange(0, 2);
                                } else {
                                    event.target.setSelectionRange(2, 2);
                                }
                                $(this).attr('select-index', 0);
                            } else {
                                if (month == "__") {
                                    if (parseInt(day)) {
                                        event.target.setSelectionRange(0, 2);
                                    } else {
                                        event.target.setSelectionRange(2, 2);
                                    }
                                    $(this).attr('select-index', 0);
                                } else {
                                    $(this).val(day + "/" + "__" + "/" + year);
                                    event.target.setSelectionRange(5, 5);
                                    $(this).attr('select-index', 1);
                                }
                            }
                            break;
                        case 2:
                            if (parseInt(year)) {
                                $(this).val(day + "/" + month + "/" + "____");
                                if (parseInt(month)) {
                                    event.target.setSelectionRange(3, 5);
                                } else {
                                    event.target.setSelectionRange(5, 5);
                                }
                                $(this).attr('select-index', 1);
                            } else {
                                if (year == "____") {
                                    if (parseInt(month)) {
                                        event.target.setSelectionRange(3, 5);
                                    } else {
                                        event.target.setSelectionRange(5, 5);
                                    }
                                    $(this).attr('select-index', 1);
                                } else {
                                    year = "_" + year.substring(0, 3);
                                    $(this).val(day + "/" + month + "/" + year);
                                    event.target.setSelectionRange(10, 10);
                                    $(this).attr('select-index', 2);
                                }
                            }
                            break;
                    }
                } else if (event.which == 37) { // left key
                    var start = event.target.selectionStart;
                    var end = event.target.selectionEnd;
                    if (start == 0 && end == 10 && $(this).closest("td").length > 0) {                    
                        event.preventDefault();
                        return;
                    }
                    switch (selectRange) {
                        case 0:
                            if (parseInt(year)) {
                                event.target.setSelectionRange(6, 10);
                            } else {
                                event.target.setSelectionRange(10, 10);
                            }
                            $(this).attr('select-index', 2);
                            break;
                        case 1:
                            if (parseInt(day)) {
                                event.target.setSelectionRange(0, 2);
                            } else {
                                event.target.setSelectionRange(2, 2);
                            }
                            $(this).attr('select-index', 0);
                            break;
                        case 2:
                            if (parseInt(month)) {
                                event.target.setSelectionRange(3, 5);
                            } else {
                                event.target.setSelectionRange(5, 5);
                            }
                            $(this).attr('select-index', 1);
                            break;
                        default:
                            if (parseInt(day)) {
                                event.target.setSelectionRange(0, 2);
                            } else {
                                event.target.setSelectionRange(2, 2);
                            }
                            $(this).attr('select-index', 0);
                            break;
                    }
                } else if (event.which == 39) { // right key
                    var start = event.target.selectionStart;
                    var end = event.target.selectionEnd;
                    if (start == 0 && end == 10 && $(this).closest("td").length > 0) {
                        event.preventDefault();
                        return;
                    }
                    switch (selectRange) {
                        case 0:
                            if (parseInt(month)) {
                                event.target.setSelectionRange(3, 5);
                            } else {
                                event.target.setSelectionRange(5, 5);
                            }
                            $(this).attr('select-index', 1);
                            break;
                        case 1:
                            if (parseInt(year)) {
                                event.target.setSelectionRange(6, 10);
                            } else {
                                event.target.setSelectionRange(10, 10);
                            }
                            $(this).attr('select-index', 2);
                            break;
                        case 2:
                            if (parseInt(day)) {
                                event.target.setSelectionRange(0, 2);
                            } else {
                                event.target.setSelectionRange(2, 2);
                            }
                            $(this).attr('select-index', 0);
                            break;
                        default:
                            if (parseInt(day)) {
                                event.target.setSelectionRange(0, 2);
                            } else {
                                event.target.setSelectionRange(2, 2);
                            }
                            $(this).attr('select-index', 0);
                            break;
                    }
                } else if (event.which == 13 || event.which == 16 || event.which == 9) {
                
                    return;
                } if ((event.which > 47 && event.which < 58) || (event.which > 95 && event.which < 106)) {                
                    var code = event.which;
                    if (code >= 96 && code <= 105) {
                        // Numpad keys
                        code -= 48;
                    }
                    switch (selectRange) {
                        case 1:
                            if (month == "__") {
                                month = month.substring(0, 1) + "" + String.fromCharCode(code);
                            } else if (month.substring(0, 1) == "_") {
                                if (month.substring(1, 2) == "1") {
                                    if (String.fromCharCode(code) == "0" || String.fromCharCode(code) == "1" || String.fromCharCode(code) == "2") {
                                        month = month.substring(1, 2) + String.fromCharCode(code);
                                    } else {
                                        month = "0" + String.fromCharCode(code);
                                    }
                                } else {
                                    if (String.fromCharCode(code) == "0") {
                                        month = "01";
                                    } else {
                                        month = "0" + String.fromCharCode(code);
                                    }
                                }
                            } else {
                                month = "_" + String.fromCharCode(code);
                            }

                            if (parseInt(month)) {
                                if (parseInt(month) > 12) {
                                    month = "12";
                                }
                                $(this).val(day + "/" + month + "/" + year);
                                if (parseInt(year)) {
                                    $(this).attr('select-index', 2);
                                    event.target.setSelectionRange(6, 10);
                                } else {
                                    $(this).attr('select-index', 2);
                                    event.target.setSelectionRange(10, 10);
                                }
                            } else {
                                $(this).val(day + "/" + month + "/" + year);
                                $(this).attr('select-index', 1);
                                event.target.setSelectionRange(5, 5);
                            }
                            break;
                        case 2:
                            if (parseInt(year)) {
                                year = "___" + String.fromCharCode(code);
                            } else {
                                year = year.substring(1) + String.fromCharCode(code);
                            }
                            $(this).val(value.substring(0, 6) + year);
                            if (parseInt(year)) {
                                $(this).attr('select-index', 2);
                                event.target.setSelectionRange(6, 10);
                            } else {
                                $(this).attr('select-index', 2);
                                event.target.setSelectionRange(10, 10);
                            }
                            break;
                        default:
                            if (day == "__") {
                                day = day.substring(0, 1) + "" + String.fromCharCode(code);
                            } else if (day.substring(0, 1) == "_") {
                                switch (day) {
                                    //case "_0":
                                    //    if (String.fromCharCode(code) == "0") {
                                    //        day = "01";
                                    //    } else {
                                    //        day = "0" + String.fromCharCode(code);
                                    //    }
                                    //    break;
                                    case "_1":
                                    case "_2":
                                        day = day.substring(1, 2) + String.fromCharCode(code);
                                        break;
                                    case "_3":
                                        if (String.fromCharCode(code) == "0" || String.fromCharCode(code) == "1") {
                                            day = day.substring(1, 2) + String.fromCharCode(code);
                                        } else {
                                            day = "0" + String.fromCharCode(code);
                                        }
                                        break;
                                    default:
                                        if (String.fromCharCode(code) == "0") {
                                            day = "01";
                                        } else {
                                            day = "0" + String.fromCharCode(code);
                                        }
                                        break;
                                }
                            } else {
                                day = "_" + String.fromCharCode(code);
                            }

                            if (parseInt(day) && parseInt(day) > 31) {
                                day = "31";
                            }

                            $(this).val(day + value.substring(2, 10));
                            if (parseInt(day)) {
                                if (parseInt(month)) {
                                    $(this).attr('select-index', 1);
                                    event.target.setSelectionRange(3, 5);
                                } else {
                                    $(this).attr('select-index', 1);
                                    event.target.setSelectionRange(5, 5);
                                }
                            } else {
                                $(this).attr('select-index', 0);
                                event.target.setSelectionRange(2, 2);
                            }
                            break;
                    }
                    $(this).trigger("change");
                }
                event.preventDefault();
            }
        })
        .on('focus', ".text-date", function (event) {
            if ($(this).attr('is-focus') == "true") {
                if ($(this).attr('select-index') == "0" || $(this).attr('select-index') == 0) {
                    event.target.setSelectionRange(0, 2);
                } else if ($(this).attr('select-index') == "1" || $(this).attr('select-index') == 1) {
                    event.target.setSelectionRange(3, 5);
                } else {
                    event.target.setSelectionRange(6, 10);
                }
                return;
            }
            if ($(this).attr('readonly') != 'readonly') {
                var value = $(this).val();
                if (value == "")
                    $(this).val("__/__/____");
                value = $(this).val();
                var day = value.substring(0, 2);
                if (parseInt(day)) {
                    event.target.setSelectionRange(0, 2);
                } else {
                    event.target.setSelectionRange(2, 2);
                }

                $(this).attr('select-index', 0);
                $(this).attr('is-focus', "true");
            } else {
                event.target.setSelectionRange(0, 2);
            }
        })
        .on('click', ".text-date", function (event) {
            if ($(this).attr('readonly') != 'readonly') {
                var value = $(this).val();
                var day = value.substring(0, 2);
                var month = value.substring(3, 5);
                var year = value.substring(6, 10);

                var position = getCursorPosition($(this));
                if (position && position >= 0 && position < 3) {
                    if (parseInt(day)) {
                        event.target.setSelectionRange(0, 2);
                        $(this).attr('select-index', 0);
                    } else {
                        event.target.setSelectionRange(2, 2);
                        $(this).attr('select-index', 0);
                    }
                } else if (position && position >= 3 && position < 6) {
                    if (parseInt(month)) {
                        event.target.setSelectionRange(3, 5);
                        $(this).attr('select-index', 1);
                    } else {
                        event.target.setSelectionRange(5, 5);
                        $(this).attr('select-index', 1);
                    }
                } else if (position && position >= 6 && position <= 10) {
                    if (parseInt(year)) {
                        event.target.setSelectionRange(6, 10);
                        $(this).attr('select-index', 2);
                    } else {
                        event.target.setSelectionRange(10, 10);
                        $(this).attr('select-index', 2);
                    }
                } else {
                    if (parseInt(day)) {
                        event.target.setSelectionRange(0, 2);
                        $(this).attr('select-index', 0);
                    } else {
                        event.target.setSelectionRange(2, 2);
                        $(this).attr('select-index', 0);
                    }
                }
            }
        })
        .on('paste', ".text-date", function (e) {
            if ($(this).attr('readonly') != 'readonly') {
                event.preventDefault();
            }
        })
        .on('cut', '.text-date', function (e) {
            if ($(this).attr('readonly') != 'readonly') {
                event.preventDefault();
            }
        });
});

//#region RadioButton

$('.radiobutton a', $('#desk______controlid_____')).on('click', function () {
    var sel = $(this).data('title');
    var tog = $(this).data('toggle');
    $('input.' + tog, $(this).parent().parent()).prop('value', sel);

    $('a[data-toggle="' + tog + '"]').not('[data-title="' + sel + '"]', $(this).parent()).removeClass('active').addClass('notactive');
    $('a[data-toggle="' + tog + '"][data-title="' + sel + '"]', $(this).parent()).removeClass('notactive').addClass('active');
})

//#endregion RadioButton

function _____controlid______SendKeyTable(e) {
    if ($("#desk______controlid_____ .table-search").length > 0 && $("#desk______controlid_____ .table-search").is(":visible")) return;
    let row = $('#desk______controlid_____ .s3tcloud-prefix table tbody tr.selected:first');
    let controlid = $(row.closest("table")).attr("controlid");
    if (controlid) {
        let s3ttable = eval(controlid + "_S3Table");
        return s3ttable.KeyDown(e);
    }    
}