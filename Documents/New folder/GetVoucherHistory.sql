
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
	SELECT vc.*, u.HOVATEN, cv.Name, u.DIENTHOAI
	FROM VoucherHistory vc
	Join UserProfile u on vc.CreatedBy = u.Id
	Join CHUCVU cv on u.CHUCVU_ID = cv.Id
	WHERE VoucherID = @p_VoucherID
	Order by vc.CreatedAt DESC
END