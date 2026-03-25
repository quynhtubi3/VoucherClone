
---DELETE PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMCOSOCUAHANG_Delete')
	DROP PROCEDURE DMCOSOCUAHANG_Delete
GO



CREATE PROCEDURE DMCOSOCUAHANG_Delete
(	
	@p_Id			T_ID,
	@p_ModifiedBy	T_ID,
	@p_ModifiedAt	T_DATE
) WITH ENCRYPTION
/********************************************************************************
--Routine: DMCOSOCUAHANG_Delete
--Task: Delete record(s) from table DMCOSOCUAHANG
--Version: 
--    1.0 Mar 25 2022 11:55AM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	DECLARE @v_InUsed		T_INT

	IF EXISTS(SELECT * FROM DMCOSOCUAHANG WHERE Id = @p_Id AND ModifiedAt != @p_ModifiedAt)
	BEGIN
		RETURN -2
	END
	
	SET @v_InUsed = (SELECT COUNT(Id) FROM Voucher WHERE CoSoCuaHangId = @p_Id)	

	IF @v_InUsed > 0
	BEGIN
		RETURN -3
	END

	

	DELETE FROM DMCOSOCUAHANG WHERE Id = @p_Id

	RETURN 1
END
