---DELETE PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'PHONGBANQUANLY_Delete')
	DROP PROCEDURE PHONGBANQUANLY_Delete
GO



CREATE PROCEDURE PHONGBANQUANLY_Delete
(	
	@p_UserId			T_ID) WITH ENCRYPTION
/********************************************************************************
--Routine: PHONGBANQUANLY_Delete
--Task: Delete record(s) from table PHONGBANQUANLY
--Version: 
--    1.0 Mar 25 2022 11:55AM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	DELETE FROM PHONGBANQUANLY WHERE UserId = @p_UserId

	RETURN 1
END
