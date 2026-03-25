---DELETE PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'VoucherType_Delete')
	DROP PROCEDURE VoucherType_Delete
GO



CREATE PROCEDURE VoucherType_Delete
(	
	@p_Id			T_ID
) WITH ENCRYPTION
/********************************************************************************
--Routine: VoucherType_Delete
--Task: Delete record(s) from table VoucherType
--Version: 
--    1.0 04/08/2025 11:55AM:    AnBD        Created
********************************************************************************/
AS
BEGIN
	DECLARE @v_InUsed		T_INT

	SET @v_InUsed = (SELECT COUNT(Id) FROM Voucher WHERE VoucherTypeId = @p_Id)	

	IF @v_InUsed > 0
	BEGIN
		RETURN -3
	END

	DELETE FROM VoucherType WHERE Id = @p_Id

	RETURN 1
END