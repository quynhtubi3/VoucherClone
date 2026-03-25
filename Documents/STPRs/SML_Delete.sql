  ---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'SML_Delete')
	DROP PROCEDURE SML_Delete
GO

CREATE PROCEDURE SML_Delete
(	
	@COQUANID			T_ID,
	@THANG T_INT,
	@NAM T_INT,
	@LAN T_INT
) WITH ENCRYPTION
/********************************************************************************
--Routine: DMPHONGBAN_Delete
--Task: Delete record(s) from table DMPHONGBAN
--Version: 
--    1.0 Mar 25 2022 11:55AM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	DELETE FROM SML WHERE SML.COQUANID = @COQUANID and SML.THANG = @THANG and SML.NAM = @NAM and SML.SOLANTRONGTHANG = @LAN
	RETURN 1
END
