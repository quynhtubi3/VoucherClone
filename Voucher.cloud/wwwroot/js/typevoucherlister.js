/* Điều khiển cửa sổ danh sách danh mục */
var _____controlid______Loading = new ItpOverlay("container______controlid_____", "partial-loading");
var _____controlid______AlertMessage = new AlertMessage("container______controlid_____");
var _____controlid______Right1;//edit
var _____controlid______Right2;//remove
var _____controlid______Right3;//privilege
var _____controlid______S3Table = new S3ttable({
    Id: "_____controlid______ScrollArea",
    ClusterizeData: ClusterizeData(),
    BuildRow: _____htmlid______BuildRow,
    Callbacks: {
        ClusterChanged: function () {
            buildToolTip($('#desk______controlid_____ .s3t-tooltip'));            
        }
    }
});


$(function () {

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
        if (typeof TableColumnFilter_ResetFilter != "undefined") TableColumnFilter_ResetFilter('_____controlid_____');
    });

    $('#desk______controlid_____ .form-toolbar .button-add').on('click', function (e) {
        _____controlid______ShowEditor(true);
    });

    $('#desk______controlid_____ .form-toolbar .button-delete').on('click', function (e) {
        _____controlid______Right2 == true && _____controlid______OnDelete();
    });

    $('#desk______controlid_____ .form-toolbar .button-refresh').on('click', function (e) {
        _____controlid______OnLoad();
    });

    $('#desk______controlid_____ .form-toolbar .button-edit').on('click', function (e) {
        _____controlid______Right1 == true && _____controlid______S3Table.ClusterizeData.current_row_id && _____controlid______ShowEditor(false);
    });

    $('#desk______controlid_____ .form-toolbar .button-role').on('click', function (e) {
        let data = $('#desk______controlid_____').data('screen-info');
        let screenInfo = new Object();

        screenInfo.Id = "ManagerRoleLister";
        screenInfo.Type = "userlister";
        screenInfo.Dock = "full";
        screenInfo.ParentId = '_____controlid_____';
        screenInfo.ChildId = 'ManagerRoleEditor';
        if (data) {
            data = JSON.parse(data);
            screenInfo.TabId = data.TabId + '_Role';
        }
        AddTab(screenInfo);
    });

    $('#desk______controlid_____ .form-toolbar .button-right').on('click', function (e) {
        if (_____controlid______Right3 != true) return;
        let data = $('#desk______controlid_____').data('screen-info');
        let row = _____controlid______S3Table.ClusterizeData;
        if (row && row != null && row.current_row_id) {
            var screenInfo = new Object();

            screenInfo.Id = "RightAssignment";
            screenInfo.Type = "listeditor";
            screenInfo.Dock = "none";
            screenInfo.TabType = _____controlid______Type;
            if (data) {
                data = JSON.parse(data);
                screenInfo.TabId = data.TabId + '_Right';
            }
            screenInfo.Callback = screenInfo.TabId + "_OnShow";
            screenInfo.ParentId = '_____controlid_____';
            screenInfo.NewChecked = false;

            AddTab(screenInfo);
        }
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

    $('#desk______controlid_____ .form-container').on('keydown', function (e) {
        switch (e.keyCode) {
            case 113: //F2
                e.preventDefault();
                _____controlid______ShowEditor(true);

                break;

            case 114: //F3
                e.preventDefault();
                _____controlid______Right1 == true && _____controlid______S3Table.ClusterizeData.current_row_id && _____controlid______ShowEditor(false);

                break;

            case 119: //F8
                e.preventDefault();
                _____controlid______Right2 == true && _____controlid______OnDelete();

                break;
        }
    });

    $('#desk______controlid_____').on('dblclick', 'table tbody tr', function (e) {
        _____controlid______Right1 == true && _____controlid______ShowEditor(false);
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

    _____controlid______S3Table.Init();
    initTextSearch($('#desk______controlid_____ .text-search'));
    _____controlid______OnLoad();
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
    var data = $('#desk______controlid_____').data('screen-info');
    var screenInfo = new Object();
    screenInfo.Id = "_____childcontrolid_____";
    screenInfo.Type = "listeditor";
    screenInfo.Dock = "none";
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

    AddTab(screenInfo);
}
