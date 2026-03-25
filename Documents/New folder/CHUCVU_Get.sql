---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'CHUCVU_Get')
	DROP PROCEDURE CHUCVU_Get
GO

CREATE PROCEDURE CHUCVU_Get
(
	@p_Name			T_D256,
	@p_Code		T_D256
)WITH ENCRYPTION
/********************************************************************************
--Routine: CHUCVU_Get
--Task: Get record(s) from table CHUCVU_Get
--Version: 
--    1.0 Mar 23 2022  2:14PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	SELECT *  FROM CHUCVU WHERE [Name] Like '%' + @p_Name + '%' AND Code Like '%' + @p_Code + '%'
	Order by CreatedAt desc

END
