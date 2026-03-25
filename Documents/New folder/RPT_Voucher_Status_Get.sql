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