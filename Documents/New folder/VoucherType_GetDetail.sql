
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