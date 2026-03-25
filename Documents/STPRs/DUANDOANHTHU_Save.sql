  ---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DUANDOANHTHU_Save')
	DROP PROCEDURE DUANDOANHTHU_Save
GO

CREATE PROCEDURE DUANDOANHTHU_Save
(
	@MADUAN						[T_D256] = NULL,
	@NGAYNHANTIEN			[T_DATE] = NULL,
	@SOTIEN						[T_TIEN] = null,
	@DIENGIAI						[NVARCHAR](MAX) = NULL,
	@LOAIDOANHTHU					[T_D256] = null,
	@DOITUONG						[T_D256] = NULL,
	@p_ModifiedBy				T_ID,
	@mode						T_BIT,
	@ERROR		T_D256		OUTPUT
) WITH ENCRYPTION
/********************************************************************************
--Routine: TBLS_Save
--Task: Save a record into table TBLS
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN

	IF (EXISTS(select * from DOANHTHUDUAN where DOANHTHUDUAN.MADUAN = @MADUAN))
	BEGIN
		if @mode = 0
		begin
			return 1
		end
	end
		BEGIN TRANSACTION
		BEGIN TRY
		declare @DUAN_Id T_ID
		select @DUAN_Id = DMDUAN.Id from DMDUAN where DMDUAN.Code = @MADUAN
			INSERT INTO DOANHTHUDUAN
				(
					Id,
					DUAN_Id,
					MADUAN,
					NGAYNHANTIEN,
					SOTIEN,
					DIENGIAI,
					LOAIDOANHTHU,
					DOITUONG,
					CreatedAt,
					CreatedBy,
					ModifiedAt,
					ModifiedBy
				)
				VALUES
				(
					NEWID(),					
					@DUAN_Id,
					@MADUAN,
					@NGAYNHANTIEN,
					@SOTIEN,
					@DIENGIAI,
					@LOAIDOANHTHU,
					@DOITUONG,	
					GETDATE(),
					@p_ModifiedBy,
					GETDATE(),
					@p_ModifiedBy
				)
			COMMIT TRANSACTION
			RETURN 1
		END TRY
		BEGIN CATCH
			SELECT  ERROR_NUMBER() AS ErrorNumber;
			SELECT @ERROR = ERROR_MESSAGE();  
			ROLLBACK TRANSACTION
			RETURN 0
		END CATCH
END
