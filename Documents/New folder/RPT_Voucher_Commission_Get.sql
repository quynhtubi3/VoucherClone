IF EXISTS (SELECT * FROM sysobjects WHERE [name] = 'RPT_Voucher_Commission_Get' AND [type] = 'P')
    DROP PROCEDURE RPT_Voucher_Commission_Get;
GO

CREATE PROCEDURE RPT_Voucher_Commission_Get
(
    @p_Count      INT = 10 -- Số dòng trả về tối đa
)
WITH ENCRYPTION
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Data TABLE (
        Code NVARCHAR(50),
        Name NVARCHAR(200),
        Total DECIMAL(18, 2)
    );

    -- Cá nhân
    INSERT INTO @Data (Code, Name, Total)
    SELECT
        N'Hoa hồng cho cá nhân',
        N'Hoa hồng cá nhân',
        SUM(ISNULL(V.SalePrice, 0) * ISNULL(CV.HHCaNhan, 0) / 100.0)
    FROM [Coffee-Tay-Ho].dbo.Voucher V
    INNER JOIN [Coffee-Tay-Ho].dbo.DMNGUOIBAN NB ON V.SellerId = NB.Id
    LEFT JOIN [Coffee-Tay-Ho].dbo.CHUCVU CV ON NB.ChucVuId = CV.Id
    WHERE V.SellerId IS NOT NULL

    -- Trưởng cửa hàng
    INSERT INTO @Data (Code, Name, Total)
    SELECT
        N'Hoa hồng cho Trưởng cửa hàng',
        N'Hoa hồng Trưởng cửa hàng',
        SUM(ISNULL(V.SalePrice, 0) * ISNULL(CV.HHTruongCuaHang, 0) / 100.0)
    FROM [Coffee-Tay-Ho].dbo.Voucher V
    INNER JOIN [Coffee-Tay-Ho].dbo.DMNGUOIBAN NB ON V.SellerId = NB.Id
    LEFT JOIN [Coffee-Tay-Ho].dbo.CHUCVU CV ON NB.ChucVuId = CV.Id
    WHERE V.SellerId IS NOT NULL

    -- Phó cửa hàng
    INSERT INTO @Data (Code, Name, Total)
    SELECT
        N'Hoa hồng cho Phó cửa hàng',
        N'Hoa hồng Phó cửa hàng',
        SUM(ISNULL(V.SalePrice, 0) * ISNULL(CV.HHPhoCuaHang, 0) / 100.0)
    FROM [Coffee-Tay-Ho].dbo.Voucher V
    INNER JOIN [Coffee-Tay-Ho].dbo.DMNGUOIBAN NB ON V.SellerId = NB.Id
    LEFT JOIN [Coffee-Tay-Ho].dbo.CHUCVU CV ON NB.ChucVuId = CV.Id
    WHERE V.SellerId IS NOT NULL

    -- Quy đổi pha chế
    INSERT INTO @Data (Code, Name, Total)
    SELECT
        N'Hoa hồng cho Quỹ đổi pha chế',
        N'Quỹ đổi pha chế',
        SUM(ISNULL(V.SalePrice, 0) * ISNULL(CV.QuyDoiPhaChe, 0) / 100.0)
    FROM [Coffee-Tay-Ho].dbo.Voucher V
    INNER JOIN [Coffee-Tay-Ho].dbo.DMNGUOIBAN NB ON V.SellerId = NB.Id
    LEFT JOIN [Coffee-Tay-Ho].dbo.CHUCVU CV ON NB.ChucVuId = CV.Id
    WHERE V.SellerId IS NOT NULL

    -- Quỹ chung
    INSERT INTO @Data (Code, Name, Total)
    SELECT
        N'Quỹ chung',
        N'Quỹ chung',
        SUM(ISNULL(V.SalePrice, 0) * ISNULL(CV.QuyChung, 0) / 100.0)
    FROM [Coffee-Tay-Ho].dbo.Voucher V
    INNER JOIN [Coffee-Tay-Ho].dbo.DMNGUOIBAN NB ON V.SellerId = NB.Id
    LEFT JOIN [Coffee-Tay-Ho].dbo.CHUCVU CV ON NB.ChucVuId = CV.Id
    WHERE V.SellerId IS NOT NULL

    -- Kết quả (TOP n loại hoa hồng có giá trị cao nhất)
    SELECT TOP (@p_Count) *
    FROM @Data
    ORDER BY Total DESC;
END
GO
