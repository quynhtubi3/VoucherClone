select * from Voucher
select * from VoucherType 



---DELETE PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'Voucher_Delete')
	DROP PROCEDURE Voucher_Delete
GO



CREATE PROCEDURE Voucher_Delete
(	
	@p_Id			T_ID
) WITH ENCRYPTION
/********************************************************************************
--Routine: Voucher_Delete
--Task: Delete record(s) from table Voucher
--Version: 
--    1.0 04/08/2025 11:55AM:    AnDB        Created
********************************************************************************/
AS
BEGIN
	DELETE FROM Voucher WHERE Id = @p_Id
	RETURN 1
END
