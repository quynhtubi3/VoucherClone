select * from UserProfile up 

select * from Menu m

select * from DMCOQUANBO



GO

ALTER PROCEDURE [dbo].[UserProfile_Get]

	@Id				T_ID


/********************************************************************************
--Routine: UserProfile_Get
--Task: Save a record into table UserProfile
--Version: 
--    1.1 13/07/2025  9:33PM:    ANBD        Created
********************************************************************************/
AS
BEGIN
--20240318

	SELECT	UserProfile.Id,
			[HOVATEN] as HoVaTen,
			[PHONGBAN_Id] as PhongBanId,
			UserProfile.COQUANBO_Id as CoQuanId,
			tblUser.UserName2 as UserName,
			tblUser.Email2 as Email,
			[CHUCVU] as ChucVu,
			[NGAYSINH] as NgaySinh,
			[GIOITINH] as GioiTinh,
			[DIENTHOAI] as DienThoai,
			[SOCCCD] as SoCCCD,
			[NGAYCAP] as NgayCap,
			[NOICAP] as NoiCap,
			[QUEQUAN] as QueQuan,
			[DIACHIHIENTAI] as DiaChiHienTai,
			DMPHONGBAN.Code as PhongBanCode,
			DMPHONGBAN.[Name] as PhongBanName,
			DMCOQUANBO.[Code] as CoQuanCode,
			DMCOQUANBO.[Name] as CoQuanName,
			MANHANVIEN

	FROM  [3TVoucher].dbo.UserList tblUser JOIN [UserProfile] ON tblUser.Id = UserProfile.Id
													LEFT JOIN DMPHONGBAN ON DMPHONGBAN.Id = UserProfile.PHONGBAN_Id
													LEFT JOIN DMCOQUANBO ON DMCOQUANBO.Id = UserProfile.COQUANBO_Id
	WHERE UserProfile.Id = @Id
END






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
			[CHUCVU] as ChucVu,
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
	FROM  GroupWareService.dbo.UserList tblUser LEFT JOIN [UserProfile] ON tblUser.Id = UserProfile.Id
													LEFT JOIN DMPHONGBAN ON DMPHONGBAN.Id = UserProfile.PHONGBAN_Id
													LEFT JOIN DMCOQUANBO ON DMCOQUANBO.Id = UserProfile.COQUANBO_Id
END









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
			[GIOITINH] as GioiTinh,
			[CHUCVU] as ChucVu,
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
	FROM  [3TVoucher].tblUser LEFT JOIN [UserProfile] ON tblUser.Id = UserProfile.Id
													LEFT JOIN DMPHONGBAN ON DMPHONGBAN.Id = UserProfile.PHONGBAN_Id
													LEFT JOIN DMCOQUANBO ON DMCOQUANBO.Id = UserProfile.COQUANBO_Id
	WHERE UserProfile.Id = @Id
END























---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'UserProfile_Save')
	DROP PROCEDURE UserProfile_Save
GO

CREATE PROCEDURE UserProfile_Save
(
    @p_Moi_Sua				T_INT = null,
	@Id						T_ID output,
	@HOVATEN				T_D256 = NULL,
	@DIENTHOAI				T_D256 = NULL,
	@PHONGBAN_Id			T_ID = NULL,
	@COQUANBO_Id			T_ID = NULL,
	@NGAYSINH				T_DATE = NULL,
	@GIOITINH				T_D001 = NULL,
	@CHUCVU					T_D256 = NULL,
	@SOCCCD					T_D256 = NULL,
	@NGAYCAP				T_DATE = NULL,	
	@NOICAP					T_D256 = NULL,	
	@QUEQUAN				nvarchar(MAX) = NULL,
	@DIACHIHIENTAI			nvarchar(MAX) = NULL,
	@MANHANVIEN				T_D256 = NULL
) WITH ENCRYPTION
/********************************************************************************
--Routine: UserProfile_Save
--Task: Save a record into table UserProfile
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	BEGIN TRANSACTION

	BEGIN TRY
		IF @p_Moi_Sua = 1
		BEGIN
			INSERT INTO UserProfile
			(
				Id,
				HOVATEN,
				DIENTHOAI,
				PHONGBAN_Id,
				COQUANBO_Id,
				NGAYSINH,
				GIOITINH,
				CHUCVU,
				SOCCCD,
				NGAYCAP,
				NOICAP,
				QUEQUAN,
				DIACHIHIENTAI,
				MANHANVIEN
			)
			VALUES
			(
				@Id,
				@HOVATEN,
				@DIENTHOAI,
				@PHONGBAN_Id,
				@COQUANBO_Id,
				@NGAYSINH,
				@GIOITINH,
				@CHUCVU,
				@SOCCCD,
				@NGAYCAP,
				@NOICAP,
				@QUEQUAN,
				@DIACHIHIENTAI,
				@MANHANVIEN
			)
		END
		ELSE
		BEGIN
			UPDATE UserProfile SET
				HOVATEN = @HOVATEN,
				DIENTHOAI = @DIENTHOAI,
				PHONGBAN_Id = @PHONGBAN_Id,
				COQUANBO_Id = @COQUANBO_Id,
				NGAYSINH = @NGAYSINH,
				GIOITINH = @GIOITINH,
				CHUCVU = @CHUCVU,
				SOCCCD = @SOCCCD,
				NGAYCAP = @NGAYCAP,
				NOICAP = @NOICAP,
				QUEQUAN = @QUEQUAN,
				DIACHIHIENTAI = @DIACHIHIENTAI,
				MANHANVIEN = @MANHANVIEN
			WHERE Id = @Id
		END

		COMMIT TRANSACTION
		RETURN 1
	END TRY
	BEGIN CATCH
		SELECT   
			ERROR_NUMBER() AS ErrorNumber,
			ERROR_MESSAGE() AS ErrorMessage;  
		ROLLBACK TRANSACTION
		RETURN 0
	END CATCH
END






















GO
ALTER PROCEDURE [dbo].[UserProfile_Save]
	@p_Moi_Sua				T_INT = null,
	@Id						T_ID output,
	@HOVATEN				T_D256 = NULL,
	@DIENTHOAI				T_D256 = NULL,
	@PHONGBAN_Id			T_ID = NULL,
	@COQUANBO_Id			T_ID = NULL,
	@NGAYSINH				T_DATE = NULL,
	@GIOITINH				T_D001 = NULL,
	@CHUCVU					T_D256 = NULL,
	@SOCCCD					T_D256 = NULL,
	@NGAYCAP				T_DATE = NULL,	
	@NOICAP					T_D256 = NULL,	
	@QUEQUAN				nvarchar(MAX) = NULL,
	@DIACHIHIENTAI			nvarchar(MAX) = NULL,
	@MANHANVIEN				T_D256 = NULL
AS
BEGIN
	BEGIN TRANSACTION

	BEGIN TRY
		IF @p_Moi_Sua = 1
		BEGIN
			INSERT INTO UserProfile
			(
				Id,
				HOVATEN,
				DIENTHOAI,
				PHONGBAN_Id,
				COQUANBO_Id,
				NGAYSINH,
				GIOITINH,
				CHUCVU,
				SOCCCD,
				NGAYCAP,
				NOICAP,
				QUEQUAN,
				DIACHIHIENTAI,
				MANHANVIEN
			)
			VALUES
			(
				@Id,
				@HOVATEN,
				@DIENTHOAI,
				@PHONGBAN_Id,
				@COQUANBO_Id,
				@NGAYSINH,
				@GIOITINH,
				@CHUCVU,
				@SOCCCD,
				@NGAYCAP,
				@NOICAP,
				@QUEQUAN,
				@DIACHIHIENTAI,
				@MANHANVIEN
			)
		END
		ELSE
		BEGIN
			UPDATE UserProfile SET
				HOVATEN = @HOVATEN,
				DIENTHOAI = @DIENTHOAI,
				PHONGBAN_Id = @PHONGBAN_Id,
				COQUANBO_Id = @COQUANBO_Id,
				NGAYSINH = @NGAYSINH,
				GIOITINH = @GIOITINH,
				CHUCVU = @CHUCVU,
				SOCCCD = @SOCCCD,
				NGAYCAP = @NGAYCAP,
				NOICAP = @NOICAP,
				QUEQUAN = @QUEQUAN,
				DIACHIHIENTAI = @DIACHIHIENTAI,
				MANHANVIEN = @MANHANVIEN
			WHERE Id = @Id
		END

		COMMIT TRANSACTION
		RETURN 1
	END TRY
	BEGIN CATCH
		SELECT   
			ERROR_NUMBER() AS ErrorNumber,
			ERROR_MESSAGE() AS ErrorMessage;  
		ROLLBACK TRANSACTION
		RETURN 0
	END CATCH
END
