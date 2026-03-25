ALTER PROCEDURE [dbo].[DUANDOANHTHU_Get]

	@p_DUAN_Id			varchar(50) = NULL,
	@p_MADUAN			T_D256 = NULL,		
	@CurrentUserID	T_D256 = NULL

AS
BEGIN
--20230831

    DECLARE @SQLString NVARCHAR(MAX)
	SET @SQLString = 'SELECT a.Id, a.DUAN_Id, a.MADUAN AS DuAnCode, a.NGAYNHANTIEN AS NgayNhanTien, a.SOTIEN AS SoTien, a.DIENGIAI AS DienGiai, a.LOAIDOANHTHU AS LoaiDoanhThu'
	SET @SQLString = @SQLString + ' , a.DOITUONG AS DoiTuong, a.CreatedAt, a.CreatedBy, a.ModifiedAt, a.ModifiedBy'
	SET @SQLString = @SQLString + ' , a.THUE, a.SOTIENNET'
	SET @SQLString = @SQLString + ' FROM DOANHTHUDUAN a join DMDUAN b on a.DUAN_Id = b.Id'
	SET @SQLString = @SQLString + ' WHERE 1 = 1' 
	
	IF @p_MADUAN is not NULL and @p_MADUAN != ''
	BEGIN
		SET @SQLString = @SQLString + ' and a.MADUAN = ''' + @p_MADUAN + ''''
	END

	IF @p_DUAN_Id is not NULL and @p_DUAN_Id != ''
	BEGIN
		SET @SQLString = @SQLString + ' and a.DUAN_Id = ''' + @p_DUAN_Id + ''''
	END

	--QuachPhu 20230512 Start
	SET @SQLString = @SQLString + ' AND b.AM_Id IN (select * from funcDanhSachNhanVienPhongBanQuanLy(''' + @CurrentUserID + '''))'
	--QuachPhu 20230512 End
	
	EXECUTE sp_executesql @SQLString

	
END









