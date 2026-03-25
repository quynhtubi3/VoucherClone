ALTER PROCEDURE [dbo].[TBLTCDA_Get]

	@p_DUAN_Id			varchar(50) = NULL,
	@p_MADUAN			T_D256 = NULL,		
	@CurrentUserID	T_D256 = NULL

AS
BEGIN
--20230525

    DECLARE @SQLString NVARCHAR(MAX)
	SET @SQLString = 'SELECT a.Id, a.DUANID, a.MADUAN AS DuAnCode, a.NOIDUNG AS NoiDung, a.NGAYTHANG AS NgayThang'
	SET @SQLString = @SQLString + ' , a.KHACHHANGID, a.AMID, a.PHONGBANID'
	SET @SQLString = @SQLString + ' , a.SOTIEN AS TienNet'
	SET @SQLString = @SQLString + ' , a.NGUOITHUHUONGID'
	SET @SQLString = @SQLString + ' , a.EMAIL AS DoiTuong'
	SET @SQLString = @SQLString + ' , a.SOTIENGROSS AS TienGross'
	SET @SQLString = @SQLString + ' , a.THUE, a.MALOAICHIPHI'
	SET @SQLString = @SQLString + ' , a.CreatedAt, a.CreatedBy, a.ModifiedAt, a.ModifiedBy'
	SET @SQLString = @SQLString + ' FROM tblTCDA a join DMDUAN b on a.DUANID = b.Id'
	SET @SQLString = @SQLString + ' WHERE 1 = 1' 
	
	IF @p_MADUAN is not NULL and @p_MADUAN != ''
	BEGIN
		SET @SQLString = @SQLString + ' and a.MADUAN = ''' + @p_MADUAN + ''''
	END

	IF @p_DUAN_Id is not NULL and @p_DUAN_Id != ''
	BEGIN
		SET @SQLString = @SQLString + ' and a.DUANID = ''' + @p_DUAN_Id + ''''
	END

	--QuachPhu 20230512 Start
	SET @SQLString = @SQLString + ' AND b.AM_Id IN (select * from funcDanhSachNhanVienPhongBanQuanLy(''' + @CurrentUserID + '''))'
	--QuachPhu 20230512 End
	
	EXECUTE sp_executesql @SQLString

	
END









