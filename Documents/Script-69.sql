select * from Menu m 

select * from Voucher

drop table Voucher
CREATE TABLE [Coffee-Tay-Ho].dbo.Voucher (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Serial nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	BatchId uniqueidentifier NULL,
	Status int NULL,
	VoucherTypeId uniqueidentifier NULL,
	ValidityPeriod int NULL,
	SalePrice decimal(18,2) NULL,
	VoucherType int NULL,	
	SellerId uniqueidentifier NULL,
	SaleDate datetime NULL,
	IndividualCommission decimal(10,2) NULL,
	GroupCommission decimal(10,2) NULL,
	ApplicableLocation nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,	
	BuyerName nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	BuyerPhone nvarchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	ActivationDate datetime NULL,
	ExpiryDate datetime NULL,
	CreatedAt datetime NULL,
	UpdateAt datetime NULL,
	CreatedBy uniqueidentifier NULL,
	Updateby uniqueidentifier NULL,
	CONSTRAINT PK_Vouchers PRIMARY KEY (Id),
	CONSTRAINT UQ_Vouchers_Serial UNIQUE (Serial)
);


---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'Voucher_Get')
	DROP PROCEDURE Voucher_Get
GO

CREATE PROCEDURE Voucher_Get
(
	@p_Serial nvarchar(256) = NULL,
	@p_VoucherType	int = NULL,
	@p_ValidityPeriod  int = NULL
)
WITH ENCRYPTION
/********************************************************************************
--Routine: Voucher_Get
--Task: Get record(s) from table Voucher
--Version: 
--    1.2 25/07/2025  3:15PM:    AnBD        Fixed int condition
********************************************************************************/
AS
BEGIN
	SELECT *
	FROM Voucher
	WHERE
		(@p_Serial IS NULL OR @p_Serial = '' OR Serial LIKE '%' + @p_Serial + '%')
		AND
		(@p_VoucherType IS NULL  OR [VoucherType] = @p_VoucherType)
		AND
		(@p_ValidityPeriod IS NULL OR [ValidityPeriod] = @p_ValidityPeriod)
END








---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'Voucher_Save')
	DROP PROCEDURE Voucher_Save
GO

CREATE PROCEDURE Voucher_Save
(
	@p_Moi_Sua		T_BIT,
	@p_Id			uniqueidentifier		OUTPUT,
    @p_Serial	    nvarchar(256),
	@p_BatchId		uniqueidentifier,
	@p_Status	int,
	@p_VoucherTypeId  uniqueidentifier,
	@p_ValidityPeriod   int,	
	@p_SalePrice   int,
	@p_VoucherType   int,
	@p_SellerId		uniqueidentifier,	
	@p_SaleDate	datetime,
	@p_IndividualCommission	decimal(10,2),
	@p_GroupCommission	decimal(10,2),
	@p_ApplicableLocation	nvarchar(256),
	@p_BuyerName	nvarchar(256),
	@p_BuyerPhone	nvarchar(256),
	@p_ActivationDate	datetime,
	@p_ExpiryDate	datetime,
	@p_ModifiedBy	uniqueidentifier,
	@p_ModifiedAt	datetime		OUTPUT

) WITH ENCRYPTION
/********************************************************************************
--Routine: Voucher_Save
--Task: Save a record into table Voucher
--Version: 
--    1.0 24/07/2025  9:33PM:    AnBD        Created
********************************************************************************/
AS
BEGIN
	DECLARE @v_Serial	nvarchar(256)

	IF (@p_Moi_Sua = 1 AND EXISTS(SELECT * FROM Voucher WHERE Serial = @p_Serial)) OR 
			(@p_Moi_Sua = 0 AND EXISTS(SELECT * FROM Voucher WHERE Id != @p_Id AND Serial = @p_Serial))
	BEGIN
		RETURN -1
	END

	IF @p_Moi_Sua = 0
	BEGIN
		SELECT @v_Serial = Serial FROM Voucher WHERE Id = @p_Id AND UpdateAt = @p_ModifiedAt
		IF @v_Serial IS NULL
			RETURN -2
	END

	BEGIN TRANSACTION

	BEGIN TRY
		IF @p_Moi_Sua = 0 AND @v_Serial <> @p_Serial
		BEGIN
			EXECUTE Change_Code 'Voucher', 'Serial', @v_Serial, @p_Serial
		END

		SET @p_ModifiedAt = GETDATE()

		IF @p_Moi_Sua = 1
		BEGIN
			SET @p_Id = NEWID()

			INSERT INTO Voucher
				(
					Id,
					Serial,
					BatchId,
					Status,
					VoucherTypeId,
					ValidityPeriod,
					SalePrice,
					VoucherType,
					SellerId,
					SaleDate,
					IndividualCommission,
					GroupCommission,
					ApplicableLocation,
					BuyerName,
					BuyerPhone,
					ActivationDate,
					ExpiryDate,
					CreatedAt,
					UpdateAt,
					CreatedBy,
					Updateby
				)
			VALUES
				(
					@p_Id,
					@p_Serial,
					@p_BatchId,
					@p_Status,
					@p_VoucherTypeId,
					@p_ValidityPeriod,
					@p_SalePrice,
					@p_VoucherType,
					@p_SellerId,
					@p_SaleDate,
					@p_IndividualCommission,
					@p_GroupCommission,
					@p_ApplicableLocation,
					@p_BuyerName,
					@p_BuyerPhone,
					@p_ActivationDate,
					@p_ExpiryDate,
					@p_ModifiedAt,
					@p_ModifiedAt,
					@p_ModifiedBy,
					@p_ModifiedBy
				)
		END
		ELSE
		BEGIN
			UPDATE Voucher SET
				Serial		 = @p_Serial,
				BatchId		 = @p_BatchId,
				Status		 = @p_Status,
				VoucherTypeId	 = @p_VoucherTypeId,
				ValidityPeriod	 = @p_ValidityPeriod,
				SalePrice = @p_SalePrice,
				VoucherType = @p_VoucherType,
				SellerId = @p_SellerId,
				SaleDate = @p_SaleDate,
				IndividualCommission = @p_IndividualCommission,
				GroupCommission = @p_GroupCommission,
				ApplicableLocation = @p_ApplicableLocation,
				BuyerName = @p_BuyerName,
				BuyerPhone = @p_BuyerPhone,
				ActivationDate = @p_ActivationDate,
				ExpiryDate = @p_ExpiryDate,			
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