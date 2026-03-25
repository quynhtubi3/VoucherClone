  ---SELECT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'UserProfile_Search')
	DROP PROCEDURE UserProfile_Search
GO

CREATE PROCEDURE [dbo].[UserProfile_Search]
	
	@UserName				T_D256 = NULL,
	@p_HoVaTen				T_D256 = NULL,	
	@DienThoai				T_D256 = NULL,
	@MaPhongBan				T_D256 = NULL,
	@TinhTrangCongViec				T_D256 = NULL,
	@ChucVu				T_D256 = NULL


/********************************************************************************
--Routine: UserProfile_Search
--Task: Save a record into table UserProfile
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
--20240321
	DECLARE @SQLString NVARCHAR(MAX)
	SET @SQLString = 'select u.Id, tblUser.UserName2 as UserName, u.HOVATEN as HoVaTen, u.DIENTHOAI as DienThoai, tblUser.Email2 as Code,'
	SET @SQLString = @SQLString + ' u.CHUCVU_ID as ChucVu_Id,cv.Name as ChucVu, u.PHONGBAN_Id, DMPHONGBAN.Name as PhongBanName ' 	
	SET @SQLString = @SQLString + ' from UserProfile u '
    SET @SQLString = @SQLString + ' LEFT JOIN CHUCVU cv ON cv.Id = u.CHUCVU_ID '
	SET @SQLString = @SQLString + ' JOIN [3TVoucher].dbo.UserList tblUser ON tblUser.Id = u.Id '
	SET @SQLString = @SQLString + ' LEFT JOIN DMPHONGBAN ON DMPHONGBAN.Id = u.PHONGBAN_Id '
	SET @SQLString = @SQLString + ' WHERE 1 = 1 '

	
	IF @UserName is not null and @UserName != ''
	BEGIN
		SET @SQLString = @SQLString + ' and tblUser.UserName2 like ''%' + @UserName + '%'''
	END

	IF @p_HoVaTen is not null and @p_HoVaTen != ''
	BEGIN
		SET @SQLString = @SQLString + ' and u.HOVATEN like N''%' + @p_HoVaTen + '%'''
	END

	IF @DienThoai is not null and @DienThoai != ''
	BEGIN
		SET @SQLString = @SQLString + ' and u.DIENTHOAI like ''%' + @DienThoai + '%'''
	END

	IF @MaPhongBan is not null and @MaPhongBan != ''
	BEGIN
		SET @SQLString = @SQLString + ' and u.PHONGBAN_Id = ''' + @MaPhongBan + ''''
	END

	IF @TinhTrangCongViec is not null and @TinhTrangCongViec != '' and @TinhTrangCongViec != '-1'
	BEGIN
		SET @SQLString = @SQLString + ' and u.TINHTRANGCONGVIEC = ''' + @TinhTrangCongViec + ''''
	END
	
	IF @ChucVu is not null and @ChucVu != ''
	BEGIN
		SET @SQLString = @SQLString + ' and u.CHUCVU like N''%' + @ChucVu + '%'''
	END

	SET @SQLString = @SQLString + ' ORDER BY tblUser.UserName2' 


	EXECUTE sp_executesql @SQLString

END

