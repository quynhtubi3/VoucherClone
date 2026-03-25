/* Điều khiển cửa sổ danh sách danh mục */

var _____controlid______Right = null;
var _____controlid______Modal = ''; //search (tìm theo nhóm) - merge2code (gộp mã) - decrease (ghi giảm tài sản) - accessories (cập nhật linh kiện tài sản) - importdata (cập nhật dữ liệu từ excel)
var _____controlid______FilterVar = {};
var _____controlid______Code = '_____controlidcode_____';
var _____controlid______Loading = new ItpOverlay("container______controlid_____", "partial-loading");
var _____controlid______AlertMessage = new AlertMessage("container______controlid_____");
var _____controlid______Dock = "none";
var _____controlid______S3Table = new S3ttable({
        Id: "_____controlid______ScrollArea",
        ClusterizeData: ClusterizeData(),
        BuildRow: _____htmlid______BuildRow,
        ColumnSearchElement: $("#_____controlid______TableColumnSearch"),
        Callbacks: {
            ClusterChanged: function () {
                if (typeof _____controlid______ClusterChanged != "undefined") {
                    _____controlid______ClusterChanged();
                }
            }
        }
});

if (typeof _____htmlid______Import_BuildRow != "undefined") {    
    var _____controlid______Import_S3Table = new S3ttable({
        Id: "_____controlid______Import_ScrollArea",
        DeskId: "_____controlid_____",
        ClusterizeData: ClusterizeData(),
        BuildRow: _____htmlid______Import_BuildRow,
        Callbacks: {
            ClusterChanged: function () {

            }
        }
    });
}

$(function () {
    $("#desk______controlid_____ .popup-modal-background>div[child-form='importdata']").attr('import-sample-file', _____controlid______Table.toUpperCase());

    $('#desk______controlid_____ .form-title .button-favorite').on('click', function (e) {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            RemoveTabFromFavorite('#desk______controlid_____');
        } else {            
            $(this).addClass("active");
            AddTabToFavorite('#desk______controlid_____');
        }
    });

    if (GetFavorite('#desk______controlid_____') == true) {
        $('#desk______controlid_____ .form-title .button-favorite').addClass("active");
    }

    $('#desk______controlid_____ .s3tcloud-prefix.form-container>.form-title .button-close').on('click', function (e) {
        RemoveTab('_____controlid_____', $('#desk______controlid_____').attr('parentcontrolid'));
        typeof TableColumnFilter_ResetFilter != "undefined" && TableColumnFilter_ResetFilter('_____controlid_____');
    });

    $('#desk______controlid_____ .form-toolbar .button-refresh').on('click', function (e) {
        _____controlid______CtrlEnter();
    });

    $('#desk______controlid_____ .form-toolbar .button-add').on('click', function (e) {
        (_____controlid______Right == null || _____controlid______Right.Right_2 == true) && _____controlid______ShowEditor(true);
    });

    $('#desk______controlid_____ .form-toolbar .button-delete').on('click', function (e) {
        (_____controlid______Right == null || _____controlid______Right.Right_4 == true) && _____controlid______OnDelete();
    });

    $('#desk______controlid_____ .form-toolbar .button-edit').on('click', function (e) {
        (_____controlid______Right == null || _____controlid______Right.Right_3 == true) && _____controlid______S3Table.ClusterizeData && _____controlid______S3Table.ClusterizeData != null &&
        _____controlid______S3Table.ClusterizeData.current_row_id && _____controlid______ShowEditor(false);
    });
    
    $('#desk______controlid_____ .form-toolbar .button-search').on('click', function (e) {        
        _____controlid______Modal = 'search';
        if (eval("typeof _____controlid______SearchPreprocess") == "function") _____controlid______SearchPreprocess();
        $("#desk______controlid_____ .popup-modal-background>div[child-form='search']").show();
        $("#desk______controlid_____ .popup-modal-background>div[child-form!='search']").hide();

        ShowModalCenterOfParent("desk______controlid_____", "desk______controlid_____ .s3tcloud-prefix.form-container", "modal______controlid_____ .popup-modal-background>div[child-form='search'] .popup-modal-form");

        $('#desk______controlid_____ .popup-modal-background').show();
        $('#desk______controlid_____ .popup-modal-background .popup-modal-body input:visible:first').focus();
    });

    $('#desk______controlid_____ .button-preview').on('click', function (e) {
        _____controlid______Modal = 'preview';
        if (eval("typeof _____controlid______SearchPreprocess") == "function") _____controlid______SearchPreprocess();
        $("#desk______controlid_____ .popup-modal-background>div[child-form='preview']").show();
        $("#desk______controlid_____ .popup-modal-background>div[child-form!='preview']").hide();

        ShowModalCenterOfParent("desk______controlid_____", "desk______controlid_____ .s3tcloud-prefix.form-container", "modal______controlid_____ .popup-modal-background>div[child-form='preview'] .popup-modal-form");

        $('#desk______controlid_____ .popup-modal-background').show();
        $('#desk______controlid_____ .popup-modal-background .popup-modal-body input:visible:first').focus();
    });

    $('#desk______controlid_____ .form-toolbar .button-export-excel').on('click', function (e) {
       // if (_____controlid______Right.Right_4 == false) return;
        var excelInfo = new Object();

        excelInfo.Title = $('#desk______controlid_____ .form-title:first label').text();
        excelInfo.Title_E = $('#desk______controlid_____ .form-title:first p').text();
        excelInfo.TableHtml = $('#desk______controlid_____ .form-body table').clone();
        excelInfo.TableData = _____controlid______S3Table.ClusterizeData;

        //export
        ExportToExcel(excelInfo,'_____controlid_____');

        //just in case, prevent default behaviour
        e.preventDefault();
    });

    $('#desk______controlid_____ .form-toolbar .button-import').on('click', function (e) {
        if (_____controlid______Right.Right_2 == false) return;
        _____controlid______Modal = 'importdata';

        $("#desk______controlid_____ .popup-modal-background>div[child-form='importdata']").show();
        $("#desk______controlid_____ .popup-modal-background>div[child-form!='importdata']").hide();

        ShowModalCenterOfParent("desk______controlid_____", "desk______controlid_____ .s3tcloud-prefix.form-container", "modal______controlid_____ .popup-modal-background>div[child-form='importdata'] .popup-modal-form");

        $('#desk______controlid_____ .popup-modal-background').show();
        $('#desk______controlid_____ .popup-modal-background .popup-modal-body input:visible:first').focus();
    });

    $("#desk______controlid_____ .s3tcloud-prefix.popup-modal .popup-modal-background>div[child-form='importdata'] .import-sample-file").off('click').on('click', function (e) {
        let screenInfo = $('#desk______controlid_____').data('screen-info');
        if (screenInfo) {
            screenInfo = JSON.parse(screenInfo)
            let link = document.createElement("a");
            link.download = _____controlid______Table.toUpperCase() + ".xlsx";
            link.href = "template/" + _____controlid______Table.toUpperCase() + ".xlsx";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
        }
    });

    $('#desk______controlid_____ .popup-modal-background>div[child-form="importdata"] .button-save').on('click', function () {
        _____controlid______Import();
    })

    $('#desk______controlid_____ .s3tcloud-prefix.form-container:first').on('keydown', function (e) {
        switch (e.keyCode) {
            case 113: //F2
                e.preventDefault();
                !_____controlid______AlertMessage.isShow() && (_____controlid______Right == null ||_____controlid______Right.Right_2 == true) && _____controlid______ShowEditor(true);

                break;

            case 114: //F3
                e.preventDefault();

                if (e.shiftKey) {
                    sumCellSelected($("#desk______controlid_____ table"));
                } else if (!e.ctrlKey && !e.shiftKey && !e.altKey) {
                    (_____controlid______Right == null || _____controlid______Right.Right_3 == true) && _____controlid______S3Table.ClusterizeData &&
                    _____controlid______S3Table.ClusterizeData != null && _____controlid______S3Table.ClusterizeData.current_row_id && _____controlid______ShowEditor(false);
                }
                
                break;

            case 119: //F8
                e.preventDefault();
                (_____controlid______Right == null || _____controlid______Right.Right_4 == true) && _____controlid______OnDelete();

                break;

            case 116: //Ctrl+F5 - Kết xuất dữ liệu ra excel
                e.preventDefault();
                if (e.ctrlKey) {
                    $('#desk______controlid_____ .form-toolbar .button-export-excel').click();
                }

                break;
        }
    });

    $('#desk______controlid_____').on('dblclick', '.form-container table tbody tr', function (e) {
        //20230731: Double click row
        (_____controlid______Right == null || _____controlid______Right.Right_3 == true) && _____controlid______S3Table.ClusterizeData &&
        _____controlid______S3Table.ClusterizeData != null && _____controlid______S3Table.ClusterizeData.current_row_id && _____controlid______ShowEditor(false);
    });

    $('#desk______controlid_____ .popup-modal-background .button-cancel, #desk______controlid_____ .s3tcloud-prefix .popup-modal-form>.form-title .button-close').on('click', function () {
        _____controlid______Modal_Close();
    })

    $('#desk______controlid_____ .popup-modal-background').on('keydown', function (e) {
        if (e.keyCode == 27) {
            e.preventDefault();

            if ($(".ui-autocomplete:visible").length > 0) {
                $(".ui-autocomplete:visible").empty();
                $(".ui-autocomplete:visible").hide();
            } else {
                _____controlid______Modal_Close();
            }
        } 
    })

    if ($("#container______controlid_____ table").attr("htmlid") != undefined && $("#container______controlid_____ table").attr("contextmenu") != "false") {
        $("#container______controlid_____ table thead").contextMenu({
            selector: "th",
            items: [
                {
                    translate: false,
                    name: "Save",
                    icon: "fa-floppy-o",
                    callback: function () { 
                        _____controlid______S3Table.SaveColumnWidths();
                    },
                },
                {
                    translate: false,
                    type: 'cm_seperator'
                },
                {
                    translate: false,
                    name: "Hide",
                    icon: "fa-eye-slash",
                    callback: function () { 
                        _____controlid______S3Table.HideColumn($(this));
                    },
                },
                {
                    translate: false,
                    name: "UnHide",
                    icon: "fa-eye",
                    callback: function () { 
                        _____controlid______S3Table.UnHideColumns();
                    }
                },
                //{
                //    translate: false,
                //    type: 'cm_seperator'
                //},
                //{
                //    translate: false,
                //    name: "Frozen",
                //    icon: "fa-lock",
                //    callback: function () { 
                //        _____controlid______S3Table.SetColumnFrozen($(this));
                //    }
                //},
                //{
                //    translate: false,
                //    type: 'cm_seperator'
                //},
                //{
                //    translate: false,
                //    name: "Set column width",
                //    icon: "fa-thumb-tack",
                //    callback: function () { 
                //    //    _____controlid______S3Table.SetColumnWidth($(this));
                //    }
                //},
                {
                    translate: false,
                    type: 'cm_seperator'
                },
                {
                    translate: false,
                    name: "Reset to default",
                    icon: "fa-window-restore",
                    callback: function () { 
                        _____controlid______S3Table.ResetColumnWidths();
                    }
                }
            ]
        });
    }

    TranslateMainTitle('_____controlid_____');
    initTextSearch($('#desk______controlid_____ .text-search'));

    _____controlid______OnLoad();

    //20230918 Start: Chuyen cac popup child-form vao div s3tcloud-prefix popup-modal trong listlister.html
    $("#desk______controlid_____ div:not(.popup-modal) .popup-modal-background").children().appendTo("#desk______controlid_____ .popup-modal .popup-modal-background");
    $("#desk______controlid_____ div:not(.popup-modal) .popup-modal-background").remove();
    //End
})

function _____controlid______Modal_Close() {
    if ($('#desk______controlid_____ .popup-alert .popup-alert-background').length == 0) {
        // enable resize
        $("#desk______controlid_____ table").each(function (i, t) {
            $(t).enableGrips();
        });
        $('#desk______controlid_____ .form-container:first').focus();
        $('#desk______controlid_____ .popup-modal-background').hide();
        _____controlid______S3Table.Focus();
    }
}

function _____controlid______ShowEditor(NewChecked) {
    if (!NewChecked && $("#desk______controlid_____ table tbody tr:visible").length == 0) {
        return;
    }

    //Trường hợp có thêm điều kiện đặc thù thì sẽ tạo trong html
    if (typeof _____controlid______PrepareToShow === "function" && !_____controlid______PrepareToShow()) {
        return;
    }

    var data = $('#desk______controlid_____').data('screen-info');
    var screenInfo = new Object();

    screenInfo.Id = "_____childcontrolid_____";
    
    screenInfo.Type = "listeditor";
    screenInfo.Dock = _____controlid______Dock;
    screenInfo.ParentId = '_____controlid_____';
    screenInfo.NewChecked = NewChecked;

    if (data) {
        data = JSON.parse(data);
        screenInfo.Title = data.Title;
        screenInfo.Title_E = data.Title_E;
        screenInfo.DataSource = data.DataSource;
        screenInfo.TabId = data.TabId + '_Editor';
        screenInfo.Callback = screenInfo.TabId + "_OnShow";
    }
    if (!isNullOrEmpty(screenInfo.Id) && screenInfo.Id != 'null'){
        AddTab(screenInfo);
    }
}

//20230530 Start: Them nut view
function _____controlid______ShowEditorView(NewChecked) {
    if (!NewChecked && $("#desk______controlid_____ table tbody tr:visible").length == 0) {
        return;
    }

    //Trường hợp có thêm điều kiện đặc thù thì sẽ tạo trong html
    if (typeof _____controlid______PrepareToShow === "function" && !_____controlid______PrepareToShow()) {
        return;
    }

    var data = $('#desk______controlid_____').data('screen-info');
    var screenInfo = new Object();

    screenInfo.Id = "_____childcontrolid_____";
    
    screenInfo.Type = "listeditor";
    screenInfo.Dock = _____controlid______Dock;
    screenInfo.ParentId = '_____controlid_____';
    screenInfo.NewChecked = NewChecked;

    screenInfo.View = true;//20230530
    //let extraVar = new Object();
    //extraVar.View = true;
    //screenInfo.ExtraVar = extraVar;
    
    if (data) {
        data = JSON.parse(data);
        screenInfo.Title = data.Title;
        screenInfo.Title_E = data.Title_E;
        screenInfo.DataSource = data.DataSource;
        screenInfo.TabId = data.TabId + '_Editor';
        screenInfo.Callback = screenInfo.TabId + "_OnShow";
    }

    AddTab(screenInfo);
}
//20230530 End: Them nut view

function _____controlid______DisableToolBar(buttons) {
    if (!_____controlid______Right) _____controlid______Right = new Object();
    if (buttons.Add) {
        $("#container______controlid_____ .form-toolbar .button-add").remove();
        _____controlid______Right.Right_2 = false;
    } else {
        _____controlid______Right.Right_2 = true;
    }
    if (buttons.Edit) {
        $("#container______controlid_____ .form-toolbar .button-edit").remove();
        _____controlid______Right.Right_3 = false;
    } else {
        _____controlid______Right.Right_3 = true;
    }
    if (buttons.Delete) {
        $("#container______controlid_____ .form-toolbar .button-delete").remove();
        _____controlid______Right.Right_4 = false;
    } else {
        _____controlid______Right.Right_4 = true;
    }

    buttons.Refresh && $("#container______controlid_____ .form-toolbar .button-refresh").remove();
    buttons.Search && $("#container______controlid_____ .form-toolbar .button-search").remove();
    buttons.Excel && $("#container______controlid_____ .form-toolbar .button-export-excel").remove();    
    buttons.Import && $("#container______controlid_____ .form-toolbar .button-import").remove();
    buttons.QuickSearch && $("#container______controlid_____ .form-toolbar .button-quick-search").remove();//20230807: Bo Tim kiem nhanh
}

async function _____controlid______Loaded(obj) {
    _____controlid______Loading.show();
    // check permision
    let screenInfo = $('#desk______controlid_____').data('screen-info');

    if (screenInfo) {
        screenInfo = JSON.parse(screenInfo)
        if (screenInfo.RightId) {
            $.ajax({
                type: 'GET',
                url: 'api/RightAssignment/Privilege?id=' + screenInfo.RightId + '&type=I',
                async: false,
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    _____controlid______Right = data;
                    if (data.Right_2 == false) {
                        $('#desk______controlid_____ .button-add').removeClass("toolbar-button").addClass("toolbar-button-disabled");
                        $('#desk______controlid_____ .button-import').removeClass("toolbar-button").addClass("toolbar-button-disabled");
                    }
                    if (data.Right_3 == false) {
                        $('#desk______controlid_____ .button-edit').removeClass("toolbar-button").addClass("toolbar-button-disabled");
                    }
                    if (data.Right_4 == false) {
                        $('#desk______controlid_____ .button-delete').removeClass("toolbar-button").addClass("toolbar-button-disabled");
                    }
                    if (data.Right_5 == false) {
                        $('#desk______controlid_____ .button-export-excel').removeClass("toolbar-button").addClass("toolbar-button-disabled");
                    }
                },

                error: function (e) {
                    handleResponseError(_____controlid______AlertMessage,e);
                }
            });
        } else {
            _____controlid______Right = null;
        }
    } 
    
    let rowModel = new Object();
    if (obj !== undefined && obj.ExtraRowModel !== undefined && obj.ExtraRowModel) {
        rowModel = obj.ExtraRowModel;
    }
   
    _____controlid______S3Table.SetOptions({
        HasImage: obj.HasImage,
        //Fields: obj.Fields,
        SortCondition: obj.SortCondition,
        DetailCallback: obj.DetailCallback,
        BuildRowModel: rowModel
    })
    _____controlid______S3Table.Init();

    var model = new Object();
    if (obj !== undefined && obj.ExtraVar !== undefined && obj.ExtraVar) {
        model = obj.ExtraVar;
    }
    model.Code = (obj !== undefined && obj.Code !== undefined ? obj.Code : '');

    _____controlid______OnFilter(model);
}
async function _____controlid______Loaded_Pagination(obj) {
    _____controlid______Loading.show();
    // check permision
    let screenInfo = $('#desk______controlid_____').data('screen-info');

    if (screenInfo) {
        screenInfo = JSON.parse(screenInfo)
        if (screenInfo.RightId) {
            $.ajax({
                type: 'GET',
                url: 'api/RightAssignment/Privilege?id=' + screenInfo.RightId + '&type=I',
                async: false,
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    _____controlid______Right = data;
                    if (data.Right_2 == false) {
                        $('#desk______controlid_____ .button-add').removeClass("toolbar-button").addClass("toolbar-button-disabled");
                        $('#desk______controlid_____ .button-import').removeClass("toolbar-button").addClass("toolbar-button-disabled");
                    }
                    if (data.Right_3 == false) {
                        $('#desk______controlid_____ .button-edit').removeClass("toolbar-button").addClass("toolbar-button-disabled");
                    }
                    if (data.Right_4 == false) {
                        $('#desk______controlid_____ .button-delete').removeClass("toolbar-button").addClass("toolbar-button-disabled");
                    }
                    if (data.Right_5 == false) {
                        $('#desk______controlid_____ .button-export-excel').removeClass("toolbar-button").addClass("toolbar-button-disabled");
                    }
                },

                error: function (e) {
                    handleResponseError(_____controlid______AlertMessage, e);
                }
            });
        } else {
            _____controlid______Right = null;
        }
    }

    let rowModel = new Object();
    if (obj !== undefined && obj.ExtraRowModel !== undefined && obj.ExtraRowModel) {
        rowModel = obj.ExtraRowModel;
    }

    _____controlid______S3Table.SetOptions({
        HasImage: obj.HasImage,
        //Fields: obj.Fields,
        SortCondition: obj.SortCondition,
        DetailCallback: obj.DetailCallback,
        BuildRowModel: rowModel
    })
    _____controlid______S3Table.Init();

    var model = new Object();
    if (obj !== undefined && obj.ExtraVar !== undefined && obj.ExtraVar) {
        model = obj.ExtraVar;
    }
    model.Code = (obj !== undefined && obj.Code !== undefined ? obj.Code : '');

    return _____controlid______OnFilter_Pagination(model);
}

function _____controlid______CtrlEnter() {
    _____controlid______Loading.show();
    _____controlid______OnFilter_Pagination();
   /* _____controlid______OnFilter();*/
}

var _____controlid______Executed = false;
async function _____controlid______OnFilter(filter) {
    return new Promise(function (resolve, reject) {
        if (filter)
            _____controlid______FilterVar = filter;
        
        let menuType = $('#desk______controlid_____ table').attr("menutype");
        $.ajax({
            type: 'POST',
            url: 'api/' + _____controlid______Table + '/Get',
            headers: {
                '3t-action-table': _____controlid______Table,
                '3t-action-menu-type': menuType ? 'N' : 'I'
            },
            //async: false,
            data: JSON.stringify(_____controlid______FilterVar),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (_____controlid______Executed == false) {
                    _____controlid______S3Table.Load(data);
                } else {
                    _____controlid______S3Table.ClusterizeData.column_selected_index = null;
                    _____controlid______S3Table.Refresh(data, true);
                }

                _____controlid______Executed = true;
                _____controlid______S3Table.OnCtrlHome(function () { _____controlid______S3Table.Focus(); });
                _____controlid______Loading.hide();
                resolve();
            },

            error: function (result) {
                _____controlid______Loading.hide();
                handleResponseError(_____controlid______AlertMessage, result, "_____controlid_____");
                resolve();
            }
        });
    });
}


async function _____controlid______OnFilter_Pagination(filter) {
    return new Promise(function (resolve, reject) {
        if (filter)
            _____controlid______FilterVar = filter;

        let menuType = $('#desk______controlid_____ table').attr("menutype");
        $.ajax({
            type: 'POST',
            url: 'api/' + _____controlid______Table + _____controlid______api,
            headers: {
                '3t-action-table': _____controlid______Table,
                '3t-action-menu-type': menuType ? 'N' : 'I'
            },
            //async: false,
            data: JSON.stringify(_____controlid______FilterVar),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (_____controlid______Executed == false) {
                    _____controlid______S3Table.Load(data.Data);
                } else {
                    _____controlid______S3Table.ClusterizeData.column_selected_index = null;
                    _____controlid______S3Table.Refresh(data.Data, true);
                }

                _____controlid______Executed = true;
                _____controlid______S3Table.OnCtrlHome(function () { _____controlid______S3Table.Focus(); });
                _____controlid______Loading.hide();
                resolve(data);
            },

            error: function (result) {
                _____controlid______Loading.hide();
                handleResponseError(_____controlid______AlertMessage, result, "_____controlid_____");
                resolve(null);
            }
        });
    });
}

function _____controlid______OnDelete() {
    if ($('#desk______controlid_____ table tbody tr:visible').length == 0 ||
        ($('#desk______controlid_____ table').attr("type") == 'tree' && _____controlid______S3Table.ClusterizeData.CurrentRowData().IsEnd == false)) {
        return;
    }
     
    _____controlid______AlertMessage.showConfirm(_____controlid______Delete);
}

function _____controlid______OnPrepareToDelete(itistree) {
    let source = function (row, itistree) {
        let model = new Object();
        model.Id = row.Id;
        model.Code = row[_____controlid______TableColumnCode];
        model.ModifiedAt = row.ModifiedAt;

        //Trường hợp có thêm điều kiện đặc thù thì sẽ tạo trong html
        if (typeof _____controlid______PrepareToDelete === 'function') {
            model.Source = _____controlid______PrepareToDelete(row);
        }

        if (itistree) {
            model.ParentId = row.ParentId;
            model.ParentIsEnd = false;
            if (row.ParentId != null && row.ParentId == "") {
                let tree = TreeTableGetAllChildId(_____controlid______S3Table.ClusterizeData.data, row.ParentId);
                tree.shift();

                if (tree.length == 1 && tree[0] == row.Id) {
                    model.ParentIsEnd = true;
                }
            }
        }

        return model;
    }

    let rows = [];
    if (_____controlid______S3Table.ClusterizeData.selected_row_ids.length > 0) {
        _____controlid______S3Table.ClusterizeData.selected_row_ids.forEach((id) => {
            var index = _____controlid______S3Table.ClusterizeData.data.findIndex(function (o) {
                return o.Id === id;
            });
            rows.push(source(_____controlid______S3Table.ClusterizeData.data[index], itistree));
        });
    } else {
        rows.push(source(_____controlid______S3Table.ClusterizeData.CurrentRowData(), itistree));
    }

    return rows;
}

function _____controlid______Delete() {
    _____controlid______Loading.show();

    let itistree = $('#desk______controlid_____ table').attr("type") == 'tree';
    let menuType = $('#desk______controlid_____ table').attr("menutype");
    let rows = _____controlid______OnPrepareToDelete(itistree);
    $.ajax
        ({
            type: 'DELETE',
            url: 'api/' + _____controlid______Table + '/Delete',
            headers: {
                '3t-action-table': _____controlid______Table,
                '3t-action-menu-type': menuType ? 'N' : 'I'
            },
            data: JSON.stringify(rows),
            //async: false,
            contentType: 'application/json; charset =utf-8',
            success: function (data) {
                if (data.Data.length > 0) {
                    ShowNotification('Thành công!', 'success');
                    _____controlid______S3Table.Delete(data.Data);
                }

                if (rows.length == 1) {
                    data.Data.length != rows.length && handleResponseApiCode(_____controlid______AlertMessage, data);
                } else {
                    data.Data.length == rows.length ? _____controlid______AlertMessage.showInfo('Common_Msg_ProcessDone') : _____controlid______AlertMessage.showError('Common_Msg_ProcessNotDone');
                }

                _____controlid______Loading.hide();
            },

            error: function (result) {
                _____controlid______Loading.hide();
                handleResponseError(_____controlid______AlertMessage, result);
            }
        });
}

function _____controlid______Import() {
    let xlsFile = $("#desk______controlid_____ .popup-modal-background>div[child-form='importdata'] .xlsFile");

    if (xlsFile[0].files.length == 0) {
        _____controlid______AlertMessage.showInfo('Common_Msg_NoFileToImport');
        return;
    }

    if (xlsFile[0].files.length > 0) {
        _____controlid______Loading.show();

        if (typeof (FileReader) != "undefined") {
            let reader = new FileReader();
            let ExcelIntoJson = function (data) {
                //Read the Excel File data in binary
                let workbook = XLSX.read(data, {
                    type: 'binary'
                });

                //get the name of First Sheet.
                let Sheet = workbook.SheetNames[0];

                //Read all rows from First Sheet into an JSON array.
                let datain = ExcelFomularToArray(XLSX.utils.sheet_to_formulae(workbook.Sheets[Sheet]))
                
                //No data
                if (datain == null || datain.length == 0) {                    
                    _____controlid______Loading.hide();
                    _____controlid______AlertMessage.showInfo('Common_Msg_NoData');
                    return;
                }                

                //Delete first row
                //datain.shift();

                //Read all rows from First Sheet into an JSON array.
                datain = _____controlid______ParseExcelData(datain);                
                //alert(datain);//

                if (datain == null || datain.length == 0) {                    
                    _____controlid______Loading.hide();
                    _____controlid______AlertMessage.showInfo('Common_Msg_NoData');
                    return;
                }

                //Send to database
                let method = $("#desk______controlid_____ .popup-modal-background>div[child-form='importdata'] .MethodImport").value() == '1';
                $.ajax
                    ({
                        type: 'POST',
                        url: 'api/' + _____controlid______Table + '/Import?isAll=' + method,
                        data: JSON.stringify(datain),
                        async: false,
                        contentType: 'application/json; charset =utf-8',
                        success: function (dataout) {
                            if (dataout.Code == 1) { //Có dòng mới được cập nhật
                                _____controlid______Modal_Close();

                                setTimeout(function () {
                                    (async () => {
                                        await _____controlid______OnFilter();
                                        _____controlid______Loading.hide();
                                        _____controlid______AlertMessage.showInfo('Common_Msg_ProcessDone');
                                    })();
                                }, 0);
                            } else if (dataout.Code == 2) { //Không cập nhật được dòng nào
                                _____controlid______Loading.hide();
                            } else { //Có lỗi xảy ra
                                _____controlid______Loading.hide();
                                handleResponseApiCode(_____controlid______AlertMessage, dataout);
                            }
                        },

                        error: function (result) {
                            _____controlid______Loading.hide();
                            handleResponseError(_____controlid______AlertMessage, result);
                        }
                    });
            };

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    ExcelIntoJson(e.target.result);
                };
                reader.readAsBinaryString(xlsFile[0].files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    ExcelIntoJson(data);
                };
                reader.readAsArrayBuffer(xlsFile[0].files[0]);
            }
        }
    }
}
