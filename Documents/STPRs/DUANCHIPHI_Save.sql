  ---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DUANCHIPHI_Save')
	DROP PROCEDURE DUANCHIPHI_Save
GO

CREATE PROCEDURE DUANCHIPHI_Save
(
	@MADUAN						[T_D256] = NULL,
	@NGAYTHANG			[T_DATE] = NULL,
	@SOTIENGROSS						[T_TIEN] = null,
	@SOTIENNET						[T_TIEN] = null,
	@NOIDUNG						[NVARCHAR](MAX) = NULL,
	@LOAICHIPHI					[T_D256] = null,
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

	IF (EXISTS(select * from CHIPHIDUAN where CHIPHIDUAN.MADUAN = @MADUAN))
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
			INSERT INTO CHIPHIDUAN
				(
					Id,
					DUAN_Id,
					MADUAN,
					NGAYTHANG,
					SOTIENGROSS,
					SOTIENNET,
					NOIDUNG,
					LOAICHIPHI,
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
					@NGAYTHANG,
					@SOTIENGROSS,
					@SOTIENNET,
					@NOIDUNG,
					@LOAICHIPHI,
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
