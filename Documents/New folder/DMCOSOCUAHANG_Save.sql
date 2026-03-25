---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMCOSOCUAHANG_Save')
	DROP PROCEDURE DMCOSOCUAHANG_Save
GO

CREATE PROCEDURE DMCOSOCUAHANG_Save
(
	@p_Moi_Sua		T_BIT,
	@p_Id			T_ID		OUTPUT,
	@p_Code			T_D256,
	@p_Name			T_D256,
	@p_Address			T_D256,
	@p_ModifiedBy	T_ID,
	@p_ModifiedAt	T_DATE		OUTPUT
) WITH ENCRYPTION
/********************************************************************************
--Routine: DMCOSOCUAHANG_Save
--Task: Save a record into table DMCOSOCUAHANG
--Version: 
--    1.0 Apr 10 2005  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	DECLARE @v_Code	T_D256

	IF (@p_Moi_Sua = 1 AND EXISTS(SELECT * FROM DMCOSOCUAHANG WHERE Code = @p_Code)) OR 
			(@p_Moi_Sua = 0 AND EXISTS(SELECT * FROM DMCOSOCUAHANG WHERE Id != @p_Id AND Code = @p_Code))
	BEGIN
		RETURN -1
	END

	IF @p_Moi_Sua = 0
	BEGIN
		SELECT @v_Code = Code FROM DMCOSOCUAHANG WHERE Id = @p_Id AND ModifiedAt = @p_ModifiedAt
		IF @v_Code IS NULL
			RETURN -2
	END

	BEGIN TRANSACTION

	BEGIN TRY
		IF @p_Moi_Sua = 0 AND @v_Code <> @p_Code
		BEGIN
			EXECUTE Change_Code 'DMCOSOCUAHANG', 'CODE', @v_Code, @p_Code
		END

		SET @p_ModifiedAt = GETDATE()

		IF @p_Moi_Sua = 1
		BEGIN
			SET @p_Id = NEWID()

			INSERT INTO DMCOSOCUAHANG
				(
					Id,
					Code,
					Name,
					Address,
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
					@p_Address,
					@p_ModifiedAt,
					@p_ModifiedBy,
					@p_ModifiedAt,
					@p_ModifiedBy
				)
		END
		ELSE
		BEGIN
			UPDATE DMCOSOCUAHANG SET
				Code		 = @p_Code,
				Name		 = @p_Name,
				Address       = @p_Address,
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
