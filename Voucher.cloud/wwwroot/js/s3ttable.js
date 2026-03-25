"use strict";

class S3ttable {
    constructor(options = {}) {
        this.options = Object.assign({}, this.defaultConfig, options);
        this.parent = $("#" + this.options.Id);
        this.scroll = $("#" + this.options.Id);
        this.table = $(this.parent.find("table"));
        this.ClusterizeData = this.options.ClusterizeData;
        this.options.Key = this.ClusterizeData.PrimaryKey;
        this.Clusterize = null;
    }

    Init() {
        this.MakeHeaderList();
        this.BuildQuickSearch();
        this.BuildHeader();
        $(document)
            .off("mouseenter", ".s3tcloud-prefix table tr")
            .on("mouseenter", ".s3tcloud-prefix table tr", function () {
                let $tr = $(this);
                let rowspan = parseInt($tr.find("th[rowspan], td[rowspan]").attr("rowspan")) || 1;
                let index = $tr.index();
                let $tbody = $tr.closest("tbody");

                for (let i = 0; i < rowspan; i++) {
                    $tbody.find("tr").eq(index + i).addClass("hovered");
                }
            })
            .off("mouseleave", ".s3tcloud-prefix table tr")
            .on("mouseleave", ".s3tcloud-prefix table tr", function () {
                $(".s3tcloud-prefix table tr.hovered").removeClass("hovered");
            });
    }

    Load(data) {
        let _self = this;
        let rows = [];

        //Clear old data
        _self.ClusterizeData.data = [];
        _self.ClusterizeData.row_data = [];
        _self.ClusterizeData.row_data_id = [];
        _self.ClusterizeData.data_filter = [];

        if (data != null && data.length != 0) {
            _self.ClusterizeData.data = _self.table.attr("type") == "tree" ? _self.BuildClusterizeBinaryTree(data) : _self.options.SortCondition == null ? data : data.sort(_self.options.SortCondition);
            _self.ClusterizeData.row_data = [];
            _self.ClusterizeData.row_data_id = [];
            _self.ClusterizeData.data_filter = [];

            _self.ClusterizeData.data.forEach((row) => {
                if (row.RowState != 3) {
                    _self.options.BuildRowModel.row = row;
                    _self.ClusterizeData.row_data_id.push(row[_self.options.Key]);
                    _self.ClusterizeData.row_data.push(_self.options.BuildRow(_self.options.BuildRowModel));
                    _self.ClusterizeData.data_filter.push(row);
                }
            });
            rows = _self.ClusterizeData.row_data;
        }
        if (_self.options.FocusFirst == false) _self.ClusterizeData.current_row_id = '';

        let clusterBaseEvent = function () {
            _self.BuildCells();
            _self.BuildTextSearch();
            _self.BuildLoHangSearch();
            _self.BuildTextOption();
            _self.SelectRowHeader();
            _self.ResetGrip();
            if (_self.options.HasImage == true)
                buildToolTipImage(_self.table.find('tbody .cell-image'));
            if (_self.table.attr("type") == "tree")
                _self.BuildTreeToggle(_self.table.find('tbody tr'));            
            _self.options.Callbacks.ClusterChanged && _self.options.Callbacks.ClusterChanged();

            //build by user
            if (_self.ColumnHeaders != undefined && _self.ColumnHeaders.length > 0) {
                _self.ColumnHeaders.forEach(function (value) {
                    if (value.LastHide) {
                        //set hide to body cell
                        $('td:nth-of-type(' + (value.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).addClass('hide');
                        $('td:nth-of-type(' + (value.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).attr('hide', true);
                    } else if (!value.LastHide && value.UsedInCodeOnly) {
                        //remove hide to body cell
                        $('td:nth-of-type(' + (value.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).removeClass('hide');
                        $('td:nth-of-type(' + (value.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).removeAttr('hide');
                    }
                });
            }
        };

        let focusMidTable = function (index, type) {
            if (typeof index == 'number') {
                if (_self.table.find("tbody tr.selected").length == 0) {
                    setTimeout(function () {
                        if (S3TTableRowHeight * index > _self.scroll[0].scrollHeight - S3TScrollBarWidth - _self.scroll.outerHeight()) {
                            _self.scroll[0].scrollTop = _self.scroll[0].scrollHeight - _self.scroll.outerHeight();
                        } else {
                            _self.scroll[0].scrollTop = S3TTableRowHeight * index;
                        }
                    }, 0);
                } else {
                    setTimeout(function () {
                        let tableBodyHeight = _self.scroll.outerHeight() - _self.table.find("thead td").outerHeight();
                        let tableBodyStartTop = _self.table.find("thead td").offset().top + _self.table.find("thead td").outerHeight();
                        let tableBodyEndTop = tableBodyStartTop + tableBodyHeight;
                        if (_self.table.find("tbody tr.selected").offset().top < tableBodyStartTop || _self.table.find("tbody tr.selected").offset().top + (type == "Add" ? S3TTableRowHeight : 0) > tableBodyEndTop) {
                            let midTable = Math.floor(Math.floor(tableBodyHeight / S3TTableRowHeight) / 2);
                            _self.scroll[0].scrollTop = S3TTableRowHeight * (index - midTable);
                        }
                    }, 0);
                }
            }
        }
        _self.Clusterize = new Clusterize({
            rows: rows,
            scrollId: _self.options.Id,
            contentId: _self.parent.find("tbody").attr("id"),
            clusterize_S3Table: _self,
            clusterize_data: _self.ClusterizeData,
            callbacks: {
                ClusterAdded: function (index) {
                    if (_self.FocusModel != null && _self.FocusModel.HasFocus == false) {
                        _self.FocusModel = null;
                    }
                    _self.Focus();
                    clusterBaseEvent();
                    _self.options.DetailCallback && _self.options.DetailCallback();
                    focusMidTable(index, "Add");
                },
                ClusterUpdated: function (index) {
                    if (_self.FocusModel != null && _self.FocusModel.HasFocus == false) {
                        _self.FocusModel = null;
                    } else {
                        _self.Focus();
                    }
                    clusterBaseEvent();
                    _self.options.UpdateCallback && _self.options.UpdateCallback();
                    _self.scroll.find(".clusterize-content").attr("event-trigger", "Update");
                    focusMidTable(index, "Update");
                },
                ClusterRefresh: function (callDetail) {
                    if (_self.FocusModel != null && _self.FocusModel.HasFocus == false) {
                        _self.FocusModel = null;
                    } else {
                        _self.Focus(_self.options.DefaultFocus);
                    }
                    clusterBaseEvent();

                    if (callDetail == true) _self.options.DetailCallback && _self.options.DetailCallback();
                    
                    if (_self.options.FocusFirst == false) {
                        setTimeout(function () {
                            _self.scroll[0].scrollTop = _self.scroll[0].scrollHeight;
                            _self.scroll[0].scrollLeft = 0;
                            _self.scroll.find(".clusterize-content").attr("event-trigger", "Refresh");
                        });
                    }
                },
                ClusterUpdateRow: function (element, idle) {
                    clusterBaseEvent();
                    _self.options.UpdateCallback && _self.options.UpdateCallback();
                    if (idle == true && element) {
                        let id = $(element).attr('id');
                        element = $("#" + id);
                        if (!$(element).is(":focus")) {
                            element.focus();
                        }
                    } else if ($(element).hasClass("text-select")) {
                        let id = $(element).attr('id');
                        element = $("#" + id);
                        _self.ClusterizeData.column_selected_index = $($(element).closest("td")).siblings(":visible").addBack().index($(element).closest("td"));
                        _self.Focus();
                    }
                },
                ClusterChanged: function () {
                    if (_self.FocusModel != null && _self.FocusModel.HasFocus == false) {
                        _self.FocusModel = null;
                    } else {
                        _self.Focus();
                    }
                    clusterBaseEvent();
                },
                ClusterSearch: function () {                    
                    clusterBaseEvent();
                    let elements = _self.table.find('tbody tr th');
                    for (var i = 0; i < elements.length; i++) {
                        let rowId = $(elements[i]).attr('clusterize_row_id');
                        if (rowId == _self.ClusterizeData.current_row_id) {
                            $(elements[i]).parent().children(':visible').eq(_self.ClusterizeData.column_selected_index).addClass('active');
                            _self.table.find(".row-focus").remove();
                            $(elements[i]).closest('tr').find("th").prepend('<div class="row-focus" onmouseup="RowFocusMouseUp()" style="float: left;"><i class="glyphicon glyphicon-triangle-right"></i></div>');
                            break;
                        }
                    }
                },
                ClusterLoaded: function () {
                    if (_self.FocusModel != null && _self.FocusModel.HasFocus == false) {
                        _self.FocusModel = null;
                    } else {
                        _self.Focus(_self.options.DefaultFocus);
                    }
                    _self.Resize();
                    clusterBaseEvent();
                    _self.options.DetailCallback && _self.options.DetailCallback();
                    if (_self.options.FocusFirst == false) {
                        setTimeout(function () {
                            _self.scroll[0].scrollTop = _self.scroll[0].scrollHeight;
                            _self.scroll[0].scrollLeft = 0;
                            _self.scroll.find(".clusterize-content").attr("event-trigger", "Loaded");
                        });
                    }
                }
            }
        });
    }

    Refresh(data, callDetail) {
        let _self = this;
        let rows = [];
        if (data != null) {
            _self.ClusterizeData.data = _self.table.attr("type") == "tree" ? _self.BuildClusterizeBinaryTree(data) : _self.options.SortCondition == null ? data : data.sort(_self.options.SortCondition);
            _self.ClusterizeData.row_data = [];
            _self.ClusterizeData.row_data_id = [];
            _self.ClusterizeData.data_filter = [];

            _self.ClusterizeData.data.forEach((row) => {
                if (row.RowState != 3) {
                    _self.options.BuildRowModel.row = row;
                    _self.ClusterizeData.row_data_id.push(row[_self.options.Key]);
                    _self.ClusterizeData.row_data.push(_self.options.BuildRow(_self.options.BuildRowModel));
                    _self.ClusterizeData.data_filter.push(row);
                }
            });
            rows = _self.ClusterizeData.row_data;
            _self.Clusterize.refreshView(rows, callDetail);
        }
    }

    RefreshFilter(data) {
        let _self = this;
        let rows = [];
        if (data != null) {
            _self.ClusterizeData.data_filter = data;
            _self.ClusterizeData.row_data = [];

            _self.ClusterizeData.data_filter.forEach((row) => {
                _self.options.BuildRowModel.row = row;
                _self.ClusterizeData.row_data.push(_self.options.BuildRow(_self.options.BuildRowModel));
                _self.ClusterizeData.data_filter.push(row);
            });
            rows = _self.ClusterizeData.row_data;
            _self.Clusterize.refreshView(rows);
        }
    }

    Clear() {
        let _self = this;
        this.ClusterizeData.data = [];
        this.ClusterizeData.row_data = [];
        this.ClusterizeData.row_data_id = [];
        this.ClusterizeData.data_filter = [];
        this.ClusterizeData.column_selected_index = null;
        this.ClusterizeData.current_row_id = "";

        this.Clusterize && this.Clusterize.clear();
    }

    ClearFocus() {
        let td = this.table.find("tbody td");
        td.removeClass("active");
        td.removeClass("active-nobg");
        td.removeClass("cell-selected");
        let th = this.table.find("tbody th");
        th.removeClass("active");
        th.removeClass("active-nobg");
        th.removeClass("cell-selected");
        let tr = this.table.find("tbody tr.selected");
        tr.removeClass("active"); 
        tr.removeClass("selected"); 
        this.ClusterizeData.column_selected_index = null;
        //this.ClusterizeData.current_row_id = "";
    }

    FocusInput(allowMoveNext, id) {
        let element = $('#' + id);
        element.attr("validate-allow-move-next", allowMoveNext);
        $(element).removeAttr('validate-allow-move-next-1st');
        //currentInvalidateElement = null;//for work arround
        //element.focus();
        if (element.hasClass("text-number")) {
            $(element).attr('oldnumericvalue', $(element).attr('numericvalue'));
        } else {
            $(element).attr('oldvalue', $(element).val());
        }

        $(element).closest('td').removeClass('active-nobg');
        //this.Update(this.ClusterizeData.ElementRowData(element), element, true);
    }

    async BlurInput(element) {
        if ($(element).hasClass("text-search")) $(element).closest('td').find(".input-group-add-button").hide();
        if ($(element).hasClass("text-date") && $(element).value() == null) $(element).val("");
        if ($(element).attr("no-exec-blur") != "true") {
            await InputBlurHandle(element);
        }
        $(element).attr("no-exec-blur", false);
    }

    Add(row) {
        let _self = this;
        _self.ClusterizeData.data.push(row);
        _self.ClusterizeData.current_row_id = row[_self.options.Key];
        _self.ClusterizeData.RowStateAdded(row[_self.options.Key]);
        _self.ClusterizeData.data = _self.table.attr("type") == "tree" ? _self.BuildClusterizeBinaryTree(_self.ClusterizeData.data) : _self.options.SortCondition == null ? _self.ClusterizeData.data : _self.ClusterizeData.data.sort(_self.options.SortCondition);
        _self.ClusterizeData.data_filter = JSON.parse(JSON.stringify(_self.ClusterizeData.data));//Deep clone
        let data = _self.ClusterizeData.data.filter(function (row) {
            return row.RowState != 3;
        });
        let index = data.findIndex(function (o) {
            return o[_self.options.Key] == row[_self.options.Key];
        })
        
        _self.options.BuildRowModel.row = row;
        _self.ClusterizeData.row_data.splice(index, 0, _self.options.BuildRow(_self.options.BuildRowModel)); 
        _self.ClusterizeData.row_data_id.splice(index, 0, row[_self.options.Key]);   
        _self.FocusModel = null;
        _self.FocusModel = new Object();
        _self.FocusModel.HasFocus = _self.HasFocus();
        _self.table.attr("type") == "tree" ? _self.Refresh(_self.ClusterizeData.data) : _self.Clusterize.add(_self.ClusterizeData.row_data, index);
    }

    Update(row, element, idle) {
        if (row == null) return;
        let _self = this;
        let index = _self.ClusterizeData.data.findIndex(function (o) {
            return o[_self.options.Key] == row[_self.options.Key];
        })
        if (index > -1) {
            Object.keys(row).forEach(function (value) {
                _self.ClusterizeData.data[index][value] = row[value];
            });

            if (_self.options.SortCondition != null)
                _self.ClusterizeData.data = _self.ClusterizeData.data.sort(_self.options.SortCondition);

            _self.ClusterizeData.data = _self.table.attr("type") == "tree" ? _self.BuildClusterizeBinaryTree(_self.ClusterizeData.data) : _self.ClusterizeData.data;
            _self.ClusterizeData.row_data = [];
            _self.ClusterizeData.row_data_id = [];
            _self.ClusterizeData.data_filter = [];

            _self.ClusterizeData.data.forEach((row) => {
                if (row.RowState != 3) {
                    _self.options.BuildRowModel.row = row;
                    _self.ClusterizeData.row_data.push(_self.options.BuildRow(_self.options.BuildRowModel));
                    _self.ClusterizeData.row_data_id.push(row[_self.options.Key]);
                    _self.ClusterizeData.data_filter.push(row);
                }
            });

            index = _self.ClusterizeData.data.findIndex(function (o) {
                return o[_self.options.Key] == row[_self.options.Key];
            })
            _self.FocusModel = null;
            if (_self.table.attr("type") == "tree") {
                _self.Clusterize.forceUpdate(_self.ClusterizeData.row_data, index);
            } else {
                if (_self.options.DeskId && _self.options.DeskId.length > 0) {
                    _self.FocusModel = new Object();
                    _self.FocusModel.HasFocus = _self.HasFocus();
                    _self.Clusterize.updateRow(_self.ClusterizeData.row_data[index], element, index, idle);
                } else {
                    _self.Clusterize.forceUpdate(_self.ClusterizeData.row_data, index);
                }
            }
        }
    }

    Delete(rows) {
        let _self = this;
        let index = 0;
        if (Object.prototype.toString.call(rows) == '[object Array]') {
            for (var i = 0; i < rows.length; i++) {
                index = _self.ClusterizeData.data.findIndex(function (o) {
                    return o[_self.options.Key] == rows[i];
                });

                _self.ClusterizeData.data.splice(index, 1);
                _self.ClusterizeData.row_data.splice(index, 1);
                _self.ClusterizeData.row_data_id.splice(index, 1);
            }
        } else {
            index = _self.ClusterizeData.data.findIndex(function (o) {
                return o[_self.options.Key] == rows;
            });

            _self.ClusterizeData.data.splice(index, 1);
            _self.ClusterizeData.row_data.splice(index, 1);
            _self.ClusterizeData.row_data_id.splice(index, 1);
        }
        
        let type = _self.table.attr("type") == 'tree';
        if (type) {
            _self.ClusterizeData.data = _self.BuildClusterizeBinaryTree(_self.ClusterizeData.data);
            _self.ClusterizeData.row_data = [];
            _self.ClusterizeData.row_data_id = [];
            _self.ClusterizeData.data_filter = [];

            _self.ClusterizeData.data.forEach((row) => {
                _self.options.BuildRowModel.row = row;
                _self.ClusterizeData.row_data.push(_self.options.BuildRow(_self.options.BuildRowModel));
                _self.ClusterizeData.row_data_id.push(row[_self.options.Key]);
                _self.ClusterizeData.data_filter.push(row);
            });
        }
        _self.FocusModel = null;
        _self.FocusModel = new Object();
        _self.FocusModel.HasFocus = _self.HasFocus();        
        _self.ClusterizeData.selected_row_ids = [];
        _self.ClusterizeData.ResetCurrentRowId(index);
        _self.Clusterize.forceUpdate(_self.ClusterizeData.row_data, index);

        //_self.Focus();
        _self.options.DetailCallback && _self.options.DetailCallback();
    }

    DeleteRow(element, notFocus) {
        let _self = this;
        let id = element.find("th").attr("clusterize_row_id");
        let index = _self.ClusterizeData.row_data_id.findIndex(function (o) {
            return o == id;
        });
        
        _self.ClusterizeData.row_data_id.splice(index, 1);
        _self.ClusterizeData.row_data.splice(index, 1);
        _self.ClusterizeData.data_filter.splice(index, 1);
        _self.ClusterizeData.selected_row_ids = [];
        _self.ClusterizeData.RowStateDeleted(id);  
        _self.ClusterizeData.ResetCurrentRowId(index);        
          
        element.remove();
        if(notFocus != true)
            _self.Focus();
    }

    DeleteSelectedRow()
    {//20230905: Xoa dong da chon
        let _self = this;

        let row = _self.table.find('tbody tr.selected:first');

        let id = row.find("th").attr("clusterize_row_id");
        let index = _self.ClusterizeData.row_data_id.findIndex(function (o) {
            return o == id;
        });

        _self.ClusterizeData.row_data_id.splice(index, 1);
        _self.ClusterizeData.row_data.splice(index, 1);
        _self.ClusterizeData.data_filter.splice(index, 1);
        _self.ClusterizeData.selected_row_ids = [];
        _self.ClusterizeData.RowStateDeleted(id);
        _self.ClusterizeData.ResetCurrentRowId(index);

        row.remove();
    }

    BuildClusterizeBinaryTree(data) {
        let _self = this;
        let originalData = [];
        let treeData = [];
        let currentData = data.sort(_self.options.SortCondition);

        $.map(currentData, function (item, index) {
            if (item.ParentId == "") {
                item.Level = 0;
                treeData.push(item);
            }
            originalData.push(item);
        });
        $.map(treeData, function (item) {
            var index = currentData.findIndex(function (o) {
                return o[_self.options.Key] == item[_self.options.Key];
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
                    if (current.ParentId == root[_self.options.Key]) {
                        var index = treeData.findIndex(function (o) {
                            return o[_self.options.Key] == root[_self.options.Key];
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
                    return o[_self.options.Key] == item[_self.options.Key];
                })
                currentData.splice(index, 1);
            });
        }
        for (var i = 0; i < treeData.length; i++) {
            if (i == treeData.length - 1) {
                treeData[i].IsEnd = true;
                break;
            }
            if (treeData[i][_self.options.Key] == treeData[i + 1].ParentId) {
                treeData[i].IsEnd = false;
            } else {
                treeData[i].IsEnd = true;
            }
        }
        return treeData;
    }

    SetOptions(options) {
        this.options = Object.assign({}, this.options, options);
    }

    SetPrimaryKey(key) {
        this.ClusterizeData.SetPrimaryKey(key);
        this.options.Key = key;
    }

    BuildHeader() {
        let _self = this;

        //build flag
        if (ApplicationInstance.Systemvar.MainLanguageId) {
            $('thead th.main-language', _self.table).each(function () {
                $(this).html("<div style='margin:auto; position:relative; width:18px; height:12px; display:block; overflow:hidden;'><img s3t-image-lang=true style='position:absolute; top:0; left:0; width:100%;' src='../img/" + ApplicationInstance.Systemvar.MainLanguageId + ".png' /></div>");
            });
        }

        if (ApplicationInstance.Systemvar.SubLanguageId) {
            $('thead th.sub-language', _self.table).each(function () {
                $(this).html("<div style='margin:auto; position:relative; width:18px; height:12px; display:block; overflow:hidden;'><img s3t-image-lang=true style='position:absolute; top:0; left:0; width:100%;' src='../img/" + ApplicationInstance.Systemvar.SubLanguageId + ".png' /></div>");
            });
        }

        //show/hide to body cell by detail or sub-detail
        if (_self.options.SubTable == true) {
            let _showsubtable = eval(_self.options.DeskId + "_IsShowSubTable");

            _self.ColumnHeaders
                .filter(cell => $(cell.Control).hasClass('detail-table') || $(cell.Control).hasClass('sub-detail-table'))
                .forEach((cell) => {
                    if (_showsubtable) {
                        if ($(cell.Control).hasClass('detail-table')) {
                            if ($(cell.Control).hasClass('main-language') || $(cell.Control).hasClass('sub-language')) {
                                this.TranslateHeaderCell(cell);
                            } else {
                                cell.LastHide = false;
                                $(cell.Control).removeClass('hide').css('display', '');
                                $($('colgroup col', _self.table)[cell.ColIndex + 1]).removeClass('hide').css('display', '');
                                $($('colgroup col', _self.table)[cell.ColIndex + 1]).attr('width', cell.LastWidth);
                            }
                        } else {
                            cell.LastHide = true;
                            $(cell.Control).addClass('hide');
                            $($('colgroup col', _self.table)[cell.ColIndex + 1]).addClass('hide');
                            $($('colgroup col', _self.table)[cell.ColIndex + 1]).attr('width', 0);
                        }
                    } else {
                        if ($(cell.Control).hasClass('detail-table')) {
                            cell.LastHide = true;
                            $(cell.Control).addClass('hide');
                            $($('colgroup col', _self.table)[cell.ColIndex + 1]).addClass('hide');
                            $($('colgroup col', _self.table)[cell.ColIndex + 1]).attr('width', 0);
                        } else {
                            if ($(cell.Control).hasClass('main-language') || $(cell.Control).hasClass('sub-language')) {
                                this.TranslateHeaderCell(cell);
                            } else {
                                cell.LastHide = false;
                                $(cell.Control).removeClass('hide').css('display', '');
                                $($('colgroup col', _self.table)[cell.ColIndex + 1]).removeClass('hide').css('display', '');
                                $($('colgroup col', _self.table)[cell.ColIndex + 1]).attr('width', cell.LastWidth);
                            }
                        }
                    }
                });
        } else {
            //show/hide to header cell by language
            _self.ColumnHeaders
                .filter(cell => $(cell.Control).hasClass('main-language') || $(cell.Control).hasClass('sub-language'))
                .forEach((cell) => {
                    this.TranslateHeaderCell(cell);
                });
        }

        //show/hide filter and sort button
        $('thead th', _self.table)
            .removeAttr('mousemove')
            .removeAttr('mouseout')
            .mousemove(function (e) {
                $('.table-header-filter, .table-header-sort', $(this)).show();
            })
            .mouseout(function () {
                if (!$('.table-header-filter', $(this)).is('[selectedvalues]') || $('.table-header-filter', $(this)).attr('selectedvalues') == '')
                    $('.table-header-filter', $(this)).hide();

                if (!$('.table-header-sort', $(this)).is('.table-header-sort-asc, .table-header-sort-desc'))
                    $('.table-header-sort', $(this)).hide();
            })
            .removeAttr('mousedown')
            .mousedown(function (e) {
                if ($(e.target).hasClass("table-header-filter") || $(e.target).hasClass("table-header-sort")) {
                    _self.ClusterizeData.selected_column_ids = [];
                    return;
                }
                if (e.button === 0 && $(this).attr('colname')) {
                    _self.ClusterizeData.selected_column_ids = [];
                    let th = this;                    
                    let index = _self.ColumnHeaders.filter(x => !x.Control.hasClass("hide") && (x.Control.attr("colspan") == undefined || x.Control.attr("colspan") == "1")).findIndex(function (o) {
                        return $(o.Control).is(th);
                    })
                    _self.table.find("tbody tr").removeClass("selected");
                    let td = _self.table.find("tbody td");
                    td.removeClass("active");
                    td.removeClass("active-nobg");
                    td.removeClass("cell-selected");
                    th = _self.table.find("tbody th");
                    th.removeClass("active");
                    th.removeClass("active-nobg");
                    th.removeClass("cell-selected");
                    
                    let trs = _self.table.find("tbody").find("tr");
                    trs.each(function () {
                        $(this).find("td:not(.hide)").eq(index).addClass("cell-selected");
                    })
                    
                    _self.ClusterizeData.data.forEach((row) => {
                        _self.ClusterizeData.selected_column_ids.push(row[_self.options.Key]);
                    });
                    _self.ClusterizeData.selected_row_ids = [];
                    _self.ClusterizeData.column_selected_index = index;
                }
            });

        //add filter/sort button
        $('thead th', _self.table).each(function () {
            if (!$(this).attr('filterable') || $(this).attr('filterable') == "true") {
                let filterbutton = document.createElement('div');
                filterbutton.className = 'table-header-filter';
                filterbutton.onclick = function () {
                    _self.ShowFilter(this);                    
                };

                $(this).append(filterbutton);
            }

            if ($(this).attr('sortdirection') != "none") {
                var sortedbutton = document.createElement('div');
                sortedbutton.className = 'table-header-sort';

                if ($(this).attr('sortdirection') == "asc") {
                    sortedbutton.classList.add('table-header-sort-asc');
                    sortedbutton.style.display = "block";
                } else if ($(this).attr('sortdirection') == "desc") {
                    sortedbutton.classList.add('table-header-sort-desc');
                    sortedbutton.style.display = "block";
                }
                
                sortedbutton.onclick = function () { _self.OnSort(this) };

                $(this).append(sortedbutton);
            }
        });

        this.ResetRowspan();
        this.TranslateRow();
        this.BuildColumn(this.GetBrowserZoomLevel());
    }

    Translate() {
        this.BuildHeader();
    }

    TranslateRow() {
        let _self = this;

        //show/hide to body cell by detail or sub-detail
        if (_self.options.SubTable == true) {
            let _showsubtable = eval(_self.options.DeskId + "_IsShowSubTable");

            _self.ColumnHeaders
                .filter(cell => $(cell.Control).hasClass('detail-table') || $(cell.Control).hasClass('sub-detail-table'))
                .forEach((cell) => {
                    if (_showsubtable) {
                        if ($(cell.Control).hasClass('detail-table')) {
                            if ($(cell.Control).hasClass('main-language') || $(cell.Control).hasClass('sub-language')) {
                                this.TranslateBodyCell(cell);
                            } else {
                                cell.LastHide = false;
                                $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).removeClass('hide').css('display', '');
                                $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).removeAttr('hide')
                            }
                        } else {
                            cell.LastHide = true;
                            $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).addClass('hide');
                            $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).attr('hide', true);
                        }
                    } else {
                        if ($(cell.Control).hasClass('detail-table')) {
                            cell.LastHide = true;
                            $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).addClass('hide');
                            $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).attr('hide', true);
                        } else {
                            if ($(cell.Control).hasClass('main-language') || $(cell.Control).hasClass('sub-language')) {
                                this.TranslateBodyCell(cell);
                            } else {
                                cell.LastHide = false;
                                $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).removeClass('hide').css('display', '');
                                $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).removeAttr('hide');
                            }
                        }
                    }
                });
        } else {
            //show/hide to body cell by language
            _self.ColumnHeaders
                .filter(cell => $(cell.Control).hasClass('main-language') || $(cell.Control).hasClass('sub-language'))
                .forEach((cell) => {
                    this.TranslateBodyCell(cell);
                });
        }
    }

    TranslateHeaderCell(cell) {
        let _self = this;

        if (ApplicationInstance.Uservar.BillingualLanguage == 2) { /* Song ngữ */
            cell.LastHide = false;
            $(cell.Control).removeClass('hide').css('display', '');
            $($('colgroup col', _self.table)[cell.ColIndex + 1]).removeClass('hide').css('display', '');
            $($('colgroup col', _self.table)[cell.ColIndex + 1]).attr('width', cell.LastWidth);

            //mother
            $(cell.ParentHeader.Control).attr("filterable", false);
            $(cell.ParentHeader.Control).attr("sortdirection", "none");
            $(cell.ParentHeader.Control).removeAttr("colname");
        } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
            if ($(cell.Control).hasClass('main-language')) {
                cell.LastHide = false;
                $(cell.Control).removeClass('hide').css('display', '');
                $($('colgroup col', _self.table)[cell.ColIndex + 1]).removeClass('hide').css('display', '');
                $($('colgroup col', _self.table)[cell.ColIndex + 1]).attr('width', cell.LastWidth);

                //mother
                $(cell.ParentHeader.Control).attr("filterable", true);
                $(cell.ParentHeader.Control).attr("sortdirection", "");
                $(cell.ParentHeader.Control).attr("colname", $(cell.Control).attr("colname"));
            } else {
                cell.LastHide = true;
                $(cell.Control).addClass('hide');
                $($('colgroup col', _self.table)[cell.ColIndex + 1]).addClass('hide');
                $($('colgroup col', _self.table)[cell.ColIndex + 1]).attr('width', 0);
            }
        } else { /* Chỉ hiển thị ngôn ngữ thứ hai */
            if ($(cell.Control).hasClass('main-language')) {
                cell.LastHide = true;
                $(cell.Control).addClass('hide');
                $($('colgroup col', _self.table)[cell.ColIndex + 1]).addClass('hide');
                $($('colgroup col', _self.table)[cell.ColIndex + 1]).attr('width', 0);
            } else {
                cell.LastHide = false;
                $(cell.Control).removeClass('hide').css('display', '');
                $($('colgroup col', _self.table)[cell.ColIndex + 1]).removeClass('hide').css('display', '');
                $($('colgroup col', _self.table)[cell.ColIndex + 1]).attr('width', cell.LastWidth);

                //mother
                $(cell.ParentHeader.Control).attr("filterable", true);
                $(cell.ParentHeader.Control).attr("sortdirection", "");
                $(cell.ParentHeader.Control).attr("colname", $(cell.Control).attr("colname"));
            }
        }
    }

    TranslateBodyCell(cell) {
        let _self = this;

        if (ApplicationInstance.Uservar.BillingualLanguage == 2) { /* Song ngữ */
            cell.LastHide = false;
            $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).removeClass('hide').css('display', '');
            $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).removeAttr('hide');
        } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
            if ($(cell.Control).hasClass('main-language')) {
                cell.LastHide = false;
                $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).removeClass('hide').css('display', '');
                $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).removeAttr('hide');
            } else {
                cell.LastHide = true;
                $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).addClass('hide');
                $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).attr('hide', true);
            }
        } else { /* Chỉ hiển thị ngôn ngữ thứ hai */
            if ($(cell.Control).hasClass('main-language')) {
                cell.LastHide = true;
                $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).addClass('hide');
                $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).attr('hide',true);
            } else {
                cell.LastHide = false;
                $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).removeClass('hide').css('display', '');
                $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).removeAttr('hide');
            }
        }
    }

    ShowFilter(element) {
        let self = this;
        if ($('body > #TableColumnFilter').length == 0) {
            var t = new Date().getMilliseconds();
            $.ajax({
                url: "./html/TableColumnFilter.html?t=" + t,
                type: "GET",
                dataType: "html",

                success: function (code) {
                    $('body')
                        .append(code)
                        .ready(function () {
                            translator.translateById("TableColumnFilter");
                            self.ShowFilterData(element);
                        });
                },

                error: function (e) {
                    let id = self.options.Id.replace("_ScrollArea", "_AlertMessage");
                    let alert = eval(id);
                    alert.showError("Common_Msg_UnknownError");
                }
            });
        } else {
            self.ShowFilterData(element);
        }
    }

    ShowFilterData(element) {
        let self = this;
        let htmlId = self.table.attr("htmlid");
        if (TableColumnFilter_ControlId != htmlId) {
            TableColumnFilter_ClusterizeData = new Object();
            TableColumnFilter_ClusterizeDataChecked = new Object();
            TableColumnFilter_ControlId = htmlId;
        }

        let colName = $(element).parent('th').attr("colname");
        let dataType = $(element).parent('th').attr("datatype");
        if (!dataType) dataType = "string";
        let scale = $(element).parent('th').attr("scale");
        $("#TableColumnFilter").attr("controlid", self.table.attr("controlid"));
        $("#TableColumnFilter").attr("htmlid", htmlId);
        $("#TableColumnFilter").attr("colname", colName);
        $("#TableColumnFilter").attr("datatype", dataType);
        $("#TableColumnFilter").attr("scale", scale);

        //clusterizeData = eval(controlId + "_clusterize");
        let clusterizeData = self.ClusterizeData;
        //controlId_clusterize_data = eval(controlId + "_clusterize_data");

        if (!TableColumnFilter_ClusterizeDataChecked[colName] || !TableColumnFilter_ClusterizeData[colName] || clusterizeData.data.length != TableColumnFilter_ClusterizeDataLength) {
            let selectedTitles = [];
            //selectedTitles.push("(Select All)");
            $.map(clusterizeData.data, function (value, index) {
                if (dataType == "date-medium") {
                    selectedTitles.push(datetimeToStringMedium(value[colName]));
                } else if (dataType == "date-short") {
                    selectedTitles.push(datetimeToStringShort(value[colName]));
                } else if (dataType == "number") {
                    selectedTitles.push(number_to_text(value[colName], number_decimalscale(scale)));
                } else {
                    selectedTitles.push(value[colName]);
                }
            });

            let uniqueselectedTitles = selectedTitles.filter(function (value) {
                if (typeof dataType == "number") {
                    return true;
                } else {
                    value = value != null && value != "" ? (value + "") : value;
                    return value != null && value != "" && value.toLowerCase() != "null";
                }
            });

            var check_blank = (uniqueselectedTitles.length < selectedTitles.length);
            uniqueselectedTitles = $.unique(uniqueselectedTitles.sort((a, b) => (a + "").localeCompare((b + ""))));

            if (check_blank) {
                uniqueselectedTitles.splice(1, 0, "(Blanks)");
            }
            uniqueselectedTitles.unshift("(Select All)");
            TableColumnFilter_ClusterizeDataChecked[colName] = [];
            $.map(uniqueselectedTitles, function (value, index) {
                TableColumnFilter_ClusterizeDataChecked[colName].push(true);
            });

            TableColumnFilter_ClusterizeData[colName] = uniqueselectedTitles;
        }

        if (TableColumnFilter_ClusterizeDataChecked[colName][0] == true) {
            if (typeof TableColumnFilter_ClusterizeDataChecked[colName] == "object") {
                TableColumnFilter_ClusterizeDataChecked[colName] = Object.values(TableColumnFilter_ClusterizeDataChecked[colName]);
            }
            let indexes = TableColumnFilter_ClusterizeDataChecked[colName].reduce((r, n, i) => {
                n == false && r.push(i);
                return r;
            }, []);
            if (indexes.length > 0) TableColumnFilter_ClusterizeDataChecked[colName][0] = false;
        }

        TableColumnFilter_ClusterizeDataLength = clusterizeData.data.length;

        TableColumnFilter_CurrentClusterizeData = $.extend(true, {}, TableColumnFilter_ClusterizeData[colName]);
        TableColumnFilter_CurrentClusterizeChecked = $.extend(true, {}, TableColumnFilter_ClusterizeDataChecked[colName]);

        TableColumnFilter_RowData = [];
        TableColumnFilter_DataFilter = [];
        TableColumnFilter_ClusterizeDataFilter = [];
        TableColumnFilter_DataFilterLower = [];
        TableColumnFilter_ClusterizeDataFilterLower = [];
        $.map(TableColumnFilter_ClusterizeData[colName], function (value, index) {
            if (typeof dataType == "number") {
                TableColumnFilter_DataFilter.push(value + "");
                TableColumnFilter_ClusterizeDataFilter.push(value + "");
                TableColumnFilter_DataFilterLower.push(value + "");
                TableColumnFilter_ClusterizeDataFilterLower.push(value + "");
                TableColumnFilter_RowData.push(TableColumnFilter_BuildRow(number_to_text(value, number_decimalscale(scale)), index));
            } else {
                value = value != null && value != "" ? (value + "") : value;
                TableColumnFilter_DataFilter.push(value);
                TableColumnFilter_ClusterizeDataFilter.push(value);
                TableColumnFilter_DataFilterLower.push(value.toLowerCase());
                TableColumnFilter_ClusterizeDataFilterLower.push(value.toLowerCase());
                TableColumnFilter_RowData.push(TableColumnFilter_BuildRow(value, index));
            }
        });
        if (!TableColumnFilter_Clusterize) {
            TableColumnFilter_Clusterize = new Clusterize({
                rows: TableColumnFilter_RowData,
                scrollId: 'TableColumnFilter_Containter',
                contentId: 'TableColumnFilter_Containter_ContentArea'
            });
        } else {
            TableColumnFilter_Clusterize.update(TableColumnFilter_RowData);
        }

        $(function () {
            $('#TableColumnFilter_Containter', $('body > #TableColumnFilter')).scrollTop(0);
        })

        $('body > #TableColumnFilter').css('top', $($(element).parent('th')).offset().top + $($(element).parent('th')).outerHeight());
        $('body > #TableColumnFilter').css('left', $($(element).parent('th')).offset().left + $($(element).parent('th')).outerWidth() - parseInt($('body > #TableColumnFilter').css('width')));

        if (!$('body > #TableColumnFilter').is(':visible')) {
            $('body > #TableColumnFilter').fadeIn(function () {
                $('#TableColumnFilter_search').focus();
            });
        } else {
            $('#TableColumnFilter_search').focus();
        }

        $("#TableColumnFilter_search", $('body > #TableColumnFilter')).val('');
        $(".TableColumnFilter-filter-item", $('body > #TableColumnFilter')).show();        
    }

    OnSort(element) {
        let _self = this;

        $("th div[class*='table-header-sort-']", $(element).closest('thead')).each(function () {
            if (this !== element) {
                $(this).removeClass('table-header-sort-asc table-header-sort-desc');
                $(this).hide();
            }
        });
        let condition = false;
        if ($(element).hasClass('table-header-sort-asc')) {
            $(element).removeClass('table-header-sort-asc');
            $(element).addClass('table-header-sort-desc');
            condition = true;
        } else {
            $(element).removeClass('table-header-sort-desc');
            $(element).addClass('table-header-sort-asc');
        }
        let colName = $(element).parent('th').attr("colname");

        _self.ClusterizeData.data = _self.ClusterizeData.data.sort(sort_by({ name: colName, reverse: condition }));

        _self.ClusterizeData.data = _self.table.attr("type") == "tree" ? _self.BuildClusterizeBinaryTree(_self.ClusterizeData.data) : _self.ClusterizeData.data;
        _self.ClusterizeData.row_data = [];
        _self.ClusterizeData.row_data_id = [];
        _self.ClusterizeData.data_filter = [];

        _self.ClusterizeData.data.forEach((row) => {
            _self.options.BuildRowModel.row = row;
            _self.ClusterizeData.row_data.push(_self.options.BuildRow(_self.options.BuildRowModel));
            _self.ClusterizeData.row_data_id.push(row[_self.options.Key]);
            _self.ClusterizeData.data_filter.push(row);
        });

        _self.Clusterize.update(_self.ClusterizeData.row_data);
    }

    HasFocus() {
        return this.table.find('tbody tr.selected:first').length > 0;
    }

    Focus(defaultFocus, idle) {
        HideTooltip();
        let _self = this;
        let elements = this.table.find('tbody tr th');
        if (defaultFocus == false) {
            return;
        }

        let currentRowId, columnSelectedIndex;
        let clusterizeData = this.ClusterizeData;

        let index = clusterizeData.data.findIndex(function (o) {
            return o[_self.options.Key] == clusterizeData.current_row_id;
        })
        if (index == -1) clusterizeData.current_row_id = null;
        if (elements.length > 0) {
            elements.closest("tbody").find(".selected").removeClass("selected");
            elements.closest("tbody").find(".cell-selected").removeClass("cell-selected");
            elements.closest("tbody").find(".active").removeClass("active-nobg active");
            if (this.options.FocusFirst == false) {
                if (clusterizeData.current_row_id == null || clusterizeData.current_row_id == "") {
                    if (typeof clusterizeData.data[clusterizeData.data.length - 1][_self.options.Key] != "undefined") {
                        clusterizeData.current_row_id = clusterizeData.data[clusterizeData.data.length - 1][_self.options.Key];
                    }
                }
                if (clusterizeData.column_selected_index == null || clusterizeData.column_selected_index == "" || clusterizeData.column_selected_index == -1) {
                    clusterizeData.column_selected_index = $($($(elements[0]).parent()).find("td:visible:first")).index();
                }
            } else {
                if (clusterizeData.current_row_id == null || clusterizeData.current_row_id == "") {
                    if (typeof clusterizeData.data[0][_self.options.Key] != "undefined") {
                        clusterizeData.current_row_id = clusterizeData.data[0][_self.options.Key];
                    }
                }
                if (clusterizeData.column_selected_index == null || clusterizeData.column_selected_index == "" || clusterizeData.column_selected_index == -1) {
                    let firstCell = $($($(elements[0]).parent()).find("td:visible:first"));
                    clusterizeData.column_selected_index = $(firstCell).siblings(":visible").addBack().index(firstCell);
                }
            }

            currentRowId = clusterizeData.current_row_id;
            columnSelectedIndex = clusterizeData.column_selected_index == -1 ? 1 : clusterizeData.column_selected_index;         
        }
        let flag = true;        
        for (var i = 0; i < elements.length; i++) {
            let rowId = $(elements[i]).attr('clusterize_row_id');
            if (flag == true && rowId == currentRowId) {
                // force focus to first cell if empty
                let focusToInput = function(element) {
                    let input = element.find("input");
                    if (input.length > 0) {
                        if (idle != true) {
                            if ($(input).is(":checkbox")) {
                                _self.parent.attr("tabindex", -1).focus();
                            } else {
                                input.select();
                            }
                        } else {
                            //text-option workaround
                            input.prop("selectionStart", 0).prop("selectionEnd", 0).select().focus();                            
                        }
                            
                    } else {
                        if ($(element).find('div.text-select:visible:not(:disabled)').length > 0) { // focus to text-select
                            //window.setTimeout(function () {
                            //    $(element).find('div.text-select:visible:not(:disabled)').attr("tabindex", -1).focus();
                            //}, 0);
                        } else {
                            $(element).closest('.s3tcloud-prefix.form-container').focus();
                        }
                    }
                }
                if (currentRowId == "") {
                    $(elements[0]).parent().addClass('selected');
                    if ($(elements[0]).parent().is(":visible")) {
                        $(elements[0]).parent().children(':visible').eq(columnSelectedIndex).addClass('active');
                        _self.parent.attr("tabindex", -1).focus();
                        this.SetRowFocusData($(elements[0]).parent(), $(elements[0]).parent().children(':visible').eq(columnSelectedIndex));
                    } else {
                        $(elements[0]).parent().children().eq(columnSelectedIndex).addClass('active');
                        this.SetRowFocusData($(elements[0]).parent(), $(elements[0]).parent().children().eq(columnSelectedIndex));
                    }
                    focusToInput($(elements[0]).parent().children(':visible').eq(columnSelectedIndex));                      
                    flag = false;
                } else {
                    $(elements[i]).parent().addClass('selected');                    
                    if ($(elements[i]).parent().is(":visible")) {
                        if (idle != true) {
                            $(elements[i]).parent().children(':visible').eq(columnSelectedIndex).addClass('active');
                            _self.parent.attr("tabindex", -1).focus();
                        } else {
                            //text-option workaround
                            $(elements[i]).parent().children(':visible').eq(columnSelectedIndex).addClass('active-nobg');
                        }
                        
                        this.SetRowFocusData($(elements[i]).parent(), $(elements[i]).parent().children(':visible').eq(columnSelectedIndex));
                    } else {
                        if (idle != true) {
                            $($(elements[i]).parent().children()).not(".hide").eq(columnSelectedIndex).addClass('active');
                            _self.parent.attr("tabindex", -1).focus();
                        } else {
                            //text-option workaround
                            $(elements[i]).parent().children().eq(columnSelectedIndex).addClass('active-nobg');
                        }
                        this.SetRowFocusData($(elements[i]).parent(), $(elements[i]).parent().children().eq(columnSelectedIndex));
                    }
                    focusToInput($(elements[i]).parent().children(':visible').eq(columnSelectedIndex));                    
                    flag = false;
                }
            }
            if (clusterizeData.selected_row_ids.includes(rowId)) {
                $(elements[i]).addClass("active");                
                $(elements[i]).closest("tr").addClass("active selected");
            }
            if (clusterizeData.selected_column_ids.includes(rowId)) {
                $(elements[i]).closest("tr").find("td").eq(clusterizeData.column_selected_index).addClass("cell-selected");
            }            
        }
    }
    
    BuildCells() {
        let elements = this.table.find('tbody tr td');
        let self = this;
        //hide zero td
        $.map($(elements), function (element, index) {
            if ($(element).hasClass('text-number') && $(element).attr("hidezero") == "true") {
                if ($(element).attr("numericvalue") == "0") {
                    $(element).attr("value", "");
                }
            }
            if ($(element).find('input.text-search').length > 0) {
                $(element)
                    .on('mouseenter', function (e) {
                        if ($(this).find('input.text-search').attr("readonly") != "readonly" && $(this).find('input.text-search').attr("readonly") != "true" && $(this).find('input.text-search').attr("readonly") != true) {
                            //$(this).find(".input-group-add-button").show();//20230519
                        }
                    }).on('mouseleave', function (e) {
                        if (!$(this).find('input.text-search').is(":focus"))
                            $(this).find(".input-group-add-button").hide();
                    });
            }
        });

        elements
            .removeAttr('mousedown')
            .removeAttr('mouseover')
            .mousedown(function (e) {

                HideFilter(e);
                HideTextSelectBackground(e);
                HideDropDown(e);
                HideNavigator(e);
                HideCustomDropDown(e);
                HideCustomDropDownList(e);
                HideProfileMenu(e);

                let cell = $(this);
                let controlid = self.table.attr('controlid');
                if (controlid) {
                    if (eval("typeof " + "customcolumnresize_" + controlid + "_Pressed == 'boolean'")) {
                        let customcolumnresizePressed = eval("customcolumnresize_" + controlid + "_Pressed");
                        if (customcolumnresizePressed != true) {
                            isMouseDown = true;
                        }
                    } else {
                        isMouseDown = true;
                    }
                }
                if (e.ctrlKey) {
                    cell.addClass("cell-selected active");
                } else {
                    $(".cell-selected", $(cell).closest('.main-desktop')).removeClass("cell-selected"); // deselect everything
                    $(".active", $(cell).closest('.main-desktop')).removeClass("active-nobg");
                    $(".active", $(cell).closest('.main-desktop')).removeClass("active");
                    $(".selected", $(cell).closest('.main-desktop')).removeClass("selected");
                    self.SetRowFocusData(cell.parent(), cell);
                    self.ClusterizeData.selected_row_ids = [];
                    self.ClusterizeData.selected_column_ids = [];
                    self.table.find(".row-focus").remove();
                    $(cell).closest('tr').find("th").prepend('<div class="row-focus" onmouseup="RowFocusMouseUp()" style="float: left;"><i class="glyphicon glyphicon-triangle-right"></i></div>');
                    if (e.shiftKey) {
                        self.SelectToCell(cell, self.table);
                    } else {
                        
                        //cell.addClass("cell-selected active");
                        //self.StartCellIndex = cell.index();
                        //self.StartRowIndex = cell.parent().index();
                        //if (!$(cell).closest('tr').hasClass('selected')) {
                        //    $(cell).closest('tr').addClass('selected');
                        //}

                        //20230726: Sua loi bang chi tiet toggle bi loi background white va chu white,
                        //neu khong phai table chi tiet toggle thi moi add
                        if (!$(cell).closest('tr').hasClass('tablechild')) {
                            cell.addClass("cell-selected active");
                            self.StartCellIndex = cell.index();
                            self.StartRowIndex = cell.parent().index();
                            if (!$(cell).closest('tr').hasClass('selected')) {
                                $(cell).closest('tr').addClass('selected');
                            }
                        }

                    }
                    if ($(":focus").is("input") && $(":focus").attr("readonly") == "readonly") {
                        $(":focus")[0].setSelectionRange(0, 0);
                    }

                    self.parent.attr("tabindex", -1).focus();
                    // focus if children is input
                    if (cell.children().length > 0) {
                        if ($(cell.children()[0]).is("input")) {
                            return true;
                        }
                    }
                }
                //return false; // prevent text selection //20230517
                return true; // prevent text selection //20230517: Sua loi khong select de copy duoc
            })
            .mouseover(function () {
                if (!isMouseDown) return;
                self.table.find("tbody").find(".cell-selected").removeClass("cell-selected");
                self.SelectToCell($(this), self.table);
            })
            .bind("selectstart", function () {
                //return false;//20230517
                return true;//20230517: Sua loi khong select de copy duoc
            });

        let inputs = this.table.find('tbody tr td input');
        inputs
            .mousedown(function (e) {
                HideFilter(e);
                HideTextSelectBackground(e);
                HideDropDown(e);
            })
            .off("focus").on("focus", function (e) {
                HideFilter(e);
                HideTextSelectBackground(e);
                HideDropDown(e);
                $(this).closest('td').addClass('cell-selected active');
                $(this).closest('tr').addClass('selected');
                $(this).removeAttr('validate-allow-move-next');
                if ($(this).hasClass("text-option")) {
                    e.target.setSelectionRange(0, 0);
                }
                if ($(this).hasClass("text-search") && $(this).attr("readonly") != "readonly") {
                    //$(this).closest('td').find(".input-group-add-button").show();//20230519
                }
                let id = self.options.DeskId;
                if (id) {
                    if ($(window[id + "_LastFocus"]).is(this) && $(this).attr("readonly") != "readonly") {
                        $(this).closest("td").addClass("active-nobg");
                    } else {
                        $(this).select();
                    }
                }
                if (eval("typeof " + id + "_LastFocus != undefined")) {
                    window[id + "_LastFocus"] = this;
                }
                self.ClusterizeData.current_row_id = $(this).closest('tr').find("th").attr("clusterize_row_id");
                self.ClusterizeData.column_selected_index = $($(this).closest("td")).siblings(":visible").addBack().index($(this).closest("td"));
                if (!$(this).hasClass("text-option")) {
                    InputFocusHandle($(this));
                }
                
            })
            .off("blur").on("blur", function (e) {
                if (self.parent.closest(".main-desktop").find('.popup-alert .popup-alert-background').length > 0 || $("#main-alert").is(':visible')) return;
                self.BlurInput(this);
            })
            .on("input", function (e) {
                $.powerTip.hide();
                HideFilter(e);
                HideTextSelectBackground(e);
                HideDropDown(e);
                $(this).closest("td").addClass("active-nobg");                
            })
            .on("change", function (e) {
                self.UpdateClusterizeRow(this);
            });
    }

    BuildTextSearch() {
        let self = this;        
        let inputs = self.table.find('tbody .text-search');
        inputs
            .on("mousedown focus", function (e) {
                if ($(this).attr("text-search-ready") != "true") {
                    $(this).attr("text-search-ready", true);
                    initTextSearch($(this));
                }
            });
    }

    BuildLoHangSearch() {
        let self = this;
        let inputs = self.table.find('tbody .lohang-search');
        inputs
            .on("mousedown focus", function (e) {
                if ($(this).attr("text-search-ready") != "true") {
                    $(this).attr("text-search-ready", true);
                    initLoHangSearch($(this));
                }
            });
    }

    BuildTextOption() {
        let self = this;
        let inputs = self.table.find('tbody .text-option');
        inputs
            .on("mousedown focus", function (e) {
                InputFocusHandle($(this));
                if ($(this).attr("text-option-ready") != "true") {
                    $(this).attr("text-option-ready", true);
                    initTextOption($(this));
                }
            });
    }

    BuildTreeToggle(element) {
        let _self = this;
        $('.toggle', element).on('click', function () {
            //Gets all <tr>'s  of greater depth
            //below element in the table
            let findChildren = function (tr) {
                let depth = tr.data('depth');
                return tr.nextUntil($('tr').filter(function () {
                    return $(this).data('depth') <= depth;
                }));
            };

            let el = $(this);
            let tr = el.closest('tr'); //Get <tr> parent of toggle button
            let children = findChildren(tr);

            //Remove already collapsed nodes from children so that we don't
            //make them visible. 
            //(Confused? Remove this code and close Item 2, close Item 1 
            //then open Item 1 again, then you will understand)
            let subnodes = children.filter('.expand');
            subnodes.each(function () {
                let subnode = $(this);
                let subnodeChildren = findChildren(subnode);
                children = children.not(subnodeChildren);
            });

            //Change icon and hide/show children
            if (tr.hasClass('collapse')) {
                tr.removeClass('collapse').addClass('expand');
                children.hide();
                children.each(function () {
                    let rowId = $(this).find("th").attr("clusterize_row_id");
                    let index = _self.ClusterizeData.data.findIndex(function (o) {
                        return o[_self.ClusterizeData.PrimaryKey] == rowId;
                    })
                    _self.ClusterizeData.data[index].IsToggleTreeHidden = true;
                });
            } else {
                tr.removeClass('expand').addClass('collapse');
                children.show();
                children.each(function () {
                    let rowId = $(this).find("th").attr("clusterize_row_id");
                    let index = _self.ClusterizeData.data.findIndex(function (o) {
                        return o[_self.ClusterizeData.PrimaryKey] == rowId;
                    })
                    _self.ClusterizeData.data[index].IsToggleTreeHidden = false;
                });
            }
            
            return children;
        });
        $('.toggle-root', element).on('click', function () {
            let _this = $(this);
            _this.find(".fa").removeClass("fa-folder-open").addClass("fa-folder");
            ShowChildTreeTable(_self.ClusterizeData, _this.closest("tr"));
            window.setTimeout(function () {
                _this.find(".fa").removeClass("fa-folder").addClass("fa-folder-open");
            }, 1000);
        });
    }

    UpdateClusterizeRow(element) {
        let self = this;
        let id = $(element).closest("tr").find("th").attr("clusterize_row_id");
        let columnName = $(element).attr("column-name");
        let data = self.ClusterizeData.data.filter(function (row) {
            return row.RowState != 3;
        });
        let index = data.findIndex(function (o) {
            return o[self.options.Key] == id;
        })
        if (index != -1 && columnName) {
            data[index][columnName] = $(element).value();
            self.ClusterizeData.RowStateModified(id);
            self.options.BuildRowModel.row = data[index];
            self.ClusterizeData.row_data.splice(index, 1, self.options.BuildRow(self.options.BuildRowModel));            
            //self.ClusterizeData.row_data.splice(index, 1, $('<div>').append($(element).closest("tr").clone()).html());
            self.Clusterize.updateData(self.ClusterizeData.row_data);
        }
    }

    CurrentRowData() {
        let self = this;
        let td = this.table.find("tbody").find("tr.selected td.active");
        let th = td.closest("tr").find("th");

        if (th.length > 0) {
            let rowData = th.attr("row_data");
            if (rowData) {
                return JSON.parse(rowData);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    Resize() {
        let disabledColumns = [];
        let minus = 0;
        
        this.table.find("col").each(function () {
            if ($(this).css('display') == 'none') {
                minus++;
                return;
            }
            if ($(this).attr("noresizeable") == "") {
                disabledColumns.push($(this).index() - minus);
            }
        });
        
        this.table.colResizable({ liveDrag: false, resizeMode: 'overflow', disabledColumns: disabledColumns });        
    }

    ResetColumn() {
        this.BuildColumn(1);
        this.SyncGrip();
    }

    SyncGrip() {
        this.table.syncGrip();
    }

    ResetColumnToInit() {
        let _self = this;

        _self.ColumnHeaders.forEach((cell) => {
            $($('colgroup col', _self.table)[cell.ColIndex + 1]).attr('width', cell.OriginalWidth);
        });

        this.ResetColumn();
    }

    ResetGrip() {
        this.table.destroy();
        this.Resize();
    }

    BuildColumn(scale) {
        let _self = this;

        let _widths = [];
        let _columns = [];
        let _containerWidth = _self.parent.closest(".clusterize-scroll").width() * scale - S3TScrollBarWidth;
        let _allColumnsWidth = 0;
        let _noresizeableWidths = 0;

        //Tính tổng độ rộng của tất cả các cột hiển thị
        $('colgroup col', _self.table).each(function (i) {
            if ($(this).css('display') != 'none') {
                _allColumnsWidth += parseInt($(this).attr('width')) * scale;
            }

            if ($(this).css('display') != 'none' && $(this).attr("noresizeable") != "") {
                _columns.push(i);
            }

            if ($(this).attr("noresizeable") == "") {
                _noresizeableWidths += parseInt($(this).attr("width")) * scale;
            }
        });

        //Nếu độ rộng các cột nhỏ hơn độ rộng của container
        if (_allColumnsWidth < _containerWidth) {
            _allColumnsWidth -= _noresizeableWidths;
            _containerWidth -= _noresizeableWidths;

            let _allResizedWidths = 0;
            let _biggestColumn = 0;
            let _biggestColumnWidth = 0;

            _columns.forEach(function (value) {
                let w = Math.floor(parseInt($($('colgroup col', _self.table)[value]).attr("width")) * scale * _containerWidth / _allColumnsWidth);
                _allResizedWidths += w;
                _widths.push(w);

                if (w > _biggestColumnWidth) {
                    _biggestColumn = value;
                    _allResizedWidths = w;
                }
            });

            //Sau khi resize, nếu độ rộng các cột khác với container thì phần đó cho vào cột lớn nhất
            if (_allResizedWidths != _containerWidth) {
                _widths[_biggestColumn] = _containerWidth - _allResizedWidths;
            }

            _columns.forEach(function (value, i) {
                $($('colgroup col', _self.table)[value]).attr("width", _widths[i]);
            });
        }
    }

    SelectRowWithRowspan(tr, add = true) {
        let rowspan = parseInt(tr.find("th[rowspan], td[rowspan]").attr("rowspan")) || 1;
        let index = tr.index();
        let tbody = tr.closest("tbody");

        for (let i = 0; i < rowspan; i++) {
            let row = tbody.find("tr").eq(index + i);
            if (add) {
                row.addClass("selected");
                row.find("th").addClass("active");
                row.find("td").addClass("cell-selected");
            } else {
                row.removeClass("selected");
                row.find("th").removeClass("active");
                row.find("td").removeClass("cell-selected");
            }
        }
    }


    SelectRowHeader() {
        let elements = this.table.find('tbody tr th');
        let self = this;
        elements
            .removeAttr('mouseover')
            .removeAttr('mousedown')
            .mousedown(function (e) {
                HideFilter(e);

                if ($(":focus").is("input[readonly]")){
                    $(":focus").prop('selectionStart', 0).prop('selectionEnd', 0);
                }
                let multiSelect = self.table.attr("multi-select");
                isThMouseDown = true;
                let clusterize_data = self.ClusterizeData;
                $(this).closest(".s3tcloud-prefix.form-container").focus();
                self.table.find(".row-focus").remove();
                $(this).prepend('<div class="row-focus" onmouseup="RowFocusMouseUp()" style="float: left;"><i class="glyphicon glyphicon-triangle-right"></i></div>');
                if (!e.shiftKey && !e.ctrlKey) {
                    self.table.find('td').removeClass('cell-selected active active-nobg');
                    $(this).closest('tr').siblings().removeClass('selected');
                    $(this).closest('tr').addClass('selected');

                    clusterize_data.selected_row_ids = [];
                    clusterize_data.selected_column_ids = [];

                    $(this).closest('tbody').find('th.active').removeClass('active');
                    $(this).closest('tbody').find('tr.active').removeClass('active selected');
                    if (!$(this).hasClass('active')) {
                        $(this).addClass('active');
                        //$(this).parent().addClass('selected');
                        self.SelectRowWithRowspan($(this).parent(), true);

                        $(this).parent().find("td").addClass('cell-selected');

                        self.SetRowFocusData($(this).parent(), $(this));
                        clusterize_data.selected_row_ids.push(clusterize_data.current_row_id);
                    }

                    self.options.StartRowIndex = $(this).parent().index();
                } else {
                    if (multiSelect != "true") return;
                    if (e.ctrlKey) {
                        if (!$(this).hasClass('active')) {
                            $(this).addClass('active');
                            $(this).parent().addClass('active selected');
                            $(this).parent().find("td").addClass('cell-selected');

                            clusterize_data.selected_row_ids.push($(this).attr("clusterize_row_id"));
                            clusterize_data.current_row_id = $(this).attr("clusterize_row_id");

                        } else {
                            $(this).removeClass('active');
                            $(this).parent().removeClass('active');
                            $(this).parent().removeClass('selected');
                            $(this).parent().find("td").removeClass('cell-selected');

                            var id = $(this).attr("clusterize_row_id");
                            var index = clusterize_data.selected_row_ids.findIndex(function (o) {
                                return o == id;
                            })
                            clusterize_data.selected_row_ids.splice(index, 1);
                            clusterize_data.current_row_id = $(this).attr("clusterize_row_id");

                        }
                        self.options.StartRowIndex = $(this).parent().index();
                    } else {
                        self.table.find("tbody").find('td').removeClass('cell-selected active active-nobg');
                        self.table.find("tbody").find(".active").removeClass("active");
                        self.table.find("tbody").find(".selected").removeClass("selected");
                        self.SelectToRowHeader($(this));
                    }
                }
                
            })
            .mouseover(function (e) {
                let multiSelect = self.table.attr("multi-select");
                if (multiSelect != "true") return;
                if (!isThMouseDown) return;
                self.table.find("tbody").find(".cell-selected").removeClass("cell-selected");
                self.table.find("tbody").find(".active").removeClass("active");
                self.table.find("tbody").find(".selected").removeClass("selected");
                self.SelectToRowHeader($(this));
            });
    }

    SelectAllRowHeaders() {
        let _self = this;
        this.ClusterizeData.selected_row_ids = [];
        this.ClusterizeData.selected_column_ids = [];
        this.table.find("tbody").find("tr");

        for (let i = 0; i <= this.table.find("tbody").find("tr").length; i++) {
            let row = this.table.find("tbody").find("tr").eq(i);
            let rowCells = row.find("th");
            let rowTrCells = row.find("td");
            row.addClass("active selected");
            rowCells.addClass("active");
            rowTrCells.addClass("cell-selected");
        }

        this.ClusterizeData.data.forEach((row) => {
            this.ClusterizeData.selected_row_ids.push(row[_self.options.Key]);
        });
    }

    SelectToRowHeader(cell) {
        let row = cell.parent();
        let rowIndex = row.index();
        let rowStart, rowEnd;

        if (rowIndex < this.options.StartRowIndex) {
            rowStart = rowIndex;
            rowEnd = this.options.StartRowIndex;
        } else {
            rowStart = this.options.StartRowIndex;
            rowEnd = rowIndex;
        }
        this.ClusterizeData.selected_row_ids = [];
        this.ClusterizeData.selected_column_ids = [];
        for (let i = rowStart; i <= rowEnd; i++) {
            let r = this.table.find("tbody").find("tr").eq(i);
            let rc = r.find("th");
            let rowTrCells = r.find("td");
            r.addClass("selected");
            rc.addClass("active");
            rowTrCells.addClass("cell-selected");
            this.ClusterizeData.selected_row_ids.push($(rc).attr("clusterize_row_id"));
        }
        this.ClusterizeData.current_row_id = this.ClusterizeData.selected_row_ids[this.ClusterizeData.selected_row_ids.length - 1];
        this.table.find(".row-focus").remove();
        $(cell).prepend('<div class="row-focus" onmouseup="RowFocusMouseUp()" style="float: left;"><i class="glyphicon glyphicon-triangle-right"></i></div>');
    }
    
    SetRowFocusData(row, cell) {
        let old_row_id = this.ClusterizeData.current_row_id;
        this.ClusterizeData.current_row_id = row.find("th").attr("clusterize_row_id");
        this.ClusterizeData.column_selected_index = $(cell).siblings(":visible").addBack().index(cell);
        this.table.find(".row-focus").remove();
        $(row).find("th").prepend('<div class="row-focus" onmouseup="RowFocusMouseUp()" style="float: left;"><i class="glyphicon glyphicon-triangle-right"></i></div>');
        this.SaveRowPosition(row);

        if ($(cell).attr('showinfomessage') == "true" || $(cell).attr('showinfomessage') == true)
            this.options.ShowInvoiceInfoCallback && this.options.ShowInvoiceInfoCallback(cell);
        if (this.options.FirstLoad == true) {
            this.options.FirstLoad = false;
        } else {
            this.ClusterizeData.current_row_id != old_row_id && this.options.DetailCallback && this.options.DetailCallback();
        }
    }

    SaveRowPosition(element) {
        let self = this;
        let id = $(element).find("th").attr("clusterize_row_id");
        let index = self.ClusterizeData.data.findIndex(function (o) {
            return o[self.options.Key] == id;
        });

        $(self.table.find(".clusterize-content")).attr("row-index", index);
        $(self.table.find(".clusterize-content")).attr("row-top", $(element).offset().top);
    }

    SelectToCell(cell, table) {
        let row = cell.parent();
        let cellIndex = cell.index();
        let rowIndex = row.index();
        let rowStart, rowEnd, cellStart, cellEnd;

        if (rowIndex < this.StartRowIndex) {
            rowStart = rowIndex;
            rowEnd = this.StartRowIndex;
        } else {
            rowStart = this.StartRowIndex;
            rowEnd = rowIndex;
        }

        if (cellIndex < this.StartCellIndex) {
            cellStart = cellIndex;
            cellEnd = this.StartCellIndex;
        } else {
            cellStart = this.StartCellIndex;
            cellEnd = cellIndex;
        }

        for (var i = rowStart; i <= rowEnd; i++) {
            var rowCells = table.find("tbody").find("tr").eq(i).find("td");
            for (var j = cellStart - 1; j <= cellEnd - 1; j++) {
                rowCells.eq(j).addClass("cell-selected");
            }
        }

        this.SetRowFocusData(row, cell);
        let tbody = $(row).closest('tbody');
        tbody.find("tr.selected").removeClass("selected");
        tbody.find("td.active").removeClass("active active-nobg");
        row.addClass('selected');
        cell.addClass('active');
        this.table.find(".row-focus").remove();
        $(cell).closest('tr').find("th").prepend('<div class="row-focus" onmouseup="RowFocusMouseUp()" style="float: left;"><i class="glyphicon glyphicon-triangle-right"></i></div>');
    }

    CopyCellSelected() {
        if (this.table.find(".cell-selected").length == 0) return;
        for (var i = 0; i < this.table.length; i++) {
            var table = $(this.table[i]);
            if (table.find(".cell-selected").length > 0) {
                break;
            }
        }
        var row = [];

        $(table).find("tbody").find("tr").each(function () {
            var flag = false;
            var col = [];
            $(this).children("td").each(function () {
                if ($(this).attr('hide') != true && !$(this).hasClass('invisible-cell') && $(this).hasClass('cell-selected')) {
                    col.push($(this).text());
                    flag = true;
                }
            });
            if (flag == true)
                row.push(col.join("\t"));
        });
        var data = row.join("\n");
        const el = document.createElement('textarea');
        el.value = data;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        var parent = $(table).parent();
        while (parent.hasClass("form-container")) {
            parent = $(parent).parent();
        }
        parent.focus();
    }

    CellBlur(element) {
        let _self = this;
        return new Promise(async function (resolve, reject) {
            if ($(element).find('input').length > 0) { //blur to input
                let input = $(element).find('input');
                if (input.is('input:text') || input.is('textarea')) {
                    input[0].setSelectionRange(0, 0);
                }
                //input.blur();
                await _self.BlurInput(input);
                if (_self.options.DeskId) {
                    if (eval("typeof " + _self.options.DeskId + "_LastFocus != undefined")) {
                        window[_self.options.DeskId + "_LastFocus"] = null;
                    }
                }
                if (input.attr("invalid") == "true") resolve(false);
            } else if ($(element).find('div.text-select:visible:not(:disabled)').length > 0) { // blur to text-select
                $(element).find('div.text-select:visible:not(:disabled)').attr("tabindex", -1).blur();
            }

            element.removeClass('active').removeClass("cell-selected").removeClass("active-nobg");
            resolve(true);
        });         
    }
    
    CellFocus(element) {


        let self = this;
        if (element.closest("table").length == 0) return;
        if ($(element).find('input').length == 0)
        element.addClass('active');
        self.table.find(".row-focus").remove();
        $(element).closest('tr').find('th').prepend('<div class="row-focus" onmouseup="RowFocusMouseUp()" style="float: left;"><i class="glyphicon glyphicon-triangle-right"></i></div>');
        $(element).closest('tr').addClass("selected");
        
        if ($(element).find('input').length > 0 && $(element).find('input')[0].type == "text") { //focus to input
            element.addClass('active');
            let input = $('#' + $(element).find('input').attr('id'));
            input.focus();
            window.setTimeout(function () {
                input.prop("selectionStart", 0).prop("selectionEnd", input.value().length).select();
            }, 0);            
        } else {
            if ($(element).find('div.text-select:visible:not(:disabled)').length > 0) { // focus to text-select
                window.setTimeout(function () {
                    $(element).find('div.text-select:visible:not(:disabled)').attr("tabindex", -1).focus();
                }, 0);
            } else {
                if ($(element).closest(".popup-modal-background").length > 0) {
                    $(element).closest('.popup-modal-background').focus();
                } else {
                    $(element).closest('.s3tcloud-prefix.form-container').focus();
                }
            }
        }
        self.ClusterizeData.column_selected_index = $(element).siblings(":visible").addBack().index(element);
        if ($(element).attr('showinfomessage') == "true" || $(element).attr('showinfomessage') == true)
            self.options.ShowInvoiceInfoCallback && self.options.ShowInvoiceInfoCallback(element);
    }

    KeyDown(e) {
        let self = this;
        let row, header, totalJump, current_row_id;
        let focus = $(":focus");
        let scroll = self.scroll;
        let clusterize_data = self.ClusterizeData;
        if (focus.is(self.ColumnSearchElement)) return;

        if (e.ctrlKey && e.keyCode == 13) { //Ctrl + enter
            //do nothing

            return;
        }

        if (e.altKey && e.keyCode == 40) { //alt + down
            if ($(".ui-autocomplete:visible").length > 0) {
                return;
            }
            if (focus.is('input')) {

            } else {
                $("thead th", self.table).each(function () {
                    if ($(this).attr("filterable") != "false" && $(this).offset().left == $("td.active", self.table).offset().left) {
                        self.ShowFilter($(this).find(".table-header-filter"));
                    }
                });
                e.preventDefault();
            }

            return;
        }

        if (e.altKey && e.keyCode == 38) { //alt + up
            if ($(".ui-autocomplete:visible").length > 0) {
                return;
            }
            if (focus.is('input')) {

            } else {
                if (typeof TableColumnFilter_ResetFilter == "function")
                TableColumnFilter_ResetFilter(self.table.attr("controlid"));
                e.preventDefault();
            }

            return;
        }

        if (e.ctrlKey && e.keyCode == 70) { //ctrl + F
            if ($(".ui-autocomplete:visible").length > 0) {
                return;
            }

            //show search box
            let searchBox = self.parent.find(".table-search");
            let searchBoxEvent = function (element) {
                let _search = $(element).value();
                if (!_search) return;

                let _rowindex = 0;
                let _colIndex = 0;
                let _match = false;
                let _cols = self.ColumnSearches();

                if (element.attr("row-index") && element.attr("col-index")) {
                    _rowindex = parseInt(element.attr("row-index"));
                    _colIndex = parseInt(element.attr("col-index")) + 1;
                }

                for (let i = _rowindex; i < self.ClusterizeData.data_filter.length; i++) {
                    _rowindex = i;

                    for (let j = _colIndex; j < _cols.length; j++) {
                        if (self.Search(self.ClusterizeData.data_filter[i][_cols[j].ColName], _cols[j].DataType, _search)) {
                            _colIndex = j;
                            _match = true;
                            break;
                        }
                    }

                    if (_match == true) break;

                    //Reset from column first
                    _colIndex = 0;
                }

                if (_match == true) {
                    //focus cell
                    element.attr("row-index", _rowindex);
                    element.attr("col-index", _colIndex);
                    self.ClusterizeData.column_selected_index = _colIndex + 1;
                    self.SearchCellFocus(_rowindex, self.ClusterizeData.column_selected_index, "NORMAL");
                } else {
                    element.removeAttr("row-index");
                    element.removeAttr("col-index");
                }
            }
            let searchBoxMove = ($sbox) => {
                $(window).on('mouseup', function (e) {
                    $(document).unbind('mousemove');
                });
                $($sbox).on('mousedown', function (e) {
                    $sbox.attr('offsetleft', e.pageX - $(this).offset().left);
                    $sbox.attr('offsettop', e.pageY - $(this).offset().top);

                    $(document).bind('mousemove', function (e) {
                        let x = e.pageX - parseInt($sbox.attr('offsetleft'));
                        let y = e.pageY - parseInt($sbox.attr('offsettop'));

                        let x_allowed = x >= $sbox.parent().parent().offset().left && x < $sbox.parent().parent().offset().left + $sbox.parent().parent().width() - $sbox.parent().width();
                        let y_allowed = y >= $sbox.parent().parent().offset().top && y < $sbox.parent().parent().offset().top + $sbox.parent().parent().height() - $sbox.parent().height();

                        if (x_allowed) {
                            $sbox.parent().css({ 'left': x + 'px' });
                        } else {
                            //fine tune tweaks
                            if (x < $sbox.parent().parent().offset().left) {
                                $sbox.parent().css({ 'left': $sbox.parent().parent().offset().left + 'px' });
                            } else {
                                $sbox.parent().css({ 'left': ($sbox.parent().parent().offset().left + $sbox.parent().parent().width() - $sbox.parent().width()) + 'px' });
                            }
                        }
                        if (y_allowed) {
                            $sbox.parent().css({ 'top': y + 'px' });
                        } else {
                            //fine tune tweaks
                            if (y < $sbox.parent().parent().offset().top) {
                                $sbox.parent().css({ 'top': $sbox.parent().parent().offset().top + 'px' });
                            } else {
                                $sbox.parent().css({ 'top': ($sbox.parent().parent().offset().top + $sbox.parent().parent().height() - $sbox.parent().height()) + 'px' });
                            }
                        }
                    });
                });
            }

            if (searchBox.length == 0) {
                $(self.parent).prepend('<div class="table-search"><div class="search-box"><input type="text" class="table-search-input" placeholder="What are you looking for?"><button type="button" class="table-search-button"><i class="fa fa-search"></i></button></div></div>')
                    .ready(function () {
                        searchBox = self.parent.find(".table-search");
                        searchBoxMove($('.search-box', $(searchBox)));
                        searchBox.find("input").on("keydown", function (e) {
                            if (!e.ctrlKey && !e.shiftKey && !e.altKey && (e.keyCode == 13 || e.keyCode == 9)) {
                                searchBoxEvent(searchBox.find("input"));
                            }
                        });
                        searchBox.find("button").on("mousedown", function (e) {
                            searchBoxEvent(searchBox.find("input"));
                        });
                        searchBox.css({ top: self.parent.offset().top + self.parent.height() / 2, left: self.parent.offset().left + self.parent.width() / 2 - searchBox.width() / 2 });
                        searchBox.show();
                        searchBox.find("input").focus();
                    })
            } else {
                searchBox.show();
                searchBox.find("input").val("");
                searchBox.find("input").focus();
            }

            return;
        }

        if (e.ctrlKey && e.keyCode == 67) { //ctrl + C
            if ($(".ui-autocomplete:visible").length > 0) {
                return;
            }
            if (focus.is('input')) {

            } else {
                self.CopyCellSelected();
                e.preventDefault();
            }

            return;
        }

        if (e.ctrlKey && e.keyCode == 65) { //ctrl + A
            if ($(".ui-autocomplete:visible").length > 0) {
                return;
            }
            if ($("#customtextselectbackground:visible").length > 0) {
                return;
            }
            if (focus.is('input') && focus.closest("tr").length == 0) {
                return;
            }

            let multiSelect = self.table.attr("multi-select");
            if (multiSelect == "true") {
                self.SelectAllRowHeaders();
            }
            return;
        }

        if (e.ctrlKey && e.keyCode == 36) { //ctrl + Home
            if ($(".ui-autocomplete:visible").length > 0) {
                e.preventDefault();
                return;
            }
            if ($("#customtextselectbackground:visible").length > 0) {
                e.preventDefault();
                return;
            }
            self.OnCtrlHome();
            return;
        }

        if (e.ctrlKey && e.keyCode == 35) { //ctrl + End
            if ($(".ui-autocomplete:visible").length > 0) {
                e.preventDefault();
                return;
            }
            if ($("#customtextselectbackground:visible").length > 0) {
                e.preventDefault();
                return;
            }
            if (focus.is('input') && focus.closest("tr").length == 0) return;
            if (focus.is('input') && focus.closest("tr").length > 0 && focus.closest("td").hasClass("active-nobg")) return;

            row = self.table.find('tbody tr.selected:first');
            clusterize_data.current_row_id = clusterize_data.data_filter[clusterize_data.data_filter.length - 1][self.options.Key];

            scroll.find(".clusterize-content").attr("event-trigger", "CtrlEnd");
            scroll[0].scrollTop = row.closest("table").height();

            row.closest("tbody").find(".cell-selected").removeClass("cell-selected");
            row.find('td.active').removeClass('active active-nobg');
            row.closest("tbody").find(".selected").removeClass("selected");
            row.closest("tbody").find('tr:visible:last:not(".clusterize-extra-row")').addClass("selected");
            self.FocusToInput(self.table.find('tbody tr.selected:first td:visible:last'));

            if (clusterize_data.data.length > 80) {
                setTimeout(function () {
                    self.table.find('tbody tr.selected:first td').removeClass("active-nobg active cell-selected");
                    self.FocusToInput(self.table.find('tbody tr.selected:first td:visible:last'));

                    self.Horizontal(self.table.find('tbody tr.selected:first td:visible:last'), false);
                }, 10);
            } else {
                self.Horizontal(self.table.find('tbody tr.selected:first td:visible:last'), false);
            }

            return;
        }

        switch (e.keyCode) {
            case 115: //F4   
                e.preventDefault();
                if ($(".ui-autocomplete:visible").length > 0) {
                    return;
                }
                if ($("#customtextselectbackground:visible").length > 0) {
                    return;
                }

                e.preventDefault();

                if ($('.s3table-search', $('.button-quick-search', $(self.table).closest('.s3tcloud-prefix.form-container'))).length > 0) {
                    self.ColumnSearchElement = $('.s3table-search', $('.button-quick-search', $(self.table).closest('.s3tcloud-prefix.form-container')));
                    self.ColumnSearchElement.focus();
                };

                break;
            case 33: //PageUp
                if ($(".ui-autocomplete:visible").length > 0) {
                    e.preventDefault();
                    return;
                }
                if ($("#customtextselectbackground:visible").length > 0) {
                    e.preventDefault();
                    return;
                }
                if (focus.is('input') && focus.closest("tr").length == 0) return;
                if (focus.is('input') && focus.closest("tr").length > 0 && focus.closest("td").hasClass("active-nobg")) return;

                e.preventDefault();

                row = self.table.find('tbody tr.selected:first');
                header = scroll.find("thead");
                totalJump = Math.floor((scroll.height() - header.height()) / row.height());
                scroll[0].scrollTop -= totalJump * row.height();

                current_row_id = row.find("th").attr("clusterize_row_id");
                var index = clusterize_data.data.findIndex(function (o) {
                    return o[self.options.Key] == current_row_id;
                });

                if (index - totalJump < 0) {
                    clusterize_data.current_row_id = clusterize_data.data[0][self.options.Key];
                } else {
                    clusterize_data.current_row_id = clusterize_data.data[index - totalJump][self.options.Key];
                }
                row.closest("tbody").find(".selected").removeClass("selected");
                row.closest("tbody").find(".cell-selected").removeClass("cell-selected");
                row.closest("tbody").find(".active").removeClass("active-nobg active");
                self.Focus();
                break;
            case 34: //PageDown
                if($(".ui-autocomplete:visible").length > 0) {
                    e.preventDefault();
                    return;
                }
                if ($("#customtextselectbackground:visible").length > 0) {
                    e.preventDefault();
                    return;
                }
                if (focus.is('input') && focus.closest("tr").length == 0) return;
                if (focus.is('input') && focus.closest("tr").length > 0 && focus.closest("td").hasClass("active-nobg")) return;

                e.preventDefault();

                row = self.table.find('tbody tr.selected:first');
                header = scroll.find("thead");
                totalJump = Math.floor((scroll.height() - header.height()) / row.height());
                scroll[0].scrollTop += totalJump * row.height();

                current_row_id = row.find("th").attr("clusterize_row_id");
                var index = clusterize_data.data.findIndex(function (o) {
                    return o[self.options.Key] == current_row_id;
                });

                if (index + totalJump > clusterize_data.data.length - 1) {
                    clusterize_data.current_row_id = clusterize_data.data[clusterize_data.data.length - 1][self.options.Key];
                } else {
                    clusterize_data.current_row_id = clusterize_data.data[index + totalJump][self.options.Key];
                }
                row.closest("tbody").find(".selected").removeClass("selected");
                row.closest("tbody").find(".cell-selected").removeClass("cell-selected");
                row.closest("tbody").find(".active").removeClass("active-nobg active");
                self.Focus();
                break;
            case 35: //End        
                if ($(".ui-autocomplete:visible").length > 0) {
                    e.preventDefault();
                    return;
                }
                if ($("#customtextselectbackground:visible").length > 0) {
                    e.preventDefault();
                    return;
                }
                if (focus.is('input') && focus.closest("tr").length == 0) return;
                if (focus.is('input') && focus.closest("tr").length > 0 && focus.closest("td").hasClass("active-nobg")) return;

                e.preventDefault();

                row = self.table.find('tbody tr.selected:first');
                row.closest("tbody").find(".cell-selected").removeClass("cell-selected");
                row.find('td.active').removeClass('active-nobg active');
                self.FocusToInput(self.table.find('tbody tr.selected:first td:visible:last'));

                self.Horizontal(self.table.find('tbody tr.selected:first td:visible:last'), false);
                break;
            case 36: //Home
                if ($(".ui-autocomplete:visible").length > 0) {
                    e.preventDefault();
                    return;
                }
                if ($("#customtextselectbackground:visible").length > 0) {
                    e.preventDefault();
                    return;
                }
                if (focus.is('input') && focus.closest("tr").length == 0) return;
                if (focus.is('input') && focus.closest("tr").length > 0 && focus.closest("td").hasClass("active-nobg")) return;

                e.preventDefault();

                row = self.table.find('tbody tr.selected:first');
                row.closest("tbody").find(".cell-selected").removeClass("cell-selected");
                row.find('td.active').removeClass('active-nobg active');
                self.FocusToInput(self.table.find('tbody tr.selected:first td:visible:first'));

                self.Horizontal(self.table.find('tbody tr.selected:first td:visible:first'), true);
                break;
            case 13: //Enter
                if (e.ctrlKey || e.shiftKey || e.altKey) break;
                let now = Date.now();
                if (now - self.options.KeyEnter < 100) return; // less than 50 milisecond ago, stop
                self.options.KeyEnter = now;
                row = self.table.find('tbody tr.selected:first');
                let moveRight = function () {

                    let execMoveRight = function () {
                        let row = self.table.find('tbody tr.selected:first');
                        row.closest("tbody").find(".cell-selected").removeClass("cell-selected");
                        var index = row.find('td.active').index() == -1 ? 1 : row.find('td.active').index();

                        if (index < row.find('td:visible:last').index()) {
                            self.OnKeyRight();
                        } else if (index == row.find('td:visible:last').index()) {
                            self.OnKeyDown(true, true);// enter to next row
                            self.options.DetailCallback && self.options.DetailCallback();
                        }
                    }

                    execMoveRight();
                }

                let isEnd = row.closest("tbody").find(".active").attr("end");
                if (self.table.attr("type") == "tree" && (isEnd == true || isEnd == "true")) {
                    let screenInfo = $(row).closest('table').data('screen-info');
                    let htmlId = $(row).closest('table').attr('htmlid');

                    if (!screenInfo) {
                        let index = ApplicationInstance.Menu.findIndex(function (o) {
                            return o.ControlId == htmlId;
                        });
                        screenInfo = new Object();
                        let childId = ApplicationInstance.Menu[index].ChildId;
                        index = ApplicationInstance.Menu.findIndex(function (o) {
                            return o[self.options.Key] == childId;
                        })
                        if (index == -1) {
                            moveRight();
                        }
                    }
                    ShowChildTreeTable(clusterize_data, row);
                } else {
                    let cell = row.find("td.active");
                    if ($(cell).hasClass("enter-remove-row")) {
                        //check language
                        if ($(cell).hasClass("sub-language") && ApplicationInstance.Uservar.BillingualLanguage != 1) {
                            moveRight();
                            return;
                        }

                        if ($(cell.find("input")).val() != "") {
                            moveRight();
                            return;
                        }
                        if (self.table.find('tbody tr').length == 1) {
                            moveRight();
                            return;
                        }
                        let removerowcallback = $(cell).attr("removerowcallback");    
                        let next = row.next();
                        if (next.is("tr")) {
                            this.DeleteRow($(cell).closest("tr"));
                        } else {
                            // focus to next input of form
                            let input = $(self.scroll.next()).find("input:visible:not(:disabled):first");
                            if (input.length > 0) {
                                this.DeleteRow($(cell).closest("tr"), true);
                                input.select().focus();
                            } else {
                                this.DeleteRow($(cell).closest("tr"));
                            }
                        }
                        if (removerowcallback && eval("typeof " + removerowcallback + " == 'function'")) {
                            let cb = eval(removerowcallback);
                            cb($(cell.find("input")));
                        }
                    } else {
                        moveRight();
                    }
                }
                break;
            case 37: //Left
                //e.preventDefault();
                //if ($("#customtextselectbackground:visible").length > 0) {
                //    e.preventDefault();
                //    return;
                //}
                if (focus.is('input') && focus.closest("tr").length == 0) {
                    return;
                }
                if (document.activeElement.tagName == 'INPUT') {
                    if (!$(document.activeElement).closest('td').hasClass('active-nobg') || $(document.activeElement).hasClass("text-option")) {
                        e.preventDefault();
                        self.OnKeyLeft();
                    }
                } else {
                    self.OnKeyLeft();
                }

                break;
            case 39: //Right
                //e.preventDefault();
                if (focus.is('input') && focus.closest("tr").length == 0) {
                    return;
                }
                //if ($("#customtextselectbackground:visible").length > 0) {
                //    e.preventDefault();
                //    return;
                //}
                if (document.activeElement.tagName == 'INPUT') {
                    if (!$(document.activeElement).closest('td').hasClass('active-nobg') || $(document.activeElement).hasClass("text-option")) {
                        e.preventDefault();
                        self.OnKeyRight();
                    }
                } else {
                    self.OnKeyRight();
                }

                break;
            case 38: //Up
                //e.preventDefault();
                if (focus.is('input') && focus.closest("tr").length == 0) {
                    return;
                }
                if ($("#customtextselectbackground:visible").length > 0) {
                    e.preventDefault();
                    return;
                }
                if (document.activeElement.tagName == 'INPUT') {
                    if (!$(document.activeElement).closest('td').hasClass('active-nobg') || $(document.activeElement).hasClass("text-option")) {
                        e.preventDefault();
                        self.OnKeyUp();
                    }
                } else {
                    self.OnKeyUp();
                }

                break;
            case 40: //Down    
                //e.preventDefault();
                if (focus.is('input') && focus.closest("tr").length == 0) {
                    return;
                }
                if ($("#customtextselectbackground:visible").length > 0) {
                    e.preventDefault();
                    return;
                }
                if (document.activeElement.tagName == 'INPUT') {
                    if (!$(document.activeElement).closest('td').hasClass('active-nobg') || $(document.activeElement).hasClass("text-option")) {
                        e.preventDefault();
                        self.OnKeyDown();
                    }
                } else {
                    self.OnKeyDown();
                }
                break;
        }
    }

    OnKeyLeft() {
        let _self = this;
        let row = this.table.find('tbody tr.selected:first');
        row.closest("tbody").find(".cell-selected").removeClass("cell-selected");
        row.closest("tbody").find("th.active").removeClass("active");
        let index = row.find('td.active').index() == -1 ? 1 : row.find('td.active').index();
        if (index > row.find('td:visible:first').index()) {
            let current = row.find('td.active');
            _self.CellBlur(current).then(function (result) {
                let input = current.find('input');
                let moveNext = $(input).attr('validate-allow-move-next');
                let moveNext1St = $(input).attr('validate-allow-move-next-1st');
                if (result == true && moveNext != "false") {
                    let previous = row.children().eq(index - 1);
                    if (moveNext == "true" && moveNext1St == "true") {
                        previous = row.children().eq(index);
                    }
                    if (current.attr("hide") && current.attr("hide") == "false") {
                        if (previous.attr("hide") && previous.attr("hide") == "false") {
                            if (previous.hasClass("invisible-cell")) {
                                let previousIndex = index - 2;
                                while (previousIndex < row.children().length && (row.children().eq(previousIndex).hasClass("invisible-cell")
                                    || (row.children().eq(previousIndex).attr("hide") && row.children().eq(previousIndex).attr("hide") == "true"))) {
                                    previousIndex--;
                                }
                                previous = row.children().eq(previousIndex);
                            }
                        } else if (previous.attr("hide") && previous.attr("hide") == "true") {
                            previous = row.children().eq(index - 2);
                            if (previous.hasClass("invisible-cell")) {
                                let previousIndex = index - 2;
                                while (previousIndex < row.children().length && (row.children().eq(previousIndex).hasClass("invisible-cell")
                                    || (row.children().eq(previousIndex).attr("hide") && row.children().eq(previousIndex).attr("hide") == "true"))) {
                                    previousIndex--;
                                }
                                previous = row.children().eq(previousIndex);
                            }
                        } else {
                            if (previous.hasClass("invisible-cell")) {
                                let previousIndex = index - 2;
                                while (previousIndex < row.children().length && (row.children().eq(previousIndex).hasClass("invisible-cell")
                                    || (row.children().eq(previousIndex).attr("hide") && row.children().eq(previousIndex).attr("hide") == "true"))) {
                                    previousIndex--;
                                }
                                previous = row.children().eq(previousIndex);
                            }
                        }
                        _self.Horizontal(previous, true);
                        _self.CellFocus(previous);
                    } else if (current.attr("hide") && current.attr("hide") == "true") {

                    } else {
                        if (previous.attr("hide") && previous.attr("hide") == "false") {
                            if (previous.hasClass("invisible-cell")) {
                                let previousIndex = index - 2;
                                while (previousIndex < row.children().length && (row.children().eq(previousIndex).hasClass("invisible-cell")
                                    || (row.children().eq(previousIndex).attr("hide") && row.children().eq(previousIndex).attr("hide") == "true"))) {
                                    previousIndex--;
                                }
                                previous = row.children().eq(previousIndex);
                            }
                        } else if (previous.attr("hide") && previous.attr("hide") == "true") {
                            previous = row.children().eq(index - 2);
                            if (previous.hasClass("invisible-cell") || previous.hasClass("hide")) {
                                let previousIndex = index - 2;
                                while (previousIndex < row.children().length && (row.children().eq(previousIndex).hasClass("invisible-cell") || row.children().eq(previousIndex).hasClass("hide")
                                    || (row.children().eq(previousIndex).attr("hide") && row.children().eq(previousIndex).attr("hide") == "true"))) {
                                    previousIndex--;
                                }
                                previous = row.children().eq(previousIndex);
                            }
                        } else {
                            if (previous.hasClass("invisible-cell")) {
                                let previousIndex = index - 2;
                                while (previousIndex < row.children().length && (row.children().eq(previousIndex).hasClass("invisible-cell")
                                    || (row.children().eq(previousIndex).attr("hide") && row.children().eq(previousIndex).attr("hide") == "true"))) {
                                    previousIndex--;
                                }
                                previous = row.children().eq(previousIndex);
                            }
                        }
                        _self.Horizontal(previous, true);
                        _self.CellFocus(previous);
                    }
                } else {
                    $(input).closest("td").addClass("active");
                }
            });                
        }
    }

    OnKeyRight() {
        let _self = this;
        let row = _self.table.find('tbody tr.selected:first');
        row.closest("tbody").find(".cell-selected").removeClass("cell-selected");
        row.closest("tbody").find("th.active").removeClass("active");
        let index = row.find('td.active').index() == -1 ? 1 : row.find('td.active').index();
        if (index < row.find('td:visible:last').index()) {
            let current = row.find('td.active');
            _self.CellBlur(current).then(function (result) {
                let input = current.find('input');
                let moveNext = $(input).attr('validate-allow-move-next');
                let moveNext1St = $(input).attr('validate-allow-move-next-1st');

                if (result == true && moveNext != "false") {
                    row = _self.table.find('tbody tr.selected:first');
                    if ($(input).attr('id')) {
                        row = $('#' + $(input).attr('id')).closest('tr');
                    }
                    row.closest("tbody").find(".cell-selected").removeClass("cell-selected");
                    row.closest("tbody").find(".active").removeClass("active");
                    let next = row.children().eq(index + 1);
                    if (moveNext == "true" && moveNext1St == "true") {
                        next = row.children().eq(index);
                    }
                    if (current.attr("hide") && current.attr("hide") == "false") {
                        if (next.attr("hide") && next.attr("hide") == "false") {
                            if (next.hasClass("invisible-cell")) {
                                let nextIndex = index + 2;
                                while (nextIndex < row.children().length && (row.children().eq(nextIndex).hasClass("invisible-cell")
                                    || (row.children().eq(nextIndex).attr("hide") && row.children().eq(nextIndex).attr("hide") == "true"))) {
                                    nextIndex++;
                                }
                                next = row.children().eq(nextIndex);
                            }
                        } else if (next.attr("hide") && next.attr("hide") == "true") {
                            next = row.children().eq(index + 2);
                            if (next.hasClass("invisible-cell")) {
                                var nextIndex = index + 2;
                                while (nextIndex < row.children().length && (row.children().eq(nextIndex).hasClass("invisible-cell")
                                    || (row.children().eq(nextIndex).attr("hide") && row.children().eq(nextIndex).attr("hide") == "true"))) {
                                    nextIndex++;
                                }
                                next = row.children().eq(nextIndex);
                            }
                        } else {
                            if (next.hasClass("invisible-cell")) {
                                var nextIndex = index + 2;
                                while (nextIndex < row.children().length && (row.children().eq(nextIndex).hasClass("invisible-cell")
                                    || (row.children().eq(nextIndex).attr("hide") && row.children().eq(nextIndex).attr("hide") == "true"))) {
                                    nextIndex++;
                                }
                                next = row.children().eq(nextIndex);
                            }
                        }
                        _self.Horizontal(next, false);
                        _self.CellFocus(next);
                    } else if (current.attr("hide") && current.attr("hide") == "true") {

                    } else {
                        if (next.attr("hide") && next.attr("hide") == "false") {
                            if (next.hasClass("invisible-cell")) {
                                let nextIndex = index + 2;
                                while (nextIndex < row.children().length && (row.children().eq(nextIndex).hasClass("invisible-cell")
                                    || (row.children().eq(nextIndex).attr("hide") && row.children().eq(nextIndex).attr("hide") == "true"))) {
                                    nextIndex++;
                                }
                                next = row.children().eq(nextIndex);
                            }
                        } else if (next.attr("hide") && next.attr("hide") == "true") {
                            next = row.children().eq(index + 2);
                            if (next.hasClass("invisible-cell") || next.hasClass("hide")) {
                                var nextIndex = index + 2;
                                while (nextIndex < row.children().length && (row.children().eq(nextIndex).hasClass("invisible-cell") || row.children().eq(nextIndex).hasClass("hide")
                                    || (row.children().eq(nextIndex).attr("hide") && row.children().eq(nextIndex).attr("hide") == "true"))) {
                                    nextIndex++;
                                }
                                next = row.children().eq(nextIndex);
                            }
                        } else {
                            if (next.hasClass("invisible-cell")) {
                                var nextIndex = index + 2;
                                while (nextIndex < row.children().length && (row.children().eq(nextIndex).hasClass("invisible-cell")
                                    || (row.children().eq(nextIndex).attr("hide") && row.children().eq(nextIndex).attr("hide") == "true"))) {
                                    nextIndex++;
                                }
                                next = row.children().eq(nextIndex);
                            }
                        }
                        _self.Horizontal(next, false);
                        _self.CellFocus(next);
                    }
                } else {
                    $(input).closest("td").addClass("active");
                }
            });             
        }
    }

    OnKeyUp() {
        let _self = this;
        let row = _self.table.find('tbody tr.selected:first');
        row.closest("tbody").find(".cell-selected").removeClass("cell-selected");
        row.closest("tbody").find("th.active").removeClass("active");
        if (row != null && row.length > 0 && row.prev(':not(".clusterize-extra-row")').length > 0) {
            this.Vertical(row, true);
            let index = row.find('td.active').index() == -1 ? 1 : row.find('td.active').index();
            let current = row.find('td.active');
            _self.CellBlur(current).then(function (result) {
                let input = current.find('input');
                let moveNext = $(input).attr('validate-allow-move-next');
                let moveNext1St = $(input).attr('validate-allow-move-next-1st');
                if (result == true && moveNext != "false") {
                    row = _self.table.find('tbody tr.selected:first');
                    row.closest("tbody").find("tr").removeClass('selected');
                    row = row.prev();
                    let column = row.children().eq(index);
                    _self.CellFocus(column);

                    row.addClass('selected');
                    _self.ClusterizeData.current_row_id = row.find("th").attr("clusterize_row_id");
                    _self.SaveRowPosition(row);
                } else {
                    $(input).closest("td").addClass("active");
                }
            });            
        } else {
            if (row.closest(".clusterize-scroll").length > 0)
                row.closest(".clusterize-scroll")[0].scrollTop -= row.height();
        }
    }

    OnKeyDown(isEnd, isReset) {
        let _self = this;
        _self.options.KeyEnterNextRow = isEnd;
        let row = _self.table.find('tbody tr.selected:first');
        row.closest("tbody").find(".cell-selected").removeClass("cell-selected");
        row.closest("tbody").find("th.active").removeClass("active");
        let clusterize_data = _self.ClusterizeData;
        if (row != null && row.length > 0 && row.next(':not(".clusterize-extra-row")').length > 0) {
            clusterize_data.current_row_id = row.next().find("th").attr("clusterize_row_id");

            this.Vertical(row, false);
            let index = 0;
            if (isReset == true) {
                index = row.find('td:visible:first').index();
            } else {
                index = row.find('td.active').index() == -1 ? 1 : row.find('td.active').index();
            }
            let current = row.find('td.active');
            _self.CellBlur(current).then(function (result) {
                let input = current.find('input');
                let moveNext = $(input).attr('validate-allow-move-next');
                let moveNext1St = $(input).attr('validate-allow-move-next-1st');
                if (result == true && moveNext != "false") {
                    row = _self.table.find('tbody tr.selected:first');
                    row.closest("tbody").find("tr").removeClass('selected');
                    row = row.next();
                    let column = row.children().eq(index);
                    row.addClass('selected');
                    _self.ClusterizeData.current_row_id = row.find("th").attr("clusterize_row_id");
                    if (isReset == true) {
                        window.setTimeout(function () {
                            column = _self.table.find("tbody tr.selected:first").children().eq(index);
                            _self.Horizontal(column, true);
                            _self.CellFocus(column);
                        }, 0);
                    } else {
                        _self.CellFocus(column);
                    }
                    _self.SaveRowPosition(row);
                } else {
                    $(input).closest("td").addClass("active");
                }
            });               
        } else {
            if (row.closest(".clusterize-scroll").length > 0)
                row.closest(".clusterize-scroll")[0].scrollTop += row.height();
            if (isEnd == true) {
                _self.OnEnterCallback(row);                
            }
        }
    }

    OnCtrlHome(callback) {
        let self = this;
        let focus = $(":focus");
        let scroll = self.scroll;
        let clusterize_data = self.ClusterizeData;
        if (focus.is('input') && focus.closest("tr").length == 0 || clusterize_data.data.length == 0) return;
        if (focus.is('input') && focus.closest("tr").length > 0 && focus.closest("td").hasClass("active-nobg")) return;

        let row = self.table.find('tbody tr.selected:first');
        clusterize_data.current_row_id = clusterize_data.data_filter[0][self.options.Key];
        scroll.find(".clusterize-content").attr("event-trigger", "CtrlHome");
        scroll[0].scrollTop = 0;
        row.closest("tbody").find(".cell-selected").removeClass("cell-selected");
        row.find('td.active').removeClass('active');
        row.closest("tbody").find(".selected").removeClass("selected");
        row.closest("tbody").find('tr:visible:first:not(".clusterize-extra-row")').addClass("selected");

        self.FocusToInput(self.table.find('tbody tr.selected:first td:visible:first'));

        if (clusterize_data.data.length > 80) {
            setTimeout(function () {
                self.table.find('tbody tr.selected:first td').removeClass("active cell-selected active-nobg");
                let td = self.table.find('tbody tr.selected:first td:visible:first');
                if (td.length == 0)
                    td = self.table.find('tbody tr:first td:visible:first');
                self.FocusToInput(self.table.find('tbody tr.selected:first td:visible:first'));
                self.Horizontal(td, true);
                callback && callback();
            }, 10);
        } else {
            let td = self.table.find('tbody tr.selected:first td:visible:first');
            if (td.length == 0)
                td = self.table.find('tbody tr:first td:visible:first');
            self.Horizontal(td, true);
            callback && callback();
        }
    }

    OnEnterCallback(row) {
        let _self = this;
        let clusterize_data = _self.ClusterizeData;
        let tdLast = row.find("td:visible:last");
        let callback = tdLast.attr("entercallback");
        if (callback && eval("typeof " + callback + " == 'function'")) {
            let validateCallback = tdLast.find("input.text-number").attr("callbackvalidate");
            if (validateCallback && eval("typeof " + validateCallback + " == 'function'")) {
                //do nothing
            } else {
                _self.CellBlur(row.find('td.active')).then(function (result) {
                    if (result == true) {
                        callback = eval(callback);
                        let current_row_id = row.find("th").attr("clusterize_row_id");
                        let index = clusterize_data.data.findIndex(function (o) {
                            return o[_self.options.Key] == current_row_id;
                        });
                        let status = true;
                        let latest = row.find("td:visible:last");

                        if (index != -1) {
                            status = callback(clusterize_data.data[index], latest);
                        } else {
                            status = callback(null, latest);
                        }
                        if (status == true) {
                            row = _self.table.find('tbody tr.selected:first');
                            latest = row.prev().find("td:visible:last");
                            let input = latest.find("input");
                            let columnName = $(input).attr("column-name");
                            if (columnName && input.length > 0) {
                                current_row_id = row.prev().find("th").attr("clusterize_row_id");
                                index = clusterize_data.data.findIndex(function (o) {
                                    return o[_self.options.Key] == current_row_id;
                                });
                                $(input).value(clusterize_data.data[index][columnName]);
                            }
                            if (_self.CellBlur(row.find('td.active')) == false) return;
                            _self.CellBlur(row.find('td.active')).then(function (result2) {
                                if (result2 == true) {
                                    let index = row.find('td:visible:first').index();
                                    let column = row.children().eq(index);
                                    _self.Horizontal(row.find("td:visible:first"), true);
                                    _self.CellFocus(column);
                                }
                            });                            
                        } else {
                            let ignore = $(latest).attr("ignorefablefocus");
                            if (ignore == "true") {
                                $(latest).attr("ignorefablefocus", false);
                                _self.ClearFocus();
                            } else {
                                _self.CellBlur(row.find('td.active')).then(function (result2) {
                                    if (result2 == true) {
                                        window.setTimeout(function () {
                                            let column = _self.table.find('tbody tr.selected td:visible:first');
                                            _self.scroll[0].scrollLeft = 0;
                                            _self.scroll.find(".clusterize-content").attr("event-trigger", "Horizontal");
                                            _self.CellFocus(column);
                                        }, 0);
                                    }
                                });
                            }
                        }
                    }
                });
                
            }
        } else {
            _self.CellBlur(row.find('td.active')).then(function (result) {
                if (result == true) {
                    window.setTimeout(function () {
                        let column = _self.table.find('tbody tr.selected td:visible:first');
                        _self.scroll[0].scrollLeft = 0;
                        _self.scroll.find(".clusterize-content").attr("event-trigger", "Horizontal");
                        _self.CellFocus(column);
                    }, 0);
                }
            });              
        }
    }

    Vertical(element, isUp) {
        let table = this.table;
        let scroll = this.scroll;

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

            if (elementTop + 2 * elementHeight > scrollHeight) {
                scroll[0].scrollTop += elementTop + 2 * elementHeight - scrollHeight + 1;
            }
        } else {// key up
            if (elementTop - elementHeight < 0) {
                scroll[0].scrollTop += elementTop - elementHeight + 1;
            }
        }
    }

    Horizontal(element, isLeft) {
        let table = this.table;
        let scroll = this.scroll;
        let container = scroll;
        let parentPos = table.offset();
        let childOffset;
        let childPos;
        if (element.length > 0) {
            childPos = element.offset();            
            childOffset = {
                top: childPos.top - parentPos.top,
                left: childPos.left - parentPos.left
            }
        }
        
        if (table.find("tr.selected").length > 0 && !table.find("tr.selected").is(element.closest("tr"))) {
            element = table.find("tr td.active");
            if (element.length > 0) {
                childPos = element.offset();
                childOffset = {
                    top: childPos.top - parentPos.top,
                    left: childPos.left - parentPos.left
                }
            } else {
                scroll[0].scrollLeft = 0;
                scroll.find(".clusterize-content").attr("event-trigger", "Horizontal");
                return;
            }
        }
        
        if (isLeft == false) {// key right        
            if ($(element).siblings(":visible").addBack().index(element) == scroll.find("col:visible").length - 1) {
                scroll[0].scrollLeft = scroll[0].scrollWidth;
                scroll.find(".clusterize-content").attr("event-trigger", "Horizontal");
            } else {
                if (childOffset.left + element.outerWidth() > container.width() + scroll.scrollLeft()) {
                    scroll[0].scrollLeft += childOffset.left + element.outerWidth() - (container.width() + scroll.scrollLeft()) + S3TScrollBarWidth;
                    scroll.find(".clusterize-content").attr("event-trigger", "Horizontal");
                }
            }
        } else {// key left
            if ($(element).siblings(":visible").addBack().index(element) == 1) {
                if (scroll[0].scrollLeft != 0)
                    scroll.find(".clusterize-content").attr("event-trigger", "Horizontal");
                scroll[0].scrollLeft = 0;
            } else {
                let th = element.closest("tr").find("th");
                if (scroll[0].scrollWidth - childOffset.left + th.outerWidth() > scroll[0].scrollWidth - scroll.scrollLeft() && scroll.scrollLeft() > 0) {
                    scroll[0].scrollLeft -= scroll.scrollLeft() - childOffset.left + th.outerWidth();
                    scroll.find(".clusterize-content").attr("event-trigger", "Horizontal");
                }
            }
        }
    }

    FocusToInput(element) {
        element.addClass("active cell-selected");
        if (element.find("input").length > 0 && element.find("input").attr("readonly") != "readonly") {
            if (element.find("input").hasClass("text-date") || element.find("input").hasClass("text-option")) {
                element.find("input").focus();
            } else {
                element.find("input").focus().select();
            }
        }
    };

    ColumnSearches(cell) {
        let _self = this;

        if (cell == undefined) {
            let dataout = [];

            _self.ColumnHeaders
                .filter(head => !head.LastHide && head.ColName)
                .forEach((head) => {
                    dataout.push({ ColName : head.ColName, DataType : head.DataType });
                })

            let helper = {};
            dataout = dataout.reduce(function (r, o) {
                let key = o.ColName;

                if (!helper[key]) {
                    helper[key] = Object.assign({}, o); // create a copy of o
                    r.push(helper[key]);
                }

                return r;
            }, []);

            return dataout;
        } else {
            let dataout = {};
            let index = $(cell).index() - 1;

            _self.ColumnHeaders
                .filter(head => !head.LastHide && head.ColName && head.ColIndex == index)
                .every((head) => {
                    dataout.ColName = head.ColName;
                    dataout.DataType = head.DataType;
                })

            return dataout;
        }
    }

    BuildQuickSearch() {
        if ($('.s3table-search', $('.button-quick-search', $(this.table).closest('.s3tcloud-prefix.form-container'))).length > 0) {
            this.ColumnSearchElement = $('.s3table-search', $('.button-quick-search', $(this.table).closest('.s3tcloud-prefix.form-container')));

            this.ColumnSearchElement
                .off("focus").on("focus", function (e) {
                    let _table = $(this).closest(".s3tcloud-prefix").find("table tbody td.active:first").closest("table").attr("controlid");
                    if (_table) { 
                        let _self = eval(_table + "_S3Table");

                        if (_self.table.find("tbody tr.selected td.active").length > 0) {
                            let dataout = _self.ColumnSearches(_self.table.find("tbody tr.selected td.active"));
                            if (dataout != null) {
                                _self.ColumnSearchResultIndex = -1;
                                _self.ColumnSearchName = dataout.ColName;
                                _self.ColumnSearchType = dataout.DataType;
                            }
                        }
                    }
                })
                .off("keydown").on("keydown", function (e) {
                    let element = this;
                    if (e.keyCode == 13 || e.keyCode == 38 || e.keyCode == 40) { //Enter Up Down
                        window.setTimeout(function () {
                            $(element).blur();
                        });
                    }
                })
                .off("blur").on("blur", function (e) {
                    $(this).val('');

                    let _table = $(this).closest(".s3tcloud-prefix").find("table tbody td.active:first").closest("table").attr("controlid");
                    if (_table) { 
                        let _self = eval(_table + "_S3Table");
                        _self.Focus();
                    }
                })
                .off("input").on("input", function (e) {
                    let _table = $(this).closest(".s3tcloud-prefix").find("table tbody td.active:first").closest("table").attr("controlid");
                    if (_table) { 
                        let _self = eval(_table + "_S3Table");

                        if (_self.ColumnSearchName && $(this).val().trim() != "") {
                            let _rowindex = -1;
                            let _searchvalue = $(this).val();

                            for (let rowindex = 0; rowindex < _self.ClusterizeData.data_filter.length; rowindex++) {
                                //if (_self.Search(_self.ClusterizeData.data_filter[rowindex][_self.ColumnSearchName], _self.ColumnSearchType, _searchvalue, true))
                                if (_self.Search(_self.ClusterizeData.data_filter[rowindex][_self.ColumnSearchName], _self.ColumnSearchType, _searchvalue, false))//20230609: Sua tim kiem nhanh thanh contain
                                {
                                    _rowindex = rowindex;
                                    break;
                                }
                            }

                            if (_rowindex != -1 && _rowindex != _self.ColumnSearchResultIndex) {
                                //focus cell
                                _self.SearchCellFocus(_rowindex, _self.ClusterizeData.column_selected_index);
                            }
                        }
                    }
                })
        }
    }

    //searchtype: true (==), false (contains)
    Search(datavalue, datatype, searchvalue, searchtype) {
        let _dataout = false;

        if ((datatype == 'number' || typeof datavalue == 'number')) {
            _dataout = datavalue.toString().substr(0, searchvalue.length) == searchvalue;
        } else if (datatype == 'date-short') {
            _dataout = datetimeToStringShort(datavalue).substr(0, searchvalue.length) == searchvalue;
        } else if (datatype == 'date-medium') {
            _dataout = datetimeToStringMedium(datavalue).substr(0, searchvalue.length) == searchvalue;
        } else if (typeof datavalue != 'boolean' && datavalue) {
            searchvalue = removeVietnameseTones(searchvalue).toUpperCase();
            datavalue = removeVietnameseTones(datavalue).toUpperCase();

            _dataout = searchtype ? datavalue.substr(0, searchvalue.length) == searchvalue : datavalue.includes(searchvalue);
        }

        return _dataout;
    }

    SearchCellFocus(rowindex, colindex, type) {
        let _self = this;

        _self.ColumnSearchResultIndex = rowindex;
        _self.table.find("tbody td.active").closest('tr').removeClass("selected");
        _self.table.find("tbody td.active").removeClass("active").removeClass("cell-selected");
        _self.ClusterizeData.current_row_id = _self.ClusterizeData.data_filter[rowindex][_self.options.Key];
        _self.scroll.find(".clusterize-content").attr("scroll-type", "search");
        if (S3TTableRowHeight * rowindex > _self.scroll[0].scrollHeight - S3TScrollBarWidth - _self.scroll.outerHeight()) {
            _self.scroll[0].scrollTop = _self.scroll[0].scrollHeight - _self.scroll.outerHeight();
        } else {
            let hiddenrows = parseInt(((_self.scroll.outerHeight() - _self.table.find("thead td").outerHeight()) / S3TTableRowHeight) / 2);
            _self.scroll[0].scrollTop = S3TTableRowHeight * (rowindex - hiddenrows);
        }
        
        //set active cell
        $("tbody tr th[clusterize_row_id=" + _self.ClusterizeData.current_row_id + "]", $(_self.table)).closest('tr').addClass('selected');
        $("tbody tr th[clusterize_row_id=" + _self.ClusterizeData.current_row_id + "]", $(_self.table)).closest('tr').children(':visible').eq(colindex).addClass('active');
        _self.table.find(".row-focus").remove();
        $("tbody tr th[clusterize_row_id=" + _self.ClusterizeData.current_row_id + "]", $(_self.table)).closest('tr').find("th").prepend('<div class="row-focus" onmouseup="RowFocusMouseUp()" style="float: left;"><i class="glyphicon glyphicon-triangle-right"></i></div>');
        //fire callback
        _self.options.DetailCallback && _self.options.DetailCallback();
    }

    MakeHeaderList() {
        let _self = this;
        let _headers = [];
        let _columnheaders = Array.from(Array($('thead tr', _self.table).length), () => new Array($('colgroup col', _self.table).length));

        let colspan = (headerindex, rowindex, value) => {
            let colstart = 0;

            for (let index = 0; index < $('colgroup col', _self.table).length; index++) {
                if (_columnheaders[rowindex][index] == undefined) {
                    colstart = index;
                    break;
                }
            }

            for (let index = colstart; index < colstart + value; index++) {
                _columnheaders[rowindex][index] = { Index: headerindex, ColIndex: colstart, Colspan: (value > 1) };
            }

            return colstart;
        }

        let rowspan = (headerindex, colindex, value) => {
            let rowstart = 0;

            for (let index = 0; index < $('thead tr', _self.table).length; index++) {
                if (_columnheaders[index][colindex] == undefined) {
                    rowstart = index;
                    break;
                }
            }

            for (let index = rowstart; index < rowstart + value - 1; index++) {
                _columnheaders[index][colindex] = { Index: headerindex, ColIndex: colindex, Colspan: false };
            }

            return rowstart;
        }

        $('thead tr', $(_self.table)).each((_rowindex, tr) => {
            let _tr = tr;

            let _columnindex = 0;
            $('th', $(_tr)).each((_colindex, th) => {
                let _colspan = $(th).attr('colspan') != undefined ? parseInt($(th).attr('colspan')) : 1;
                let _rowspan = $(th).attr('rowspan') != undefined ? parseInt($(th).attr('rowspan')) : 1;

                _columnindex = colspan(_colindex, _rowindex, _colspan);

                if (_rowspan > 1) {
                    rowspan(_colindex, _columnindex, _rowspan);
                }

                _columnindex += _colspan;
            })
        })

        let MakeHeaderTree = function(rowindex, colindex) {
            let header = {};

            header.X = rowindex + 1;
            header.Y = _columnheaders[rowindex][colindex].Index + 1;

            header.Index = _columnheaders[rowindex][colindex].Index;
            header.ColIndex = _columnheaders[rowindex][colindex].ColIndex;
            header.Control = $('th:nth-of-type(' + (_columnheaders[rowindex][colindex].Index + 1) + ')', $('thead tr:nth-of-type(' + (rowindex + 1) + ')', $(_self.table)));

            header.ColName = $(header.Control).attr('colname');
            header.DataType = $(header.Control).attr('datatype');
            header.UsedInCodeOnly = $($('colgroup col', _self.table)[_columnheaders[rowindex][colindex].ColIndex + 1]).hasClass('used-in-code-only') ||
                $($('colgroup col', _self.table)[_columnheaders[rowindex][colindex].ColIndex + 1]).hasClass('main-language') ||
                $($('colgroup col', _self.table)[_columnheaders[rowindex][colindex].ColIndex + 1]).hasClass('sub-language');

            header.LastHide = header.OriginalHide = $(header.Control).css('display') == 'none';
            header.LastWidth = header.OriginalWidth = parseInt($($('colgroup col', _self.table)[_columnheaders[rowindex][colindex].ColIndex + 1]).attr('width'));
            header.LastColspan = header.OriginalColspan = $(header.Control).attr('colspan') == undefined ? 1 : parseInt($(header.Control).attr('colspan'));
            header.LastRowspan = header.OriginalRowspan = $(header.Control).attr('rowspan') == undefined ? 1 : parseInt($(header.Control).attr('rowspan'));
 
            header.ChildHeaders = [];
            header.ParentHeader = null;

            if (_columnheaders[rowindex][colindex].Colspan && rowindex < _columnheaders.length - 1) {
                for (let _colindex = colindex; _colindex < _columnheaders[0].length; _colindex++) {
                    if (_columnheaders[rowindex][_colindex] != undefined && _columnheaders[rowindex][_colindex].ColIndex == colindex &&
                        (_colindex == 0 || _columnheaders[rowindex + 1][_colindex - 1].ColIndex != _columnheaders[rowindex + 1][_colindex].ColIndex)) {
                        //Make child
                        let child = MakeHeaderTree(rowindex + 1, _colindex);

                        //Add parent
                        child.ParentHeader = header;

                        //Add child to parent
                        header.ChildHeaders.push(child);
                    }
                }
            }

            //Add to list
            _headers.push(header);

            //
            return header;
        }

        if (_columnheaders.length > 0) {
            let _headertree = [];
            for (let index = 0; index < _columnheaders[0].length; index++) {
                if (_columnheaders[0][index] != undefined && (index == 0 || _columnheaders[0][index - 1].ColIndex != _columnheaders[0][index].ColIndex)) {
                    _headertree.push(MakeHeaderTree(0, _columnheaders[0][index].ColIndex));
                }
            }
        }

        _self.ColumnHeaders = _headers;

        //Load saved columns
        this.LoadColumnWidths();
    }

    HideColumn(header) {
        let index = this.ColumnHeaders.findIndex(function (o) {
            return $(o.Control).is(header);
        })

        if (index != -1) {
            this.HideColumnByHeader(this.ColumnHeaders[index]);
        }
    }

    HideColumnByXY(x, y) {
        let index = this.ColumnHeaders.findIndex(function (o) {
            return o.X == x && o.Y == y;
        })

        if (index != -1) {
            this.HideColumnByHeader(this.ColumnHeaders[index]);
        }
    }

    IsLanguageColumn(header) {
        let headers = [];

        let collectheaders = (cell) => {
            headers.push(cell);

            if (!cell.ChildHeaders != null && cell.ChildHeaders.length > 0) {
                cell.ChildHeaders.forEach((child) => {
                    collectheaders(child);
                });
            }
        }

        let islanguagecolumn = (headers) => {
            let dataout = false;

            for (let index = 0; index < headers.length; index++) {
                if ($(headers[index].Control).hasClass('main-language') || $(headers[index].Control).hasClass('sub-language')) {
                    dataout = true;
                    break;
                }
            }

            return dataout;
        }

        collectheaders(header);
        return islanguagecolumn(headers);
    }


    HideColumnByHeader(header) {
        let _self = this;

        let reduce = (cell, colspan) => {
            if ($(cell.Control).attr('colspan') == undefined || parseInt($(cell.Control).attr('colspan')) == 1 ||
                parseInt($(cell.Control).attr('colspan')) == colspan) {
                //set hide to list
                cell.LastHide = true;

                //set hide to header
                $(cell.Control).addClass('hide');
            } else {
                //set to list
                cell.LastColspan -= colspan;

                //set to header
                $(cell.Control).attr('colspan', parseInt($(cell.Control).attr('colspan')) - colspan);
            }

            cell.LastWidth = parseInt($($('colgroup col', _self.table)[cell.ColIndex + 1]).attr('width'));

            if (cell.ParentHeader != null) {
                reduce(cell.ParentHeader, colspan);
            }
        };

        let hidechild = (cell) => {
            //save current width
            cell.LastHide = true;
            cell.LastWidth = parseInt($($('colgroup col', _self.table)[cell.ColIndex + 1]).attr('width'));

            //set hide to body cell
            $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).addClass('hide');
            $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).attr('hide', true);

            //hide and set width is zero
            (cell.Control).addClass('hide');
            $($('colgroup col', _self.table)[cell.ColIndex + 1]).addClass('hide');
            $($('colgroup col', _self.table)[cell.ColIndex + 1]).attr('width', 0);

            //childs
            if (cell.ChildHeaders != null && cell.ChildHeaders.length > 0) {
                cell.ChildHeaders.forEach((child) => {
                    hidechild(child);
                });
            }
        };

        //Do except main-language and sub-language columns
        if (!_self.IsLanguageColumn(header)) {
            //parent
            if (header.ParentHeader != null) {
                reduce(header.ParentHeader, $(header.Control).attr('colspan') == undefined ? 1 : parseInt($(header.Control).attr('colspan')));
            }

            //me and childs
            hidechild(header);

            this.ResetRowspan();
            this.ResetColumn();
        }
    }

    UnHideColumnByHeader(header) {
        let _self = this;

        _self.ColumnHeaders.forEach((cell) => {
            if ($(cell.Control).is(header)) {
                //show header
                cell.LastHide = false;

                //remove hide to body cell
                $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).removeClass('hide');
                $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).removeAttr('hide');

                //remove and set width is last width
                (cell.Control).removeClass('hide');
                $($('colgroup col', _self.table)[cell.ColIndex + 1]).removeClass('hide');
                $($('colgroup col', _self.table)[cell.ColIndex + 1]).attr('width', cell.LastWidth);
            }
        });

        this.ResetRowspan();
        this.ResetColumn();
    }

    UnHideColumns() {
        let _self = this;
        let _changed = false;

        _self.ColumnHeaders.forEach((cell) => {
            if (cell.OriginalHide != cell.LastHide || cell.OriginalWidth != cell.LastWidth || cell.OriginalColspan != cell.LastColspan || cell.OriginalRowspan != cell.LastRowspan) {
                _changed = true;

                if (!cell.UsedInCodeOnly) {
                    cell.LastHide = false;
                    cell.LastColspan = cell.OriginalColspan;
                    cell.LastRowspan = cell.OriginalRowspan;

                    //header
                    $(cell.Control).removeClass('hide');
                    $(cell.Control).attr('colspan', cell.OriginalColspan);
                    $(cell.Control).attr('rowspan', cell.OriginalRowspan);

                    //remove hide to body cell
                    $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).removeClass('hide');
                    $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).removeAttr('hide');

                    //column
                    $($('colgroup col', _self.table)[cell.ColIndex + 1]).removeClass('hide');
                }

                $($('colgroup col', _self.table)[cell.ColIndex + 1]).attr('width', cell.LastWidth);
            }
        });

        if (_changed) {
            this.ResetRowspan();
            this.SyncGrip();
        }
    }

    ResetColumnWidths() {
        let _self = this;
        let _changed = false;

        _self.ColumnHeaders.forEach((cell) => {
            if (cell.OriginalHide != cell.LastHide || cell.OriginalWidth != parseInt($($('colgroup col', _self.table)[cell.ColIndex + 1]).attr('width')) || cell.OriginalColspan != cell.LastColspan || cell.OriginalRowspan != cell.LastRowspan) {
                _changed = true;

                if (!cell.UsedInCodeOnly) {
                    cell.LastHide = false;
                    cell.LastColspan = cell.OriginalColspan;
                    cell.LastRowspan = cell.OriginalRowspan;

                    //header
                    $(cell.Control).removeClass('hide');
                    $(cell.Control).attr('colspan', cell.OriginalColspan);
                    $(cell.Control).attr('rowspan', cell.OriginalRowspan);

                    //column
                    $($('colgroup col', _self.table)[cell.ColIndex + 1]).removeClass('hide');

                    //set hide to body cell
                    $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).removeClass('hide');
                    $('td:nth-of-type(' + (cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).removeAttr('hide');
                }

                cell.LastWidth = cell.OriginalWidth;
                $($('colgroup col', _self.table)[cell.ColIndex + 1]).attr('width', cell.OriginalWidth);
            }
        });
        
        if (_changed) {
            this.ResetRowspan();
            this.BuildColumn(this.GetBrowserZoomLevel());
            this.SyncGrip();
        }
    }

    ResetRowspan() {
        let _self = this;

        //if parent has one child only, hide header child and parent rowspan + 1
        let childvisible = (mother) => {
            let count = 0;
            mother.ChildHeaders.forEach((cell) => {
                count += !cell.LastHide ? cell.LastColspan : 0;
            })

            return count;
        }

        let motherrowspan = (child) => {
            let _childcount = childvisible(child.ParentHeader);

            //move rowspan to mother
            if (_childcount == 1) {
                $(child.ParentHeader.Control).attr('rowspan', child.ParentHeader.LastRowspan + child.LastRowspan);
                child.ParentHeader.LastRowspan += child.LastRowspan;

                //hide child
                $(child.Control).addClass('hide');
            }

            child.ParentHeader.LastColspan = _childcount;
            $(child.ParentHeader.Control).attr('colspan', _childcount);

            //check grand mother
            if (child.ParentHeader.ParentHeader != null) {
                motherrowspan(child.ParentHeader);
            }
        }

        //scan cell has one visible child only
        _self.ColumnHeaders.forEach((cell) => {
            if (!cell.LastHide && cell.ParentHeader != null && $(cell.Control).text() != 'P') {
                motherrowspan(cell);
            }
        })

        //
        let _rowcount = 0;
        let _height = 0;

        //if all header cell is not visible, set header row visible
        let headerrowvisible = (rowindex) => {
            let billingual = 0;
            let count = 0;
            _self.ColumnHeaders
                .filter(cell => !cell.LastHide && cell.X == rowindex + 1)
                .forEach((cell) => {
                    billingual += $(cell.Control).hasClass('main-language') || $(cell.Control).hasClass('sub-language') ? 1 : 0;
                    count += cell.LastColspan;
                })

            return count - (billingual == 1 ? 1 : 0);
        }

        //header row
        $('thead tr', $(_self.table)).each((rowindex, tr) => {
            $(tr).removeClass('hide');

            //if ($('th:visible', $(tr)).length > 0) {
            if (headerrowvisible(rowindex) > 0) {
                _rowcount++;

                $(tr).removeClass('hide');
                $('th:visible', $(tr)).css('top', _height);
            } else {
                $(tr).addClass('hide');

                this.ColumnHeaders.forEach((header) => {
                    if (header.X <= rowindex && header.X + header.LastRowspan >= rowindex + 2) {
                        header.LastRowspan--;
                        $(header.Control).attr('rowspan', header.LastRowspan);
                    }
                })
            }

            _height += S3TTableRowHeight;
        })

        //check child true visible
        let childtruevisible = (mother) => {
            let count = 0;
            mother.ChildHeaders.forEach((cell) => {
                count += $(cell.Control).css('display') != 'none' ? cell.LastColspan : 0;
            })

            return count;
        }

        //reset rowspan
        _self.ColumnHeaders.forEach((cell) => {
            if (!cell.LastHide && (cell.ChildHeaders == null || childtruevisible(cell) == 0) && cell.X + cell.LastRowspan != _rowcount + 1 && $(cell.Control).text() != 'P') {
                cell.LastRowspan = _rowcount - cell.X + 1;
                $(cell.Control).attr('rowspan', _rowcount - cell.X + 1);
            } else if (!cell.LastHide && cell.ChildHeaders != null && childtruevisible(cell) > 0 && cell.X + cell.LastRowspan >= _rowcount + 1) {
                cell.LastRowspan = 1; //--;
                $(cell.Control).attr('rowspan', cell.LastRowspan);
            }
        })

        //last header row
        $('thead tr:visible:last th:visible', $(_self.table)).attr('rowspan', 1);

        //top-left cell
        $('thead tr:first td', $(_self.table)).attr('rowspan', _rowcount);
    }

    LoadColumnWidths() {
        if (this.table.attr('htmlid') == undefined) {
            return;
        }

        let _self = this;

        let model = {};
        model.Name = this.table.attr('htmlid');

        $.ajax({
            type: 'POST',
            url: 'api/Common/TableColumnWidthGet',
            headers: {
                '3t-action-menu-type': 'N'
            },
            async: false,
            data: JSON.stringify(model),
            contentType: 'application/json; charset=utf-8',
            success: function (dataout) {
                if (dataout != null && dataout.length > 0) {
                    dataout.forEach(function (value) {
                        let index = _self.ColumnHeaders.findIndex(function (o) {
                            return o.X == value.X && o.Y == value.Y;
                        })

                        if (index != -1) {
                            let _cell = _self.ColumnHeaders[index];

                            _cell.LastHide = value.Hide;
                            _cell.LastWidth = value.Width;
                            _cell.LastColspan = value.Colspan;
                            _cell.LastRowspan = value.Rowspan;

                            //set width to group.col
                            $($('colgroup col', _self.table)[_cell.ColIndex + 1]).attr('width', _cell.LastWidth);

                            //set colspan
                            (_cell.Control).attr('colspan', _cell.LastColspan);
                            (_cell.Control).attr('rowspan', _cell.LastRowspan);

                            if (_cell.LastHide) {
                                //hide header
                                (_cell.Control).addClass('hide');

                                //set hide to group.col
                                $($('colgroup col', _self.table)[_cell.ColIndex + 1]).addClass('hide');
                                $($('colgroup col', _self.table)[_cell.ColIndex + 1]).attr('width', 0);

                                //set hide to body cell
                                $('td:nth-of-type(' + (_cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).addClass('hide');
                                $('td:nth-of-type(' + (_cell.ColIndex + 1) + ')', $('tbody tr', $(_self.table))).attr('hide', true);
                            }
                        }
                    });
                }
            },

            error: function (result) {

            }
        });
    }

    SaveColumnWidths() {
        if (this.table.attr('htmlid') == undefined) {
            return;
        }

        let _self = this;
        let widths = [];
        $(this.ColumnHeaders).each((index, item) => {
            if (item.LastHide) {
                widths.push({ X : item.X, Y : item.Y, Hide : item.LastHide, Width : item.LastWidth, Colspan : item.LastColspan, Rowspan : item.LastRowspan });
            } else {
                widths.push({ X : item.X, Y : item.Y, Hide : item.LastHide, Width : parseInt($($('colgroup col', _self.table)[item.ColIndex + 1]).attr('width')), Colspan : item.LastColspan, Rowspan : item.LastRowspan });
            }
        });

        let model = {};
        model.Name = this.table.attr('htmlid');
        model.Value = widths;

        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'POST',
                url: 'api/Common/TableColumnWidthSave',
                headers: {
                    '3t-action-menu-type': 'N'
                },
                //async: false,
                data: JSON.stringify(model),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    resolve();
                },

                error: function (result) {
                    resolve();
                }
            });
        });
    }

    GetBrowserZoomLevel() {
        let browserZoomLevel = Math.round(window.devicePixelRatio * 100);
        return browserZoomLevel / 100;
    }
      /*
     Id: Id of table example _____controlid______ScrollArea (Require)
     DeskId: Parent id of table example _____controlid_____ (Optional)
     BuildRowModel: Parameter of BuildRow function (Optional)
     BuildRow: Function which render each row of table (Require)
     ClusterizeData: Clusterize data of table (Require)
     Key: Id Key of each row (Optional)
     SubTable: Sub table (Optional)
     FocusFirst: Focus to 1st row after load (Optional)
     DefaultFocus: Focus to table when load or not (Optional)
     HasImage: Clusterize data of table (Optional)
     DetailCallback: Detail callback when focus special row (Optional)
     ShowInvoiceInfoCallback: Show invoice info when focus to special cell (Optional)
     SortCondition: Sort condition (Optional)
     Callbacks: Custom callback (Optional)
     */
    get defaultConfig() {
        return {
            Id: "",
            DeskId: "",
            BuildRowModel: new Object(),
            BuildRow: null,
            ClusterizeData: null,
            ColumnSearchElement: null,
            Key: "Id",
            SubTable: false,
            FocusFirst: true,
            FirstLoad: true,
            DefaultFocus: true,
            HasImage: false,
            KeyEnter: 0,
            KeyEnterNextRow: false,
            StartRowIndex: null,
            StartCellIndex: null,
            DetailCallback: null,
            UpdateCallback: null,
            ShowInvoiceInfoCallback: null,
            SortCondition: null,
            ColumnHeaders: null,
            Callbacks: {}
        };
    }
}
