
---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'VoucherType_GetDetail')
	DROP PROCEDURE VoucherType_GetDetail
GO

CREATE PROCEDURE VoucherType_GetDetail
(
	@p_Id T_ID
)
WITH ENCRYPTION
/********************************************************************************
--Routine: VoucherType_GetDetail
--Task: Get record(s) from table Voucher
--Version: 
--    1.2 25/07/2025  3:15PM:    AnBD        Fixed int condition
********************************************************************************/
AS
BEGIN
	SELECT *
	FROM Voucher
	WHERE Id = @p_Id
END




---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'GetVoucherHistory')
	DROP PROCEDURE GetVoucherHistory
GO

CREATE PROCEDURE GetVoucherHistory
(
	@p_VoucherID T_ID
)
WITH ENCRYPTION
/********************************************************************************
--Routine: GetVoucherHistory
--Task: Get record(s) from table VoucherHistory
--Version: 
--    1.2 25/07/2025  3:15PM:    AnBD        Fixed int condition
********************************************************************************/
AS
BEGIN
	SELECT vc.*, u.HOVATEN, u.CHUCVU, u.DIENTHOAI
	FROM VoucherHistory vc
	Join UserProfile u on vc.CreatedBy = u.Id
	WHERE VoucherID = @p_VoucherID
	Order by vc.CreatedAt DESC
END





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
	Order by CreatedAt DESC
END


select * from Voucher up 
select * from VoucherHistory vh 