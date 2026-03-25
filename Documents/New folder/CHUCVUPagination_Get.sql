---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'CHUCVUPagination_Get')
	DROP PROCEDURE CHUCVUPagination_Get
GO

CREATE PROCEDURE CHUCVUPagination_Get
(
	@p_Name			T_D256,
	@p_Code		T_D256,
	@p_PageNumber INT = 1,
    @p_PageSize INT = 10
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
	OFFSET (@p_PageNumber - 1) * @p_PageSize ROWS
    FETCH NEXT @p_PageSize ROWS ONLY;

    SELECT COUNT(*) AS TotalCount
    FROM CHUCVU 
    WHERE [Name] Like '%' + @p_Name + '%' AND Code Like '%' + @p_Code + '%'

END
