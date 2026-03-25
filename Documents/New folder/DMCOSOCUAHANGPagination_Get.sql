---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMCOSOCUAHANGPagination_Get')
	DROP PROCEDURE DMCOSOCUAHANGPagination_Get
GO

CREATE PROCEDURE DMCOSOCUAHANGPagination_Get
(
	@p_Code			T_D256,
	@p_Name			T_D256,
	@p_PageNumber INT = 1,
    @p_PageSize INT = 10
)WITH ENCRYPTION
/********************************************************************************
--Routine: DMCOSOCUAHANG_Get
--Task: Get record(s) from table DMCOSOCUAHANG
--Version: 
--    1.0 Mar 23 2022  2:14PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	SELECT * 
	FROM DMCOSOCUAHANG
	WHERE Code Like '%' + @p_Code + '%' and [Name] Like '%' + @p_Name + '%' 
	Order by CreatedAt desc
	OFFSET (@p_PageNumber - 1) * @p_PageSize ROWS
    FETCH NEXT @p_PageSize ROWS ONLY;

    SELECT COUNT(*) AS TotalCount
    FROM DMCOSOCUAHANG
    WHERE Code Like '%' + @p_Code + '%' and [Name] Like '%' + @p_Name + '%' 
END
