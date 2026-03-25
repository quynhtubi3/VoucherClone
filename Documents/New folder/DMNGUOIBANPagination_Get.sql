
---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMNGUOIBANPagination_Get')
    DROP PROCEDURE DMNGUOIBANPagination_Get
GO

CREATE PROCEDURE DMNGUOIBANPagination_Get
(
    @p_Code       T_D256,
    @p_Name       T_D256,
    @p_DienThoai  T_D256,
    @p_PageNumber INT = 1,
    @p_PageSize   INT = 10
) WITH ENCRYPTION
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
    WHERE (@p_Name IS NULL OR @p_Name = '' OR nb.Name LIKE '%' + @p_Name + '%')
      AND (@p_DienThoai IS NULL OR @p_DienThoai = '' OR nb.DienThoai LIKE '%' + @p_DienThoai + '%')
      AND (@p_Code IS NULL OR @p_Code = '' OR nb.Code LIKE '%' + @p_Code + '%')
    ORDER BY nb.CreatedAt DESC
    OFFSET (@p_PageNumber - 1) * @p_PageSize ROWS
    FETCH NEXT @p_PageSize ROWS ONLY;

    SELECT COUNT(*) AS TotalCount 
    FROM DMNGUOIBAN nb
    JOIN CHUCVU c ON nb.ChucVuId = c.Id
    WHERE (@p_Name IS NULL OR @p_Name = '' OR nb.Name LIKE '%' + @p_Name + '%')
      AND (@p_DienThoai IS NULL OR @p_DienThoai = '' OR nb.DienThoai LIKE '%' + @p_DienThoai + '%')
      AND (@p_Code IS NULL OR @p_Code = '' OR nb.Code LIKE '%' + @p_Code + '%')
END
GO







