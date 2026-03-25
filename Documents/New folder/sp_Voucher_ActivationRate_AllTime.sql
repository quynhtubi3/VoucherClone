IF EXISTS (SELECT * FROM sys.objects WHERE name = 'sp_Voucher_ActivationRate_AllTime' AND type = 'P')
    DROP PROCEDURE sp_Voucher_ActivationRate_AllTime;
GO

CREATE PROCEDURE sp_Voucher_ActivationRate_AllTime
    @p_PageNumber INT = 1,   -- số trang
    @p_PageSize   INT = 20   -- số bản ghi mỗi trang
AS
BEGIN
    SET NOCOUNT ON;

    -- Đưa dữ liệu vào bảng tạm
    SELECT 
        FORMAT(SaleDate, 'MM/yyyy') AS [SaleDate],
        COUNT(*) AS [Sold],
        COUNT(CASE WHEN ActivationDate IS NOT NULL THEN 1 END) AS [Activated],
        CAST(
            100.0 * COUNT(CASE WHEN ActivationDate IS NOT NULL THEN 1 END) / COUNT(*) 
            AS DECIMAL(5,2)
        ) AS [UsageRate],
        YEAR(SaleDate) AS [SaleYear],
        MONTH(SaleDate) AS [SaleMonth]
    INTO #ActivationRate
    FROM Voucher
    WHERE SaleDate IS NOT NULL
    GROUP BY FORMAT(SaleDate, 'MM/yyyy'), YEAR(SaleDate), MONTH(SaleDate);



    -- Recordset 2: Phân trang
    SELECT [SaleDate], [Sold], [Activated], [UsageRate]
    FROM #ActivationRate
    ORDER BY [SaleYear], [SaleMonth]
    OFFSET (@p_PageNumber - 1) * @p_PageSize ROWS
    FETCH NEXT @p_PageSize ROWS ONLY;
    
        -- Recordset 1: Tổng số tháng có dữ liệu
    SELECT COUNT(*) AS TotalCount
    FROM #ActivationRate;
END
GO
