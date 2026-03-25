---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMPHONGBAN_Get')
	DROP PROCEDURE DMPHONGBAN_Get
GO

CREATE PROCEDURE DMPHONGBAN_Get
(	@p_Code			T_D256,	@p_Name			T_D256,	@p_CName		T_D256) WITH ENCRYPTION
/********************************************************************************
--Routine: DMPHONGBAN_Get
--Task: Get record(s) from table DMPHONGBAN
--Version: 
--    1.0 Mar 23 2022  2:14PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	SELECT PB.Id,PB.Code,PB.Name,PB.ModifiedAt,PB.ModifiedBy,CQ.Name as CName,CQ.Code as CCode,CQ.Id as CId  FROM DMPHONGBAN as PB INNER JOIN DMCOQUANBO as CQ ON CQ.Id = PB.COQUANBO_Id  WHERE PB.Code Like '%' + @p_Code + '%' AND PB.[Name] Like '%' + @p_Name + '%' AND CQ.[Name] Like '%' + @p_CName + '%' 
END
