---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMKHACHHANG_Get')
	DROP PROCEDURE DMKHACHHANG_Get
GO

CREATE PROCEDURE DMKHACHHANG_Get
(
	@p_Name			T_D256,
	@p_DiaChi		NVARCHAR(MAX),
	@p_DienThoai	T_D256
)WITH ENCRYPTION
/********************************************************************************
--Routine: DMKHACHHANG_Get
--Task: Get record(s) from table DMKHACHHANG
--Version: 
--    1.0 Mar 23 2022  2:14PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	SELECT *  FROM DMKHACHHANG WHERE [Name] Like '%' + @p_Name + '%' AND DiaChi Like '%' + @p_DiaChi + '%' AND DienThoai Like '%' + @p_DienThoai + '%'
END







---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMKHACHHANG_Save')
	DROP PROCEDURE DMKHACHHANG_Save
GO

CREATE PROCEDURE DMKHACHHANG_Save
(
	@p_Moi_Sua		T_BIT,
	@p_Id			T_ID		OUTPUT,
	@p_Code			T_D256,
	@p_Name			T_D256,
	@p_DiaChi		NVARCHAR(MAX),
	@p_DienThoai	T_D256,
	@p_Email	T_D256,
	@p_NamSinh		T_DATE,
	@p_GioiTinh	  int,
	@p_Other	  NVARCHAR(MAX),
	@p_Note			NVARCHAR(MAX),
	@p_Identifier	NVARCHAR(15),
	@p_ModifiedBy	T_ID,
	@p_ModifiedAt	T_DATE		OUTPUT
) WITH ENCRYPTION
/********************************************************************************
--Routine: DMKHACHHANG_Save
--Task: Save a record into table DMKHACHHANG
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN


	IF (@p_Moi_Sua = 1 AND EXISTS(SELECT * FROM DMKHACHHANG WHERE [Code] = @p_Code)) OR 
			(@p_Moi_Sua = 0 AND EXISTS(SELECT * FROM DMKHACHHANG WHERE Id != @p_Id AND [Code] = @p_Code))
	BEGIN
		RETURN -1
	END

	BEGIN TRANSACTION

	BEGIN TRY		
		-- SET @p_ModifiedAt = GETDATE()

		IF @p_Moi_Sua = 1
		BEGIN
			SET @p_Id = NEWID()

			INSERT INTO DMKHACHHANG
				(
					Id,
					Code,
					Name,
					DiaChi,
					DienThoai,
					Email,
					GioiTinh,
					NamSinh,
					Other,
					Note,
					Identifier,
					CreatedAt,
					CreatedBy,
					ModifiedAt,
					ModifiedBy
				)
			VALUES
				(
					@p_Id,
					@p_Code,
					@p_Name,
					@p_DiaChi,
					@p_DienThoai,
					@p_Email,
					@p_GioiTinh,
					@p_NamSinh,
					@p_Other,
					@p_Note,
					@p_Identifier,
					@p_ModifiedAt,
					@p_ModifiedBy,
					@p_ModifiedAt,
					@p_ModifiedBy
				)
		END
		ELSE
		BEGIN
			UPDATE DMKHACHHANG SET
			    Code            = @p_Code,
				Name			= @p_Name,
				DiaChi			= @p_DiaChi,
				DienThoai		= @p_DienThoai,
				Email           = @p_Email,
				GioiTinh        = @p_GioiTinh,
				NamSinh         = @p_NamSinh,
				Other			= @p_Other,				
				Note			= @p_Note,
				Identifier    = @p_Identifier,
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
