---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'VoucherHistory_Save')
	DROP PROCEDURE VoucherHistory_Save
GO

CREATE PROCEDURE VoucherHistory_Save
(
    @p_VoucherID      T_ID,
	@p_DataFieldOld	  nvarchar(max),
	@p_DataFieldNew	  nvarchar(max),
	@p_CreatedBy	  T_ID,
	@p_CreatedAt	  T_DATE
) WITH ENCRYPTION
/********************************************************************************
--Routine: VoucherHistory_Save
--Task: Save a record into table VoucherHistory
--Version: 
--    1.0 01/08/2025  9:33PM:    AnBD        Created
********************************************************************************/
AS
BEGIN

	BEGIN TRANSACTION
	BEGIN TRY	
		SET @p_CreatedAt = GETDATE()
		BEGIN
			INSERT INTO VoucherHistory
				(
					Id,
					VoucherID,
					DataFieldOld,
					DataFieldNew,
					CreatedAt,
					CreatedBy
				)
			VALUES
				(
					NEWID(),
					@p_VoucherID,
					@p_DataFieldOld,
					@p_DataFieldNew,
					@p_CreatedAt,
					@p_CreatedBy
				)
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