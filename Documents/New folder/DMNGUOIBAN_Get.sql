---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMNGUOIBAN_Get')
    DROP PROCEDURE DMNGUOIBAN_Get
GO

CREATE PROCEDURE DMNGUOIBAN_Get
(
    @p_Name       T_D256,
    @p_DienThoai  T_D256
) WITH ENCRYPTION
/********************************************************************************
--Routine: DMNGUOIBAN_Get
--Task: Get record(s) from table DMNGUOIBAN
--Version: 
--    1.0 Mar 23 2022  2:14PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
    SELECT 
        c.Name AS ChucVu,
        c.HHCaNhan,
        c.HHTruongCuaHang,
        c.HHPhoCuaHang,
        c.QuyDoiPhaChe,
        c.QuyChung,
        nb.*  
    FROM DMNGUOIBAN nb
    JOIN CHUCVU c ON nb.ChucVuId = c.Id
    WHERE nb.Name LIKE '%' + @p_Name + '%' 
      AND nb.DienThoai LIKE '%' + @p_DienThoai + '%'
    ORDER BY nb.CreatedAt DESC;
END
GO