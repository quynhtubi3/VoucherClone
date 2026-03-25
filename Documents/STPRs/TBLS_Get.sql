  ---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'TBLS_Get')
	DROP PROCEDURE TBLS_Get
GO

CREATE PROCEDURE TBLS_Get WITH ENCRYPTION
/********************************************************************************
--Routine: TBLS_Save
--Task: Save a record into table TBLS
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	select distinct TBLS.COQUANID as Id, DMCOQUANBO.Code as Code , DMCOQUANBO.Name as [Name] from TBLS inner join DMCOQUANBO on DMCOQUANBO.Id = TBLS.COQUANID
END