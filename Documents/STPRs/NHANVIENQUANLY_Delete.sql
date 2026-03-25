---DELETE PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'NHANVIENQUANLY_Delete')
	DROP PROCEDURE NHANVIENQUANLY_Delete
GO



CREATE PROCEDURE NHANVIENQUANLY_Delete
(	
	@p_UserId			T_ID) WITH ENCRYPTION
/********************************************************************************
--Routine: NHANVIENQUANLY_Delete
--Task: Delete record(s) from table NHANVIENQUANLY
--Version: 
--    1.0 Mar 25 2022 11:55AM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	DELETE FROM NHANVIENQUANLY WHERE UserId = @p_UserId

	RETURN 1
END
