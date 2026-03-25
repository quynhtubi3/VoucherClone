---DELETE PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMKHACHHANG_Delete')
	DROP PROCEDURE DMKHACHHANG_Delete
GO



CREATE PROCEDURE DMKHACHHANG_Delete
(	
	@p_Id			T_ID,
	@p_ModifiedBy	T_ID,
	@p_ModifiedAt	T_DATE
) WITH ENCRYPTION
/********************************************************************************
--Routine: DMKHACHHANG_Delete
--Task: Delete record(s) from table DMKHACHHANG
--Version: 
--    1.0 Mar 25 2022 11:55AM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	DECLARE @v_InUsed		T_INT

	IF EXISTS(SELECT * FROM DMKHACHHANG WHERE Id = @p_Id AND ModifiedAt != @p_ModifiedAt)
	BEGIN
		RETURN -2
	END

	SET @v_InUsed = (SELECT COUNT(Id) FROM Voucher WHERE KhachHangId = @p_Id)	

	IF @v_InUsed > 0
	BEGIN
		RETURN -3
	END

	DELETE FROM DMKHACHHANG WHERE Id = @p_Id

	RETURN 1
END