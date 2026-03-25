IF EXISTS (SELECT * FROM sys.objects WHERE name = 'sp_VoucherRevenue_ByType' AND type = 'P')
    DROP PROCEDURE sp_VoucherRevenue_ByType;
GO

CREATE PROCEDURE sp_VoucherRevenue_ByType
    @p_DateFrom   DATETIME = NULL,
    @p_DateTo     DATETIME = NULL,
    @p_PageNumber INT = 1,
    @p_PageSize   INT = 20
AS
BEGIN
    SET NOCOUNT ON;

    -- Đưa kết quả vào bảng tạm để vừa đếm vừa phân trang
    SELECT 
        vt.Id,
        vt.Name,
        vt.Code,
        vt.Type,
        vt.DefaultValidityPeriod,
        vt.DefaultPrice,
        COUNT(*) AS [SalesQuantity],
        SUM(ISNULL(v.SalePrice, 0)) AS [TotalRevenue]
    INTO #VoucherRevenue
    FROM Voucher v
    JOIN VoucherType vt ON v.VoucherTypeId = vt.Id
    WHERE v.SaleDate IS NOT NULL
          AND (@p_DateFrom IS NULL OR v.SaleDate >= @p_DateFrom)
          AND (@p_DateTo   IS NULL OR v.SaleDate < DATEADD(DAY, 1, @p_DateTo)) -- Bao gồm cả ngày @p_DateTo
    GROUP BY 
        vt.Id,
        vt.Name,
        vt.Code,
        vt.Type,
        vt.DefaultValidityPeriod,
        vt.DefaultPrice;

    -- Recordset 2: dữ liệu phân trang
    SELECT *
    FROM #VoucherRevenue
    ORDER BY TotalRevenue DESC
    OFFSET (@p_PageNumber - 1) * @p_PageSize ROWS
    FETCH NEXT @p_PageSize ROWS ONLY;
    
    
    -- Recordset 1: tổng số dòng
    SELECT COUNT(*) AS TotalCount
    FROM #VoucherRevenue;

END
GO
