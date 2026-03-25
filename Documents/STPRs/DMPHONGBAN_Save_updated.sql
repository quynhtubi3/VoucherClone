---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMKHACHHANG_Save')
	DROP PROCEDURE DMKHACHHANG_Save
GO

CREATE PROCEDURE DMKHACHHANG_Save
(
	@p_Moi_Sua		T_BIT,
	@p_Id			T_ID		OUTPUT,
	@p_Name			T_D256,
	@p_DiaChi		NVARCHAR(MAX),
	@p_DienThoai	T_D256,
	@p_Other		NVARCHAR(MAX),
	@p_TheoDoi		T_BIT,
	@p_Loai			T_D001,
	@p_DKKD			T_D020,
	@p_Note			NVARCHAR(MAX),
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

if(@p_DKKD <>'')
 Begin
	IF (@p_Moi_Sua = 1 AND EXISTS(SELECT * FROM DMKHACHHANG WHERE [DKKD] = @p_DKKD)) OR 
			(@p_Moi_Sua = 0 AND EXISTS(SELECT * FROM DMKHACHHANG WHERE Id != @p_Id AND [DKKD] = @p_DKKD))
	BEGIN
		RETURN -1
	END
End
if(@p_Name <>'')
 begin
	IF (@p_Moi_Sua = 1 AND EXISTS(SELECT * FROM DMKHACHHANG WHERE [Name] = @p_Name)) OR 
			(@p_Moi_Sua = 0 AND EXISTS(SELECT * FROM DMKHACHHANG WHERE Id != @p_Id AND [Name] = @p_Name))
	BEGIN
		RETURN -1
	END
End
	BEGIN TRANSACTION

	BEGIN TRY		
		if( @p_ModifiedAt='')
		   SET @p_ModifiedAt = GETDATE()

		IF @p_Moi_Sua = 1
		BEGIN
			SET @p_Id = NEWID()

			INSERT INTO DMKHACHHANG
				(
					Id,
					Name,
					DiaChi,
					DienThoai,
					Other,
					TheoDoi,
					Loai,					
					DKKD,
					Note,
					CreatedAt,
					CreatedBy,
					ModifiedAt,
					ModifiedBy
				)
			VALUES
				(
					@p_Id,
					@p_Name,
					@p_DiaChi,
					@p_DienThoai,
					@p_Other,
					@p_TheoDoi,
					@p_Loai,
					@p_DKKD,
					@p_Note,
					@p_ModifiedAt,
					@p_ModifiedBy,
					@p_ModifiedAt,
					@p_ModifiedBy
				)
		END
		ELSE
		BEGIN
			UPDATE DMKHACHHANG SET
				Name			= @p_Name,
				DiaChi			= @p_DiaChi,
				DienThoai		= @p_DienThoai,
				Other			= @p_Other,
				TheoDoi			= @p_TheoDoi,
				Loai			= @p_Loai,
				DKKD			= @p_DKKD,
				Note			= @p_Note,
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
