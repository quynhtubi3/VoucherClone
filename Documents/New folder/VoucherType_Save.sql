---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'VoucherType_Save')
	DROP PROCEDURE VoucherType_Save
GO

CREATE PROCEDURE VoucherType_Save
(
	@p_Moi_Sua		T_BIT,
	@p_Id			uniqueidentifier		OUTPUT,
    @p_Name	    nvarchar(256),
	@p_Code		nvarchar(256),
	@p_Type	int,
	@p_DefaultValidityPeriod  int,
	@p_DefaultPrice   DECIMAL(18,2),	
	@p_DefaultRealPrice DECIMAL(18,2),
	@p_DefaultNumberOfUse  int,
	@p_DefaultNumberOfFree  int,
	@p_Description  nvarchar(max),
	@p_CostSave  nvarchar(256),
	@p_ModifiedBy	uniqueidentifier,
	@p_ModifiedAt	datetime		OUTPUT

) WITH ENCRYPTION
/********************************************************************************
--Routine: VoucherType_Save
--Task: Save a record into table VoucherType
--Version: 
--    1.0 24/07/2025  9:33PM:    AnBD        Created
********************************************************************************/
AS
BEGIN
	DECLARE @v_Code	nvarchar(256)

	IF (@p_Moi_Sua = 1 AND EXISTS(SELECT * FROM VoucherType WHERE Code = @p_Code)) OR 
			(@p_Moi_Sua = 0 AND EXISTS(SELECT * FROM VoucherType WHERE Id != @p_Id AND Code = @p_Code))
	BEGIN
		RETURN -1
	END

	IF @p_Moi_Sua = 0
	BEGIN
		SELECT @v_Code = Code FROM VoucherType WHERE Id = @p_Id AND UpdateAt = @p_ModifiedAt
		IF @v_Code IS NULL
			RETURN -2
	END

	BEGIN TRANSACTION

	BEGIN TRY
		IF @p_Moi_Sua = 0 AND @v_Code <> @p_Code
		BEGIN
			EXECUTE Change_Code 'VoucherType', 'Code', @v_Code, @p_Code
		END

		SET @p_ModifiedAt = GETDATE()

		IF @p_Moi_Sua = 1
		BEGIN
			SET @p_Id = NEWID()

			INSERT INTO VoucherType
				(
					Id,
					Name,
					Code,
					Type,
					DefaultValidityPeriod,
					DefaultPrice,
					DefaultRealPrice,
					DefaultNumberOfUse,
					DefaultNumberOfFree,
					Description,
					CostSave,
					CreatedAt,
					UpdateAt,
					CreatedBy,
					Updateby
				)
			VALUES
				(
					@p_Id,
					@p_Name,
					@p_Code,
					@p_Type,
					@p_DefaultValidityPeriod,
					@p_DefaultPrice,
					@p_DefaultRealPrice,
	                @p_DefaultNumberOfUse ,
	                @p_DefaultNumberOfFree,
	                @p_Description,
	                @p_CostSave,
					@p_ModifiedAt,
					@p_ModifiedAt,
					@p_ModifiedBy,
					@p_ModifiedBy
				)
		END
		ELSE
		BEGIN
			UPDATE VoucherType SET
				Name		 = @p_Name,
				Code		 = @p_Code,
				Type		 = @p_Type,
				DefaultValidityPeriod	 = @p_DefaultValidityPeriod,
				DefaultPrice	 = @p_DefaultPrice,
				DefaultRealPrice = @p_DefaultRealPrice,
				DefaultNumberOfUse = @p_DefaultNumberOfUse,
				DefaultNumberOfFree = @p_DefaultNumberOfFree,
				Description = @p_Description,
				CostSave = @p_CostSave,
				UpdateAt = @p_ModifiedAt,
				Updateby = @p_ModifiedBy
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