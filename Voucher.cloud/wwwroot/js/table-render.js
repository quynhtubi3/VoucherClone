//Dùng riêng cho màn hình main
function i18nLayout0(key) {
    if (key != "Common_Title" && (applicationDictionary[key].sub == undefined || (applicationDictionary[key].sub == "" && applicationDictionary[key].main != applicationDictionary[key].sub) || applicationDictionary[key].main == applicationDictionary[key].sub)) {
        return "<label class='main-language' data-i18n='" + key + ".main'></label>";
    }
    if (ApplicationInstance.Uservar.BillingualLanguage == 2) { /* Song ngữ */
        return "<label class='main-language' style='font-weight:bold; padding-right: 3px;' data-i18n='" + key + ".main'></label><label style='font-weight:normal;'>(</label><label class='sub-language' style='font-weight: normal;' data-i18n='" + key + ".sub'></label><label style='font-weight:normal;'>)</label>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
        return "<label class='main-language' style='font-weight:bold;' data-i18n='" + key + ".main'></label>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) { /* Chỉ hiển thị ngôn ngữ thứ hai */
        return "<label class='sub-language' style='font-weight:bold;' data-i18n='" + key + ".sub'></label>";
    }
}

function i18nLayout1(key) {
    if (key != "Common_Title" && (applicationDictionary[key].sub == undefined || (applicationDictionary[key].sub == "" && applicationDictionary[key].main != applicationDictionary[key].sub) || applicationDictionary[key].main == applicationDictionary[key].sub)) {
        return "<label class='main-language' data-i18n='" + key + ".main' hide='false' style='font-weight: bold; overflow: hidden; text-overflow: ellipsis;'></label>";
    }
    if (ApplicationInstance.Uservar.BillingualLanguage == 2) { /* Song ngữ */
        return "<label class='main-language' data-i18n='" + key + ".main' style='overflow: hidden; text-overflow: ellipsis; font-weight: bold;'></label><p class='sub-language' data-i18n='" + key + ".sub' style='overflow: hidden; text-overflow: ellipsis; padding-left: 10px;'></p>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
        return "<label class='main-language' data-i18n='" + key + ".main' hide='false' style='font-weight: bold; overflow: hidden; text-overflow: ellipsis;'></label>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) { /* Chỉ hiển thị ngôn ngữ thứ hai */
        return "<label class='sub-language' data-i18n='" + key + ".sub' hide='false' style='font-weight: bold; overflow: hidden; text-overflow: ellipsis;'></label>";
    }
}

function i18nLayout5(key) {
    if (key != "Common_Title" && (applicationDictionary[key].sub == undefined || (applicationDictionary[key].sub == "" && applicationDictionary[key].main != applicationDictionary[key].sub) || applicationDictionary[key].main == applicationDictionary[key].sub)) {
        return "<label class='main-language' data-i18n='" + key + ".main' hide='false' style='color: var(--theme); overflow: hidden; text-overflow: ellipsis;padding-left: 10px;'></label>";
    }
    if (ApplicationInstance.Uservar.BillingualLanguage == 2) { /* Song ngữ */
        return "<label class='main-language' data-i18n='" + key + ".main' style='overflow: hidden; text-overflow: ellipsis; padding-left: 10px;color: var(--theme);'></label><p class='sub-language' data-i18n='" + key + ".sub' style='overflow: hidden; text-overflow: ellipsis; padding-left: 10px;color: var(--theme);'></p>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
        return "<label class='main-language' data-i18n='" + key + ".main' hide='false' style='color: var(--theme); overflow: hidden; text-overflow: ellipsis;padding-left: 10px;'></label>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) { /* Chỉ hiển thị ngôn ngữ thứ hai */
        return "<label class='sub-language' data-i18n='" + key + ".sub' hide='false' style='color: var(--theme); overflow: hidden; text-overflow: ellipsis;padding-left: 10px;'></label>";
    }
}

function i18nLayout4(key) {
    if (key != "Common_Title" && (applicationDictionary[key].sub == undefined || (applicationDictionary[key].sub == "" && applicationDictionary[key].main != applicationDictionary[key].sub) || applicationDictionary[key].main == applicationDictionary[key].sub)) {
        return "<p class='main-language' data-i18n='" + key + ".main' hide='false' style='font-weight: bold; overflow: hidden; text-overflow: ellipsis;'></p>";
    }
    if (ApplicationInstance.Uservar.BillingualLanguage == 2) { /* Song ngữ */
        return "<p class='main-language' data-i18n='" + key + ".main' style='overflow: hidden; text-overflow: ellipsis; font-weight: bold;'></p><p class='sub-language' data-i18n='" + key + ".sub' style='overflow: hidden; text-overflow: ellipsis; padding-left: 10px;'></p>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
        return "<p class='main-language' data-i18n='" + key + ".main' hide='false' style='font-weight: bold; overflow: hidden; text-overflow: ellipsis;'></p>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) { /* Chỉ hiển thị ngôn ngữ thứ hai */
        return "<p class='sub-language' data-i18n='" + key + ".sub' hide='false' style='font-weight: bold; overflow: hidden; text-overflow: ellipsis;'></p>";
    }
}

function i18nLayout2(key) {
    if (key != "Common_Title" && (applicationDictionary[key].sub == undefined || (applicationDictionary[key].sub == "" && applicationDictionary[key].main != applicationDictionary[key].sub) || applicationDictionary[key].main == applicationDictionary[key].sub)) {
        return "<label class='main-language' data-i18n='" + key + ".main'></label>";
    }
    if (ApplicationInstance.Uservar.BillingualLanguage == 2) { /* Song ngữ */
        return "<label class='main-language' style='font-weight:bold; padding-right: 3px;' data-i18n='" + key + ".main'></label><label style='font-weight:normal;'>(</label><label class='sub-language' style='font-weight: normal;' data-i18n='" + key + ".sub'></label><label style='font-weight:normal;'>)</label>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
        return "<label class='main-language' data-i18n='" + key + ".main'></label>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) { /* Chỉ hiển thị ngôn ngữ thứ hai */
        return "<label class='sub-language' data-i18n='" + key + ".sub'></label>";
    }
}

function i18nLayout3(key) {   
    if (key != "Common_Title" && (applicationDictionary[key].sub == undefined || (applicationDictionary[key].sub == "" && applicationDictionary[key].main != applicationDictionary[key].sub) || applicationDictionary[key].main == applicationDictionary[key].sub)) {
        return "<label class='main-language' data-i18n='" + key + ".main'></label>";
    }
    if (ApplicationInstance.Uservar.BillingualLanguage == 2) { /* Song ngữ */
        return "<label class='main-language' data-i18n='" + key + ".main'></label><br><label class='sub-language' style='font-weight: normal;' data-i18n='" + key + ".sub'></label>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
        return "<label class='main-language' data-i18n='" + key + ".main'></label>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) { /* Chỉ hiển thị ngôn ngữ thứ hai */
        return "<label class='sub-language' data-i18n='" + key + ".sub'></label>";
    }
}

function i18nLayout7(key) {
    if (key != "Common_Title" && (applicationDictionary[key].sub == undefined || (applicationDictionary[key].sub == "" && applicationDictionary[key].main != applicationDictionary[key].sub) || applicationDictionary[key].main == applicationDictionary[key].sub)) {
        return "<label class='main-language' data-i18n='" + key + ".main' hide='false' style='font-weight: bold; overflow: hidden; text-overflow: ellipsis;'></label>";
    }
    if (ApplicationInstance.Uservar.BillingualLanguage == 2) { /* Song ngữ */
        return "<label class='main-language' data-i18n='" + key + ".main' style='overflow: hidden; text-overflow: ellipsis; font-weight: bold;'></label><p class='sub-language' data-i18n='" + key + ".sub' style='font-weight: normal; overflow: hidden; text-overflow: ellipsis;'></p>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
        return "<label class='main-language' data-i18n='" + key + ".main' hide='false' style='font-weight: bold; overflow: hidden; text-overflow: ellipsis;'></label>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) { /* Chỉ hiển thị ngôn ngữ thứ hai */
        return "<label class='sub-language' data-i18n='" + key + ".sub' hide='false' style='font-weight: bold; overflow: hidden; text-overflow: ellipsis;'></label>";
    }
}

function i18nLayout9(key) {
    if (key != "Common_Title" && (applicationDictionary[key].sub == undefined || (applicationDictionary[key].sub == "" && applicationDictionary[key].main != applicationDictionary[key].sub) || applicationDictionary[key].main == applicationDictionary[key].sub)) {
        return "<label class='main-language' data-i18n='" + key + ".main' hide='false' style='font-weight: bold; text-align: center;'></label>";
    }
    if (ApplicationInstance.Uservar.BillingualLanguage == 2) { /* Song ngữ */
        return "<p class='main-language' data-i18n='" + key + ".main' style='font-weight: bold; text-align: center;'></p><p class='sub-language' data-i18n='" + key + ".sub' style='text-align: center;'></p>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
        return "<p class='main-language' data-i18n='" + key + ".main' hide='false' style='font-weight: bold; text-align: center;'></p>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) { /* Chỉ hiển thị ngôn ngữ thứ hai */
        return "<p class='sub-language' data-i18n='" + key + ".sub' hide='false' style='font-weight: bold; text-align: center;'></p>";
    }
}

// for alert
function i18nLayout10(key) {
    if (key != "Common_Title" && (applicationDictionary[key].sub == undefined || (applicationDictionary[key].sub == "" && applicationDictionary[key].main != applicationDictionary[key].sub) || applicationDictionary[key].main == applicationDictionary[key].sub)) {
        return "<label class='main-language' data-i18n='" + key + ".main'></label>";
    }
    if (ApplicationInstance.Uservar.BillingualLanguage == 2) { /* Song ngữ */
        return "<label class='main-language' style='font-weight: bold; color: var(--theme);' data-i18n='" + key + ".main'></label><br><label class='sub-language' style='font-weight: normal; font-size: 13px;' data-i18n='" + key + ".sub'></label>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
        return "<label class='main-language' style='font-weight: bold; color: var(--theme);' data-i18n='" + key + ".main'></label>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) { /* Chỉ hiển thị ngôn ngữ thứ hai */
        return "<label class='sub-language' style='font-weight: bold; color: var(--theme);' data-i18n='" + key + ".sub'></label>";
    }
}

// for alert button
function i18nLayout11(key) {
    if (key != "Common_Title" && (applicationDictionary[key].sub == undefined || (applicationDictionary[key].sub == "" && applicationDictionary[key].main != applicationDictionary[key].sub) || applicationDictionary[key].main == applicationDictionary[key].sub)) {
        return "<label class='main-language' data-i18n='" + key + ".main'></label>";
    }
    if (ApplicationInstance.Uservar.BillingualLanguage == 2) { /* Song ngữ */
        return "<label class='main-language' style='font-weight: bold;' data-i18n='" + key + ".main'></label><br><label class='sub-language' style='font-weight: normal;' data-i18n='" + key + ".sub'></label>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
        return "<label class='main-language' style='font-weight: bold;' data-i18n='" + key + ".main'></label>";
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) { /* Chỉ hiển thị ngôn ngữ thứ hai */
        return "<label class='sub-language' style='font-weight: bold;' data-i18n='" + key + ".sub'></label>";
    }
}

// for context menu
function i18nLayout8(key) {
    if (key != "Common_Title" && (applicationDictionary[key].sub == undefined || (applicationDictionary[key].sub == "" && applicationDictionary[key].main != applicationDictionary[key].sub) || applicationDictionary[key].main == applicationDictionary[key].sub)) {
        return applicationDictionary[key].main;
    }
    if (ApplicationInstance.Uservar.BillingualLanguage == 2) { /* Song ngữ */
        return applicationDictionary[key].main + " (" + applicationDictionary[key].sub + ")"
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
        return applicationDictionary[key].main;
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) { /* Chỉ hiển thị ngôn ngữ thứ hai */
        return applicationDictionary[key].sub;
    }
}

//Dành cho thông báo powertip
function i18nLayout6(key) {
    if (ApplicationInstance.Uservar.BillingualLanguage == 2) { /* Song ngữ */
        return key.main + "<br>" + key.sub;
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
        return key.main;
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) { /* Chỉ hiển thị ngôn ngữ thứ hai */
        return key.sub;
    }
}

function i18nLayoutTooltip(title, title_E) {
    if (ApplicationInstance.Uservar.BillingualLanguage == 2) { /* Song ngữ */
        return title + "<br>" + title_E;
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
        return title;
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) { /* Chỉ hiển thị ngôn ngữ thứ hai */
        return title_E;
    }
}

function translateRow(row) {    
    if (ApplicationInstance.Uservar.BillingualLanguage == 2) { /* Song ngữ */
        return row;
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
        row = row.split("class='sub-language'").join("class='sub-language hide' hide=true style='display:none;'")
        row = row.split("class='main-language'").join("class='main-language' hide=false")
        return row;
    } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) { /* Chỉ hiển thị ngôn ngữ thứ hai */
        row = row.split("class='main-language'").join("class='main-language hide' hide=true style='display:none;'");
        row = row.split("class='sub-language'").join("class='sub-language' hide=false");
        return row;
    }
}

function BuildTreeLevel(row, noDetail) {
    let obj = new Object();
    if (noDetail == true) {
        if (row.IsEnd == false) {
            obj.level1 = "level" + row.Level;
            obj.level = "data-depth='" + row.Level + "' class='collapse level" + row.Level + "'";
            obj.item = "<span class='toggle collapse'></span>";
        } else {
            if (row.ParentId == null || row.ParentId == "") {
                obj.level = "data-depth='0' class='collapse level0'";
                obj.item = "<span class='toggle collapse'></span>";
                obj.level1 = "";
            } else {
                obj.level1 = "level" + row.Level;
                obj.level = "data-depth='" + row.Level + "' class='collapse level" + row.Level + "'";
                obj.item = "";
            }
        }
    } else {
        if (row.IsEnd == false) {
            obj.level1 = "level" + row.Level;
            obj.level = "data-depth='" + row.Level + "' class='collapse level" + row.Level + "'";
            obj.item = "<span class='toggle collapse'></span>";
        } else {
            if (row.ParentId == null || row.ParentId == "") {
                obj.level = "data-depth='0' class='collapse level0'";
                obj.item = "<span class='toggle-root'><i class='fa fa-folder-open' aria-hidden='true'></i></span>";
                obj.level1 = "";
            } else {
                obj.level1 = "level" + row.Level;
                obj.level = "data-depth='" + row.Level + "' class='collapse level" + row.Level + "'";
                obj.item = "<span class='toggle-root'><i class='fa fa-folder-open' aria-hidden='true'></i></span>";
            }
        }
    }
    return obj;
}

function TextOptionBuildHtml(options) {
    let td = "<td";
    td += (options.ClassName ? " class='" + options.ClassName + "'" : "");
    td += (options.EnterCallback ? " entercallback='" + options.EnterCallback + "'" : "");
    td += ">";

    let input = "<input";
    input += (options.Id && options.ColumnName ? " id='" + options.Id + options.ColumnName + "'" : "");
    input += (options.ReadOnly ? " readonly" : "");
    input += (options.ColumnName ? " column-name='" + options.ColumnName + "'" : "");
    input += (options.ClassName ? " class='text-option " + options.ColumnName + " " + options.ClassName + " " + options.Id + options.ColumnName + "'" : " class='text-option " + options.ColumnName + " " + options.Id + options.ColumnName + "'");
    input += (options.Callback ? " callback='" + options.Callback + "'" : "");
    input += (options.FocusCallback ? " focuscallback='" + options.FocusCallback + "'" : "");
    input += (options.DefaultValue ? " default-value='" + options.DefaultValue + "'" : "");
    input += (options.CodeValue ? " option-code='" + options.CodeValue + "'" : "");
    input += (options.Width > 0 ? " style='width:" + options.Width + "px;'" : " style='width:100%;'");
    input += " value='" + options.Value + "' type='text'/>"

    return td + input + "</td>";
}

function TextSearchBuildHtml(options) {
    let td = "<td";
    td += (options.ClassName ? " class='" + options.ClassName + "'" : "");
    td += (options.ShowInfoMessage ? " showinfomessage='true'" : "");
    td += (options.RemoveRowCallback ? " removerowcallback='" + options.RemoveRowCallback + "'" : "");
    td += (options.EnterCallback ? " entercallback='" + options.EnterCallback + "'" : "");
    td += ">";

    let input = "<input";
    input += (options.Id && options.ColumnName ? " id='" + options.Id + options.ColumnName + "'" : "");
    input += (options.ReadOnly ? " readonly" : "");
    input += (options.ColumnName ? " column-name='" + options.ColumnName + "'" : "");
    input += (options.ClassName ? " class='text-search " + options.ColumnName + " " + options.Id + options.ColumnName + "'" : "' class='text-search " + options.ColumnName + " " + options.Id + options.ColumnName + "'");
    input += (options.Validate ? " validate='true'" : "");
    input += (options.NoRequired ? " no-required='true'" : "");
    input += (options.Callback ? " callback='" + options.Callback + "'" : "");
    input += (options.FocusCallback ? " focuscallback='" + options.FocusCallback + "'" : "");
    input += (options.Function ? " add-function='" + options.Function + "(\"" + options.ControlId + "\", $(\"#desk_" + options.ControlId + " ." + options.Id + options.ColumnName + "." + options.ColumnName + "\"))'" + (options.FirstFilter ? " data-first-filter=\"" + options.FirstFilter + "\"" : "") + " data-table='" + options.Table + "' data-field-name='" + options.FieldName + "'" + (options.DestinationId ? " data-destination-id='" + options.DestinationId + "'" : "") + " data-prefix-class='" + options.Id + "'" : "");
    input += (options.Width > 0 ? " style='width:" + options.Width + "px;'" : " style='width:100%;'");
    input += " value='" + options.Value + "' type='text'/>"

    return td + input + "</td>";
}

function TextSelectBuildHtml(options) {
    let id = ((options.Value != null && options.Value != undefined) ? options.Value : ((options.DetaulValue != null && options.DetaulValue != undefined) ? options.DetaulValue : "")).toString();
    let data = JSON.parse(options.DataToggle);
    let index = data.findIndex(function (o) {
        return o.id === id;
    });
    let value = id;
    if (index != -1) {
        let main = translator._getValueFromJSON(data[index].name + ".main", applicationDictionary, false);
        let sub = translator._getValueFromJSON(data[index].name + ".sub", applicationDictionary, false);

        if (ApplicationInstance.Uservar.BillingualLanguage == 2) { /* Song ngữ */
            value = main + (sub ? " (" + sub + ")" : "");
        } else if (ApplicationInstance.Uservar.BillingualLanguage == 0) { /* Chỉ hiển thị ngôn ngữ thứ nhất */
            value = main;
        } else if (ApplicationInstance.Uservar.BillingualLanguage == 1) { /* Chỉ hiển thị ngôn ngữ thứ hai */
            value = (sub ? sub : main);
        }
    }

    let td = "<td";
    td += (options.ClassName ? " class='" + options.ClassName + "'" : "");
    td += (options.ShowInfoMessage ? " showinfomessage='true'" : "");
    td += (options.RemoveRowCallback ? " removerowcallback='" + options.RemoveRowCallback + "'" : "");
    td += (options.EnterCallback ? " entercallback='" + options.EnterCallback + "'" : "");
    td += ">";

    let input = "<div";
    input += (options.Id && options.ColumnName ? " id='" + options.Id + options.ColumnName + "'" : "");
    input += (options.ReadOnly ? " readonly" : "");
    input += (options.ColumnName ? " column-name='" + options.ColumnName + "'" : "");
    input += (options.ClassName ? " class='text-select " + options.ColumnName + " " + options.Id + options.ColumnName + "'" : " class='text-select " + options.ColumnName + " " + options.Id + options.ColumnName + "'");
    input += (options.Callback ? " callback='" + options.Callback + "'" : "");
    input += (options.DataToggle ? " data-toggle='" + options.DataToggle + "'" : " data-toggle='[]'");
    input += " data-title='" + id + "'";
    input += (options.Width > 0 ? " style='width:" + options.Width + "px;'" : " style='width:100%;'>") + value + "</div>";

    return td + input + "</td>";
}

function GetNumberFormat(scale) {
    let nscale = ApplicationInstance.Systemvar[scale] == undefined? ApplicationInstance.Uservar[scale] : ApplicationInstance.Systemvar[scale];

    let numberFormat = "#\\" + ApplicationInstance.Uservar.GroupingSymbol + "##0";
    if (nscale > 0) {
        numberFormat += "\\" + ApplicationInstance.Uservar.DecimalSymbol.padEnd(nscale + 1, '0');
    }

    return numberFormat;
}

function TextNumberBuildHtml(options) {
    let td = "";
    if (options.Scale) {
        td = "<td style='mso-number-format:\"" + GetNumberFormat(options.Scale) + "\";'";
    } else {
        td = "<td";
    }
    
    td += (options.ClassName ? " class='text-number " + options.ClassName + "'" : " class='text-number'");
    td += (options.HideZero ? " hidezero='true'" : "");
    td += (options.Scale ? " scale='" + options.Scale + "'" : "");
    td += (options.ColumnName ? " column-name='" + options.ColumnName + "'" : "");
    td += (options.Value ? " numericvalue='" + options.Value + "'" : "");
    td += (options.EnterCallback ? " entercallback='" + options.EnterCallback + "'" : "");
    td += (options.Value ? ">" + number_to_text(options.Value, number_decimalscale(options.Scale), options.HideZero) : ">");

    return td + "</td>";

}

function TextNumberPhanTramBuildHtml(options) {
    let td = "<td style='text-align:center;";

    if (options.ShowColor === true) {
        if (options.Value > 80)
            td += " background-color:#90EE90;";
        else if (options.Value < 55)
            td += " background-color:#FFD580;";

        if (options.Scale) {
            td += " mso-number-format:\"" + GetNumberFormat(options.Scale) + "\";'";
        }
    }
    
    td += (options.ClassName ? " class='text-number " + options.ClassName + "'" : " class='text-number'");
    td += (options.HideZero ? " hidezero='true'" : "");
    td += (options.Scale ? " scale='" + options.Scale + "'" : "");
    td += (options.ColumnName ? " column-name='" + options.ColumnName + "'" : "");
    td += (options.Value ? " numericvalue='" + options.Value + "'" : "");
    td += (options.EnterCallback ? " entercallback='" + options.EnterCallback + "'" : "");
    td += (options.Value ? ">" + number_to_text(options.Value, number_decimalscale(options.Scale), options.HideZero) + "%" : ">");

    return td + "</td>";

}

function TextNumberInputBuildHtml(options) {
    let td = "";
    if (options.Scale) {
        td = "<td style='mso-number-format:\"" + GetNumberFormat(options.Scale) + "\";'";
    } else {
        td = "<td";
    }
    
    td += (options.ClassName ? " class='" + options.ClassName + "'" : "");
    td += (options.EnterCallback ? " entercallback='" + options.EnterCallback + "'" : "");
    td += ">";

    let input = "<input";
    input += (options.Id && options.ColumnName ? " id='" + options.Id + options.ColumnName + "'" : "");
    input += (options.ReadOnly ? " readonly" : "");
    input += (options.ColumnName ? " column-name='" + options.ColumnName + "'" : "");
    input += (options.ClassName ? " class='text-number " + options.ClassName + " " + options.Id + options.ColumnName + "'" : " class='text-number " + options.Id + options.ColumnName + "'");
    input += (options.Callback ? " callback='" + options.Callback + "'" : "");
    input += (options.CallbackValidate ? " callbackvalidate='" + options.CallbackValidate + "'" : "");
    input += (options.Validate ? " validate='" + options.Validate + "'" : "");
    input += (options.ValidateMessage ? " validatemessage='" + options.ValidateMessage + "'" : "");
    input += (options.HideZero ? " hidezero='" + options.HideZero + "'" : "");
    input += (options.NotEqualZero ? " notequalzero='" + options.NotEqualZero + "'" : "");
    input += (options.AllowNegative ? " allownegative='" + options.AllowNegative + "'" : "");
    input += (options.MinValue !== undefined ? " minvalue='" + options.MinValue + "'" : "");
    input += (options.MaxValue !== undefined ? " maxvalue='" + options.MaxValue + "'" : "");
    input += (options.Scale ? " scale='" + options.Scale + "'" : "");
    input += " numericvalue='" + options.Value + "' value='" + number_to_text(options.Value, number_decimalscale(options.Scale), options.HideZero) + "'/>"

    return td + input + "</td>";
}

function TdBuildHtml(options) {
    let td = "<td";
    td += (options.Id && options.ColumnName ? " id='" + options.Id + options.ColumnName + "'" : "");
    td += (options.ClassName ? " class='" + options.ClassName + "'" : "");
    td += (options.ShowInfoMessage ? " showinfomessage='true'" : "");
    td += (options.ColumnName ? " column-name='" + options.ColumnName + "'" : "");
    td += (options.EnterCallback ? " entercallback='" + options.EnterCallback + "'" : "");
    td += (options.Value ? ">" + options.Value : ">");

    return td + "</td>";
}

function CheckboxBuildHtml(options) {
    //"<td class='center'><label class='checkbox-container'><input currentid='" + row.Id + "' parentid='" + row.ParentId + "' onclick='" + controlid + "_menu_checkbox_click(this,\"" + row.Id + "\",\"" + row.ParentId + "\",\"" + row.Type + "\",\"" + row.SubId + "\")' class='rightassignment_menu rightassignment_menu_" + row.ParentId + "' type='checkbox' " + checked + " " + disabled + "/><span class='checkmark'></span></label></td>"
    let td = "<td class='center'><label class='checkbox-container'><input ";
    td += (options.Id && options.ColumnName ? " id='" + options.Id + options.ColumnName + "'" : "");
    td += (options.ClassName ? " class='" + options.ClassName + " " + options.Id + options.ColumnName + "'" : " class='" + options.Id + options.ColumnName + "'");
    td += (options.ColumnName ? " column-name='" + options.ColumnName + "'" : "");
    td += (options.Value ? " checked" : "");
    td += " type='checkbox'/>"

    return td + "<span class='checkmark'></span></label></td>";
}

function TextInputHtml(options) {
    let td = "<td";
    td += (options.ClassName ? " class='" + options.ClassName + "'" : "");
    td += (options.EnterCallback ? " entercallback='" + options.EnterCallback + "'" : "");
    td += ">";

    let input = "<input";
    input += (options.Id && options.ColumnName ? " id='" + options.Id + options.ColumnName + "'" : "");
    input += (options.ReadOnly ? " readonly" : "");
    input += (options.ColumnName ? " column-name='" + options.ColumnName + "'" : "");
    input += (options.ClassName ? " class='" + options.ClassName + " " + options.Id + options.ColumnName + "'" : " class='" + options.Id + options.ColumnName + "'");
    input += (options.Callback ? " callback='" + options.Callback + "'" : "");
    input += (options.FocusCallback ? " focuscallback='" + options.FocusCallback + "'" : "");
    input += (options.Value ? " value='" + options.Value + "'" : "") + " type='text'/>";

    return td + input + "</td>";
}

function TextInputHtml2(options) {
    let td = "<td";
    td += (options.ClassName ? " class='" + options.ClassName + "'" : "");
    td += (options.EnterCallback ? " entercallback='" + options.EnterCallback + "'" : "");
    td += ">";

    let input = "<input";
    input += (options.Id && options.ColumnName ? " id='" + options.Id + "'" : "");
    input += (options.ReadOnly ? " readonly" : "");
    input += (options.ColumnName ? " column-name='" + options.ColumnName + "'" : "");
    input += (options.ClassName ? " class='" + options.ClassName + " " + options.Id + options.ColumnName + "'" : " class='" + options.Id + options.ColumnName + "'");
    input += (options.Callback ? " callback='" + options.Callback + "'" : "");
    input += (options.FocusCallback ? " focuscallback='" + options.FocusCallback + "'" : "");
    input += (options.Value ? " value='" + options.Value + "'" : "") + " type='text'/>";

    return td + input + "</td>";
}

function TextDateBuildHtml(options) {
    let td = "<td";
    td += (options.Id && options.ColumnName ? " id='" + options.Id + options.ColumnName + "'" : "");
    td += (options.ClassName ? " class='text-date " + options.ClassName + "'" : " class='text-date'");
    td += (options.ShowInfoMessage ? " showinfomessage='true'" : "");
    td += (options.ColumnName ? " column-name='" + options.ColumnName + "'" : "");
    td += (options.EnterCallback ? " entercallback='" + options.EnterCallback + "'" : "");
    td += (options.Value ? ">" + datetimeToStringShort(options.Value) : ">");

    return td + "</td>";
}

function TextDateInputBuildHtml(options) {
    let td = "<td";
    td += (options.ClassName ? " class='" + options.ClassName + "'" : "");
    td += (options.EnterCallback ? " entercallback='" + options.EnterCallback + "'" : "");
    td += ">";

    let input = "<input";
    input += (options.Id && options.ColumnName ? " id='" + options.Id + options.ColumnName + "'" : "");
    input += (options.ReadOnly ? " readonly" : "");
    input += (options.NoRequired ? " no-required='" + options.NoRequired + "'" : "");
    input += (options.Validate ? " validate='" + options.Validate + "'" : "");
    input += (options.validatemessage ? " validate='" + options.ValidateMessage + "'" : "");
    input += (options.ColumnName ? " column-name='" + options.ColumnName + "'" : "");
    input += (options.ClassName ? " class='text-date " + options.ClassName + " " + options.Id + options.ColumnName + "'" : " class='text-date " + options.Id + options.ColumnName + "'");
    input += (options.Callback ? " callback='" + options.Callback + "'" : "");
    input += (options.FocusCallback ? " focuscallback='" + options.FocusCallback + "'" : "");
    input += (options.Value ? " value='" + datetimeToStringShort(options.Value) + "'" : "") + "'/>";

    return td + input + "</td>";
}

function DmFileLister_BuildRow(model) {
    let row = model.row;
    let tr = "<tr><th clusterize_row_id='" + row.Id + "'></th><td id='Ten_File' class='main-language'>" + row.Ten_File + "</td><td id='Ten_File_E' class='sub-language'>" + row.Ten_File_E + "</td></tr>";
    return translateRow(tr);
}

function DMCOQUANBOLister_BuildRow(model) {
    let row = model.row;
    let tr = "<tr>" +
        "<th clusterize_row_id='" + row.Id + "'>" + "</th>" +
        "<td class='no-format' title='" + row.Code + "'>" + row.Code + "</td>" +
        "<td class='no-format' title='" + row.Name + "'>" + row.Name + "</td>" +
        "</tr>";
    return translateRow(tr);
}
function DMCOSOCUAHANGLister_BuildRow(model) {
    let row = model.row;
    let tr = "<tr>" +
        "<th clusterize_row_id='" + row.Id + "'>" + "</th>" +
        "<td class='no-format' title='" + row.Code + "'>" + row.Code + "</td>" +
        "<td class='no-format' title='" + row.Name + "'>" + row.Name + "</td>" +
        "<td class='no-format' title='" + row.Address + "'>" + row.Address + "</td>" +
        "</tr>";
    return translateRow(tr);
}

function DMPHONGBANLister_BuildRow(model) {
    let row = model.row;
    let tr = "<tr>" +
        "<th clusterize_row_id='" + row.Id + "'>" + "</th>" +
        "<td class='no-format' title='" + row.Code + "'>" + row.Code + "</td>" +
        "<td class='no-format' title='" + row.Name + "'>" + row.Name + "</td>" +
        "<td class='no-format' title='" + row.CName + "'>" + row.CName + "</td>" +
        "</tr>";
    return translateRow(tr);
}

function DMKHACHHANGLister_BuildRow(model) {

    let row = model.row;
    const GioiTinhMap = { 1: "Nam", 0: "Nữ" };
    let GioiTinhText = GioiTinhMap[row.GioiTinh] || row.GioiTinh;

    // Danh sách voucher của khách hàng
    let vouchers = row.Vouchers || [];
    let voucherCount = vouchers.length || 1; // nếu chưa có voucher vẫn phải render 1 row

    let rowsHtml = "";

    // Loop qua voucher
    vouchers.forEach((voucher, index) => {
        if (index === 0) {
            // Dòng đầu tiên: in cả thông tin KH + voucher
            rowsHtml += "<tr>" +
                "<th rowspan='" + voucherCount + "' clusterize_row_id='" + row.Id + "'></th>" +
                "<td rowspan='" + voucherCount + "' class='no-format' title='" + row.Code + "'>" + row.Code + "</td>" +
                "<td rowspan='" + voucherCount + "' class='no-format' title='" + row.Name + "'>" + row.Name + "</td>" +
                "<td rowspan='" + voucherCount + "' class='no-format' title='" + row.DiaChi + "'>" + row.DiaChi + "</td>" +
                "<td rowspan='" + voucherCount + "' class='no-format' title='" + formatDate3(row.NamSinh) + "'>" + formatDate3(row.NamSinh) + "</td>" +
                "<td rowspan='" + voucherCount + "' class='no-format' title='" + row.Identifier + "'>" + row.Identifier + "</td>" +
                "<td rowspan='" + voucherCount + "' class='no-format' title='" + GioiTinhText + "'>" + GioiTinhText + "</td>" +
                "<td rowspan='" + voucherCount + "' class='no-format' title='" + row.DienThoai + "'>" + row.DienThoai + "</td>" +
                "<td rowspan='" + voucherCount + "' class='no-format' title='" + row.Email + "'>" + row.Email + "</td>" +

                // cột voucher
                "<td class='no-format link' title='" + voucher.Serial + "' onclick='ShowVoucherEditor(" + JSON.stringify(voucher) + " ," + JSON.stringify(row) + ")'>" + voucher.Serial + "</td>" +
                "<td class='no-format' title='" + formatNumber(voucher.NumberOfUseRemaining) + "'>" + formatNumber(voucher.NumberOfUseRemaining) + "</td>" +
                "<td class='no-format' title='" + formatNumber(voucher.NumberOfFreeRemaining) + "'>" + formatNumber(voucher.NumberOfFreeRemaining) + "</td>" +
                "</tr>";
        } else {
            // Các dòng sau: chỉ in voucher thôi
            rowsHtml += "<tr>" +
                "<td class='no-format link' title='" + voucher.Serial + "' onclick='ShowVoucherEditor(" + JSON.stringify(voucher) + " ," + JSON.stringify(row) + ")'>" + voucher.Serial + "</td>" +
                "<td class='no-format' title='" + formatNumber(voucher.NumberOfUseRemaining) + "'>" + formatNumber(voucher.NumberOfUseRemaining) + "</td>" +
                "<td class='no-format' title='" + formatNumber(voucher.NumberOfFreeRemaining) + "'>" + formatNumber(voucher.NumberOfFreeRemaining) + "</td>" +
                "</tr>";
        }
    });

    // Trường hợp khách hàng chưa có voucher nào
    if (vouchers.length === 0) {
        rowsHtml += "<tr>" +
            "<th clusterize_row_id='" + row.Id + "'></th>" +
            "<td class='no-format' title='" + row.Code + "'>" + row.Code + "</td>" +
            "<td class='no-format' title='" + row.Name + "'>" + row.Name + "</td>" +
            "<td class='no-format' title='" + row.DiaChi + "'>" + row.DiaChi + "</td>" +
            "<td class='no-format' title='" + formatDate3(row.NamSinh) + "'>" + formatDate3(row.NamSinh) + "</td>" +
            "<td class='no-format' title='" + row.Identifier + "'>" + row.Identifier + "</td>" +
            "<td class='no-format' title='" + GioiTinhText + "'>" + GioiTinhText + "</td>" +
            "<td class='no-format' title='" + row.DienThoai + "'>" + row.DienThoai + "</td>" +
            "<td class='no-format' title='" + row.Email + "'>" + row.Email + "</td>" +
            "<td colspan='3' class='no-format' title='Chưa có voucher'>Chưa có voucher</td>" +
            "</tr>";
    }

    return translateRow(rowsHtml);
}


function DMNGUOIBANLister_BuildRow(model) {
    let row = model.row;

    const GioiTinhMap = {
        1: "Nam",
        0: "Nữ",
    };
    let GioiTinhText = GioiTinhMap[row.GioiTinh] || row.GioiTinh;

    let tr = "<tr>" +
        "<th clusterize_row_id='" + row.Id + "'></th>" +
        "<td class='no-format' title='" + row.Code + "'>" + row.Code + "</td>" +
        "<td class='no-format' title='" + row.Name + "'>" + row.Name + "</td>" +
        "<td class='no-format' title='" + row.ChucVu + "'>" + row.ChucVu + "</td>" +
        "<td class='no-format' title='" + formatDate3(row.NamSinh) + "'>" + formatDate3(row.NamSinh) + "</td>" +
        "<td class='no-format' title='" + row.Identifier + "'>" + row.Identifier + "</td>" +
        "<td class='no-format' title='" + GioiTinhText + "'>" + GioiTinhText + "</td>" +
        "<td class='no-format' title='" + row.DienThoai + "'>" + row.DienThoai + "</td>" +
        "<td class='no-format' title='" + row.DiaChi + "'>" + row.DiaChi + "</td>" +
        "<td class='no-format' title='" + row.Email + "'>" + row.Email + "</td>" +
        "</tr>";

    return translateRow(tr);
}

function CHUCVULister_BuildRow(model) {
    let row = model.row;
    let tr = "<tr>" +
        "<th clusterize_row_id='" + row.Id + "'></th>" +
        "<td class='no-format' title='" + row.Code + "'>" + row.Code + "</td>" +
        "<td class='no-format' title='" + row.Name + "'>" + row.Name + "</td>" +
        "<td class='no-format' title='" + row.HHCaNhan + " %'>" + row.HHCaNhan + " %</td>" +
        "<td class='no-format' title='" + row.HHTruongCuaHang + " %'>" + row.HHTruongCuaHang + " %</td>" +
        "<td class='no-format' title='" + row.HHPhoCuaHang + " %'>" + row.HHPhoCuaHang + " %</td>" +
        "<td class='no-format' title='" + row.QuyDoiPhaChe + " %'>" + row.QuyDoiPhaChe + " %</td>" +
        "<td class='no-format' title='" + row.QuyChung + " %'>" + row.QuyChung + " %</td>" +
        "<td class='no-format' title='" + row.Note + "'>" + row.Note + "</td>" +
        "</tr>";
    return translateRow(tr);
}

function DMDUANLister_BuildRow(model) {
    let row = model.row;
    let TheoDoi = "DUAN_Var_TheoDoi_" + row.TheoDoi;
    let tr = "<tr>" +
        "<th clusterize_row_id='" + row.Id + "'></th>" +
        "<td class='no-format' title='" + row.Code + "'>" + row.Code + "</td>" +
        "<td class='no-format' title='" + row.Name + "'>" + row.Name + "</td>" +
        "<td class='no-format' title='" + row.SoHopDong + "'>" + row.SoHopDong + "</td>" +
        "<td class='no-format' title='" + row.KName + "'>" + row.KName + "</td>" +
        //"<td class='no-format' title='" + row.UName + "'>" + row.UName + "</td>" +
        "<td class='no-format' title='" + row.AMName + "'>" + row.AMName + "</td>" + //20230612
        "<td class='no-format' title='" + applicationDictionary[TheoDoi].main + "'>" + applicationDictionary[TheoDoi].main + "</td>" +
        "</tr>";
    return translateRow(tr);
}


function ManagerRoleLister_BuildRow(model) {
    let row = model.row;
    let checked = row.Type == true ? "checked='checked'" : "";

    let tr =
        "<tr>" +
        "<th clusterize_row_id='" + row.Id + "'></th>" +
        "<td class='upper-case' title='" + row.Name + "'>" + row.Name + "</td>" +
        "<td class='no-format' title='" + row.Description + "'>" + row.Description + "</td>" +
        "<td class='center'>" +
        "<input disabled type='checkbox' " + checked + " />" +
        "</td>" +
        "</tr>";

    return translateRow(tr);
}

function ManagerUserLister_BuildRow(model) {
    let row = model.row;
    let status = "";
    if (row.LockoutEnd != null) {
        status = "<td class='text-align-center'><div class='head-icon'><i style='color:red;' class='s3t-tooltip fa fa-lock' data-tooltip-key='UserList_Var_Status_Locked' placement='s'></i></div></td>";
    } else {
        if (row.EmailConfirmed == false) {
            status = "<td class='text-align-center'><div class='head-icon'><i style='color:red;' class='s3t-tooltip fa fa-times-circle-o' data-tooltip-key='UserList_Var_Status_Not_Active' placement='s'></i></div></td>";
        } else {
            status = "<td class='text-align-center'><div class='head-icon'><i class='s3t-tooltip fa fa-check-square-o' data-tooltip-key='UserList_Var_Status_Active' placement='s'></i></div></td>";
        }
    }
    let tr = "<tr><th clusterize_row_id='" + row.Id + "'></th>"
        + status
        + "<td><div class='cell-image' data-image-path='" + (row.HasAvatar == true ? row.Avatar : "") + "'></div></td>"
        + "<td class='upper-case' title='" + row.UserName + "'>" + row.UserName + "</td>"
        + "<td class='no-format' title='" + row.Email + "'>" + row.Email + "</td>"
        + "<td class='no-format' title='" + row.FullName + "'>" + row.FullName + "</td>"
        + "<td class='no-format' title='" + row.Role + "'>" + row.Role + "</td>"
        + "<td class='no-format' title='" + row.DienThoai + "'>" + row.DienThoai + "</td>"
        + "<td class='no-format' title='" + row.ChucVu + "'>" + row.ChucVu + "</td>"
        //+ "<td class='no-format' title='" + row.PhongBanName + "'>" + row.PhongBanName + "</td>"
        + "</tr>";
    return translateRow(tr);
}

function ManagerVoucherLister_BuildRow(model) {
    let row = model.row;

    const validityMap = { 1: "3 Tháng", 2: "6 Tháng", 3: "9 Tháng", 4: "12 Tháng" };
    const typeMap = { 1: "Voucher miễn phí", 2: "Voucher có giá trị" };
    const statusMap = { 1: "Chưa bán", 2: "Đã bán", 3: "Đã kích hoạt" };

    let defaultValidityText = validityMap[row.ValidityPeriod] || row.ValidityPeriod;
    let typeText = typeMap[row.VoucherType] || row.VoucherType;
    let statusText = statusMap[row.Status] || row.Status;

    let tr = "<tr><th clusterize_row_id='" + row.Id + "'></th>"
        + "<td class='upper-case' title='" + row.Serial + "'>" + row.Serial + "</td>"
        + "<td class='no-format' title='" + typeText + "'>" + typeText + "</td>"
        + "<td class='no-format' title='" + formatNumber(row.SalePrice) + "'>" + formatNumber(row.SalePrice) + "</td>"
        + "<td class='no-format' title='" + formatNumber(row.NumberOfUseRemaining) + "'>" + formatNumber(row.NumberOfUseRemaining) + "</td>"
        + "<td class='no-format' title='" + formatNumber(row.NumberOfFreeRemaining) + "'>" + formatNumber(row.NumberOfFreeRemaining) + "</td>"
        + "<td class='no-format' title='" + defaultValidityText + "'>" + defaultValidityText + "</td>"
        + "<td class='no-format' title='" + row.BuyerName + "'>" + row.BuyerName + "</td>"
        + "<td class='no-format' title='" + row.BuyerPhone + "'>" + row.BuyerPhone + "</td>"
        + "<td class='no-format' title='" + row.ApplicableLocation + "'>" + row.ApplicableLocation + "</td>"
        + "<td class='no-format' title='" + formatDate3(row.ActivationDate) + "'>" + formatDate3(row.ActivationDate) + "</td>"
        + "<td class='no-format' title='" + formatDate3(row.ExpiryDate) + "'>" + formatDate3(row.ExpiryDate) + "</td>"
        + "<td class='no-format' title='" + statusText + "'>" + statusText + "</td>"
        + "<td class='no-format'>"
        + "<div style='display:flex;flex-direction:row;justify-content:space-evenly;align-items:center;'>"
        + "<div class='toolbar-button button-preview' title='Xem lịch sử'>"
        + "<i class='fa fa-eye' onclick='showHistory(\"" + row.Id + "\")'></i>"
        + "</div>"
        + "</div>"
        + "</td>"
        + "</tr>";

    return translateRow(tr);
}


function ManageVoucherSapHetHanLister_BuildRow(model) {
    let row = model.row;
    // Ánh xạ giá trị DefaultValidityPeriod
    const validityMap = {
        1: "3 Tháng",
        2: "6 Tháng",
        3: "9 Tháng",
        4: "12 Tháng"
    };
    // Ánh xạ giá trị Type
    const typeMap = {
        1: "Voucher miễn phí",
        2: "Voucher có giá trị"
    };
    // Ánh xạ giá trị Type
    const statusMap = {
        1: "Chưa bán",
        2: "Đã bán",
        3: "Đã kích hoạt",
    };
    let defaultValidityText = validityMap[row.ValidityPeriod] || row.ValidityPeriod;
    let typeText = typeMap[row.VoucherType] || row.VoucherType;
    let statusText = statusMap[row.Status] || row.Status;
    let checkboxHtml = row.BuyerEmail
        ? "<input type='checkbox' />"
        : "<input type='checkbox' disabled title='Không thể chọn vì không có email' />";

    let tr = "<tr><th clusterize_row_id='" + row.Id + "'></th>"
        + "<td class='upper-case td-check'>" + checkboxHtml + "</td>"
        + "<td class='upper-case' title='" + row.Serial + "'>" + row.Serial + "</td>"
        + "<td class='no-format' title='" + typeText + "'>" + typeText + "</td>"
        + "<td class='no-format' title='" + defaultValidityText + "'>" + defaultValidityText + "</td>"
        + "<td class='no-format' title='" + formatNumber(row.SalePrice) + "'>" + formatNumber(row.SalePrice) + "</td>"
        + "<td class='no-format' title='" + row.BuyerName + "'>" + row.BuyerName + "</td>"
        + "<td class='no-format' title='" + row.BuyerPhone + "'>" + row.BuyerPhone + "</td>"
        + "<td class='no-format' title='" + row.BuyerEmail + "'>" + row.BuyerEmail + "</td>"
        + "<td class='no-format' title='" + row.ApplicableLocation + "'>" + row.ApplicableLocation + "</td>"
        + "<td class='no-format' title='" + formatDate3(row.ActivationDate) + "'>" + formatDate3(row.ActivationDate) + "</td>"
        + "<td class='no-format' title='" + formatDate3(row.ExpiryDate) + "'>" + formatDate3(row.ExpiryDate) + "</td>"
        + "<td class='no-format' title='" + statusText + "'>" + statusText + "</td>"
        + "</tr>";
    return translateRow(tr);
}

function ManageDoanhThuNguoiBanLister_BuildRow(model) {
    let row = model.row;
    let tr = "<tr><th clusterize_row_id='" + row.Id + "'></th>"
        + "<td class='no-format' title='" + row.SellerName + "'>" + row.SellerName + "</td>"
        + "<td class='upper-case' title='" + row.SellerPhone + "'>" + row.SellerPhone + "</td>"
        + "<td class='no-format' title='" + row.ChucVuName + "'>" + row.ChucVuName + "</td>"
        + "<td class='no-format' title='" + formatNumber(row.SoldCount) + "'>" + formatNumber(row.SoldCount) + "</td>"
        + "<td class='no-format' title='" + formatCurrencyVN(row.TotalRevenue) + "'>" + formatCurrencyVN(row.TotalRevenue) + "</td>"
        + "<td class='no-format' title='" + formatCurrencyVN(row.TotalHHCaNhan) + "'>" + formatCurrencyVN(row.TotalHHCaNhan) + "</td>"
        + "<td class='no-format' title='" + formatCurrencyVN(row.TotalHHTruongCuaHang) + "'>" + formatCurrencyVN(row.TotalHHTruongCuaHang) + "</td>"
        + "<td class='no-format' title='" + formatCurrencyVN(row.TotalHHPhoCuaHang) + "'>" + formatCurrencyVN(row.TotalHHPhoCuaHang) + "</td>"
        + "<td class='no-format' title='" + formatCurrencyVN(row.TotalQuyDoiPhaChe) + "'>" + formatCurrencyVN(row.TotalQuyDoiPhaChe) + "</td>"
        + "<td class='no-format' title='" + formatCurrencyVN(row.TotalQuyChung) + "'>" + formatCurrencyVN(row.TotalQuyChung) + "</td>"
        + "</tr>";
    return translateRow(tr);
}

function ManageHoaHongChoCacBenLister_BuildRow(model) {
    let row = model.row;
    let tr = "<tr><th clusterize_row_id='" + row.Id + "'></th>"
        + "<td class='no-format' title='" + row.Hoten + "'>" + row.Hoten + "</td>"
        + "<td class='upper-case' title='" + row.DienThoai + "'>" + row.DienThoai + "</td>"
        + "<td class='no-format' title='" + row.Email + "'>" + row.Email + "</td>"
        + "<td class='no-format' title='" + row.ChucVu_Name + "'>" + row.ChucVu_Name + "</td>"
        + "<td class='no-format' title='" + formatCurrencyVN(row.Commission) + "'>" + formatCurrencyVN(row.Commission) + "</td>"
        + "</tr>";
    return translateRow(tr);
}

function ManageDoanhThuTheoLoaiVoucherLister_BuildRow(model) {
    let row = model.row;
    let tr = "<tr><th clusterize_row_id='" + row.Id + "'></th>"
        + "<td class='upper-case' title='" + row.Name + "'>" + row.Name + "</td>"
        + "<td class='no-format' title='" + row.Code + "'>" + row.Code + "</td>"
        + "<td class='no-format' title='" + formatCurrencyVN(row.DefaultPrice) + "'>" + formatCurrencyVN(row.DefaultPrice) + "</td>"
        + "<td class='no-format' title='" + row.SalesQuantity + "'>" + row.SalesQuantity + "</td>"
        + "<td class='no-format' title='" + formatCurrencyVN(row.TotalRevenue) + "'>" + formatCurrencyVN(row.TotalRevenue) + "</td>"
        + "</tr>";
    return translateRow(tr);
}
function ManageTiLeKichHoatVoucherLister_BuildRow(model) {
    let row = model.row;
    let tr = "<tr><th clusterize_row_id='" + row.Id + "'></th>"
        + "<td class='upper-case' title='" + row.SaleDate + "'>" + row.SaleDate + "</td>"
        + "<td class='no-format text-center' title='" + row.Sold + "'>" + row.Sold + "</td>"
        + "<td class='no-format text-center' title='" + row.Activated + "'>" + row.Activated + "</td>"
        + "<td class='no-format text-center' title='" + row.UsageRate + "%'>" + row.UsageRate + " %" + "</td>"
        + "</tr>";
    return translateRow(tr);
}



function ManagerTypeVoucherLister_BuildRow(model) {
    let row = model.row;

    // Ánh xạ giá trị DefaultValidityPeriod
    const validityMap = {
        1: "3 Tháng",
        2: "6 Tháng",
        3: "9 Tháng",
        4: "12 Tháng"
    };

    // Ánh xạ giá trị Type
    const typeMap = {
        1: "Voucher miễn phí",
        2: "Voucher có giá trị"
    };

    let defaultValidityText = validityMap[row.DefaultValidityPeriod] || row.DefaultValidityPeriod;
    let typeText = typeMap[row.Type] || row.Type;

    let tr =
        "<tr>"
        + "<th clusterize_row_id='" + row.Id + "'></th>"
        + "<td class='no-format' title='" + row.Code + "'>" + row.Code + "</td>"
        + "<td class='no-format' title='" + row.Name + "'>" + row.Name + "</td>"
        + "<td class='no-format' title='" + row.Description + "'>" + row.Description + "</td>"
        + "<td class='no-format' title='" + formatNumber(row.DefaultPrice) + "'>" + formatNumber(row.DefaultPrice) + "</td>"
        + "<td class='no-format' title='" + formatNumber(row.DefaultRealPrice) + "'>" + formatNumber(row.DefaultRealPrice) + "</td>"
        + "<td class='no-format' title='" + row.CostSave + "'>" + row.CostSave + "</td>"
        + "<td class='no-format' title='" + defaultValidityText + "'>" + defaultValidityText + "</td>"
        + "<td class='no-format' title='" + typeText + "'>" + typeText + "</td>"
        + "<td class='no-format' title='" + row.DefaultNumberOfUse + "'>" + row.DefaultNumberOfUse + "</td>"
        + "<td class='no-format' title='" + row.DefaultNumberOfFree + "'>" + row.DefaultNumberOfFree + "</td>"
        + "</tr>";

    return translateRow(tr);
}
function QTNHATKYSUDUNGLister_BuildRow(model) {
    let row = model.row;
    let tr =
        "<tr>" +
        "<th clusterize_row_id='" + row.Id + "'></th>" +
        "<td class='no-format' title='" + row.UserName + "'>" + row.UserName + "</td>" +
        "<td class='text-align-center' title='" + datetimeToStringMedium(row.ThoiGian) + "'>" + datetimeToStringMedium(row.ThoiGian) + "</td>" +
        "<td class='no-format' title='" + row.ChucNang + "'>" + row.ChucNang + "</td>" +
        "<td class='no-format' title='" + row.HanhDong + "'>" + row.HanhDong + "</td>" +
        "</tr>";

    return translateRow(tr);
}
function RightAssignment_BuildRow(model) {
    let row = model.row, controlid = model.controlid;
    let disabled = row.IsDeny == true ? "disabled" : "";
    let Right_1 = row.Right_1 == true ? "checked='checked'" : "";
    let Right_2 = row.Right_2 == true ? "checked='checked'" : "";
    let Right_3 = row.Right_3 == true ? "checked='checked'" : "";
    let Right_4 = row.Right_4 == true ? "checked='checked'" : "";
    let Right_5 = row.Right_5 == true ? "checked='checked'" : "";    

    let enabled1 = row.IsDeny == false || row.IsEnabled1 == true ? "" : "disabled";
    let enabled2 = row.IsDeny == false || row.IsEnabled2 == true ? "" : "disabled";
    let enabled3 = row.IsDeny == false || row.IsEnabled3 == true ? "" : "disabled";
    let enabled4 = row.IsDeny == false || row.IsEnabled4 == true ? "" : "disabled";
    let enabled5 = row.IsDeny == false || row.IsEnabled5 == true ? "" : "disabled";  

    row.ParentId = row.ParentId == null ? "" : row.ParentId;

    let level = !row.ParentId ? "data-depth='0' class='collapse level0' style='font-weight: bold;'" : "data-depth='1' class='collapse level1'";
    let level1 = !row.ParentId ? "" : "level1";
    let item = !row.ParentId ? "<span class='toggle collapse'></span>" : "";

    let CheckboxBuildHtml = function (disabled, enabled, controlid, row, right, index) {
        return "<td class='center'><label class='checkbox-container'><input " + disabled + " " + enabled + " onclick='" + controlid + "__right" + index + "_click(this,\"" + row.Id + "\")' class='rightassignment rightassignment_" + row.Id + "' type='checkbox' " + right + "/><span class='checkmark'></span></label></td>";
    }

    let checkbox1 = CheckboxBuildHtml(disabled, enabled1, controlid, row, Right_1, 1);
    let checkbox2 = CheckboxBuildHtml(disabled, enabled2, controlid, row, Right_2, 2);
    let checkbox3 = CheckboxBuildHtml(disabled, enabled3, controlid, row, Right_3, 3);
    let checkbox4 = CheckboxBuildHtml(disabled, enabled4, controlid, row, Right_4, 4);
    let checkbox5 = CheckboxBuildHtml(disabled, enabled5, controlid, row, Right_5, 5);

    let tr = "<tr " + level + "><th clusterize_row_id='" + row.Id + "'></th><td class='" + level1 + "'>" + item + row.Name + "</td>";
    tr += checkbox1 + checkbox2 + checkbox3 + checkbox4 + checkbox5 + "</tr>";

    return translateRow(tr);
}

function XemTTNhanVienLister_BuildRow(model) {

    let row = model.row;
    let tr = "<tr>" +
        "<th clusterize_row_id='" + row.Id + "'>" + "</th>" +
        "<td class='no-format'>" + row.UserName + "</td>" +
        "<td class='no-format'>" + row.HoVaTen + "</td>" +
        "<td class='no-format'>" + row.DienThoai + "</td>" +
        "<td class='no-format'>" + row.Code + "</td>" +
        "<td class='no-format'>" + row.ChucVu + "</td>" +
        "<td class='no-format'>" + row.PhongBanName + "</td>" +
        "</tr>";
    return translateRow(tr);
}


function ThoiGianBCCVLister_BuildRow(model) {
    let row = model.row;

    let TrongGio = TextNumberBuildHtml({
        ColumnName: 'TrongGio',
        Validate: false,
        HideZero: false,
        AllowNegative: false,
        NotEqualZero: true,
        Scale: 'QuantityDecimals',
        Value: row.TrongGio,
        Id: row.Id,
        MinValue: 0,
        MaxValue: 8
    });

    let NgoaiGio = TextNumberBuildHtml({
        ColumnName: 'TrongGio',
        Validate: false,
        HideZero: false,
        AllowNegative: false,
        NotEqualZero: true,
        Scale: 'QuantityDecimals',
        Value: row.NgoaiGio,
        Id: row.Id,
        MinValue: 0,
        MaxValue: 8
    });
    
    let tr = "<tr>" +
        "<th clusterize_row_id='" + row.Id + "'>" + "</th>" +        
        "<td class='no-format'>" + row.NguoiGui + "</td>" +
        "<td class='no-format'>" + row.TenPhongBan + "</td>" +
        "<td class='no-format'>" + row.NgayBaoCaoHienThi + "</td>" + TrongGio + NgoaiGio +
        "<td class='no-format'>" + row.ThoiGianGuiBaoCaoHienThi + "</td>" +
        "<td class='no-format'>" + row.ThoiGianDuyetBaoCaoHienThi + "</td>" +
        "<td class='no-format'>" + row.NguoiDuyet + "</td>" +
        /*"<td class='no-format'>" + row.TrangThaiHienThi + "</td>" +*/
        "</tr>";

    return translateRow(tr);
}