IF OBJECT_ID('dbo.RPT_UserProfile_Commission', 'P') IS NOT NULL
    DROP PROCEDURE dbo.RPT_UserProfile_Commission;
GO

CREATE PROCEDURE dbo.RPT_UserProfile_Commission
(
    @p_DateFrom   DATETIME = NULL,
    @p_DateTo     DATETIME = NULL,
    @p_PageNumber INT = 1,
    @p_PageSize   INT = 20
)
WITH ENCRYPTION
AS
BEGIN
    SET NOCOUNT ON;

    /* 1) Doanh số bán ra trong kỳ (dùng SaleDate) */
    ;WITH VoucherSales AS
    (
        SELECT 
            v.Id,
            v.SalePrice,
            v.SaleDate,
            nb.ChucVuId AS SellerChucVuId
        FROM Voucher v
        JOIN DMNGUOIBAN nb ON v.SellerId = nb.Id
        WHERE 
            (@p_DateFrom IS NULL OR v.SaleDate >= @p_DateFrom)
            AND (@p_DateTo IS NULL OR v.SaleDate < DATEADD(day, 1, @p_DateTo))
    ),

    /* 2) Tổng pool hoa hồng cho Trưởng/Phó (tính theo chức vụ NGƯỜI BÁN) */
    Pools AS
    (
        SELECT
            CAST(SUM(vs.SalePrice * COALESCE(cs.HHTruongCuaHang,0) / 100.0) AS DECIMAL(18,6)) AS Pool_Truong,
            CAST(SUM(vs.SalePrice * COALESCE(cs.HHPhoCuaHang,   0) / 100.0) AS DECIMAL(18,6)) AS Pool_Pho
        FROM VoucherSales vs
        JOIN CHUCVU cs ON vs.SellerChucVuId = cs.Id
    ),

    /* 3) Đếm số user theo vai trò nhận ké (chỉ hai code sau) */
    RoleCounts AS
    (
        SELECT
            SUM(CASE WHEN c.Code = 'TCH' THEN 1 ELSE 0 END) AS CntTruong,
            SUM(CASE WHEN c.Code = 'PCH'    THEN 1 ELSE 0 END) AS CntPho
        FROM UserProfile up
        JOIN CHUCVU c ON up.CHUCVU_ID = c.Id
        WHERE c.Code IN ('TCH', 'PCH')
    )

    /* Đổ kết quả ra bảng tạm #FinalResult */
    SELECT
        up.Id,
        up.HOVATEN as Hoten,
        up.DIENTHOAI as DienThoai,
        up.GIOITINH as GioiTinh,
        ul.Email2 as Email,
        ul.UserName2 as Username,
        c.Code as ChucVu_Code,
        c.Name as ChucVu_Name,
        CAST(
            CASE 
                WHEN c.Code = 'TCH' 
                    THEN p.Pool_Truong / NULLIF(rc.CntTruong, 0)
                WHEN c.Code = 'PCH'    
                    THEN p.Pool_Pho    / NULLIF(rc.CntPho, 0)
                ELSE 0
            END
        AS DECIMAL(18,2)) AS Commission
    INTO #FinalResult
    FROM UserProfile up
    JOIN [3TVoucher].dbo.UserList ul ON up.Id = ul.Id
    JOIN CHUCVU c ON up.CHUCVU_ID = c.Id
    CROSS JOIN Pools      p
    CROSS JOIN RoleCounts rc
    WHERE c.Code IN ('TCH', 'PCH');

    /* Recordset 2: Kết quả phân trang */
    SELECT *
    FROM #FinalResult
    ORDER BY Commission DESC, Hoten
    OFFSET (@p_PageNumber - 1) * @p_PageSize ROWS
    FETCH NEXT @p_PageSize ROWS ONLY;
    
     /* Recordset 1: TotalCount */
    SELECT COUNT(*) AS TotalCount
    FROM #FinalResult;

END
GO
