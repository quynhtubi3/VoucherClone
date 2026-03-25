---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMCOQUANBO_Get')
	DROP PROCEDURE DMCOQUANBO_Get
GO

CREATE PROCEDURE DMCOQUANBO_Get
(	@p_Code			T_D256,	@p_Name			T_D256)WITH ENCRYPTION
/********************************************************************************
--Routine: DMCOQUANBO_Get
--Task: Get record(s) from table DMCOQUANBO
--Version: 
--    1.0 Mar 23 2022  2:14PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	SELECT * FROM DMCOQUANBO WHERE Code Like '%' + @p_Code + '%' and [Name] Like '%' + @p_Name + '%' 
END
