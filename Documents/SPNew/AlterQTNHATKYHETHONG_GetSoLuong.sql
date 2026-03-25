GO

ALTER PROCEDURE QTNHATKYHETHONG_GetSoLuong

	@user_name T_D256 = NULL,
	@tu_ngay T_D256,
	@den_ngay T_D256,
	@chuc_nang T_D256 = NULL

/********************************************************************************
--Routine: QTNHATKYHETHONG_Get
--Task: Get record(s) from table NHATKYHETHONG
--Version: 
--    1.0 Mar 27 2022  2:14PM:    HAINP        Created
********************************************************************************/
AS
BEGIN
--20230927
	DECLARE @SQLString NVARCHAR(MAX)
	DECLARE @FromDate NVARCHAR(MAX)
	DECLARE @ToDate NVARCHAR(MAX)

	SET @SQLString = 'select count(*) as SoLuong '
	SET @SQLString = @SQLString + ' from NHATKYHETHONG tblnhatky, GroupWareService.dbo.UserList tblnguoidung ' 
	SET @SQLString = @SQLString + ' where tblnhatky.User_Id = tblnguoidung.Id and FORMAT(tblnhatky.THOIGIAN, ''yyyy/MM/dd'') between ''' + @tu_ngay + ''' and ''' + @den_ngay + ''''
		
	IF @user_name is not NULL and @user_name != ''
	BEGIN
		SET @SQLString = @SQLString + ' and tblnguoidung.Id = ''' + @user_name + ''''
	END

	IF @chuc_nang is not NULL and @chuc_nang != ''
	BEGIN
		SET @SQLString = @SQLString + ' and tblnhatky.CHUCNANG = N''' + @chuc_nang + ''''
	END

	--print @SQLString
	EXECUTE sp_executesql @SQLString

END
GO
