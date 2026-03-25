  ---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'TBLS_Delete')
	DROP PROCEDURE TBLS_Delete
GO

CREATE PROCEDURE TBLS_Delete
(	
	@COQUANID			T_ID
) WITH ENCRYPTION
/********************************************************************************
--Routine: DMPHONGBAN_Delete
--Task: Delete record(s) from table DMPHONGBAN
--Version: 
--    1.0 Mar 25 2022 11:55AM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	DELETE FROM TBLS WHERE TBLS.COQUANID = @COQUANID
	RETURN 1
END
