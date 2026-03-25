ALTER PROCEDURE DMDUAN_Get

	@p_Code			T_D256,
	@p_Name			T_D256,	
	@p_KName		T_D256,
	@p_AM			varchar(50) = NULL,
	@p_TheoDoi		T_D002,
	@CurrentUserID	T_D256 = NULL,
	@p_SoHopDong	T_D256 = NULL

/********************************************************************************
--Routine: DMDUAN_Get
--Task: Get record(s) from table DMDUAN
--Version: 
--    1.0 Mar 23 2022  2:14PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
--20240313

    DECLARE @SQLString NVARCHAR(MAX)
	SET @SQLString = 'SELECT DU.Id,DU.Mota,DU.StartDate,DU.EndDate,DU.TheoDoi,DU.Code,DU.Name,DU.SoHopDong,DU.NamDuAn,DU.NgayKyHD,DU.GiaTriHD,DU.GiaVon,DU.CreatedAt,DU.CreatedBy,DU.ModifiedAt,DU.ModifiedBy,KH.Id AS KId, KH.Name as KName,PB.Id AS PId, PB.Code as PName,U.Id as UId, U.UserName2 as UName '
	SET @SQLString = @SQLString + ' , DU.AMAD, DU.LOAIDUAN, DU.NAMQUYETTOAN, DU.DOANHTHUDUKIEN, DU.DOANHTHUTHUCTE, DU.GIAVONMUANGOAITHUCTE, DU.INCENTIVETAMUNG, DU.INCENTIVE '
	SET @SQLString = @SQLString + ' , U.FullName as AMName '
	SET @SQLString = @SQLString + ' , PM.Id as PMId, PM.UserName2 as PMName '
	SET @SQLString = @SQLString + ' , PIC.Id as PICId, PIC.UserName2 as PICName '
	SET @SQLString = @SQLString + ' , QTHD.Id as QTHDId, QTHD.UserName2 as QTHDName '
	SET @SQLString = @SQLString + ' FROM DMDUAN as DU INNER JOIN DMKHACHHANG as KH ON DU.KHACHHANG_Id = KH.Id INNER JOIN DMPHONGBAN as PB ON PB.Id = DU.PHONGBAN_Id INNER JOIN GroupWareService.dbo.UserList as U ON DU.AM_Id = U.Id '
	SET @SQLString = @SQLString + ' LEFT JOIN GroupWareService.dbo.UserList as PM ON DU.PMID = PM.Id '
	SET @SQLString = @SQLString + ' LEFT JOIN GroupWareService.dbo.UserList as PIC ON DU.PICID = PIC.Id '
	SET @SQLString = @SQLString + ' LEFT JOIN GroupWareService.dbo.UserList as QTHD ON DU.QTHDID = QTHD.Id '
	SET @SQLString = @SQLString + ' WHERE DU.Code Like ''%' + @p_Code + '%'' AND DU.[Name] Like ''%' + @p_Name + '%'' AND KH.[Name] Like ''%' + @p_KName + '%'''
	
	IF @p_AM is not null and @p_AM != ''
	BEGIN
		SET @SQLString = @SQLString + ' AND DU.AM_Id = ''' + @p_AM + ''''
	END

	IF @p_TheoDoi is not null and @p_TheoDoi != '' 
	BEGIN
		SET @SQLString = @SQLString + ' AND DU.TheoDoi = ''' + @p_TheoDoi + ''''
	END


	--SET @SQLString = @SQLString + ' AND DU.AM_Id IN ('
	--SET @SQLString = @SQLString + ' select NHANVIEN_Id from NHANVIENQUANLY where UserId = ''' + @CurrentUserID + ''''
	--SET @SQLString = @SQLString + ' union all select Id from UserProfile where Id = ''' + @CurrentUserID + ''''
	--SET @SQLString = @SQLString + ' union all select UserProfile.Id from PHONGBANQUANLY inner join DMPHONGBAN on DMPHONGBAN.Id = PHONGBANQUANLY.PHONGBAN_Id inner join UserProfile on UserProfile.PHONGBAN_Id = PHONGBANQUANLY.PHONGBAN_Id where PHONGBANQUANLY.UserId = ''' + @CurrentUserID + ''''
	--SET @SQLString = @SQLString + ' )'

	--QuachPhu 20230512 Start
	SET @SQLString = @SQLString + ' AND DU.AM_Id IN (select * from funcDanhSachNhanVienPhongBanQuanLy(''' + @CurrentUserID + '''))'
	--QuachPhu 20230512 End

	IF @p_SoHopDong is not null and @p_SoHopDong != '' 
	BEGIN
		SET @SQLString = @SQLString + ' AND DU.SoHopDong Like ''%' + @p_SoHopDong + '%''';
	END

	SET @SQLString = @SQLString + ' order by DU.CreatedAt desc '
	
	EXECUTE sp_executesql @SQLString

	
END









GO
