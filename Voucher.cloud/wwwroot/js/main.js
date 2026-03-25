/* Điều khiển màn hình chính */
var ApplicationInstance = new Object();
var isMouseDown = false;
var isThMouseDown = false;
var currentInvalidateElement = null;
var Main_Loading = new ItpOverlay("s3t-cloud-body", "main-loading");
var Main_AlertMessage = new AlertMessage("main-alert");
var TabQueue = [];

$(function () {

    //Arrange controls on form main
    DoResize();
    $(document).on("keypress", ".text-decimal", function (e) {
        var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
        var charStr = String.fromCharCode(charCode);

        // Cho phép phím control (Backspace, Tab, Enter, Delete, mũi tên…)
        if (e.ctrlKey || e.metaKey || charCode < 32) {
            return;
        }

        // Chỉ cho phép số, dấu . hoặc ,
        if (!/[0-9.,-]/.test(charStr)) {
            e.preventDefault();
            return false;
        }

        // Chỉ cho phép 1 dấu . hoặc ,
        if ((charStr === "." || charStr === ",") && $(this).val().includes(charStr)) {
            e.preventDefault();
            return false;
        }

        // Dấu - chỉ được ở đầu
        if (charStr === "-" && this.selectionStart !== 0) {
            e.preventDefault();
            return false;
        }
    });
    $(document).on('keydown', function (e) {
        if (e.ctrlKey && e.keyCode == 192 && TabQueue.length > 0) {
            let tabid = '';

            if ($('#maintaskbar .tab .active').closest('.tab').parent().is($('#maintaskbar'))) {
                if ($('#maintaskbar > .tab .active').closest('.tab').index() < $('#maintaskbar > .tab').length) {
                    tabid = $('#maintaskbar > .tab .active').closest('.tab').next().attr("id");
                } else if (TabQueue.length > $('#maintaskbar > .tab').length) {
                    tabid = $($('#invisibleitemsmenu > .tab')[$('#invisibleitemsmenu > .tab').length - 1]).attr("id");
                } else {
                    tabid = 'tab_00'; // tabid = $($('#maintaskbar > .tab')[0]).attr("id");
                }
            } else if ($('#invisibleitemsmenu .tab .active').closest('.tab').parent().is($('#invisibleitemsmenu'))) {
                if ($('#invisibleitemsmenu > .tab .active').closest('.tab').index() == 0) {
                    tabid = 'tab_00'; // $($('#maintaskbar > .tab')[0]).attr("id");
                } else {
                    tabid = $('#invisibleitemsmenu > .tab .active').closest('.tab').prev().attr("id");
                }
            } else {
                tabid = $($('#maintaskbar > .tab')[0]).attr("id");
            }

            ShowTab(tabid.substr(4));
        } else if (e.keyCode == 13 || e.keyCode == 27 || e.keyCode == 32) { //Enter, Escape, Space
            Main_AlertMessage.hide();
        }
    });

    $(document).on("change", 'input, textarea', function (e) {
        !$(this).is(":file") && $(this).closest("td").length == 0 && UpdateCurrentRow($(this));
    });

    $(document).on("keydown", 'input, textarea, select, div.text-select', function (e) {
        /* ENTER PRESSED*/

        if ($(this).closest('.main-desktop').find('.popup-alert .popup-alert-background').length > 0 || $(this).hasClass("s3table-search") || $(this).hasClass("table-search-input")) {
            return;
        }

        if (!e.ctrlKey && !e.shiftKey && !e.altKey && (e.keyCode == 13 || e.keyCode == 9)) {
            if ($(this).closest("td").length == 0) {
                let self = this;
                Validate($(self), true).then(function (isValid) {
                    if (isValid == true) {
                        e.preventDefault();

                        let $parent = $($(self).closest('div[tabindex="0"]'));
                        let $this = $('input:visible:not(:disabled):not([tabindex="-1"]),select:visible,textarea:visible,div.text-select:visible:not(:disabled)', $($parent));
                        let nextFocus = $(self).attr("next-focus");
                        let nextFocusType = $(self).attr("next-focus-type");

                        if (nextFocus && nextFocusType == "editor") {
                            CKEDITOR.instances[nextFocus].focus();
                            return;
                        }

                        if ($this.length > 0) {
                            // for text-multi-select
                            if ($(self).closest(".chosen-container").hasClass("chosen-with-drop")) return;
                            let index = $this.index(self) + 1;

                            if (index == $this.length)
                                index = 0;

                            if ($($this[index].closest('td')).length > 0) {
                                let controlid = $($this[index].closest('table')).attr("controlid");
                                window.setTimeout(function () {
                                    let s3ttable = eval(controlid + "_S3Table");
                                    s3ttable.ClusterizeData.current_row_id = "";//reset focus
                                    s3ttable.Focus();
                                    s3ttable.scroll[0].scrollTop = 0;
                                    s3ttable.scroll[0].scrollLeft = 0;
                                }, 50);

                                if ($(self).is('input:text') || $(self).is('input:file') || $(self).is('textarea')) {
                                    $(self)[0].setSelectionRange(0, 0);
                                }

                                $(self).blur();
                            } else {
                                if ($($this[index]).is("div.text-select")) {
                                    $($this[index]).attr("tabindex", -1).focus();
                                } else {
                                    $this[index].focus();
                                }

                                if ($($this[index]).hasClass('text-option')) {
                                    if ($($this[index]).prop('readonly')) {
                                        $this[index].select();
                                    } else {
                                        $this[index].setSelectionRange(0, 0);
                                    }
                                } else if (!$($this[index]).hasClass('text-date') && !$($this[index]).hasClass('text-select') && !$($this[index]).is('select')) {
                                    $this[index].select();
                                }
                            }
                        }
                    }
                });
            }
        }
    });

    $(document).on("blur", 'input, textarea', function (e) {
        if ($(this).closest("td").length == 0) {
            InputBlurHandle($(this));
        }
    });

    $(document).on("input", 'input, textarea', function (e) {
        if ($(this).closest("td").length == 0) {
            $.powerTip.hide();
        }
    });

    $(document).on("focus", 'input, textarea', function (e) {
        if (!$(this).hasClass('table-search-input') && $(this).closest("td").length == 0) {
            let mainDesktop = $(this).closest(".main-desktop");
            if (mainDesktop) {
                let id = mainDesktop.attr('id')
                if (id) {
                    id = mainDesktop.attr('id').replace('desk_', '');
                    if (eval("typeof " + id + "_LastFocus != undefined")) {
                        window[id + "_LastFocus"] = this;
                    }
                }
            }
            InputFocusHandle($(this));
        }
    });

    $(document).mousedown(function (e) {
        HideFilter(e);
        HideTextSelectBackground(e);
        HideDropDown(e);
        TableClear(e);
        HideNavigator(e);
        HideCustomDropDown(e);
        HideCustomDropDownList(e);
        HideProfileMenu(e);
        HideSearchTable(e);
    });

    $(document).mouseup(function () {
        isMouseDown = false;
        isThMouseDown = false;
    });

    $('#Button_Dashboard').click(function () {
        HideNavigator();
        ShowTab("T00");
    });

    $('#Button_Logout').click(function () {
        $.ajax
            ({
                type: 'GET',
                url: 'api/Admin/IsAuthorize',
                async: false,
                contentType: 'application/json; charset =utf-8',
                success: function (data) {
                    $("#Logout_Form")[0].submit();
                },
                error: function (data) {
                    let a = document.createElement('a');
                    a.href = "Account/Login";
                    a.click();
                    a.remove();
                },
            });
    });

    $(document).on("click", function (e) {
        if ($(e.target).is("#invisibleitemsmenu, #invisibleitemsbutton img") === false) {
            $('#invisibleitemsmenu').hide();
        }
    });

    $('#invisibleitemsbutton img').click(function () {
        if ($('#invisibleitemsmenu .tab').length > 0) {
            if ($('#invisibleitemsmenu').is(':visible')) {
                $('#invisibleitemsmenu').hide();
            } else {
                $('#invisibleitemsmenu').show();
            }
        }
    });

    $('#mainmenu-user').click(function () {
        $("#sidenav-user").offset({ left: $("#mainmenu-user").width() + $("#maintoolbar").width(), top: $("#mainmenu-user").offset().top - $("#sidenav-user").height() + $("#mainmenu-user").height() });
        $("#sidenav-user").show();
        $(".menu-user-open-menu", $("#mainmenu-user")).attr("src", "img/polygon-close.png");
    });

    $('#Button_Profie').click(function () {
        HideProfileMenu();
        let TabId = $(this).attr("tabid");
        if (TabId) {

        } else {
            TabId = CreateUUIDNoSaperate();
            $(this).attr("tabid", TabId);
        }

        let screenInfo = new Object();
        screenInfo.Title = translator._getValueFromJSON("UserProfile_Var_Title.main", applicationDictionary, false);
        screenInfo.Title_E = translator._getValueFromJSON("UserProfile_Var_Title.sub", applicationDictionary, false);
        screenInfo.TabId = TabId;
        screenInfo.Id = "UserProfile";
        screenInfo.Dock = "none";
        screenInfo.ChildId = "UserProfile";

        AddTab(screenInfo);
    });

    $('.main-menu-button').first().click(function () {
        let data = $(this).attr('major') ? JSON.parse($(this).attr('major')) : [];
        let major = data.filter(row => row.RightType != "R");
        let report = data.filter(row => row.RightType == "R");

        $("#sidenav-major .navbar a").remove();

        major.forEach(function (item, index) {
            item.Id = item.Id == undefined ? "" : item.Id;
            item.Dock = item.Dock == undefined ? "full" : item.Dock;
            item.Type = item.Type == undefined ? "" : item.Type;
            item.ChildId = item.RightId == undefined ? "" : item.ChildId;
            item.RightId = item.RightId == undefined ? "" : item.RightId;
            item.RightType = item.RightType == undefined ? "" : item.RightType;
            item.MenuRightType = item.MenuRightType == undefined ? "" : item.MenuRightType;
            item.IsInputData = item.IsInputData == undefined ? false : item.IsInputData;
            item.Image_Name = item.Image_Name == undefined ? "" : item.Image_Name;
            item.Image_Parent = item.Image_Parent == undefined ? "" : item.Image_Parent;

            let extraVar = item.ExtraMenuVar;
            if (item.RightType == "S" || item.RightType == "P" || item.RightType == "C" || item.RightType == "K") {
                $("#sidenav-major .navbar").append('<a class="main-menu-sub" href="javascript:void(0)" isinputdata = "' + item.IsInputData + '"' + (extraVar ? '" extravar = \'' + JSON.stringify(extraVar) + '\'' : '') + ' rightid = "' + item.RightId + '" righttype = "' + item.RightType + '" menurighttype = "' + item.MenuRightType + '" controlid = "' + item.Id + '" dockstyle = "' + item.Dock + '" image-name = "' + item.Image_Name + '" image-parent = "' + item.Image_Parent + '">' +
                    '<div class="billingual-wrapper"><label class="main-language">' + item.Title + '</label><p class="sub-language">' + item.Title_E + '</p></div></a>');
            } else {
                $("#sidenav-major .navbar").append('<a class="main-menu-sub" href="javascript:void(0)" isinputdata = "' + item.IsInputData + '"' + (extraVar ? '" extravar = \'' + JSON.stringify(extraVar) + '\'' : '') + ' rightid = "' + item.RightId + '" righttype = "' + item.RightType + '" menurighttype = "' + item.MenuRightType + '" controlid = "' + item.Id + '" controltype = "' + item.Type + '" dockstyle = "' + item.Dock + '" childcontrolid = "' + item.ChildId + '" image-name = "' + item.Image_Name + '" image-parent = "' + item.Image_Parent + '">' +
                    '<div class="billingual-wrapper"><label class="main-language">' + item.Title + '</label><p class="sub-language">' + item.Title_E + '</p></div></a>');
            }
        });

        $("#sidenav-report .navbar div.report-body div.report-column").remove();
        $("#sidenav-report .navbar div.report-body")
            .append("<div class='report-column report-column00'></div>")
            .ready(function () {
                report.forEach(function (item, index) {
                    item.Id = item.Id == undefined ? "" : item.Id;
                    item.Dock = item.Dock == undefined ? "none" : item.Dock;
                    item.Type = item.Type == undefined ? "" : item.Type;
                    item.ChildId = item.RightId == undefined ? "" : item.ChildId;

                    let extraVar = item.ExtraMenuVar;
                    $("#sidenav-report .navbar div.report-column.report-column00").append('<a class="main-menu-sub" href="javascript:void(0)" ' + (extraVar ? '" extravar = \'' + JSON.stringify(extraVar) + '\'' : '') + ' rightid = "' + item.RightId + '" righttype = "R" controlid = "' + item.Id + '" controltype = "' + item.Type + '" dockstyle = "' + item.Dock + '" childcontrolid = "' + item.ChildId + '">' +
                        '<div class="billingual-wrapper"><label class="main-language">' + item.Title + '</label><p class="sub-language">' + item.Title_E + '</p></div></a>');
                });
            })

        $.map($("#sidenav-major .billingual-wrapper"), function (elm, index) {
            translateMenu(elm, index);
        });

        $.map($("#sidenav-report .billingual-wrapper"), function (elm, index) {
            translateMenu(elm, index);
        });

        translator.translateById("sidenav-major");
        translator.translateById("sidenav-report");
        if (major.length > 0) {
            $("#sidenav-major").show();
            $("#sidenav-major").width(400);
            $("#sidenav-major").offset({ left: ($("#maintoolbar").width() + $("#mainmenu").width()), top: $("#mainmenu").offset().top });
        } else {
            $("#sidenav-major").hide();
        }
        if (report.length > 0) {
            $("#sidenav-report").show();
            $("#sidenav-report").width(330);
            $("#sidenav-report").offset({ left: ($("#maintoolbar").width() + $("#mainmenu").width() + (major.length > 0 ? 250 : 0)), top: $("#mainmenu").offset().top });
        } else {
            $("#sidenav-report").hide();
        }

        $('.main-menu-sub').off('click').click(function () {
            HideNavigator();

            if ($(this).attr('righttype') == "S") {
                $("#maintoolbar a[controlid=" + $(this).attr('controlid') + "]").click();
                return;
            }

            let TabId = $(this).attr("tabid");
            if (TabId) {

            } else {
                TabId = CreateUUIDNoSaperate();
                $(this).attr("tabid", TabId);
            }

            let screenInfo = new Object();

            screenInfo.Title = $('.main-language', $(this)).text();
            screenInfo.Title_E = $('.sub-language', $(this)).text();
            screenInfo.TabId = TabId;
            screenInfo.Id = $(this).attr('controlid');
            screenInfo.Type = $(this).attr('controltype');
            screenInfo.Dock = $(this).attr('dockstyle');
            screenInfo.ChildId = $(this).attr('childcontrolid');
            screenInfo.RightId = $(this).attr('rightid');
            screenInfo.RightType = $(this).attr('righttype');
            screenInfo.MenuRightType = $(this).attr('menurighttype');
            screenInfo.ExtraMenuVar = $(this).attr('extravar') ? JSON.parse($(this).attr('extravar')) : null;
            screenInfo.IsInputData = $(this).attr('isinputdata');
            // Danh mục: IsInputData = false
            // Chứng từ: IsInputData = true
            screenInfo.Image_Name = $(this).attr('image-name') != undefined ? $(this).attr('image-name') : "";
            screenInfo.Image_Parent = $(this).attr('image-parent') != undefined ? $(this).attr('image-parent') : "";
            if (ApplicationInstance.Dvcsvar.IsParentCompany && (screenInfo.IsInputData == true || screenInfo.IsInputData == "true")) {
                Main_AlertMessage.showInfo("Common_Msg_NoPrivilege");
                return;
            }

            AddTab(screenInfo);
        });
    });

    $('.main-menu-button').not(':first').click(function () {
        let report = $(this).attr('report') ? JSON.parse($(this).attr('report')) : [];
        let major = $(this).attr('major') ? JSON.parse($(this).attr('major')) : [];

        $("#sidenav-major .navbar a").remove();

        let favorites = $($('.main-menu-button').first()).attr('major') ? JSON.parse($($('.main-menu-button').first()).attr('major')) : [];
        let majorFavorites = favorites.filter(row => row.RightType != "R");
        let reportFavorites = favorites.filter(row => row.RightType == "R");

        major.forEach(function (item, index) {
            let extraVar = JSON.stringify(JSON.parse(item.ExtraVar));

            let favorite = '<div class="menu-icon"><i class="fa"></i></div>';
            let indexFavorite = majorFavorites.findIndex(function (o) {
                return o.Id == item.ControlId && o.Title == item.Bar && ((o.ExtraMenuVar == null && item.ExtraVar == null) || JSON.stringify(o.ExtraMenuVar) == JSON.stringify(JSON.parse(item.ExtraVar)));
            });
            if (indexFavorite != -1) {
                favorite = '<div class="menu-icon active"><i class="fa fa-heart"></i></div>';
            }

            if (item.Id == "1acd3efc-0dc4-4756-92a5-e7b28c340752") {//20230728: Them gach ngang ngan cach 4 menu
                //alert('1');
                $("#1acd3efc-0dc4-4756-92a5-e7b28c340752x").remove();
                $("#sidenav-major .navbar").append('<li id="1acd3efc-0dc4-4756-92a5-e7b28c340752x" class="divider"></li>');
            }
            else {
                if (item.Type == "S" || item.Type == "C" || item.Type == "K") {
                    $("#sidenav-major .navbar").append('<a class="main-menu-sub" href="javascript:void(0)" isinputdata = "' + item.IsInputData + '" extravar = ' + extraVar + ' rightid = "' + item.Id + '" righttype = "' + item.Type + '" menurighttype = "' + item.MenuRightType + '" controlid = "' + item.ControlId + '" dockstyle = "' + item.DockStyle + '" image-name = "' + item.Image_Name + '" image-parent = "' + item.Image_Parent + '">' +
                        favorite + '<div class="billingual-wrapper"><label class="main-language">' + item.Bar + '</label><p class="sub-language">' + item.Bar_E + '</p></div></a>');
                } else if (item.Type != "P") {
                    $("#sidenav-major .navbar").append('<a class="main-menu-sub" href="javascript:void(0)" isinputdata = "' + item.IsInputData + '" extravar = ' + extraVar + ' rightid = "' + item.Id + '" righttype = "' + item.Type + '" menurighttype = "' + item.MenuRightType + '" controlid = "' + item.ControlId + '" controltype = "' + item.ControlType + '" dockstyle = "' + item.DockStyle + '" childcontrolid = "' + item.ChildControlId + '" image-name = "' + item.Image_Name + '" image-parent = "' + item.Image_Parent + '">' +
                        favorite + '<div class="billingual-wrapper"><label class="main-language">' + item.Bar + '</label><p class="sub-language">' + item.Bar_E + '</p></div></a>');
                }
            }

        });

        //Report
        $("#sidenav-report .navbar div.report-body div.report-column").remove();

        let result = Object.values(report.reduce(function (r, e) {
            let key = e.RepoGrp;
            if (!r[key]) {
                r[key] = e;
            }
            return r;
        }, {}))

        result.forEach(rrow => {
            let column = rrow.RepoGrp;

            $("#sidenav-report .navbar div.report-body")
                .append("<div class='report-column report-column" + column + "'></div>")
                .ready(function () {
                    report.filter(row => row.RepoGrp == rrow.RepoGrp).forEach(function (item, index) {
                        let ExtraVar = item.ExtraVar != null ? JSON.parse(item.ExtraVar) : new Object();
                        ExtraVar.Id = item.Id;
                        ExtraVar.Title = item.Title;
                        ExtraVar.Title_E = item.Title_E;
                        ExtraVar.Serial = item.Serial;
                        ExtraVar.RepoFile = item.RepoFile;

                        ExtraVar = JSON.stringify(ExtraVar);

                        let favorite = '<div class="menu-icon"><i class="fa"></i></div>';
                        let indexFavorite = reportFavorites.findIndex(function (o) {
                            return o.Id == item.ControlId && o.Title == item.Bar && JSON.stringify(o.ExtraMenuVar) == JSON.stringify(JSON.parse(ExtraVar));
                        });
                        if (indexFavorite != -1) {
                            favorite = '<div class="menu-icon active"><i class="fa fa-heart"></i></div>';
                        }
                        $("#sidenav-report .navbar div.report-column.report-column" + column).append('<a class="main-menu-sub" href="javascript:void(0)" extravar = \'' + ExtraVar + '\' rightid = "' + item.Id + '" righttype = "R" controlid = "' + item.ControlId + '" controltype = "' + item.ControlType + '" dockstyle = "' + item.DockStyle + '" childcontrolid = "' + item.ChildControlId + '">' +
                            favorite + '<div class="billingual-wrapper"><label class="main-language">' + item.Bar + '</label><p class="sub-language">' + item.Bar_E + '</p></div></a>');
                    });
                })
        });

        $.map($("#sidenav-major .billingual-wrapper"), function (elm, index) {
            translateMenu(elm, index);
        });

        $.map($("#sidenav-report .billingual-wrapper"), function (elm, index) {
            translateMenu(elm, index);
        });

        translator.translateById("sidenav-major");
        translator.translateById("sidenav-report");
        if (major.length > 0) {
            $("#sidenav-major").show();
            $("#sidenav-major").width(400);
            $("#sidenav-major").offset({ left: ($("#maintoolbar").width() + $("#mainmenu").width()), top: $("#mainmenu").offset().top });
        } else {
            $("#sidenav-major").hide();
        }
        if (report.length > 0) {
            $("#sidenav-report").show();
            $("#sidenav-report").width(330 * result.length);
            $("#sidenav-report").offset({ left: ($("#maintoolbar").width() + $("#mainmenu").width() + (major.length > 0 ? 250 : 0)), top: $("#mainmenu").offset().top });
            $('#sidenav-report', $('body')).outerHeight($("#maintoolbar").outerHeight() - $("#topnav").outerHeight());
        } else {
            $("#sidenav-report").hide();
        }

        $('.main-menu-sub').off('click').click(function () {
            HideNavigator();
            if ($(this).attr('righttype') == "S") {
                $("#maintoolbar a[controlid=" + $(this).attr('controlid') + "]").click();
                return;
            }
            let TabId = $(this).attr("tabid");
            if (TabId) {

            } else {
                TabId = CreateUUIDNoSaperate();
                $(this).attr("tabid", TabId);
            }

            let screenInfo = new Object();

            screenInfo.Title = $('.main-language', $(this)).text();
            screenInfo.Title_E = $('.sub-language', $(this)).text();
            screenInfo.TabId = TabId;
            screenInfo.Id = $(this).attr('controlid');
            screenInfo.Type = $(this).attr('controltype');
            screenInfo.Dock = $(this).attr('dockstyle');
            screenInfo.ChildId = $(this).attr('childcontrolid');
            screenInfo.RightId = $(this).attr('rightid');
            screenInfo.RightType = $(this).attr('righttype');
            screenInfo.MenuRightType = $(this).attr('menurighttype');
            screenInfo.ExtraMenuVar = $(this).attr('extravar') ? JSON.parse($(this).attr('extravar')) : null;
            screenInfo.Image_Name = $(this).attr('image-name') != undefined ? $(this).attr('image-name') : "";
            screenInfo.Image_Parent = $(this).attr('image-parent') != undefined ? $(this).attr('image-parent') : "";
            if (screenInfo.Id == "ManagerRoleLister") {
                screenInfo.TabId = TabId + '_Role';
            }

            AddTab(screenInfo);
        });
    });

    $(".main-menu-button:not(.no-accessible)").hover(function () {
        $($(this).find(".menu-icon div")).css("opacity", 1);
    }, function () {
        $($(this).find(".menu-icon div")).css("opacity", 0.3);
    });

    $('.main-menu-toolbar').click(function () {
        let TabId = $(this).attr("tabid");
        if (TabId) {

        } else {
            TabId = CreateUUIDNoSaperate();
            $(this).attr("tabid", TabId);
        }

        let screenInfo = new Object();

        screenInfo.Title = $(this).attr('mainlanguage');
        screenInfo.Title_E = $(this).attr('sublanguage');
        screenInfo.TabId = TabId;
        screenInfo.Id = $(this).attr('controlid');
        screenInfo.Type = $(this).attr('controltype');
        screenInfo.Dock = $(this).attr('dockstyle');
        screenInfo.ChildId = $(this).attr('childcontrolid');
        screenInfo.RightId = $(this).attr('rightid');
        screenInfo.RightType = $(this).attr('righttype');
        screenInfo.MenuRightType = $(this).attr('menurighttype');
        screenInfo.Image_Name = $(this).attr('image-name') != undefined ? $(this).attr('image-name') : "";
        screenInfo.Image_Parent = $(this).attr('image-parent') != undefined ? $(this).attr('image-parent') : "";

        //if (screenInfo.Id == 'DmDvcsLister') {
        //    $("#maindesktop .main-desktop").not(':first').remove();
        //    $("#maintaskbar .tab").remove();
        //    $("#invisibleitemsmenu .tab").remove();
        //}

        AddTab(screenInfo);
    });

    $('#maintoolbar .navbar-toggle').on('click', () => {
        if ($('#mainmenu').is(':visible')) {
            $('#mainmenu').hide();
        } else {
            $('#mainmenu').show();
        }
    })
});


$(window).resize(function () {
    DoResize();
});

function UpdateCurrentRow(element) {
    if ($(element).closest(".main-desktop").attr("id") != undefined) {
        let controlid = $(element).closest(".main-desktop").attr("id").replace("desk_", "");
        let columnName = $(element).attr("data-field-name");
        if (controlid && columnName && eval("typeof " + controlid + "_CurrentRow != 'undefined'")) {
            let currentRow = eval(controlid + "_CurrentRow");
            if (currentRow)
                currentRow[columnName] = $(element).value();
        }
    }
}

function RowFocusMouseUp(e) {
    isThMouseDown = false;
}

function HideNavigator(e) {
    let mainmenu = $("#mainmenu");
    let major = $("#sidenav-major");
    let report = $("#sidenav-report");
    if (e == undefined || !mainmenu.is(e.target) && mainmenu.has(e.target).length === 0 &&
        !major.is(e.target) && major.has(e.target).length === 0 &&
        !report.is(e.target) && report.has(e.target).length === 0) {
        $("#sidenav-major").width(0);
        $("#sidenav-report").width(0);
        $("#sidenav-major").hide();
        $("#sidenav-report").hide();

        //Hide menu if screen size is <= 1366
        if ((e == undefined || !$('#maintoolbar .navbar-toggle').is(e.target)) && $('#maintoolbar .navbar-toggle').is(':visible')) {
            $('#mainmenu').hide();
        }
    }
}

function HideCustomDropDown(e) {
    let customdropdown = $("#customdropdown");
    if (!customdropdown.is(e.target) && customdropdown.has(e.target).length === 0) {
        $("#customdropdown").hide();
    }
}

function HideCustomDropDownList(e) {
    let customdropdown = $("#customdropdown-list");
    if (!customdropdown.is(e.target) && customdropdown.has(e.target).length === 0) {
        $("#customdropdown-list").hide();
    }
}

function HideTooltip() {
    $.powerTip.hide();
    currentInvalidateElement = null;
}

function HideFilter(e) {
    var container = $("#TableColumnFilter", $('body'));

    if (!container.is(e.target) && container.has(e.target).length === 0) {
        if (!$(e.target).hasClass("table-header-filter") && $(container).css('display') != 'none') {
            if (typeof TableColumnFilter_CancelFilter != "undefined")
                TableColumnFilter_CancelFilter()
        };
    }
}

function HideProfileMenu(e) {
    let container = $("#sidenav-user");
    if (e == undefined || !$("#mainmenu-user").is(e.target) && $("#mainmenu-user").has(e.target).length === 0 && !container.is(e.target) && container.has(e.target).length === 0) {
        $("#sidenav-user").css("top", 0);
        $("#sidenav-user").css("left", 0);
        $("#sidenav-user").hide();
        $(".menu-user-open-menu", $("#mainmenu-user")).attr("src", "img/polygon-open.png");
    }
}

function HideSearchTable(e) {
    var container = $(".table-search", $('body'));

    if (!container.is(e.target) && container.has(e.target).length === 0) {
        $(".table-search", $('body')).hide();
    }
}

function TableClear(e) {
    if ($(e.target).closest("td").length == 0 && $(e.target).is("input")) {
        $(e.target).closest(".main-desktop").find("table").each(function () {
            if ($(this).attr("controlid") && $(this).find("tbody tr.selected td.active").length > 0) {
                let s3table = eval($(this).attr("controlid") + "_S3Table");
                if (!$(e.target).is(s3table.options.ColumnSearchElement))
                    TableClearFocus($(e.target).closest(".main-desktop").find("table"));
            }
        });
    }
}

function HideTextSelectBackground(e) {
    var container = $("#customtextselectbackground", $('body'));

    if (!container.is(e.target) && container.has(e.target).length === 0) {
        if (!$(e.target).hasClass("text-select") && $(container).css('display') != 'none') {
            $(container).hide();
            $(".text-select", $('body')).each(function () {
                customtextselect_blink_stop(this);
            });
        };
    }
}

function HideDropDown(e) {
    var container = $(".dropdown-menu", $('body'));
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ((!$(e.target).hasClass("dropdown") && !$(e.target).hasClass("fa-bolt"))) {
            $(container).hide();
        };
    }
}




async function Validate(element, isFocus) {
    if ($(element).is(":visible") != true)
        return true;
    var result = true;
    var validate = $(element).attr("validate");
    if (validate === true || validate === "true") {
        var validateType = "";
        if ($(element).hasClass("text-date")) {
            validateType = "date";
        } else if ($(element).hasClass("text-number")) {
            validateType = "number";
        }else if ($(element).hasClass("text-decimal")) {
            validateType = "decimal";
        }else if ($(element).hasClass("text-search")) {
            validateType = "search";
        } else if ($(element).hasClass("text-search-custom")) {
            validateType = "search-custom";
        } else if ($(element).hasClass("lohang-search")) {
            validateType = "lohang-search";
        } else if ($(element).hasClass("text-email")) {
            validateType = "email";
        } else if ($(element).hasClass("text-phone")) {
            validateType = "phone";
        } else if ($(element).hasClass("text-citizenid")) {
            validateType = "citizenid";
        }
        else {
            if ($(element).is("table")) {
                validateType = "table";
            }
        }

        switch (validateType) {
            case "citizenid":
                var idValue = $(element).val().trim();
                var idRegex = /^(\d{9}|\d{12})$/;

                if ($(element).attr("no-required") == true || $(element).attr("no-required") == "true") {
                    if (idValue != "" && !idRegex.test(idValue)) {
                        ShowValidate(element);
                        result = false;
                    }
                } else {
                    if (idValue === "" || !idRegex.test(idValue)) {
                        ShowValidate(element);
                        result = false;
                    }
                }
                break;
            case "email":
                var emailValue = $(element).val().trim();
                var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if ($(element).attr("no-required") == true || $(element).attr("no-required") == "true") {
                    if (emailValue != "" && !emailRegex.test(emailValue)) {
                        ShowValidate(element);
                        result = false;
                    }
                } else {
                    if (emailValue === "" || !emailRegex.test(emailValue)) {
                        ShowValidate(element);
                        result = false;
                    }
                }

                break;

            case "phone":
                var phoneValue = $(element).val().trim();
                var phoneRegex = /^(0|\+84|84)([0-9]{8,10})$/;
                if ($(element).attr("no-required") == true || $(element).attr("no-required") == "true") {
                    if (phoneValue != "" && !phoneRegex.test(phoneValue)) {
                        ShowValidate(element);
                        result = false;
                    }
                } else {
                    if (phoneValue === "" || !phoneRegex.test(phoneValue)) {
                        ShowValidate(element);
                        result = false;
                    }
                }
                break;
            case "table":
                var length = $(element).find("tbody").find("tr").length;
                if (length == 0) {
                    ShowValidate(element);
                    result = false;
                }
                break;

            case "date":
                if (!IsValidDate($(element).val())) {
                    if ($(element).attr("no-required") == true || $(element).attr("no-required") == "true") {
                        if ($(element).val() != "__/__/____" && $(element).val() != "") {
                            ShowValidate(element);
                            result = false;
                        }
                    } else {
                        ShowValidate(element);
                        result = false;
                    }
                }

                //var callback = $(element).attr("callbackvalidate"); //
                //if (callback && eval("typeof " + callback + " === 'function'")) {
                //    let status = eval(callback)(element);
                //    if (status.Status == false) {
                //        ShowValidate(element, status.Key, status.Arguments);
                //        result = false;
                //    }
                //}
                break;

            case "number":
                var value = $(element).value();
                var callback = $(element).attr("callbackvalidate"); //

                if (callback && eval("typeof " + callback + " === 'function'")) {
                    if (isFocus == true) {
                        //if ($(element).closest("td").hasClass("active-nobg")) {
                        if ($(element).attr("validate-allow-move-next") == "true" || $(element).attr("validate-allow-move-next") === true) {
                            window.setTimeout(function () {
                                $(element).removeAttr("validate-allow-move-next");
                            }, 100);
                        } else {
                            let resultValidate = await eval(callback)($(element));
                            if (resultValidate.status == false) {
                                $(element).attr("validate-allow-move-next", resultValidate.allowMoveNext);
                                $(element).attr("validate-allow-move-next-1st", true);
                                result = resultValidate.allowMoveNext;
                            } else { // do entercallback if exist
                                $(element).removeAttr("validate-allow-move-next");
                                let tdLast = $(element).closest("td");
                                let callback = tdLast.attr("entercallback");
                                if (callback && eval("typeof " + callback + " == 'function'")) {
                                    let controlid = $($(element).closest("table")).attr("controlid");
                                    if (controlid) {
                                        let s3ttable = eval(controlid + "_S3Table");
                                        return s3ttable.OnEnterCallback($(element).closest("tr"));
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (($(element).attr("notequalzero") === true || $(element).attr("notequalzero") === "true") && (isNaN(value) || value == 0)) {
                        ShowValidate(element, "Common_Msg_NotEqualZero");
                        result = false;
                    } else if (($(element).attr("allownegative") === false || $(element).attr("allownegative") === "false") && (!isNaN(value) && value < 0)) {
                        ShowValidate(element, "Common_Msg_AllowNegative");
                        result = false;
                    } else if ($(element).attr("maxvalue") !== undefined && !isNaN(value) && value > parseFloat($(element).attr("maxvalue"))) {
                        ShowValidate(element, "Common_Msg_MaxValue", [$(element).attr("maxvalue")]);
                        result = false;
                    } else if ($(element).attr("minvalue") !== undefined && !isNaN(value) && value < parseFloat($(element).attr("minvalue"))) {
                        ShowValidate(element, "Common_Msg_MinValue", [$(element).attr("minvalue")]);
                        result = false;
                    }
                }
                break;
            case "decimal":
                var value = parseFloat($(element).val().replace(/,/g, "")); // bỏ dấu , nếu có
                var callback = $(element).attr("callbackvalidate");

                if (callback && eval("typeof " + callback + " === 'function'")) {
                    if (isFocus == true) {
                        if ($(element).attr("validate-allow-move-next") == "true" || $(element).attr("validate-allow-move-next") === true) {
                            window.setTimeout(function () {
                                $(element).removeAttr("validate-allow-move-next");
                            }, 100);
                        } else {
                            let resultValidate = await eval(callback)($(element));
                            if (resultValidate.status == false) {
                                $(element).attr("validate-allow-move-next", resultValidate.allowMoveNext);
                                $(element).attr("validate-allow-move-next-1st", true);
                                result = resultValidate.allowMoveNext;
                            } else {
                                $(element).removeAttr("validate-allow-move-next");
                                let tdLast = $(element).closest("td");
                                let callback = tdLast.attr("entercallback");
                                if (callback && eval("typeof " + callback + " == 'function'")) {
                                    let controlid = $($(element).closest("table")).attr("controlid");
                                    if (controlid) {
                                        let s3ttable = eval(controlid + "_S3Table");
                                        return s3ttable.OnEnterCallback($(element).closest("tr"));
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (($(element).attr("notequalzero") === true || $(element).attr("notequalzero") === "true") && (isNaN(value) || value == 0)) {
                        ShowValidate(element, "Common_Msg_NotEqualZero");
                        result = false;
                    } else if (($(element).attr("allownegative") === false || $(element).attr("allownegative") === "false") && (!isNaN(value) && value < 0)) {
                        ShowValidate(element, "Common_Msg_AllowNegative");
                        result = false;
                    } else if ($(element).attr("maxvalue") !== undefined && !isNaN(value) && value > parseFloat($(element).attr("maxvalue"))) {
                        ShowValidate(element, "Common_Msg_MaxValue", [$(element).attr("maxvalue")]);
                        result = false;
                    } else if ($(element).attr("minvalue") !== undefined && !isNaN(value) && value < parseFloat($(element).attr("minvalue"))) {
                        ShowValidate(element, "Common_Msg_MinValue", [$(element).attr("minvalue")]);
                        result = false;
                    }
                }
                break;
            case "search":
                var value = $(element).val();
                if (value == null || value.trim() == "") {
                    if ($(element).attr("no-required") != true && $(element).attr("no-required") != "true") {
                        //Cần lưu ý kiểm tra lại lý do không hiển thị validate tại dòng cuối trong table
                        //Vẫn phải comment các dòng này vì nếu không, sẽ không hiển thị thông báo tại dòng cuối
                        //if ($(element).closest('td').length > 0) {
                        //    if ($(element).closest('tr').index() != $(element).closest('tbody').find('tr').length - 1) {
                        //        ShowValidate(element);
                        //    }
                        //} else {
                        ShowValidate(element);
                        //}
                        result = false;
                    }

                    $(element).data('data-value', "");
                    var preClass = $(element).attr('data-prefix-class');
                    var destinationIds = $(element).attr('data-destination-id');
                    if (destinationIds) {
                        var ids = destinationIds.split(",");
                        $.map(ids, function (id, index) {
                            TextSearchClearInput(preClass, id);
                        });
                    }

                    return result;
                } else if ($(element).closest('td').length == 0 && !$(element).data('data-value') && $(element).attr("no-required") != true && $(element).attr("no-required") != "true") {
                    //Trường hợp ô này có giá trị nhưng lại không có data-value, chứng tỏ dòng này không có trong danh mục, cần cảnh báo dữ liệu không hợp lệ
                    //Tạm thời chỉ kiểm tra trường hợp Input nằm ngoài Table
                    ShowValidate(element);
                    return false;
                }

                if (isFocus == true) {
                    // if not change no validate
                    var flag = $(element).attr("value-changed");
                    if (flag == true || flag == "true") {
                        var validateUrl = 'api/Common/ValidateSearch?value=' + value + '&table=' + $(element).attr('data-table') + '&column=' + $(element).attr('data-field-name') + '&firstFilter=' + ($(element).attr('data-first-filter') ? $(element).attr('data-first-filter') : "");
                        $.ajax({
                            url: validateUrl,
                            dataType: "json",
                            type: "GET",
                            async: false,
                            success: function (data) {
                                if (data == null) {
                                    $(element).data('data-value', "");
                                    ShowValidate(element);
                                    result = false;
                                } else {
                                    $(element).attr("value-changed", false);
                                    let item = data[0];
                                    $(element).data('data-value', JSON.stringify(item));
                                    TextSearchFillData(element, item);
                                }
                            },
                        });
                    }
                }
                break;

            case "search-custom":
                var value = $(element).val();
                if (value == null || value.trim() == "") {
                    if ($(element).attr("no-required") != true && $(element).attr("no-required") != "true") {
                        if ($(element).closest('td').length > 0) {
                            if ($(element).closest('tr').index() != $(element).closest('tbody').find('tr').length - 1) {
                                ShowValidate(element);
                            }
                        } else {
                            ShowValidate(element);
                        }
                        result = false;
                    }

                    $(element).data('data-value', "");
                    var preClass = $(element).attr('data-prefix-class');
                    var destinationIds = $(element).attr('data-destination-id');
                    if (destinationIds) {
                        var ids = destinationIds.split(",");
                        $.map(ids, function (id, index) {
                            TextSearchClearInput(preClass, id);
                        });
                    }

                    return result;
                }
                if (isFocus == true) {
                    // if not change no validate
                    var flag = $(element).attr("value-changed");
                    if (flag == true || flag == "true") {
                        if ($(element).data('data-value') == null || !$(element).data('data-value')) {
                            ShowValidate(element);
                            result = false;
                        } else {
                            $(element).attr("value-changed", false);
                            TextSearchFillData(element, JSON.parse($(element).data('data-value')));
                        }
                    }
                }
                break;

            case "lohang-search":
                if (isFocus == true) {
                    LoHangSearchFillData(element);
                }

                if ($(element).attr("user-value-changed") && $(element).val() != null && $(element).val().trim() && !$(element).data('data-value')) {
                    ShowValidate(element);
                    result = false;
                }
                break;

            default: // string
                if (($(element).attr("no-required") == undefined || ($(element).attr("no-required") != true && $(element).attr("no-required") != "true")) && $(element).val().trim() == "") {
                    ShowValidate(element);
                    result = false;
                }
                break;
        }
    } else {
        let value = $(element).val();

        if ($(element).hasClass("text-search")) {
            if (value == null || value.trim() == '') {
                $(element).data('data-value', '');

                let preClass = $(element).attr('data-prefix-class');
                let destinationIds = $(element).attr('data-destination-id');

                if (destinationIds) {
                    let ids = destinationIds.split(",");
                    $.map(ids, function (id, index) {
                        TextSearchClearInput(preClass, id);
                    });
                }
            } else {
                let item = $(element).data('data-value');
                if (item) {
                    item = JSON.parse(item);
                    TextSearchFillData(element, item);
                }
            }
        } else if ($(element).hasClass("lohang-search") && isFocus == true) {
            LoHangSearchFillData(element);
        }
    }

    return result;
}

function TextSearchClearInput(preClass, id) {
    if (id.includes("|")) {
        let field = id.split("|")[0];
        let target = id.split("|")[1];
        if ($("#" + preClass + target.trim()).hasClass("text-number")) {
            $("#" + preClass + target.trim()).value(0);
        } else {
            if ($("#" + preClass + target.trim()).is("td")) {
                $("#" + preClass + target.trim()).text('');
            } else if ($("#" + preClass + target.trim()).is("input")) {
                $("#" + preClass + target.trim()).value('');
            } else {
                $("#" + preClass + target.trim()).text('');
            }
        }
    } else {
        if ($("#" + preClass + id.trim()).hasClass("text-number")) {
            $("#" + preClass + id.trim()).value(0);
        } else {
            if ($("#" + preClass + id.trim()).is("td")) {
                $("#" + preClass + id.trim()).text('');
            } else if ($("#" + preClass + id.trim()).is("input")) {
                $("#" + preClass + id.trim()).value('');
            } else {
                $("#" + preClass + id.trim()).text('');
            }
        }
    }
}

function TextSearchFillData(element, item) {
    $(element).val($(element).value().toUpperCase());

    let preClass = $(element).attr('data-prefix-class');
    let destinationIds = $(element).attr('data-destination-id');

    $(element).data('data-value', JSON.stringify(item));
    if (destinationIds) {
        let ids = destinationIds.replace(/ /g, '').split(',');
        if ($(element).closest('td').length > 0) {
            let id = $(element).closest("tr").find("th").attr("clusterize_row_id");
            let controlid = $(element).closest("table").attr("controlid");
            let s3table = eval(controlid + "_S3Table");
            let clusterizeData = s3table.ClusterizeData;
            let index = clusterizeData.data.findIndex(function (o) {
                return o[s3table.ClusterizeData.PrimaryKey] === id;
            })
            $.map(ids, function (column, i) {
                if (column.includes("|")) {
                    clusterizeData.data[index][column.split("|")[1]] = item[column.split("|")[0]];
                } else {
                    clusterizeData.data[index][column.trim()] = item[column.trim()];
                }
            });
            s3table.UpdateClusterizeRow($(element));
        }

        $.map(ids, function (id, index) {
            TextSearchFieldInput(preClass, id, item);
        });
    } else {
        if ($(element).closest('td').length > 0) {
            let id = $(element).closest("tr").find("th").attr("clusterize_row_id");
            let columnName = $(element).attr("column-name");
            if (columnName) {
                let controlid = $(element).closest("table").attr("controlid");
                let s3table = eval(controlid + "_S3Table");
                let clusterizeData = s3table.ClusterizeData;
                let index = clusterizeData.data.findIndex(function (o) {
                    return o[s3table.ClusterizeData.PrimaryKey] === id;
                })
                clusterizeData.data[index][columnName] = item[columnName];
                s3table.UpdateClusterizeRow($(element));
            }
        }
    }
}

function TextSearchFieldInput(preClass, id, item) {
    if (id.includes("|")) {
        let field = id.split("|")[0];
        let target = id.split("|")[1];
        if ($('#' + preClass + target.trim()).hasClass('text-number')) {
            $('#' + preClass + target.trim()).value(item[field.trim()]);
        } else if ($('#' + preClass + target.trim()).is('input.text-date')) {
            $('#' + preClass + target.trim()).value(ddmmyyyyToyyyymmddFormat(item[field.trim()]));
        } else if ($('#' + preClass + target.trim()).hasClass('text-date')) {
            $('#' + preClass + target.trim()).text(datetimeToStringShort(ddmmyyyyToyyyymmddFormat(item[field.trim()])));
        } else {
            if ($('#' + preClass + target.trim()).is('td')) {
                $('#' + preClass + target.trim()).text(item[field.trim()]);
            } else if ($('#' + preClass + target).is('input')) {
                $('#' + preClass + target.trim()).value(item[field.trim()]);
            } else {
                $('#' + preClass + target.trim()).text(item[field.trim()]);
            }
        }
    } else {
        if ($('#' + preClass + id.trim()).hasClass('text-number')) {
            $('#' + preClass + id.trim()).val(item[id.trim()]);
        } else if ($('#' + preClass + id.trim()).is('input.text-date')) {
            $('#' + preClass + id.trim()).value(ddmmyyyyToyyyymmddFormat(item[id.trim()]));
        } else if ($('#' + preClass + id.trim()).hasClass('text-date')) {
            $('#' + preClass + id.trim()).text(datetimeToStringShort(ddmmyyyyToyyyymmddFormat(item[id.trim()])));
        } else {
            if ($('#' + preClass + id.trim()).is('td')) {
                $('#' + preClass + id.trim()).text(item[id.trim()]);
            } else if ($('#' + preClass + id).is('input')) {
                $('#' + preClass + id.trim()).value(item[id.trim()]);
            } else {
                $('#' + preClass + id.trim()).text(item[id.trim()]);
            }
        }
    }
}

function LoHangSearchFillData(element) {
    $(element).val($(element).value().toUpperCase());

    let value = $(element).val();
    let preClass = $(element).attr('data-prefix-class');
    let column = $(element).attr('data-field-name');

    if (column && $(element).attr("user-value-changed")) {
        if (value == null || value.trim() == "" || !$(element).data('data-value')) {
            $(element).data('data-value', "");

            if ($(element).closest('td').length > 0) {
                let id = $(element).closest("tr").find("th").attr("clusterize_row_id");
                let controlid = $(element).closest("table").attr("controlid");
                let s3table = eval(controlid + "_S3Table");
                let index = s3table.ClusterizeData.data.findIndex(function (o) {
                    return o[s3table.ClusterizeData.PrimaryKey] === id;
                })

                s3table.ClusterizeData.data[index][column.trim()] = "";
            }

            TextSearchClearInput(preClass, column.trim());
        } else {
            item = JSON.parse($(element).data('data-value'));

            if ($(element).closest('td').length > 0) {
                let id = $(element).closest("tr").find("th").attr("clusterize_row_id");
                let controlid = $(element).closest("table").attr("controlid");
                let s3table = eval(controlid + "_S3Table");
                let index = s3table.ClusterizeData.data.findIndex(function (o) {
                    return o[s3table.ClusterizeData.PrimaryKey] === id;
                })

                if (ApplicationInstance.Systemvar.DeadLineCtrl) {
                    s3table.ClusterizeData.data[index][column.trim()] = ddmmyyyyToyyyymmddFormat(item["Han_Dung"]);
                }
            }

            TextSearchFieldInput(preClass, column.trim() + '|Han_Dung', item);
        }
    }
}

async function InputBlurHandle(element) {
    //check validate
    if (currentInvalidateElement != null && currentInvalidateElement[0] != $(element)[0]) {
        if ($(element).hasClass("text-number")) {
            let callback = $(element).attr("callbackvalidate");
            if (callback && eval("typeof " + callback + " === 'function'")) {
                return;
            }
        }
        ShowValidate(currentInvalidateElement);
        return;
    }

    let result = await Validate(element, true);
    if (result == false) {
        currentInvalidateElement = $(element);
        $(element).attr("invalid", true);
    } else {
        $(element).attr("invalid", false);
        currentInvalidateElement = null;
        if ($(element).hasClass("text-number") && $(element).attr('readonly') != 'readonly') {
            if ($(element).attr("hidezero") == true || $(element).attr("hidezero") == "true") {
                if (parseFloat($(element).attr("numericvalue")) == 0) {
                    $(element).val("");
                }
            }
        }
        if ($(element).hasClass("text-date")) {
            $(element).attr('is-focus', "false");
        }
        if ($(element).attr('auto-translate-f12-pressed') != undefined) {
            $(element).attr('auto-translate-f12-pressed', false);
        }

        if (!$(element).hasClass("text-option"))
            InputCallbackHandle(element);
    }
}

function InputFocusHandle(element) {
    let callback = $(element).attr('focuscallback');
    if (callback && eval("typeof " + callback + " === 'function'")) {
        let cb = eval(callback);
        cb($(element));
    }
}

function InputCallbackHandle(element) {
    let isDoCallback = true;
    if ($(element).hasClass("text-number")) {
        if ($(element).attr('oldnumericvalue') == $(element).attr('numericvalue')) {
            isDoCallback = false;
        }
    } else if ($(element).hasClass("text-search")) {
        //if ($(element).attr('oldvalue') == $(element).val()) {
        if ($(element).attr("user-value-changed") == undefined || $(element).attr("user-value-changed") == "false") {
            isDoCallback = false;
        }
    } else {
        if ($(element).attr('oldvalue') == $(element).val()) {
            isDoCallback = false;
        }
    }

    if (isDoCallback == false) return;

    let callback = $(element).attr('callback');
    if (callback && eval("typeof " + callback + " === 'function'")) {
        let cb = eval(callback);
        cb($(element));
    }
}

async function FormElementValidate(form) {
    let result = true;
    let elements = $('input:visible:not(:disabled):not([tabindex="-1"]),select:visible,textarea:visible,div.text-select:visible:not(:disabled)', form);
    for (var i = 0; i < elements.length; i++) {
        let status = await Validate(elements[i], $(elements[i]).is(":focus"));
        if (!status) {
            result = false;
            break;
        }
    }
    return result;
}

function ShowValidate(element, key, variable) {
    if (key === undefined || !key) {
        key = $(element).attr("validatemessage") ? $(element).attr("validatemessage") : "Common_Msg_Validate";
    }

    var message = i18nLayout6(translator._getValueFromJSON(key, applicationDictionary, false));
    if (variable) {
        for (var i = 0; i < variable.length; i++) {
            message = message.split('{' + i + '}').join(variable[i]);
        }
    }

    if ($(element).is('input')) {
        if ($(element).closest('td').length > 0) {
            window.setTimeout(function () {
                $(element).closest('table').find('td.active').removeClass('cell-selected');
                $(element).closest('table').find('td.active').removeClass('active-nobg');
                $(element).closest('table').find('td.active').removeClass('active');
                $(element).closest('table').find('tr').removeClass('selected');
            }, 0);
        } else {
            $(element).closest('.main-desktop').find('td.active').removeClass('cell-selected');
            $(element).closest('.main-desktop').find('td.active').removeClass('active-nobg');
            $(element).closest('.main-desktop').find('td.active').removeClass('active');
            $(element).closest('.main-desktop').find('tr').removeClass('selected');
        }
    }

    window.setTimeout(function () {
        $(element).focus();
    }, 50);

    if (!$(element).data('powertip')) {
        $(element).data('powertip', message);
        $(element).powerTip({
            placement: 's',
            openEvents: [],
            closeEvents: ['click']
        });
        $(element).powerTip('show');
    } else {
        $(element).data('powertip', message);
        $(element).powerTip('show');
    }
}

// Validates that the input string is a valid date formatted as "dd/mm/yyyy"
function IsValidDate(dateString) {
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

function DoResize() {
    if ($(window).width() > 1366) {
        $('#maintoolbar nav > ul > li:nth-child(1)').hide();
        $('#maintoolbar nav > ul > li:nth-child(2)').show();

        $('#mainmenu').show();
        $('#mainbody').css('left', $('#mainmenu').position().left + $('#mainmenu').width());
        $('#mainbody').css('width', $(window).width() - $('#mainmenu').position().left - $('#mainmenu').width() - 10);
    } else {
        $('#maintoolbar nav > ul > li:nth-child(1)').show();
        $('#maintoolbar nav > ul > li:nth-child(2)').hide();

        $('#mainmenu').hide();
        $('#mainbody').css('left', $('#maintoolbar').position().left + $('#maintoolbar').width());
        $('#mainbody').css('width', $(window).width() - $('#maintoolbar').position().left - $('#maintoolbar').width() - 10);
    }

    OrderTab();
}

function GetTabSize() {
    let lasttabwidth = tabwidth = 230;
    let taskbarwidth = $('#maintaskbar').width() - 32;
    let maxtabcount = parseInt(taskbarwidth / 230);

    if (taskbarwidth % 230 != 0) {
        lasttabwidth = tabwidth += parseInt((taskbarwidth % 230) / maxtabcount);

        if (tabwidth * maxtabcount != taskbarwidth && $('#maintaskbar > .tab').length == maxtabcount - 1) {
            lasttabwidth += taskbarwidth - tabwidth * maxtabcount;
        }
    }

    return { TaskbarWidth: taskbarwidth, Max: maxtabcount, Width: tabwidth, Last: lasttabwidth };
}

function OrderTab() {
    let tabs = GetTabSize();

    while ($('#maintaskbar > .tab').length > tabs.Max) {
        $('#maintaskbar .tab:last-child').appendTo('#invisibleitemsmenu');
    }

    while ($('#maintaskbar > .tab').length < tabs.Max && $('#invisibleitemsmenu > .tab').length > 0) {
        $('#invisibleitemsmenu .tab:last-child').appendTo('#maintaskbar').css('width', tabs.Width);
    }

    $('#maintaskbar > .tab').css('width', tabs.Width);
    $('#maintaskbar > .tab:last-child').css('width', ($('#maintaskbar > .tab').length != tabs.Max ? tabs.Width : tabs.Last));

    $('#mainbody .main-desktop:visible').each(function (index) {
        SetFormPosition($(this).attr('id').substr(5));
    });
}

//function AddTab(screenInfo, isReload, code) {
/*
 * screenInfo:
 * Id: Tên file html
 * Title: Title to display on title and taskbar
 * Title_E: English title to display on title and taskbar
 * Type: HTML base
 * Dock: full: Tràn màn hình, none: Theo kích thước thiết kế
 * ChildId: HTML Form Editor
 * Callback: Function is called after Id html added
 * ParentId: Html of parent form
 * NewChecked: true, false
 * CurrentId: Id to edit data
 * RightId: Id of function
 * RightType: Type of function
 * IsChildren: Is called from master report
 * DataSource: Is data to create PKTK (master & detail)
 * IsInputData: // Danh mục: IsInputData = false // Chứng từ: IsInputData = true
 * Image_Name: Icon for menu item and taskbar
 * Image_Parrent: Icon for taskbar if image name is null
 */
function AddTab(screenInfo, isReload, code) {
    if (screenInfo === undefined || screenInfo == null)
        return;

    HideTooltip();

    //check Right_1 
    let Right1 = false;
    let StatusCode = 0;
    if (screenInfo.RightId && screenInfo.RightType) {
        let rightType = 'I';//screenInfo.MenuRightType == "M" ? "M" : screenInfo.RightType;
        $.ajax({
            type: 'GET',
            url: 'api/RightAssignment/Privilege?id=' + screenInfo.RightId + '&type=' + rightType,
            async: false,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                Right1 = data.Right_1;
            },

            error: function (result) {
                Right1 = false;
                StatusCode = result.status;
                handleResponseError(Main_AlertMessage, result);
            }
        });
    } else {
        // other table
        Right1 = true;
    }

    if (StatusCode != 0) {
        return;
    }
    if (Right1 != true && StatusCode != 401) {
        Main_AlertMessage.showInfo("Common_Msg_NoPrivilege");
        return;
    }

    let index = TabQueue.findIndex(function (o) {
        return o.Id == screenInfo.Id && o.Title == screenInfo.Title && o.ExtraMenuVar == JSON.stringify(screenInfo.ExtraMenuVar);
    });

    if (index != -1) {
        screenInfo.TabId = TabQueue[index].TabId;
    }

    if (!ShowTab(screenInfo.TabId, isReload, code)) { // show only 1 tab 1 controlid
        let tabQueue = new Object();
        tabQueue.Id = screenInfo.Id;
        tabQueue.Title = screenInfo.Title;
        tabQueue.TabId = screenInfo.TabId;
        tabQueue.ExtraMenuVar = JSON.stringify(screenInfo.ExtraMenuVar);

        TabQueue.push(tabQueue);

        let t = (new Date()).getTime();// TODO remove
        let disableCache = '?t=' + t;
        if ($('.tab div.active').length > 0)
            $('.tab div.active').removeClass('active');

        $('#maindesktop > div:visible').hide();

        let taskbar;
        let tabs = GetTabSize();
        let icon = (screenInfo.Image_Name == undefined || screenInfo.Image_Name == null || screenInfo.Image_Name == "" ? (screenInfo.Image_Parent == undefined || screenInfo.Image_Parent == null || screenInfo.Image_Parent == "" ? "" : screenInfo.Image_Parent) : screenInfo.Image_Name);

        $('#maintaskbar .tab').css('width', tabs.Width);
        $('#maintaskbar > .tab:last-child').css('width', ($('#maintaskbar > .tab').length != tabs.Max ? tabs.Width : tabs.Last));

        if ($('#maintaskbar > .tab').length < tabs.Max) {
            taskbar = $('#maintaskbar');
            $(taskbar).append("<div class='tab' id='tab_" + screenInfo.TabId + "' style='width:" + ($('#maintaskbar > .tab').length + 1 != tabs.Max ? tabs.Width : tabs.Last) + "px;'></div>");
        } else {
            taskbar = $('#invisibleitemsmenu');
            $(taskbar).prepend("<div class='tab' id='tab_" + screenInfo.TabId + "'></div>");
        }

        //if (icon) {
        //    $('#tab_' + screenInfo.TabId + '.tab', $(taskbar)).append("<div class='menu-icon active'><div style='background: url(\"/img/" + ApplicationInstance.Uservar.Theme + "/" + icon + "\") center center no-repeat;'></div></div>");
        //}
        $('#tab_' + screenInfo.TabId + '.tab', $(taskbar)).append("<div class='active billingual-wrapper' data-i18n-layout='layout4' data-i18n-key='Common_Title'></div>");
        $('#tab_' + screenInfo.TabId + '.tab', $(taskbar))
            .append("<div class='icon-close-tab'></div>")
            .ready(() => {
                $('.icon-close-tab', $('#tab_' + screenInfo.TabId + '.tab')).on('click', () => {
                    let closingTabId = $(event.target).parent().attr("id").replace("tab_", "");

                    // Kiểm tra xem có tab con nào đang mở không
                    let hasChild = TabQueue.some(tab => {
                        let parentId = $('#desk_' + tab.TabId).attr("parentcontrolid");
                        return parentId === closingTabId;
                    });

                    if (hasChild) {
                        Main_AlertMessage.showInfo("Common_Msg_CloseTab_WithChildren");
                        return; // không cho đóng
                    }

                    // Nếu không có tab con thì cho đóng
                    RemoveTab(closingTabId);

                    $('#desk_' + closingTabId).remove(); // xóa DOM tab
                    $(document).off('.' + closingTabId); // nếu bạn gắn namespace event
                    delete window[closingTabId + "_NumberOfFree"]; // cleanup biến global nếu có



                    //    RemoveTab($(event.target).parent().attr("id").replace("tab_", ""));
                });
            });

        if (screenInfo.ParentId === undefined || screenInfo.ParentId == null || screenInfo.ParentId.length <= 0) {
            screenInfo.ParentId = "";
        }

        if (screenInfo.Dock === undefined || screenInfo.Dock == null || screenInfo.Dock.length <= 0 || screenInfo.Dock == "none") {
            $('#maindesktop').append("<div class='main-desktop' id='desk_" + screenInfo.TabId + "' parentcontrolid='" + screenInfo.ParentId + "'></div>");
        } else {
            $('#maindesktop').append("<div class='main-desktop' id='desk_" + screenInfo.TabId + "' dockstyle='full' parentcontrolid='" + screenInfo.ParentId + "'></div>");
        }

        if (screenInfo.Type === undefined || screenInfo.Type == null || screenInfo.Type.length <= 0) {
            $.ajax({
                url: "./html/" + screenInfo.Id + ".html" + disableCache,
                type: "GET",
                dataType: "html",

                success: function (html) {
                    html = html.replace(/\_____controlid_____/g, screenInfo.TabId);
                    html = html.replace(/\_____htmlid_____/g, screenInfo.Id);
                    if (screenInfo.Code && screenInfo.Code != "") {
                        html = html.replace(/\_____controlidcode_____/g, screenInfo.Code);
                    } else {
                        html = html.replace(/\_____controlidcode_____/g, "");
                    }

                    if (!(screenInfo.ChildId === undefined || screenInfo.ChildId == null || screenInfo.ChildId == "")) {
                        html = html.replace(/\_____childcontrolid_____/g, screenInfo.ChildId);
                    }

                    let parser = new DOMParser();
                    let htmlDoc = parser.parseFromString(html, 'text/html');
                    let htmlCode = '';

                    if (htmlDoc.getElementsByTagName('script').length > 0) {
                        htmlCode = htmlDoc.getElementsByTagName('script')[0].innerText;
                        htmlDoc.getElementsByTagName('script')[0].outerHTML = '';
                    }

                    html = htmlDoc.getElementsByTagName('body')[0].outerHTML;
                    if (htmlDoc.getElementsByTagName('style').length > 0)
                        html += htmlDoc.getElementsByTagName('style')[0].outerHTML;

                    $('#desk_' + screenInfo.TabId)
                        .append(html)
                        .ready(function () {
                            $('#desk_' + screenInfo.TabId + ' .form-title .main-language').html(screenInfo.Title);
                            $('#desk_' + screenInfo.TabId + ' .form-title .sub-language').html(screenInfo.Title_E);
                            $('#desk_' + screenInfo.TabId).data('screen-info', JSON.stringify(screenInfo));
                            buildToolTip($('#desk_' + screenInfo.TabId + ' .s3t-tooltip'));
                            buildToolTip($('#tab_' + screenInfo.TabId + ' .s3t-tooltip'));
                            translator.translateById('tab_' + screenInfo.TabId);
                            translator.translateById('desk_' + screenInfo.TabId);
                            $('#tab_' + screenInfo.TabId).css({ 'display': 'flex' })

                            //Set position
                            SetFormPosition(screenInfo.TabId);

                            //Show Form
                            $('#desk_' + screenInfo.TabId + ' .form-container').fadeIn();
                        });

                    $.ajax({
                        url: "./js/controls.js" + disableCache,
                        type: "GET",
                        dataType: "html",

                        success: function (code) {
                            code = code.replace(/\_____controlid_____/g, screenInfo.TabId);
                            if (screenInfo.Code && screenInfo.Code != "") {
                                code = code.replace(/\_____controlidcode_____/g, screenInfo.Code);
                            } else {
                                code = code.replace(/\_____controlidcode_____/g, "");
                            }
                            if (!(screenInfo.ChildId === undefined || screenInfo.ChildId == null || screenInfo.ChildId == "")) {
                                code = code.replace(/\_____childcontrolid_____/g, screenInfo.ChildId);
                            }

                            let script = document.createElement('script');
                            script.appendChild(document.createTextNode(code));

                            $('#desk_' + screenInfo.TabId + ' .form-body')
                                .append(script)
                                .ready(function () {
                                    script = document.createElement('script');
                                    script.appendChild(document.createTextNode(htmlCode));

                                    $('#desk_' + screenInfo.TabId + ' .form-body')
                                        .append(script)
                                        .ready(function () {
                                            //Bring Form to Front
                                            BringToFrontTab(screenInfo.TabId);

                                            //Call function after load js
                                            CallbackFunction(screenInfo);
                                        });
                                });
                        }
                    });
                }
            });
        } else {
            $.ajax({
                url: "./html/" + screenInfo.Type + ".html" + disableCache,
                type: "GET",
                dataType: "html",

                success: function (html) {
                    html = html.replace(/\_____controlid_____/g, screenInfo.TabId);
                    html = html.replace(/\_____htmlid_____/g, screenInfo.Id);
                    if (screenInfo.Code && screenInfo.Code != "") {
                        html = html.replace(/\_____controlidcode_____/g, screenInfo.Code);
                    } else {
                        html = html.replace(/\_____controlidcode_____/g, "");
                    }
                    if (!(screenInfo.ChildId === undefined || screenInfo.ChildId == null || screenInfo.ChildId == "")) {
                        html = html.replace(/\_____childcontrolid_____/g, screenInfo.ChildId);
                    }

                    $('#desk_' + screenInfo.TabId).append(html);
                    $('#desk_' + screenInfo.TabId).data('screen-info', JSON.stringify(screenInfo));
                    $('#desk_' + screenInfo.TabId + ' .form-title .main-language').html(screenInfo.Title);
                    $('#desk_' + screenInfo.TabId + ' .form-title .sub-language').html(screenInfo.Title_E);

                    $.ajax({
                        url: "./html/" + screenInfo.Id + ".html" + disableCache,
                        type: "GET",
                        dataType: "html",

                        success: function (html) {
                            html = html.replace(/\_____controlid_____/g, screenInfo.TabId);
                            html = html.replace(/\_____htmlid_____/g, screenInfo.Id);
                            html = html.replace(/\_____parentid_____/g, screenInfo.ParentId);
                            html = html.replace(/\_____parenthtml_____/g, screenInfo.ParentHtml);
                            let parser = new DOMParser();
                            let htmlDoc = parser.parseFromString(html, 'text/html');
                            let htmlCode = '';

                            if (htmlDoc.getElementsByTagName('script').length > 0) {
                                htmlCode = htmlDoc.getElementsByTagName('script')[0].innerText;
                                htmlDoc.getElementsByTagName('script')[0].outerHTML = '';
                            }

                            html = htmlDoc.getElementsByTagName('body')[0].outerHTML;
                            if (htmlDoc.getElementsByTagName('style').length > 0)
                                html += htmlDoc.getElementsByTagName('style')[0].outerHTML;

                            $('#desk_' + screenInfo.TabId + ' .form-body')
                                .append(html)
                                .ready(function () {
                                    buildToolTip($('#desk_' + screenInfo.TabId + ' .s3t-tooltip'));
                                    buildToolTip($('#tab_' + screenInfo.TabId + ' .s3t-tooltip'));
                                    translator.translateById('tab_' + screenInfo.TabId);
                                    translator.translateById('desk_' + screenInfo.TabId);
                                    $('#tab_' + screenInfo.TabId).css({ 'display': 'flex' })

                                    //Set position
                                    SetFormPosition(screenInfo.TabId);

                                    //Show Form
                                    $('#desk_' + screenInfo.TabId + ' .form-container').fadeIn();
                                });

                            $.ajax({
                                url: "./js/controls.js" + disableCache,
                                type: "GET",
                                dataType: "html",

                                success: function (code) {
                                    code = code.replace(/\_____controlid_____/g, screenInfo.TabId);
                                    if (screenInfo.Code && screenInfo.Code != "") {
                                        code = code.replace(/\_____controlidcode_____/g, screenInfo.Code);
                                    } else {
                                        code = code.replace(/\_____controlidcode_____/g, "");
                                    }
                                    if (!(screenInfo.ChildId === undefined || screenInfo.ChildId == null || screenInfo.ChildId == "")) {
                                        code = code.replace(/\_____childcontrolid_____/g, screenInfo.ChildId);
                                    }

                                    let script = document.createElement('script');
                                    script.appendChild(document.createTextNode(code));

                                    $('#desk_' + screenInfo.TabId + ' .form-body')
                                        .append(script)
                                        .ready(function () {
                                            script = document.createElement('script');
                                            script.appendChild(document.createTextNode(htmlCode));

                                            $('#desk_' + screenInfo.TabId + ' .form-body')
                                                .append(script)
                                                .ready(function () {
                                                    $.ajax({
                                                        url: "./js/" + screenInfo.Type + ".js" + disableCache,
                                                        type: "GET",
                                                        dataType: "html",

                                                        success: function (code) {
                                                            code = code.replace(/\_____controlid_____/g, screenInfo.TabId);
                                                            code = code.replace(/\_____parentid_____/g, screenInfo.ParentId);
                                                            code = code.replace(/\_____htmlid_____/g, screenInfo.Id);
                                                            if (screenInfo.Code && screenInfo.Code != "") {
                                                                code = code.replace(/\_____controlidcode_____/g, screenInfo.Code);
                                                            } else {
                                                                code = code.replace(/\_____controlidcode_____/g, "");
                                                            }
                                                            if (!(screenInfo.ChildId === undefined || screenInfo.ChildId == null || screenInfo.ChildId == "")) {
                                                                code = code.replace(/\_____childcontrolid_____/g, screenInfo.ChildId);
                                                            }

                                                            if (screenInfo.IsChildren) {
                                                                code = code.replace(new RegExp(screenInfo.TabId + '_OnLoad\\(\\);', 'g'), '');
                                                            }

                                                            script = document.createElement('script');
                                                            script.appendChild(document.createTextNode(code));

                                                            $('#desk_' + screenInfo.TabId + ' .form-body')
                                                                .append(script)
                                                                .ready(function () {
                                                                    //Bring Form to Front
                                                                    BringToFrontTab(screenInfo.TabId);

                                                                    //Call function after load js
                                                                    CallbackFunction(screenInfo);
                                                                });
                                                        },

                                                        error: function (e) {
                                                            $(function () {
                                                                //Bring Form to Front
                                                                BringToFrontTab(screenInfo.TabId);

                                                                //Call function after load js
                                                                CallbackFunction(screenInfo);
                                                            })
                                                        }
                                                    });
                                                });
                                        });

                                    if (htmlCode.length > 0) {

                                    }
                                }
                            });
                        }
                    });
                }
            });
        }

        //Click on Tab
        document.getElementById('tab_' + screenInfo.TabId).onclick = function () { ShowTab(screenInfo.TabId, false); };
    } else {
        //Call function after load js
        $('#desk_' + screenInfo.TabId).data('screen-info', JSON.stringify(screenInfo));
        CallbackFunction(screenInfo);
        if (screenInfo.Reload == true) {
            var cmd = screenInfo.TabId + '_OnLoad()';
            eval(cmd);
        }
    }
}

//Call function after load js
function CallbackFunction(screenInfo) {
    if (screenInfo.Callback !== null && screenInfo.Callback !== undefined && screenInfo.Callback) {
        if (!screenInfo.Callback.includes(screenInfo.TabId)) {
            let func = screenInfo.Callback.split("_");
            screenInfo.Callback = screenInfo.TabId + "_" + func[1];
        }
        var cmd = screenInfo.Callback + '(screenInfo)';
        eval(cmd);
    }
}

function ShowTab(id, isReload, code) {
    HideTooltip();

    if (id == "T00") {
        if ($('#maindesktop > div:visible').attr('id') != '#desk_T00') {
            if ($('.tab div.active').length > 0)
                $('.tab div.active').removeClass('active');

            $('#maindesktop > div:visible').hide();

            $('#desk_T00').show();

            BringToFrontTab(id);
        }
        //Create data and draw charts
        Chart_Build_Data(false);

        return true;
    } else if ($('#tab_' + id).length > 0) {
        if ($('#maindesktop > div:visible').attr('id') != '#desk_' + id) {
            if ($('.tab div.active').length > 0)
                $('.tab div.active').removeClass('active');

            $('#maindesktop > div:visible').hide();

            if (!$('#desk_' + id).is(':visible')) {
                $('#tab_' + id + ' div').addClass('active');
                $('#desk_' + id).show();
            }
            if (isReload == true) {
                if (eval("typeof " + id + "_Code == 'string'")) {
                    window[id + "_Code"] = code;
                }
                if (eval("typeof " + id + "_OnLoad == 'function'")) {
                    var callBack = eval(id + "_OnLoad");
                    callBack();
                }
            }

            //Bring Form to Front
            BringToFrontTab(id);
        }

        return true;
    } else {
        return false;
    }
}

function RemoveTab(id, parentid) {
    HideTooltip();
    ResetTabVariable(id);

    let visible = $('#desk_' + id).is(':visible');

    if (parentid === undefined || parentid == null || parentid == "" || $('#tab_' + parentid).length == 0) {
        if ($('#desk_' + id).prev().attr('id') != "desk_00") {
            parentid = $('#desk_' + id).prev().attr('id').substr(5);
        } else if ($('#desk_' + id).next().length > 0) {
            parentid = $('#desk_' + id).next().attr('id').substr(5);
        } else {
            parentid = "00";
        }
    }

    $('#desk_' + id + ' table').each(function () {
        $(this).destroy();
    });

    //Function is called before remove
    if (eval("typeof " + id + "_Close === 'function'")) {
        eval(id + "_Close")();
    }

    //remove queue
    let screenInfo = $('#desk_' + id).data("screen-info");
    screenInfo = JSON.parse(screenInfo);

    let index = TabQueue.findIndex(function (o) {
        return o.Id == screenInfo.Id && o.Title == screenInfo.Title;
    });
    if (index != -1)
        TabQueue.splice(index, 1);

    $('#desk_' + id).remove();
    $('#tab_' + id).remove();

    OrderTab();

    if (visible) {
        ShowTab(parentid);
    }
}

function ResetTabVariable(id) {
    window[id + "_LastFocus"] = null;
    //reset clusterize
    if (eval("typeof " + id + "_clusterize != undefined")) {
        window[id + "_clusterize"] = null;
    }

    if (eval("typeof " + id + "_clusterize_data != undefined")) {
        window[id + "_clusterize_data"] = null;
    }

    if (eval("typeof " + id + "_Detail_clusterize != undefined")) {
        window[id + "_Detail_clusterize"] = null;
    }

    if (eval("typeof " + id + "_Detail_clusterize_data != undefined")) {
        window[id + "_Detail_clusterize_data"] = null;
    }
}

function SetFormPosition(id) {
    var dock = $('#desk_' + id).attr('dockstyle');

    if (dock === undefined || dock == null || dock.length <= 0 || dock == "none") {
        if ($(window).height() - $('#desk_' + id + ' .form-container').height() - $('#maintaskbar').height() > 0) {
            $('#desk_' + id + ' .form-container').css('top', ($(window).height() - $('#desk_' + id + ' .form-container').height() - $('#maintaskbar').height()) / 2);
        }
    } else {
        $('#desk_' + id + ' .form-container').css('height', $(window).height() - $('#maintaskbar').height() - $("#topnav").height());

        if ($('#desk_' + id + ' .form-container .form-footer').length > 0) {
            $('#desk_' + id + ' .form-body').css('height', $('#desk_' + id + ' .form-container').height() - $('#desk_' + id + ' .form-title').height() - $('#desk_' + id + ' .form-toolbar').height() - $('#desk_' + id + ' .form-footer').height());
        } else {
            $('#desk_' + id + ' .form-body').css('height', $('#desk_' + id + ' .form-container').height() - $('#desk_' + id + ' .form-title').height() - $('#desk_' + id + ' .form-toolbar').height());
        }
    }
}

function BringToFrontTab(id) {
    SetFormPosition(id);

    var modal = $('#desk_' + id + ' .popup-modal .popup-modal-background:visible');
    if (modal.length > 0) {
        if (window[id + "_LastFocus"] && modal.html().includes($(window[id + "_LastFocus"]).get(0).outerHTML)) {
            window[id + "_LastFocus"].focus();
        } else {
            modal.focus();
        }
    } else {
        if (window[id + "_LastFocus"] && $('#desk_' + id + ' .form-container').html().includes($(window[id + "_LastFocus"]).get(0).outerHTML)) {
            window[id + "_LastFocus"].focus();
        } else {
            $('#desk_' + id + ' .form-container:first').focus();
        }
    }

    $('#desk_' + id + ' table').each(function () {
        //Build background of table header
        let controlid = $(this).attr("controlid");
        if (controlid) {
            let s3ttable = eval(controlid + "_S3Table");
            s3ttable.ResetColumn();
        }
    });
}

function InitMemvar(callback) {
    $.ajax
        ({
            type: 'POST',
            url: 'api/Memvar/InitMemvar',
            async: false,
            contentType: 'application/json; charset =utf-8',
            success: function (data) {
                ApplicationInstance = data;
                //Translate desktop
                callback();

                //Set name
                $('.subsidiary-info', $('body #topnav')).text(ApplicationInstance.accountInfo.CompanyName);
                //Create data and draw charts
                Chart_Build_Data(true);
                //load stimu license
                Stimulsoft.Base.StiLicense.loadFromFile("License/key.txt")

                // To calculate the time difference of two dates
                let Difference_In_Time = new Date(ApplicationInstance.ExpiredDate).getTime() - new Date().getTime();
                // To calculate the no. of days between two dates
                let RemainDays = Difference_In_Time / (1000 * 3600 * 24);
                if (RemainDays < 30) {
                    let timer = setInterval(() => {
                        if (applicationDictionary != undefined) {
                            clearInterval(timer);
                            let args = new Array();
                            args.push('Common_Contract_Expire');
                            args.push(datetimeToStringShort(ApplicationInstance.Systemvar.ExpiredDate));
                            args.push(datetimeToStringShort(ApplicationInstance.Systemvar.ExpiredDate));
                            Main_AlertMessage.showInfo("Common_Contract_Expire", null, args);
                        }
                    }, 1);
                }
            }
        });

    ApplicationInstance.ScrollbarWidth = GetScrollbarWidth();
}

function SetUservarLanguage(id, value) {
    if (ApplicationInstance.Uservar.BillingualLanguage == value) return;
    Main_Loading.show();
    var item = new Object();
    item.Var_Name = id;
    item.Var_Value = value.toString();
    $.ajax
        ({
            type: 'POST',
            url: 'api/Memvar/SetUservar',
            //async: false,
            data: JSON.stringify(item),
            contentType: 'application/json; charset =utf-8',
            success: function (data) {
                TranslateProcess(value);
                Main_Loading.hide();
            },

            error: function (result) {
                Main_Loading.hide();
                handleResponseError(Main_AlertMessage, result);
            }
        });
}

function ChangeLang(value) {
    SetUservarLanguage('BillingualLanguage', value);
}


function ChangeTheme(value) {
    if (ApplicationInstance.Uservar.Theme == value) {
        return;
    }
    let items = [];

    let Theme = new Object();
    Theme.Var_Name = "Theme";
    Theme.Var_Value = value;
    items.push(Theme);

    $.ajax
        ({
            type: 'POST',
            url: 'api/Memvar/SetUservars',
            async: false,
            data: JSON.stringify(items),
            contentType: 'application/json; charset =utf-8',
            success: function (data) {
                window.location.reload();
            },

            error: function (result) {
                handleResponseError(Main_AlertMessage, result);
            }
        });
}

function CustomDropdownLang(seletor, callback) {
    let Selected = $(seletor);

    Selected.mousedown(function () {
        if ($('#customdropdown', $('body')).length == 0) {
            $('body').append('<div id = "customdropdown" class="drop-down-theme"><div class="options"><ul class="list-dropdown"></ul></div></div>');
        }
        $('.list-dropdown', $('#customdropdown', $('body'))).empty();

        let data = $(this).data('toggle');
        let html = '';
        let translate = (typeof $(this).data('translate') !== 'undefined' && $(this).data('translate') == false ? false : true);
        $.each(data, function (index, item) {
            html += '<li data-icon="img/' + item.icon + '.png" data-code="' + item.id + '"><div><img src="img/' + item.icon + '.png" /><div class="billingual-wrapper" data-i18n-layout="layout8" data-i18n-key="' + item.name + '"></div></div></li>';
        });

        $('.list-dropdown', $('#customdropdown', $('body')))
            .append(html);

        translate && translator.translateById('customdropdown');
        $('#customdropdown', $('body')).show();

        $('#customdropdown', $('body')).css('left', $(this)[0].getBoundingClientRect().right - $('.list-dropdown', $('#customdropdown', $('body'))).width());

        $("#customdropdown ul li").click(function () {
            $('#customdropdown', $('body')).hide();
            Selected.find(".selected img:first")[0].src = $(this).attr("data-icon");
            if (callback) callback($(this).attr("data-code"));
        });
    });
}

function CustomDropdownTheme(seletor, callback) {
    let Selected = $(seletor);

    Selected.click(function () {
        if ($('#customdropdown', $('body')).length == 0) {
            $('body').append('<div id = "customdropdown" class="drop-down-theme"><div class="options"><ul class="list-dropdown"></ul></div></div>');
        }
        $('.list-dropdown', $('#customdropdown', $('body'))).empty();

        let data = $(this).data('toggle');
        let html = '';
        let translate = (typeof $(this).data('translate') !== 'undefined' && $(this).data('translate') == false ? false : true);
        $.each(data, function (index, item) {
            html += '<li data-value="' + item.value + '" data-code="' + item.id + '"><div><div style="width:30px;height:18px;" class="' + item.value + '"></div><div class="theme-content"><div class="billingual-wrapper" data-i18n-layout="layout8" data-i18n-key="' + item.name + '"></div></div></div></li>';
        });

        $('.list-dropdown', $('#customdropdown', $('body')))
            .append(html);

        translate && translator.translateById('customdropdown');
        $('#customdropdown', $('body')).show();

        $('#customdropdown', $('body')).css('left', $(this)[0].getBoundingClientRect().right - $('.list-dropdown', $('#customdropdown', $('body'))).width());

        $("#customdropdown ul li").click(function () {
            callback($(this).attr("data-value"));
        });
    });
}

function CustomDropdownList(seletor) {
    let Selected = $(seletor);

    Selected.click(function () {
        if ($('#customdropdown-list', $('body')).length == 0) {
            $('body').append('<div id = "customdropdown-list" class="drop-down-menu"><div class="options"><ul class="list-dropdown"></ul></div></div>');
        }
        $('.list-dropdown', $('#customdropdown-list', $('body'))).empty();

        let favorites = $($('.main-menu-button').first()).attr('major') ? JSON.parse($($('.main-menu-button').first()).attr('major')) : [];
        let listFavorites = favorites.filter(row => row.RightType == 'L');

        let data = $(this).data('toggle');
        $.each(data, function (index, m) {
            let favorite = '<div class="menu-icon"><i class="fa"></i></div>';
            let indexFavorite = listFavorites.findIndex(function (o) {
                return o.Id == m.ControlId && o.Title == m.Bar && ((o.ExtraMenuVar == null && m.ExtraVar == null) || JSON.stringify(o.ExtraMenuVar) == JSON.stringify(JSON.parse(m.ExtraVar)));
            });
            if (indexFavorite != -1) {
                favorite = '<div class="menu-icon active"><i class="fa fa-heart"></i></div>';
            }

            let li = $('<li>').append('<div>' + favorite + '<div class="billingual-wrapper"><label class="main-language">' + m.Bar + '</label><p class="sub-language">' + m.Bar_E + '</p></div></div>');
            li.data("metadata", m);

            $('.list-dropdown', $('#customdropdown-list', $('body')))
                .append(li);
        });

        let menus = $("#customdropdown-list .billingual-wrapper");
        $.map(menus, function (elm, index) {
            translateMenu(elm, index);
        });

        $('#customdropdown-list ul', $('body')).outerHeight($("#maintoolbar").outerHeight() - $("#topnav").outerHeight());
        $('#customdropdown-list', $('body')).show();

        $('#customdropdown-list', $('body')).css('left', $(this)[0].getBoundingClientRect().left);

        $("#customdropdown-list ul li").click(function () {
            $('#customdropdown-list', $('body')).hide();
            let data = $(this).data("metadata");
            let TabId = $(this).attr("tabid");
            if (TabId) {

            } else {
                TabId = CreateUUIDNoSaperate();
                $(this).attr("tabid", TabId);
            }

            let screenInfo = new Object();

            screenInfo.Title = data.Bar;
            screenInfo.Title_E = data.Bar_E;
            screenInfo.TabId = TabId;
            screenInfo.Id = data.ControlId;
            screenInfo.Type = data.ControlType;
            screenInfo.Dock = data.DockStyle;
            screenInfo.ChildId = data.ChildControlId;
            screenInfo.RightId = data.SubId;
            screenInfo.RightType = data.Type;
            screenInfo.MenuRightType = data.MenuRightType;
            screenInfo.ExtraMenuVar = data.ExtraVar;
            screenInfo.IsInputData = data.IsInputData;
            // Danh mục: IsInputData = false
            // Chứng từ: IsInputData = true
            if (ApplicationInstance.Dvcsvar.IsParentCompany && (screenInfo.IsInputData == true || screenInfo.IsInputData == "true")) {
                Main_AlertMessage.showInfo("Common_Msg_NoPrivilege");
                return;
            }

            AddTab(screenInfo);
        });
    });

    $('#invisibleitemsmenu', $('body')).css('max-height', $("#maintoolbar").outerHeight() - $("#topnav").outerHeight() - $("#maintaskbar").outerHeight() + 2);
}

async function TranslateProcess(value) {
    ApplicationInstance.Uservar.BillingualLanguage = parseInt(value);

    let menus = $("#mainmenu .billingual-wrapper");
    $.map(menus, function (elm, index) {
        translateMenu(elm, index);
    });
    await translator.translateAll();
    translateInput($("body"));

    $(".s3tcloud-prefix table").each(function () {
        let controlid = $(this).attr("controlid");
        if (controlid) {
            let s3ttable = eval(controlid + "_S3Table");
            s3ttable.Translate();
            s3ttable.SyncGrip();
        }
    });

    $(".s3tcloud-prefix.form-container").each(function () {
        if ($(this).attr("allow-change") == true || $(this).attr("allow-change") == "true") {
            let callback = $(this).attr("callback");
            if (callback) {
                eval(callback);
            }
        }
    });
    translateOther();
    buildToolTip($(".s3t-tooltip"));
    //set focus
    let activeTab = $("#maintaskbar .tab .active").closest(".tab");
    if (activeTab.length > 0) {
        let id = activeTab.attr("id").replace("tab_", "");
        if (eval("typeof " + id + "_LastFocus" + " === 'object'")) {
            let lastFocus = eval(id + "_LastFocus");
            if (lastFocus)
                lastFocus.focus();
        } else {
            $("#container_" + id).focus();
        }
    }
}

async function TranslateMainTitle(id) {
    var screenInfo = $('#desk_' + id).data('screen-info');

    if (screenInfo) {
        screenInfo = JSON.parse(screenInfo)
        var title = screenInfo.Title;
        var titleE = screenInfo.Title_E;
        var mainTitle = new Array();
        mainTitle.push(title);

        var subTitle = new Array();
        subTitle.push(titleE);
        var key = "Common_Title";
        await translator.translateWithKey($('#desk_' + id + ' .form-title .billingual-wrapper')[0], key, mainTitle, subTitle);
        await translator.translateWithKey($('#tab_' + id + ' .billingual-wrapper')[0], key, mainTitle, subTitle);
    }
}

function ClusterizeData(options = {}) {
    let clusterize_data = new ClusterizeDatabase(options);
    return clusterize_data;
}

function ClusterizeReportData(options = {}) {
    let clusterize_data = new ClusterizeDatabaseReport(options);
    return clusterize_data;
}

function ClusterizeInvoiceData(options = {}) {
    let clusterize_data = new ClusterizeDatabaseInvoice(options);
    return clusterize_data;
}

function BuildClusterizeBinaryTree(data, fieldName) {
    var originalData = [];
    var treeData = [];
    var currentData = sortByKey(data, fieldName, "ASC");
    //var currentData = data;

    $.map(currentData, function (item, index) {
        if (item.ParentId == "") {
            item.Level = 0;
            treeData.push(item);
        }
        originalData.push(item);
    });
    $.map(treeData, function (item) {
        var index = currentData.findIndex(function (o) {
            return o.Id === item.Id;
        })
        currentData.splice(index, 1);
    });
    while (currentData.length > 0) {
        var removeArray = [];
        var rootNodes = [];
        $.map(treeData, function (item) {
            rootNodes.push(item);
        });
        $.map(currentData, function (current) {
            $.map(rootNodes, function (root) {
                if (current.ParentId == root.Id) {
                    var index = treeData.findIndex(function (o) {
                        return o.Id === root.Id;
                    });
                    current.Level = root.Level + 1;
                    while (true) {
                        if (index + 1 == treeData.length) break;
                        if (treeData[index + 1].ParentId == current.ParentId) {
                            index++;
                        } else {
                            break;
                        }
                    }
                    treeData.splice(index + 1, 0, current);
                    removeArray.push(current);
                }
            });
        });
        $.map(removeArray, function (item) {
            var index = currentData.findIndex(function (o) {
                return o.Id === item.Id;
            })
            currentData.splice(index, 1);
        });
    }
    for (var i = 0; i < treeData.length; i++) {
        if (i == treeData.length - 1) {
            treeData[i].IsEnd = true;
            break;
        }
        if (treeData[i].Id == treeData[i + 1].ParentId) {
            treeData[i].IsEnd = false;
        } else {
            treeData[i].IsEnd = true;
        }
    }
    return treeData;
}

function TreeTableGetAllChildId(data, id) {
    var parentIds = [id];
    for (var i = 0; i < data.length; i++) {
        if (data[i].Id != id && parentIds.includes(data[i].ParentId)) {
            parentIds.push(data[i].Id);
        }
    }
    //parentIds.shift();
    return parentIds;
}

function UpdateIsEndEffectRow(row, newChecked, clusterize_data) {
    if (newChecked == true) {
        // Update is end for effect row
        if (row.ParentId == null || row.ParentId == '') {
            // do nothing
        } else {
            row.ParentIsEnd = false;
        }
    } else {
        //clusterize_data = eval(clusterize_data);
        // Update is end for effect row
        if (row.ParentId == null || row.ParentId == '') {
            var index = clusterize_data.data.findIndex(function (o) {
                return o.Id === row.Id;
            })
            if (clusterize_data.data[index].ParentId == null || clusterize_data.data[index].ParentId == '') {
                // no change parent do nothing
            } else {
                // remove parent
                var ids = TreeTableGetAllChildId(clusterize_data.data, clusterize_data.data[index].ParentId);
                ids.shift();
                if (ids.length == 1 && ids[0] == clusterize_data.data[index].Id) {
                    row.OldParentId = clusterize_data.data[index].ParentId;
                    row.OldParentIsEnd = true;
                }
            }
        } else {
            var index = clusterize_data.data.findIndex(function (o) {
                return o.Id === row.Id;
            })
            if (clusterize_data.data[index].ParentId == null || clusterize_data.data[index].ParentId == '') {
                row.ParentIsEnd = false;
            } else {
                row.OldParentId = clusterize_data.data[index].ParentId;
                var ids = TreeTableGetAllChildId(clusterize_data.data, row.OldParentId);
                ids.shift();
                if (ids.length == 1) { // no child group
                    row.OldParentIsEnd = true;
                } else {
                    row.OldParentIsEnd = false;
                }
                row.ParentIsEnd = false;
            }
        }
    }
    return row;
}

function GetEnterRowTreeTable(element, column) {
    var screenInfo = $(element).data('screen-info');
    if (screenInfo) {
        screenInfo = JSON.parse(screenInfo);
        var rowData = screenInfo.DataSource;
        if (rowData) {
            rowData = JSON.parse(rowData);
            if (column) return rowData[column];
            return rowData;
        } else {
            if (column) return '';
            return null;
        }
    } else {
        if (column) return '';
        return null;
    }
}

function ReportScreenData(element) {
    let report = new Object();
    report.Title = translator._getValueFromJSON($(element).attr("data-i18n-key") + ".main", applicationDictionary, false);
    report.Title_E = translator._getValueFromJSON($(element).attr("data-i18n-key") + ".sub", applicationDictionary, false);
    report.Serial = $(element).attr("serial");
    report.RepoFile = $(element).attr("report-file");

    let screen = new Object();
    screen.Id = $(element).attr("html-file"); // Tên file html      
    screen.Title = report.Title; // Title to display on title and taskbar
    screen.Title_E = report.Title_E; // English title to display on title and taskbar
    screen.Type = 'reportviewer'; // HTML base
    screen.Dock = 'full'; // full: Tràn màn hình, none: Theo kích thước thiết kế
    screen.ChildId = ''; // HTML Form Editor
    screen.TabId = CreateUUIDNoSaperate();
    screen.Callback = ''; // Function is called after Id html added
    screen.ParentId = ''; // Html of parent form
    screen.RightId = screen.TabId; // Id of function
    screen.RightType = 'R'; // Type of function
    screen.ExtraMenuVar = report;
    screen.IsInputData = false;
    return screen;
}

function AddTabToFavorite(ControlId) {
    let screenInfo = $(ControlId).data("screen-info");
    screenInfo = JSON.parse(screenInfo);
    $.ajax
        ({
            type: 'POST',
            url: 'api/UserProfile/AddFavorite',
            //async: false,
            data: JSON.stringify(screenInfo),
            contentType: 'application/json; charset =utf-8',
            success: function (data) {
                let favorites = $($("#mainmenu .navbar .main-menu-button").first()).attr("major");
                if (Object.prototype.toString.call(favorites) === '[object Array]') {
                    favorites.push(screenInfo);
                } else {
                    favorites = JSON.parse(favorites);
                    favorites.push(screenInfo);
                }
                $($("#mainmenu .navbar .main-menu-button").first()).attr("major", JSON.stringify(favorites));
            },

            error: function (result) {

            }
        });
}

function RemoveTabFromFavorite(ControlId) {
    let screenInfo = $(ControlId).data("screen-info");
    screenInfo = JSON.parse(screenInfo);
    $.ajax
        ({
            type: 'POST',
            url: 'api/UserProfile/RemoveFavorite',
            //async: false,
            data: JSON.stringify(screenInfo),
            contentType: 'application/json; charset =utf-8',
            success: function (data) {
                let favorites = $($("#mainmenu .navbar .main-menu-button").first()).attr("major");
                if (Object.prototype.toString.call(favorites) === '[object Array]') {

                } else {
                    favorites = JSON.parse(favorites);
                }

                let index = favorites.findIndex(function (o) {
                    return o.Id == screenInfo.Id && o.Title == screenInfo.Title;
                });

                favorites.splice(index, 1);
                $($("#mainmenu .navbar .main-menu-button").first()).attr("major", JSON.stringify(favorites));
            },

            error: function (result) {

            }
        });
}

function GetFavorite(ControlId) {
    let result = false;
    let screenInfo = $(ControlId).data("screen-info");
    screenInfo = JSON.parse(screenInfo);
    $.ajax({
        type: 'GET',
        url: 'api/UserProfile/GetFavorite?id=' + screenInfo.Id + '&title=' + screenInfo.Title,
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            result = data;
        },

        error: function (e) {

        }
    });
    return result;
}

function GetCurrentLangCode() {
    if (ApplicationInstance.Uservar.BillingualLanguage == 0) {
        return ApplicationInstance.Systemvar.MainLanguageId;
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) {
        return ApplicationInstance.Systemvar.SubLanguageId;
    } else {
        return ApplicationInstance.Systemvar.MainLanguageId + "-" + ApplicationInstance.Systemvar.SubLanguageId;
    }
}

function ItpOverlay(id, _class) {

    this.id = id;
    this._class = _class;
    /**
     * Show the overlay
     */
    this.show = function (id) {
        if (id) {
            this.id = id;
            this._last = $(':focus', $("#" + this.id));
        }

        // Gets the object of the body tag
        let bgObj = document.getElementById(this.id);

        // Adds a overlay
        let oDiv = document.createElement('div');
        oDiv.setAttribute('id', 'itp_overlay');
        oDiv.setAttribute("class", "black_overlay");
        oDiv.style.display = 'block';
        bgObj.appendChild(oDiv);

        // Adds loading
        let lDiv = document.createElement('div');
        lDiv.setAttribute('id', _class);
        lDiv.setAttribute("class", _class);
        lDiv.style.display = 'block';

        //
        bgObj.appendChild(lDiv);

        if (this.id.startsWith("container_")) {
            let tabId = this.id.replace("container_", "tab_");
            // Gets the object of the body tag
            let bgObj = document.getElementById(tabId);
            $(bgObj).closest(".tab").addClass("draw");
        }
    }

    /**
     * Hide the overlay
     */
    this.hide = function (id) {

        if (id) {
            this.id = id;
        }

        let bgObj = $("#" + this.id);

        // Removes loading
        let element = bgObj.find("." + _class);
        element.remove();

        // Removes a overlay box
        element = bgObj.find(".itp_overlay" + _class);
        element.remove();

        $(".black_overlay", bgObj).remove();

        if (this.id.startsWith("container_")) {
            let tabId = this.id.replace("container_", "tab_");
            // Gets the object of the body tag
            let bgObj = document.getElementById(tabId);
            $(bgObj).closest(".tab").removeClass("draw");
        }

        if (this._last != null) {
            $(this._last).focus();
        }
    }
}

function AlertMessage(id) {
    this.id = id;
    this._last = null;

    this.showConfirm = function (callback, key) {
        let self = this;
        let containner = $("#" + this.id);
        this._last = $(':focus', containner);

        containner.append('<div class="popup-alert"><div class="popup-alert-background"><div class="form-title"><div class="billingual-wrapper" data-i18n-layout="layout1" data-i18n-key="Common_Msg_Confirm"></div><div class="button-group"><div class="toolbar-button button-cancel"><i class="fa fa-remove"></i></div></div></div><div class="alert-body"></div><div class="alert-footer"><div class="footer-button button-save active"><div class="billingual-wrapper" data-i18n-layout="layout11" data-i18n-key="Common_Button_Agree"></div></div><div class="footer-button button-cancel"><div class="billingual-wrapper" data-i18n-layout="layout11" data-i18n-key="Common_Button_Cancel"></div></div></div></div></div>')
            .ready(function () {
                self.center();
                containner.find(".alert-body").append('<div class="alert-icon"><img src="img/' + ApplicationInstance.Uservar.Theme + '/delete.png" /></div><div class="alert-content"><div class="billingual-wrapper" data-i18n-layout="layout10" data-i18n-key="Common_Msg_Delete_Confirm_Message"></div></div>');
                translator.translateElements(containner.find(".popup-alert")[0]);

                $(".popup-alert .button-cancel", containner).click(function (e) {
                    self.hide();
                });

                $(".popup-alert .button-save", containner).click(function (e) {
                    self.hide();

                    if (callback) {
                        callback();
                    }
                });
            });
    }

    this.showConfirmDuyetNhieu = function (callback, key) {//20230731: Confirm duyet nhieu
        let self = this;
        let containner = $("#" + this.id);
        this._last = $(':focus', containner);

        containner.append('<div class="popup-alert"><div class="popup-alert-background"><div class="form-title"><div class="billingual-wrapper" data-i18n-layout="layout1" data-i18n-key="Common_Msg_Confirm"></div><div class="button-group"><div class="toolbar-button button-cancel"><i class="fa fa-remove"></i></div></div></div><div class="alert-body"></div><div class="alert-footer"><div class="footer-button button-save active"><div class="billingual-wrapper" data-i18n-layout="layout11" data-i18n-key="Common_Button_Agree"></div></div><div class="footer-button button-cancel"><div class="billingual-wrapper" data-i18n-layout="layout11" data-i18n-key="Common_Button_Cancel"></div></div></div></div></div>')
            .ready(function () {
                self.center();
                //containner.find(".alert-body").append('<div class="alert-content"><div class="billingual-wrapper" data-i18n-layout="layout10" data-i18n-key="Common_Msg_DuyetNhieu_Confirm_Message"></div></div>');
                containner.find(".alert-body").append('<div class="alert-icon"><img src="img/warning.png" /></div><div class="alert-content"><div class="billingual-wrapper" data-i18n-layout="layout10" data-i18n-key="Common_Msg_DuyetNhieu_Confirm_Message"></div></div>');
                translator.translateElements(containner.find(".popup-alert")[0]);

                $(".popup-alert .button-cancel", containner).click(function (e) {
                    self.hide();
                });

                $(".popup-alert .button-save", containner).click(function (e) {
                    self.hide();

                    if (callback) {
                        callback();
                    }
                });
            });
    }

    this.showConfirmResetPassword = function (callback, key) {//20230808: Confirm Reset Password
        let self = this;
        let containner = $("#" + this.id);
        this._last = $(':focus', containner);

        containner.append('<div class="popup-alert"><div class="popup-alert-background"><div class="form-title"><div class="billingual-wrapper" data-i18n-layout="layout1" data-i18n-key="Common_Msg_Confirm"></div><div class="button-group"><div class="toolbar-button button-cancel"><i class="fa fa-remove"></i></div></div></div><div class="alert-body"></div><div class="alert-footer"><div class="footer-button button-save active"><div class="billingual-wrapper" data-i18n-layout="layout11" data-i18n-key="Common_Button_Agree"></div></div><div class="footer-button button-cancel"><div class="billingual-wrapper" data-i18n-layout="layout11" data-i18n-key="Common_Button_Cancel"></div></div></div></div></div>')
            .ready(function () {
                self.center();
                containner.find(".alert-body").append('<div class="alert-icon"><img src="img/warning.png" /></div><div class="alert-content"><div class="billingual-wrapper" data-i18n-layout="layout10" data-i18n-key="Common_Msg_ResetPassword_Confirm_Message"></div></div>');
                translator.translateElements(containner.find(".popup-alert")[0]);

                $(".popup-alert .button-cancel", containner).click(function (e) {
                    self.hide();
                });

                $(".popup-alert .button-save", containner).click(function (e) {
                    self.hide();

                    if (callback) {
                        callback();
                    }
                });
            });
    }

    this.showInfo = function (key, callback, args) {
        let self = this;
        let containner = $("#" + this.id);
        this._last = $(':focus', containner);

        if (self.id == "main-alert") {
            containner.show();
        }

        containner.append('<div class="popup-alert"><div class="popup-alert-background"><div class="form-title"><div class="billingual-wrapper" data-i18n-layout="layout1" data-i18n-key="Common_Msg_Info"></div><div class="button-group"><div class="toolbar-button button-cancel"><i class="fa fa-remove"></i></div></div></div><div class="alert-body"></div><div class="alert-footer"><div class="footer-button button-cancel active" style="width:100px !important;">OK</div></div></div></div>')
            .ready(function () {
                self.center();
                containner.find(".alert-body").append('<div class="alert-icon"><img src="img/warning.png" /></div><div class="alert-content"><div class="billingual-wrapper" data-i18n-layout="layout10" data-i18n-key="' + key + '"></div></div>');
                translator.translateElements(containner.find(".popup-alert")[0]);
                if (args) {
                    translator.translateWithKey(containner.find(".popup-alert .alert-body .billingual-wrapper")[0], args[0], [args[1]], [args[2]]);
                }
                $(".popup-alert .button-cancel", containner).click(function (e) {
                    self.hide();

                    if (callback) {
                        callback();
                    }
                });
            });
    }

    this.showError = function (key, callback) {
        let self = this;
        let containner = $("#" + this.id);
        this._last = $(':focus', containner);

        containner.append('<div class="popup-alert"><div class="popup-alert-background"><div class="form-title"><div class="billingual-wrapper" data-i18n-layout="layout1" data-i18n-key="Common_Msg_Info"></div><div class="button-group"><div class="toolbar-button button-cancel"><i class="fa fa-remove"></i></div></div></div><div class="alert-body"></div><div class="alert-footer"><div class="footer-button button-cancel active" style="width:100px !important;">OK</div></div></div></div>')
            .ready(function () {
                self.center();
                containner.find(".alert-body").append('<div class="alert-icon"><img src="img/error.png" /></div><div class="alert-content"><div class="billingual-wrapper" data-i18n-layout="layout10" data-i18n-key="' + key + '"></div></div>');
                translator.translateElements(containner.find(".popup-alert")[0]);

                $(".popup-alert .button-cancel", containner).click(function (e) {
                    self.hide();

                    if (callback) {
                        callback();
                    }
                });
            });
    }
    this.showSuccess = function (key, callback) {
        let self = this;
        let containner = $("#" + this.id);
        this._last = $(':focus', containner);

        containner.append('<div class="popup-alert"><div class="popup-alert-background"><div class="form-title"><div class="billingual-wrapper" data-i18n-layout="layout1" data-i18n-key="Common_Msg_Info"></div><div class="button-group"><div class="toolbar-button button-cancel"><i class="fa fa-remove"></i></div></div></div><div class="alert-body"></div><div class="alert-footer"><div class="footer-button button-cancel active" style="width:100px !important;">OK</div></div></div></div>')
            .ready(function () {
                self.center();
                containner.find(".alert-body").append('<div class="alert-icon"><img src="img/susscess.png" /></div><div class="alert-content"><div class="billingual-wrapper" data-i18n-layout="layout10" data-i18n-key="' + key + '"></div></div>');
                translator.translateElements(containner.find(".popup-alert")[0]);

                $(".popup-alert .button-cancel", containner).click(function (e) {
                    self.hide();

                    if (callback) {
                        callback();
                    }
                });
            });
    }

    this.showMessage = function (message, callback) {
        let self = this;
        let containner = $("#" + this.id);
        this._last = $(':focus', containner);

        containner.append('<div class="popup-alert"><div class="popup-alert-background"><div class="form-title"><div class="billingual-wrapper" data-i18n-layout="layout1" data-i18n-key="Common_Msg_Info"></div><div class="button-group"><div class="toolbar-button button-cancel"><i class="fa fa-remove"></i></div></div></div><div class="alert-body"></div><div class="alert-footer"><div class="footer-button button-cancel active" style="width:100px !important;">OK</div></div></div></div>')
            .ready(function () {
                self.center();
                containner.find(".alert-body").append('<div class="alert-icon"><img src="img/error.png" /></div><div class="alert-content">' + message + '</div>');
                translator.translateElements(containner.find(".popup-alert")[0]);

                $(".popup-alert .button-cancel", containner).click(function (e) {
                    self.hide();

                    if (callback) {
                        callback();
                    }
                });
            });
    }

    this.showSum = function (sum) {
        let self = this;
        let containner = $("#" + this.id);
        this._last = $(':focus', containner);

        if (self.id == "main-alert") {
            containner.show();
        }

        containner.append('<div class="popup-alert"><div class="popup-alert-background"><div class="form-title"><div class="billingual-wrapper" data-i18n-layout="layout1" data-i18n-key="Common_Tooltip_Button_Sum"></div><div class="button-group"><div class="toolbar-button button-cancel"><i class="fa fa-remove"></i></div></div></div><div class="alert-body"></div><div class="alert-footer"><div class="footer-button button-cancel active" style="width:100px !important;">OK</div></div></div></div>')
            .ready(function () {
                self.center();
                containner.find(".alert-body").append('<div class="sum-content">' + '<p>' + number_to_text(sum, number_decimalscale('CalculatorDecimals')) + '</p>' +
                    "<div class='tooltip'><button onclick='copySum(" + sum + ")' onmouseout='var tooltip = document.getElementById(\"showSumTooltip\");tooltip.innerHTML = \"Copy to clipboard\";'><span class='showSumTooltip' id='showSumTooltip'>Copy to clipboard</span><i class='fa fa-clipboard'></i></button></div>" + '</div>');
                translator.translateElements(containner.find(".popup-alert")[0]);

                $(".popup-alert .button-cancel", containner).click(function (e) {
                    self.hide();
                });
            });
    }

    this.showHtmlInfo = function (html, callback) {
        let self = this;
        let containner = $("#" + this.id);
        this._last = $(':focus', containner);

        if (self.id == "main-alert") {
            containner.show();
        }

        containner.append('<div class="popup-alert"><div class="popup-alert-background""><div class="form-title"><div class="billingual-wrapper" data-i18n-layout="layout1" data-i18n-key="Common_Msg_Info"></div><div class="button-group"><div class="toolbar-button button-cancel"><i class="fa fa-remove"></i></div></div></div><div class="alert-body"></div><div class="alert-footer"><div class="footer-button button-cancel active" style="width:100px !important;">OK</div></div></div></div>')
            .ready(function () {
                self.center();
                containner.find(".alert-body").append('<div class="alert-icon"><img src="img/warning.png" /></div><div class="alert-content" style="font-size: inherit;">' + html + '</div>');
                translator.translateElements(containner.find(".popup-alert")[0]);

                $(".popup-alert .button-cancel", containner).click(function (e) {
                    self.hide();

                    if (callback) {
                        callback();
                    }
                });
            });
    }

    this.showHtmlWarning = function (html, callback) {
        let self = this;
        let containner = $("#" + this.id);
        this._last = $(':focus', containner);

        if (self.id == "main-alert") {
            containner.show();
        }

        containner.append('<div class="popup-alert"><div class="popup-alert-background""><div class="form-title"><div class="billingual-wrapper" data-i18n-layout="layout1" data-i18n-key="Common_Msg_Warning"></div><div class="button-group"><div class="toolbar-button button-cancel"><i class="fa fa-remove"></i></div></div></div><div class="alert-body"></div><div class="alert-footer"><div class="footer-button button-cancel active" style="width:100px !important;">OK</div></div></div></div>')
            .ready(function () {
                self.center();
                containner.find(".alert-body").append('<div class="alert-icon"><img src="img/warning.png" /></div><div class="alert-content" style="font-size: inherit;">' + html + '</div>');
                translator.translateElements(containner.find(".popup-alert")[0]);

                $(".popup-alert .button-cancel", containner).click(function (e) {
                    self.hide();

                    if (callback) {
                        callback();
                    }
                });
            });
    }

    this.hide = function () {
        let containner = $("#" + this.id);

        $(".popup-alert", containner).remove();

        if (this.id == "main-alert") {
            containner.hide();
        }
        if (this._last != null) {
            $(this._last).focus();
        }

        //    let td = containner.find(".active-nobg").removeClass("active-nobg");
        //    if (td.length > 0) {
        //        td.find("input").focus();// workarround
        //    }
    }

    this.center = function () {
        let containner = $("#" + this.id);
        if (!containner.is(":visible"))
            containner = $("#mainbody", $('body'));

        let width1 = containner.width();
        let height1 = containner.height();

        let width2 = $('.popup-alert .popup-alert-background', containner).width();
        let height2 = $('.popup-alert .popup-alert-background', containner).height();

        $('.popup-alert .popup-alert-background').css({ 'left': (width1 / 2 - width2 / 2) + 'px', 'top': (height1 / 2 - height2 / 2) + 'px' });
        //containner.focus();
    }

    this.isShow = function () {
        let containner = $("#" + this.id);
        return $(".popup-alert", containner).length > 0;
    }
}

function CreateUUID() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

function CreateUUIDNoSaperate() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "";

    var uuid = s.join("");
    return "T" + uuid;
}

function formatNumber(num) {
    return num.toLocaleString("vi-VN"); // 250.000
}
function isNullOrUndefined(value) {
    return value === null || value === undefined;
}

function isNullOrEmpty(value) {
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
function formatDate3(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return "";

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

function formatCurrencyVN(number) {
    if (isNaN(number)) return '0 VNĐ';
    return Number(number).toLocaleString('vi-VN') + ' VNĐ';
}

function ShowNotification(message, type = "success") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add("show");
    }, 100);
    // Tự ẩn sau duration
    setTimeout(() => {
        toast.classList.remove("show");
        // Xóa khỏi DOM sau khi ẩn
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}