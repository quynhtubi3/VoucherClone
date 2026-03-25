function TextSearchCallback_Role(parentId, element) {
    var screenInfo = new Object();

    screenInfo.Title = translator._getValueFromJSON("UserList_Var_Role.main", applicationDictionary, false);
    screenInfo.Title_E = translator._getValueFromJSON("UserList_Var_Role.sub", applicationDictionary, false);
    screenInfo.Id = "ManagerRoleEditor";
    screenInfo.TabId = GetElementScreenInfo(element).TabId + screenInfo.Id;
    screenInfo.Type = "listeditor";
    screenInfo.Dock = "none";
    screenInfo.Callback = screenInfo.TabId + "_OnShowFromOther";
    screenInfo.ParentId = parentId;
    screenInfo.NewChecked = true;
    screenInfo.Element = element;

    AddTab(screenInfo);
}

function TextSearchCallback_DMPHONGBAN(parentId, element) {
    var screenInfo = new Object();

    screenInfo.Title = translator._getValueFromJSON("UserList_Var_Role.main", applicationDictionary, false);
    screenInfo.Title_E = translator._getValueFromJSON("UserList_Var_Role.sub", applicationDictionary, false);
    screenInfo.Id = "DMPHONGBANEditor";
    screenInfo.TabId = GetElementScreenInfo(element).TabId + screenInfo.Id;
    screenInfo.Type = "listeditor";
    screenInfo.Dock = "none";
    screenInfo.Callback = screenInfo.TabId + "_OnShowFromOther";
    screenInfo.ParentId = parentId;
    screenInfo.NewChecked = true;
    screenInfo.Element = element;

    AddTab(screenInfo);
}

function TextSearchCallback_DMCOQUANBO(parentId, element) {
    var screenInfo = new Object();

    screenInfo.Title = translator._getValueFromJSON("UserList_Var_Role.main", applicationDictionary, false);
    screenInfo.Title_E = translator._getValueFromJSON("UserList_Var_Role.sub", applicationDictionary, false);
    screenInfo.Id = "DMCOQUANBOEditor";
    screenInfo.TabId = GetElementScreenInfo(element).TabId + screenInfo.Id;
    screenInfo.Type = "listeditor";
    screenInfo.Dock = "none";
    screenInfo.Callback = screenInfo.TabId + "_OnShowFromOther";
    screenInfo.ParentId = parentId;
    screenInfo.NewChecked = true;
    screenInfo.Element = element;

    AddTab(screenInfo);
}

function TextSearchCallback_DMDUAN(parentId, element) {
    var screenInfo = new Object();
    //alert('1');Khi bam nut + o cac chuc nang co search du an thi vao day
    screenInfo.Title = translator._getValueFromJSON("UserList_Var_Role.main", applicationDictionary, false);
    screenInfo.Title_E = translator._getValueFromJSON("UserList_Var_Role.sub", applicationDictionary, false);
    screenInfo.Id = "DMDUANEditor";
    screenInfo.TabId = GetElementScreenInfo(element).TabId + screenInfo.Id;
    screenInfo.Type = "listeditor";
    screenInfo.Dock = "none";
    screenInfo.Callback = screenInfo.TabId + "_OnShowFromOther";
    screenInfo.ParentId = parentId;
    screenInfo.NewChecked = true;
    screenInfo.Element = element;

    AddTab(screenInfo);
}

function TextSearchCallback_DMKHACHHANG(parentId, element) {
    var screenInfo = new Object();

    screenInfo.Title = translator._getValueFromJSON("UserList_Var_Role.main", applicationDictionary, false);
    screenInfo.Title_E = translator._getValueFromJSON("UserList_Var_Role.sub", applicationDictionary, false);
    screenInfo.Id = "DMKHACHHANGEditor";
    screenInfo.TabId = GetElementScreenInfo(element).TabId + screenInfo.Id;
    screenInfo.Type = "listeditor";
    screenInfo.Dock = "none";
    screenInfo.Callback = screenInfo.TabId + "_OnShowFromOther";
    screenInfo.ParentId = parentId;
    screenInfo.NewChecked = true;
    screenInfo.Element = element;

    AddTab(screenInfo);
}

function TextSearchCallback_UserList(parentId, element) {
    var screenInfo = new Object();

    screenInfo.Title = translator._getValueFromJSON("UserList_Var_Role.main", applicationDictionary, false);
    screenInfo.Title_E = translator._getValueFromJSON("UserList_Var_Role.sub", applicationDictionary, false);
    screenInfo.Id = "ManagerUserEditorAdd";
    screenInfo.TabId = GetElementScreenInfo(element).TabId + screenInfo.Id;
    screenInfo.Type = "listeditor";
    screenInfo.Dock = "none";
    screenInfo.Callback = screenInfo.TabId + "_OnShowFromOther";
    screenInfo.ParentId = parentId;
    screenInfo.NewChecked = true;
    screenInfo.Element = element;

    AddTab(screenInfo);
}