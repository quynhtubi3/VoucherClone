---DELETE PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMDUAN_Delete')
	DROP PROCEDURE DMDUAN_Delete
GO



CREATE PROCEDURE DMDUAN_Delete
(	
	@p_Id			T_ID,	@p_ModifiedBy	T_ID,	@p_ModifiedAt	T_DATE) WITH ENCRYPTION
/********************************************************************************
--Routine: DMDUAN_Delete
--Task: Delete record(s) from table DMDUAN
--Version: 
--    1.0 Mar 25 2022 11:55AM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	DECLARE @v_InUsed		T_INT

	IF EXISTS(SELECT * FROM DMDUAN WHERE Id = @p_Id AND ModifiedAt != @p_ModifiedAt)
	BEGIN
		RETURN -2
	END

	--SET @v_InUsed = (SELECT COUNT(Id) FROM DMDUAN WHERE PHONGBAN_Id = @p_Id)	

	--IF @v_InUsed > 0
	--BEGIN
	--	RETURN -3
	--END

	DELETE FROM DMDUAN WHERE Id = @p_Id

	RETURN 1
END
