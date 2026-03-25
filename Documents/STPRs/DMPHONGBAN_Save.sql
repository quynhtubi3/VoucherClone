---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMPHONGBAN_Save')
	DROP PROCEDURE DMPHONGBAN_Save
GO

CREATE PROCEDURE DMPHONGBAN_Save
(	@p_Moi_Sua		T_BIT,	@p_Id			T_ID		OUTPUT,	@p_Code			T_D256,	@p_Name			T_D256,	@p_CId			T_ID,	@p_ModifiedBy	T_ID,	@p_ModifiedAt	T_DATE		OUTPUT) WITH ENCRYPTION
/********************************************************************************
--Routine: DMPHONGBAN_Save
--Task: Save a record into table DMPHONGBAN
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	DECLARE @v_Code	T_D256

	IF (@p_Moi_Sua = 1 AND EXISTS(SELECT * FROM DMPHONGBAN WHERE Code = @p_Code)) OR 
			(@p_Moi_Sua = 0 AND EXISTS(SELECT * FROM DMPHONGBAN WHERE Id != @p_Id AND Code = @p_Code))
	BEGIN
		RETURN -1
	END
	IF @p_Moi_Sua = 0
	BEGIN
		SELECT @v_Code = Code FROM DMPHONGBAN WHERE Id = @p_Id AND ModifiedAt = @p_ModifiedAt
		IF @v_Code IS NULL
			RETURN -2
	END

	BEGIN TRANSACTION
	BEGIN TRY
		IF @p_Moi_Sua = 0 AND @v_Code <> @p_Code
		BEGIN
			EXECUTE Change_Code 'DMPHONGBAN', 'CODE', @v_Code, @p_Code
		END

		SET @p_ModifiedAt = GETDATE()

		IF @p_Moi_Sua = 1
		BEGIN
			SET @p_Id = NEWID()

			INSERT INTO DMPHONGBAN				(					Id,					COQUANBO_Id,					Code,					Name,
					CreatedAt,					CreatedBy,					ModifiedAt,					ModifiedBy				)			VALUES				(					@p_Id,					@p_CId,					@p_Code,					@p_Name,					
					@p_ModifiedAt,					@p_ModifiedBy,					@p_ModifiedAt,					@p_ModifiedBy				)
		END
		ELSE
		BEGIN
			UPDATE DMPHONGBAN SET				Code		 = @p_Code,				Name		 = @p_Name,
				COQUANBO_Id  = @p_CId,
				ModifiedAt	 = @p_ModifiedAt,				ModifiedBy	 = @p_ModifiedBy			WHERE Id = @p_Id
		END
		COMMIT TRANSACTION		RETURN 1	END TRY	BEGIN CATCH		SELECT   
        ERROR_NUMBER() AS ErrorNumber  
        ,ERROR_MESSAGE() AS ErrorMessage;  		ROLLBACK TRANSACTION		RETURN 0	END CATCHEND
