IF EXISTS (SELECT * FROM sysobjects WHERE [name] = 'RPT_Voucher_Revenue_ByDay' AND [type] = 'P')
    DROP PROCEDURE RPT_Voucher_Revenue_ByDay
GO

CREATE PROCEDURE RPT_Voucher_Revenue_ByDay
AS
BEGIN
    SET NOCOUNT ON;

    -- Tạo danh sách 6 ngày gần nhất (hôm nay lùi về 6 ngày)
    DECLARE @DateRange TABLE (SaleDate DATE);
    DECLARE @i INT = 0;

    WHILE @i < 6
    BEGIN
        INSERT INTO @DateRange (SaleDate)
        VALUES (CAST(GETDATE() - @i AS DATE));
        SET @i = @i + 1;
    END

    -- Đảo ngược lại thứ tự cho dễ nhìn
    ;WITH RevenuePerDay AS (
        SELECT
            CAST(SaleDate AS DATE) AS SaleDate,
            SUM(ISNULL(SalePrice, 0)) AS Total
        FROM Voucher
        WHERE 
            SellerId IS NOT NULL
            AND SaleDate >= CAST(GETDATE() - 6 AS DATE)
            AND SaleDate <= CAST(GETDATE() AS DATE)
        GROUP BY CAST(SaleDate AS DATE)
    )

    SELECT 
        FORMAT(DR.SaleDate, 'dd/MM/yyyy') AS Code,
        N'Ngày ' + FORMAT(DR.SaleDate, 'dd/MM/yyyy') AS Name,
        ISNULL(R.Total, 0) AS Total
    FROM @DateRange DR
    LEFT JOIN RevenuePerDay R ON DR.SaleDate = R.SaleDate
    ORDER BY DR.SaleDate ASC;
END