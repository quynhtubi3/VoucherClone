---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'Memvar_Get')
	DROP PROCEDURE Memvar_Get
GO


CREATE PROCEDURE Memvar_Get
WITH ENCRYPTION
/********************************************************************************
--Routine: Memvar_Get
--Task: Get record(s) from table Memvar
--Version: 
--    1.0 Jul  5 2004  2:21PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	SELECT
			Var_Name, Var_Value
		FROM Memvar		END
