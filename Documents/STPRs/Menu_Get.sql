---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'Menu_Get')
	DROP PROCEDURE Menu_Get
GO

CREATE PROCEDURE Menu_Get
(
	@p_UserId		[uniqueidentifier] = NULL
) WITH ENCRYPTION
/********************************************************************************
--Routine: Menu_Get
--Task: Get record(s) from table Menu
--Version: 
--    1.0 Mar 14 2022  8:04AM:    THAIVM        Created
********************************************************************************/
AS
BEGIN	
	SELECT * FROM Menu ORDER BY OrderId
END
