---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'PHONGBANQUANLY_Get')
	DROP PROCEDURE PHONGBANQUANLY_Get
GO

CREATE PROCEDURE PHONGBANQUANLY_Get
(	@p_UserId			T_ID) WITH ENCRYPTION
/********************************************************************************
--Routine: PHONGBANQUANLY_Get
--Task: Get record(s) from table DMPHONGBAN
--Version: 
--    1.0 Mar 23 2022  2:14PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	SELECT Q.PHONGBAN_Id as [value],P.Name as [caption] FROM PHONGBANQUANLY as Q INNER JOIN DMPHONGBAN as P
	ON Q.PHONGBAN_Id = P.Id
	WHERE Q.UserId = @p_UserId
END
