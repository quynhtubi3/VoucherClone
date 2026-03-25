IF EXISTS (SELECT * FROM sys.objects WHERE name = 'RPT_Voucher_Revenue_BySeller' AND type = 'P')
    DROP PROCEDURE RPT_Voucher_Revenue_BySeller;
GO

CREATE PROCEDURE RPT_Voucher_Revenue_BySeller
    @p_DateFrom   DATETIME = NULL,
    @p_DateTo     DATETIME = NULL,
    @p_PageNumber INT = 1,
    @p_PageSize   INT = 10
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH RevenueCTE AS
    (
        SELECT
            V.SellerId AS SellerId,
            NB.Name AS SellerName,
            NB.DienThoai AS SellerPhone,
            NB.Email AS SellerEmail,
            CV.Name AS ChucVuName,    
            COUNT(*) AS SoldCount,
            SUM(ISNULL(V.SalePrice, 0)) AS TotalRevenue,

            -- Tính hoa hồng theo % chức vụ
            SUM(ISNULL(V.SalePrice, 0) * ISNULL(CV.HHCaNhan, 0) / 100.0) AS TotalHHCaNhan,
            SUM(ISNULL(V.SalePrice, 0) * ISNULL(CV.HHTruongCuaHang, 0) / 100.0) AS TotalHHTruongCuaHang,
            SUM(ISNULL(V.SalePrice, 0) * ISNULL(CV.HHPhoCuaHang, 0) / 100.0) AS TotalHHPhoCuaHang,
            SUM(ISNULL(V.SalePrice, 0) * ISNULL(CV.QuyDoiPhaChe, 0) / 100.0) AS TotalQuyDoiPhaChe,
            SUM(ISNULL(V.SalePrice, 0) * ISNULL(CV.QuyChung, 0) / 100.0) AS TotalQuyChung
        FROM [Coffee-Tay-Ho].dbo.Voucher V
        INNER JOIN [Coffee-Tay-Ho].dbo.DMNGUOIBAN NB ON V.SellerId = NB.Id
        LEFT JOIN [Coffee-Tay-Ho].dbo.CHUCVU CV ON NB.ChucVuId = CV.Id
        WHERE V.SellerId IS NOT NULL
            AND (@p_DateFrom IS NULL OR V.SaleDate >= @p_DateFrom)
            AND (@p_DateTo IS NULL OR V.SaleDate < DATEADD(DAY, 1, @p_DateTo)) -- Bao gồm cả ngày @p_DateTo
        GROUP BY V.SellerId, NB.Name, NB.DienThoai, NB.Email, CV.Name
    )
    SELECT *
    FROM RevenueCTE
    ORDER BY TotalRevenue DESC
    OFFSET (@p_PageNumber - 1) * @p_PageSize ROWS
    FETCH NEXT @p_PageSize ROWS ONLY;

    -- Tổng số bản ghi để client tính tổng số trang
    SELECT COUNT(*) AS TotalCount
    FROM
    (
        SELECT V.SellerId
        FROM [Coffee-Tay-Ho].dbo.Voucher V
        INNER JOIN [Coffee-Tay-Ho].dbo.DMNGUOIBAN NB ON V.SellerId = NB.Id
        LEFT JOIN [Coffee-Tay-Ho].dbo.CHUCVU CV ON NB.ChucVuId = CV.Id
        WHERE V.SellerId IS NOT NULL
            AND (@p_DateFrom IS NULL OR V.SaleDate >= @p_DateFrom)
            AND (@p_DateTo IS NULL OR V.SaleDate < DATEADD(DAY, 1, @p_DateTo))
        GROUP BY V.SellerId, NB.Name, NB.DienThoai, NB.Email, CV.Name
    ) T;
END
GO
