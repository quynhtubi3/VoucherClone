Drop table VoucherType

CREATE TABLE [Coffee-Tay-Ho].dbo.VoucherType (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Name nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Code nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Type int NULL,
	DefaultValidityPeriod int NULL,
	DefaultPrice decimal(18,2) NULL,
	CreatedAt datetime NULL,
	UpdateAt datetime NULL,
	CreatedBy uniqueidentifier NULL,
	Updateby uniqueidentifier NULL,
	CONSTRAINT PK_VoucherTypes PRIMARY KEY (Id)
);

Drop table Voucher


CREATE TABLE [Coffee-Tay-Ho].dbo.Voucher (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Serial nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	SaleDate datetime NULL,
	EnteredByUserId uniqueidentifier NOT NULL,
	BatchId uniqueidentifier NULL,
	SellerId uniqueidentifier NOT NULL,
	SellerCode nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	VoucherTypeId uniqueidentifier NOT NULL,
	ValidityPeriod int NULL,
	SalePrice decimal(10,2) NULL,
	VoucherType int NULL,
	IndividualCommission decimal(10,2) NULL,
	GroupCommission decimal(10,2) NULL,
	ApplicableLocation nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	ActivationDate datetime NULL,
	ExpiryDate datetime NULL,
	BuyerName nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	BuyerPhone nvarchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Status int NULL,
	CreatedAt datetime NULL,
	UpdateAt datetime NULL,
	CreatedBy datetime NULL,
	Updateby datetime NULL,
	CONSTRAINT PK_Vouchers PRIMARY KEY (Id),
	CONSTRAINT UQ_Vouchers_Serial UNIQUE (Serial)
);




select * from Menu m where id ='5a99c414-aad1-43fa-8893-dbc2666ad4a4'
trun
select * from VoucherType

select * from DmFile 
select * from UserProfile where id ='30ba8d89-edd2-435e-8b0d-c92d3f9e6227'

select * from 

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
