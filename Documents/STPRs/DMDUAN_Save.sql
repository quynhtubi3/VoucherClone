---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMDUAN_Save')
	DROP PROCEDURE DMDUAN_Save
GO

CREATE PROCEDURE DMDUAN_Save
(
	@p_Moi_Sua		T_BIT,
	@p_Id			T_ID		OUTPUT,
	@p_Code			T_D256,
	@p_Name			T_D256,
	@p_Mota			NVARCHAR(MAX),
	@p_SoHopDong	T_D256,
	@p_GiaTriHD		T_TIEN,
	@p_GiaVon		T_TIEN,
	@p_NamDuAn		T_D004,
	@p_NgayKyHD		T_DATE,
	@p_TheoDoi		T_D002,
	@p_KId			T_ID,
	@p_PId			T_ID,
	@p_AMId			T_ID,
	@p_ModifiedBy	T_ID,
	@p_ModifiedAt	T_DATE		OUTPUT
) WITH ENCRYPTION
/********************************************************************************
--Routine: DMDUAN_Save
--Task: Save a record into table DMDUAN
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	DECLARE @v_Code	T_D256

	IF (@p_Moi_Sua = 1 AND EXISTS(SELECT * FROM DMDUAN WHERE Code = @p_Code)) OR 
			(@p_Moi_Sua = 0 AND EXISTS(SELECT * FROM DMDUAN WHERE Id != @p_Id AND Code = @p_Code))
	BEGIN
		RETURN -1
	END

	IF @p_Moi_Sua = 0
	BEGIN
		SELECT @v_Code = Code FROM DMDUAN WHERE Id = @p_Id AND ModifiedAt = @p_ModifiedAt
		IF @v_Code IS NULL
			RETURN -2
	END

	BEGIN TRANSACTION

	BEGIN TRY
		IF @p_Moi_Sua = 0 AND @v_Code <> @p_Code
		BEGIN
			EXECUTE Change_Code 'DMDUAN', 'CODE', @v_Code, @p_Code
		END

		SET @p_ModifiedAt = GETDATE()

		IF @p_Moi_Sua = 1
		BEGIN
			SET @p_Id = NEWID()

			INSERT INTO DMDUAN
				(
					Id,
					KHACHHANG_Id,
					Mota,
					TheoDoi,
					Code,
					Name,
					SoHopDong,
					NamDuAn,
					PHONGBAN_Id,
					AM_Id,
					NgayKyHD,
					GiaTriHD,
					CreatedAt,
					CreatedBy,
					ModifiedAt,
					ModifiedBy,
					GiaVon
				)
			VALUES
				(
					@p_Id,
					@p_KId,
					@p_Mota,
					@p_TheoDoi,
					@p_Code,
					@p_Name,	
					@p_SoHopDong,
					@p_NamDuAn,
					@p_PId,
					@p_AMId,
					@p_NgayKyHD,
					@p_GiaTriHD,
					@p_ModifiedAt,
					@p_ModifiedBy,
					@p_ModifiedAt,
					@p_ModifiedBy,
					@p_GiaVon
				)
		END
		ELSE
		BEGIN
			UPDATE DMDUAN SET
				KHACHHANG_Id	= @p_KId,
				Mota			= @p_Mota,
				TheoDoi			= @p_TheoDoi,
				Code			= @p_Code,
				Name			= @p_Name,
				SoHopDong		= @p_SoHopDong,
				NamDuAn			= @p_NamDuAn,
				PHONGBAN_Id		= @p_PId,
				AM_Id			= @p_AMId,
				NgayKyHD		= @p_NgayKyHD,
				GiaTriHD		= @p_GiaTriHD,
				GiaVon			= @p_GiaVon,
				ModifiedAt	 = @p_ModifiedAt,
				ModifiedBy	 = @p_ModifiedBy
			WHERE Id = @p_Id
		END

		COMMIT TRANSACTION
		RETURN 1
	END TRY
	BEGIN CATCH
		SELECT   
        ERROR_NUMBER() AS ErrorNumber  
        ,ERROR_MESSAGE() AS ErrorMessage;  
		ROLLBACK TRANSACTION
		RETURN 0
	END CATCH
END
