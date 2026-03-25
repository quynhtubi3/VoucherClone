IF EXISTS (SELECT * FROM sysobjects WHERE [name] = 'RPT_Voucher_Status_Get' AND [type] = 'P')
    DROP PROCEDURE RPT_Voucher_Status_Get
GO


CREATE PROCEDURE RPT_Voucher_Status_Get
(
    @p_Count INT = 10 -- Số dòng trả về tối đa
)WITH ENCRYPTION
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Data TABLE (
        Code NVARCHAR(100),    -- Đổi kiểu Code sang NVARCHAR
        Name NVARCHAR(100),
        Total INT
    );

    INSERT INTO @Data (Code, Name, Total)
    SELECT
        CASE 
            WHEN Status = 1 THEN N'Chưa bán'
            WHEN Status = 2 THEN N'Đã bán'
            WHEN Status = 3 THEN N'Đã kích hoạt'
            ELSE N'Khác'
        END AS Code,
        CASE 
            WHEN Status = 1 THEN N'Chưa bán'
            WHEN Status = 2 THEN N'Đã bán'
            WHEN Status = 3 THEN N'Đã kích hoạt'
            ELSE N'Khác'
        END AS Name,
        COUNT(*) AS Total
    FROM 
        Voucher
    GROUP BY 
        Status
    ORDER BY 
        COUNT(*) DESC;

    SELECT TOP (@p_Count) *
    FROM @Data;
END
GO



IF EXISTS (SELECT * FROM sysobjects WHERE [name] = 'RPT_Voucher_Commission_Get' AND [type] = 'P')
    DROP PROCEDURE RPT_Voucher_Commission_Get
GO

CREATE PROCEDURE RPT_Voucher_Commission_Get
(
    @p_Count INT = 10 -- Số dòng trả về tối đa
)
WITH ENCRYPTION
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Data TABLE (
        Code NVARCHAR(100),
        Name NVARCHAR(100),
        Total DECIMAL(18, 2)
    );

    -- Tính hoa hồng cá nhân = SalePrice * (IndividualCommission%) / 100
    INSERT INTO @Data (Code, Name, Total)
    SELECT
        N'Cá nhân' AS Code,
        N'Hoa hồng cá nhân' AS Name,
        SUM(ISNULL(SalePrice, 0) * ISNULL(IndividualCommission, 0) / 100.0) AS Total
    FROM Voucher
    WHERE SellerId IS NOT NULL;

    -- Tính hoa hồng nhóm = SalePrice * (GroupCommission%) / 100
    INSERT INTO @Data (Code, Name, Total)
    SELECT
        N'Nhóm' AS Code,
        N'Hoa hồng nhóm' AS Name,
        SUM(ISNULL(SalePrice, 0) * ISNULL(GroupCommission, 0) / 100.0) AS Total
    FROM Voucher
    WHERE SellerId IS NOT NULL;

    -- Trả kết quả
    SELECT TOP (@p_Count) *
    FROM @Data
    ORDER BY Total DESC;
END
GO



select * from Voucher v 




IF EXISTS (SELECT * FROM sysobjects WHERE [name] = 'RPT_Voucher_Revenue_ByMonth' AND [type] = 'P')
    DROP PROCEDURE RPT_Voucher_Revenue_ByMonth
GO

CREATE PROCEDURE RPT_Voucher_Revenue_ByMonth
AS
BEGIN
    SET NOCOUNT ON;

    -- Tạo bảng chứa 6 tháng gần nhất (tính từ tháng hiện tại lùi về 5 tháng)
    DECLARE @MonthList TABLE (
        SaleMonth DATE
    );

    DECLARE @i INT = 0;
    WHILE @i < 6
    BEGIN
        INSERT INTO @MonthList (SaleMonth)
        VALUES (DATEFROMPARTS(YEAR(DATEADD(MONTH, -@i, GETDATE())), MONTH(DATEADD(MONTH, -@i, GETDATE())), 1));
        SET @i = @i + 1;
    END

    -- Tính tổng doanh thu theo SaleMonth, kết hợp với MonthList
    SELECT 
        FORMAT(m.SaleMonth, 'MM/yyyy') AS Code,
        N'Tháng ' + FORMAT(m.SaleMonth, 'MM/yyyy') AS Name,
        ISNULL(SUM(v.SalePrice), 0) AS Total
    FROM @MonthList m
    LEFT JOIN Voucher v ON 
        v.SellerId IS NOT NULL AND
        v.SaleDate >= m.SaleMonth AND 
        v.SaleDate < DATEADD(MONTH, 1, m.SaleMonth)
    GROUP BY m.SaleMonth
    ORDER BY m.SaleMonth
END


select * from Voucher v 


IF EXISTS (SELECT * FROM sysobjects WHERE [name] = 'RPT_Voucher_Revenue_ByQuarter' AND [type] = 'P')
    DROP PROCEDURE RPT_Voucher_Revenue_ByQuarter
GO

CREATE PROCEDURE RPT_Voucher_Revenue_ByQuarter
AS
BEGIN
    SET NOCOUNT ON;

    -- Tạo bảng chứa 6 quý gần nhất từ hiện tại lùi về
    DECLARE @QuarterList TABLE (
        Year INT,
        Quarter INT,
        StartDate DATE,
        EndDate DATE
    );

    DECLARE @i INT = 0;
    WHILE @i < 6
    BEGIN
        DECLARE @TargetDate DATE = DATEADD(QUARTER, -@i, GETDATE());
        DECLARE @Year INT = YEAR(@TargetDate);
        DECLARE @Month INT = MONTH(@TargetDate);
        DECLARE @Quarter INT = ((@Month - 1) / 3) + 1;

        DECLARE @StartDate DATE = DATEFROMPARTS(@Year, ((@Quarter - 1) * 3) + 1, 1);
        DECLARE @EndDate DATE = EOMONTH(DATEADD(MONTH, 2, @StartDate)); -- cuối tháng thứ 3 trong quý

        INSERT INTO @QuarterList (Year, Quarter, StartDate, EndDate)
        VALUES (@Year, @Quarter, @StartDate, @EndDate);

        SET @i = @i + 1;
    END

    -- Tính tổng doanh thu theo quý
    SELECT
        CAST(q.Year AS VARCHAR(4)) + '/Q' + CAST(q.Quarter AS VARCHAR(1)) AS Code,
        N'Quý ' + CAST(q.Quarter AS NVARCHAR(10)) + ' - ' + CAST(q.Year AS NVARCHAR(10)) AS Name,
        ISNULL(SUM(v.SalePrice), 0) AS Total
    FROM @QuarterList q
    LEFT JOIN Voucher v ON 
        v.SellerId IS NOT NULL AND
        v.SaleDate >= q.StartDate AND 
        v.SaleDate <= q.EndDate
    GROUP BY q.Year, q.Quarter
    ORDER BY q.Year, q.Quarter
END




IF EXISTS (SELECT * FROM sysobjects WHERE [name] = 'RPT_Voucher_Activated_ByMonth' AND [type] = 'P')
    DROP PROCEDURE RPT_Voucher_Activated_ByMonth
GO

CREATE PROCEDURE RPT_Voucher_Activated_ByMonth
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @MonthList TABLE (
        MonthDate DATE,
        Code NVARCHAR(7),
        Name NVARCHAR(20)
    );

    DECLARE @i INT = 0;
    WHILE @i < 6
    BEGIN
        DECLARE @Date DATE = DATEADD(MONTH, -@i, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));
        INSERT INTO @MonthList (MonthDate, Code, Name)
        VALUES (
            @Date,
            FORMAT(@Date, 'MM/yyyy'),
            N'Tháng ' + FORMAT(@Date, 'MM/yyyy')
        );
        SET @i = @i + 1;
    END

    SELECT 
        m.Code,
        m.Name,
        ISNULL(COUNT(v.Id), 0) AS Total
    FROM @MonthList m
    LEFT JOIN Voucher v ON 
        v.ActivationDate IS NOT NULL AND
        v.ActivationDate >= m.MonthDate AND
        v.ActivationDate < DATEADD(MONTH, 1, m.MonthDate)
    GROUP BY m.Code, m.Name, m.MonthDate
    ORDER BY m.MonthDate;
END


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




IF EXISTS (SELECT * FROM sys.objects WHERE name = 'RPT_Voucher_Revenue_BySeller' AND type = 'P')
    DROP PROCEDURE RPT_Voucher_Revenue_BySeller;
GO

CREATE PROCEDURE RPT_Voucher_Revenue_BySeller
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
    GROUP BY V.SellerId, U.Email2, UD.HoVaTen
    ORDER BY TotalRevenue DESC;
END



IF EXISTS (SELECT * FROM sys.objects WHERE name = 'sp_Voucher_ActivationRate_AllTime' AND type = 'P')
    DROP PROCEDURE sp_Voucher_ActivationRate_AllTime;
GO


CREATE PROCEDURE sp_Voucher_ActivationRate_AllTime
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        FORMAT(SaleDate, 'MM/yyyy') AS [SaleDate],
        COUNT(*) AS [Sold],
        COUNT(CASE WHEN ActivationDate IS NOT NULL THEN 1 END) AS [Activated],
        CAST(
            100.0 * COUNT(CASE WHEN ActivationDate IS NOT NULL THEN 1 END) / COUNT(*) 
            AS DECIMAL(5,2)
        ) AS [UsageRate]
    FROM Voucher
    WHERE SaleDate IS NOT NULL
    GROUP BY FORMAT(SaleDate, 'MM/yyyy'), 
             YEAR(SaleDate), 
             MONTH(SaleDate)
    ORDER BY YEAR(SaleDate), MONTH(SaleDate)
END




IF EXISTS (SELECT * FROM sys.objects WHERE name = 'sp_VoucherRevenue_ByType' AND type = 'P')
    DROP PROCEDURE sp_VoucherRevenue_ByType;
GO

-- 2. Doanh thu theo loại voucher
CREATE PROCEDURE sp_VoucherRevenue_ByType
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

select * from VoucherType


 SET NOCOUNT ON;

    SELECT TOP 5
        BuyerName,
        COUNT(*) AS [Số lượng voucher],
        SUM(ISNULL(SalePrice, 0)) AS [Tổng chi tiêu]
    FROM Voucher
    WHERE SaleDate IS NOT NULL
    GROUP BY BuyerName
    ORDER BY [Tổng chi tiêu] DESC;


IF EXISTS (SELECT * FROM sys.objects WHERE name = 'sp_Voucher_ExpiringSoon' AND type = 'P')
    DROP PROCEDURE sp_Voucher_ExpiringSoon;
GO 
-- 10. Voucher sắp hết hạn trong 7 ngày tới chưa được kích hoạt
CREATE PROCEDURE sp_Voucher_ExpiringSoon
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
       *
    FROM Voucher
    WHERE ActivationDate IS NOT NULL 
      AND ExpiryDate BETWEEN GETDATE() AND DATEADD(DAY, 14, GETDATE())
    ORDER BY ExpiryDate;
END
GO  
    
    
    
select * from Voucher
select * from VoucherType
select * from Menu

INSERT INTO [Coffee-Tay-Ho].dbo.Menu
(Bar, ParentId, [Type], SubId, ChildId, ControlId, ControlType, DockStyle, ChildControlId, Image_Name, OrderId, ExtraVar, IsContract, Ma_File)
VALUES(N'Thống kê doanh thu theo loại voucher', N'F8E8F198-EE39-4EC6-83E5-CFB41032DA36', N'L', NULL, NULL, N'ManageDoanhThuTheoLoaiVoucherLister', N'Baocaothongkelister', N'full', NULL, N'', 3400, NULL, 1, NULL);


