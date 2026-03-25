  ---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'QTNHATKYHETHONG_Get')
	DROP PROCEDURE QTNHATKYHETHONG_Get
GO

CREATE PROCEDURE QTNHATKYHETHONG_Get
(
	@user_name T_D256 = NULL,
	@tu_ngay T_D256,
	@den_ngay T_D256,
	@chuc_nang T_D256 = NULL
)
WITH ENCRYPTION
/********************************************************************************
--Routine: QTNHATKYHETHONG_Get
--Task: Get record(s) from table NHATKYHETHONG
--Version: 
--    1.0 Mar 27 2022  2:14PM:    HAINP        Created
********************************************************************************/
AS
BEGIN
	DECLARE @SQLString NVARCHAR(MAX)
	DECLARE @FromDate NVARCHAR(MAX)
	DECLARE @ToDate NVARCHAR(MAX)

	SET @SQLString = 'select tblnhatky.User_Id as UserId, tblnguoidung.UserName2 as UserName, tblnhatky.CHUCNANG as ChucNang, '
	SET @SQLString = @SQLString + ' tblnhatky.HANHDONG as HanhDong, tblnhatky.THOIGIAN as ThoiGian from NHATKYHETHONG tblnhatky, GroupWareService.dbo.UserList tblnguoidung ' 
	SET @SQLString = @SQLString + ' where tblnhatky.User_Id = tblnguoidung.Id and FORMAT(tblnhatky.THOIGIAN, ''yyyy/MM/dd'') between ''' + @tu_ngay + ''' and ''' + @den_ngay + ''''
		
	IF @user_name != NULL or @user_name != ''
	BEGIN
		SET @SQLString = @SQLString + ' and tblnguoidung.UserName2 Like ''%' + @user_name + '%'''
	END

	IF @chuc_nang != NULL or @chuc_nang != '' 
	BEGIN
		SET @SQLString = @SQLString + ' and tblnhatky.CHUCNANG = N''' + @chuc_nang + ''''
	END
	SET @SQLString = @SQLString + ' ORDER BY THOIGIAN DESC'
	--print @SQLString
	EXECUTE sp_executesql @SQLString

END
