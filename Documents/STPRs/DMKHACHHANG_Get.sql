IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMKHACHHANG_Get')
	DROP PROCEDURE DMKHACHHANG_Get
GO

CREATE PROCEDURE DMKHACHHANG_Get
(
	@p_Name			T_D256,
	@p_Code			T_D256,
	@p_DiaChi		NVARCHAR(MAX),
	@p_DienThoai	T_D256
)WITH ENCRYPTION
/********************************************************************************
--Routine: DMKHACHHANG_Get
--Task: Get record(s) from table DMKHACHHANG
--Version: 
--    1.0 Mar 23 2022  2:14PM:    AnBD        Created
********************************************************************************/
AS
BEGIN
	SELECT *  FROM DMKHACHHANG WHERE [Code] Like '%' + @p_Code + '%' AND [Name] Like '%' + @p_Name + '%' AND DiaChi Like '%' + @p_DiaChi + '%' AND DienThoai Like '%' + @p_DienThoai + '%'
	Order by CreatedAt desc
END
