
    ---SELECT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'UserProfile_GetAll')
	DROP PROCEDURE UserProfile_GetAll
GO

CREATE PROCEDURE UserProfile_GetAll
WITH ENCRYPTION
/********************************************************************************
--Routine: UserProfile_GetAll
--Task: Save a record into table UserProfile
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	SELECT distinct 	UserProfile.Id,
			[HOVATEN] as HoVaTen,
			[PHONGBAN_Id] as PhongBanId,
			UserProfile.COQUANBO_Id as CoQuanId,
			tblUser.UserName2 as UserName,
			tblUser.Email2 as Email,
			[NGAYSINH] as NgaySinh,
			[GIOITINH] as GioiTinh,
			[CHUCVU_ID] as ChucVu,
			[DIENTHOAI] as DienThoai,
			[SOCCCD] as SoCCCD,
			[NGAYCAP] as NgayCap,
			[NOICAP] as NoiCap,
			[QUEQUAN] as QueQuan,
			[DIACHIHIENTAI] as DiaChiHienTai,
			DMPHONGBAN.Code as PhongBanCode,
			DMPHONGBAN.[Name] as PhongBanName,
			DMCOQUANBO.[Code] as CoQuanCode,
			DMCOQUANBO.[Name] as CoQuanName
	FROM  [3TVoucher].dbo.UserList tblUser LEFT JOIN [UserProfile] ON tblUser.Id = UserProfile.Id
													LEFT JOIN DMPHONGBAN ON DMPHONGBAN.Id = UserProfile.PHONGBAN_Id
													LEFT JOIN DMCOQUANBO ON DMCOQUANBO.Id = UserProfile.COQUANBO_Id
END
