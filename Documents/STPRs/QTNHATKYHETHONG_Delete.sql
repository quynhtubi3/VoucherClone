---DELETE PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'QTNHATKYHETHONG_Delete')
	DROP PROCEDURE QTNHATKYHETHONG_Delete
GO



CREATE PROCEDURE QTNHATKYHETHONG_Delete
(	
	@p_Id			T_ID,	@p_ModifiedBy	T_ID,	@p_ModifiedAt	T_DATE) WITH ENCRYPTION
/********************************************************************************
--Routine: QTNHATKYHETHONG_Delete
--Task: Delete record(s) from table NHATKYHETHONG
--Version: 
--    1.0 Mar 25 2022 11:55AM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	DELETE FROM NHATKYHETHONG WHERE Id = @p_Id

	RETURN 1
END
