 ---SELECT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'UserProfile_Get')
	DROP PROCEDURE UserProfile_Get
GO
CREATE PROCEDURE UserProfile_Get
(
	@Id				T_ID

) WITH ENCRYPTION
/********************************************************************************
--Routine: UserProfile_Get
--Task: Save a record into table UserProfile
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN

	SELECT	UserProfile.Id,
			[HOVATEN] as HoVaTen,
			[PHONGBAN_Id] as PhongBanId,
			UserProfile.COQUANBO_Id as CoQuanId,
			tblUser.UserName2 as UserName,
			tblUser.Email2 as Email,
			[NGAYSINH] as NgaySinh,
			[MANHANVIEN] as MANHANVIEN,
			[GIOITINH] as GioiTinh,
			[CHUCVU_ID] as ChucVu_Id,
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
	WHERE UserProfile.Id = @Id
END