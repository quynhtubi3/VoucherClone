IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMKHACHHANGPagination_Get')
	DROP PROCEDURE DMKHACHHANGPagination_Get
GO

CREATE PROCEDURE DMKHACHHANGPagination_Get
(
    @p_Code			T_D256,
	@p_Name			T_D256,
	@p_DiaChi		NVARCHAR(MAX),
	@p_DienThoai	T_D256,
	@p_PageNumber INT = 1,
    @p_PageSize INT = 10
)WITH ENCRYPTION
/********************************************************************************
--Routine: DMKHACHHANGPagination_Get
--Task: Get record(s) from table DMKHACHHANG
--Version: 
--    1.0 Mar 23 2022  2:14PM:    AnBD        Created
********************************************************************************/
AS
BEGIN
	SELECT *  
	FROM DMKHACHHANG 
	WHERE [Code] Like '%' + @p_Code + '%' AND [Name] Like '%' + @p_Name + '%' AND DiaChi Like '%' + @p_DiaChi + '%' AND DienThoai Like '%' + @p_DienThoai + '%'
	Order by CreatedAt desc
	OFFSET (@p_PageNumber - 1) * @p_PageSize ROWS
    FETCH NEXT @p_PageSize ROWS ONLY;


   SELECT COUNT(*) AS TotalCount 
	FROM DMKHACHHANG 
	WHERE [Code] Like '%' + @p_Code + '%' AND [Name] Like '%' + @p_Name + '%' AND DiaChi Like '%' + @p_DiaChi + '%' AND DienThoai Like '%' + @p_DienThoai + '%'
END
