
 
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
	@CHUCVU_Id				T_ID = NULL,
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
				CHUCVU_ID,
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
				@CHUCVU_Id,
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
				CHUCVU_ID = @CHUCVU_Id,
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




















