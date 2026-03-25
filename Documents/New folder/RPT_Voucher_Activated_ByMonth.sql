IF EXISTS (SELECT * FROM sys.objects WHERE name = 'RPT_Voucher_Revenue_BySeller' AND type = 'P')
    DROP PROCEDURE RPT_Voucher_Revenue_BySeller;
GO

CREATE PROCEDURE RPT_Voucher_Revenue_BySeller
    @p_DateFrom DATETIME,
    @p_DateTo DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        V.SellerId AS ID,
        U.Email2  AS Email,
        UD.HoVaTen AS FullName,
        COUNT(*) AS SoldCount,
        SUM(ISNULL(V.SalePrice, 0)) AS TotalRevenue,
        SUM(ISNULL(V.SalePrice, 0) * ISNULL(V.IndividualCommission, 0) / 100.0) AS TotalIndividualCommission,
        SUM(ISNULL(V.SalePrice, 0) * ISNULL(V.GroupCommission, 0) / 100.0) AS TotalGroupCommission
    FROM Voucher V
    LEFT JOIN [3TVoucher].dbo.UserList U ON U.Id = V.SellerId
    LEFT JOIN UserProfile UD ON UD.Id = V.SellerId
    WHERE V.SellerId IS NOT NULL
        AND (@p_DateFrom IS NULL OR V.SaleDate >= @p_DateFrom)
        AND (@p_DateTo IS NULL OR V.SaleDate < DATEADD(DAY, 1, @p_DateTo)) -- Bao gồm cả ngày @p_DateTo
    GROUP BY V.SellerId, U.Email2, UD.HoVaTen
    ORDER BY TotalRevenue DESC;
END







IF EXISTS (SELECT * FROM sys.objects WHERE name = 'sp_VoucherRevenue_ByType' AND type = 'P')
    DROP PROCEDURE sp_VoucherRevenue_ByType;
GO

-- 2. Doanh thu theo loại voucher
CREATE PROCEDURE sp_VoucherRevenue_ByType
    @p_DateFrom DATETIME,
    @p_DateTo DATETIME
AS
BEGIN
   SET NOCOUNT ON;

   SELECT 
       vt.Id,
       vt.Name,
       vt.Code,
       vt.Type,
       vt.DefaultValidityPeriod,
       vt.DefaultPrice,
       COUNT(*) AS [SalesQuantity],
       SUM(ISNULL(SalePrice, 0)) AS [TotalRevenue]
   FROM Voucher v
   JOIN VoucherType vt ON v.VoucherTypeId = vt.Id
   WHERE v.SaleDate IS NOT NULL
         AND (@p_DateFrom IS NULL OR V.SaleDate >= @p_DateFrom)
         AND (@p_DateTo IS NULL OR V.SaleDate < DATEADD(DAY, 1, @p_DateTo)) -- Bao gồm cả ngày @p_DateTo
   GROUP BY 
        vt.Id,
        vt.Name,
        vt.Code,
        vt.Type,
        vt.DefaultValidityPeriod,
        vt.DefaultPrice
   ORDER BY [TotalRevenue] DESC;
END
GO