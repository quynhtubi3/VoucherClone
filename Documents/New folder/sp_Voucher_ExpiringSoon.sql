IF EXISTS (SELECT * FROM sys.objects WHERE name = 'sp_Voucher_ExpiringSoon' AND type = 'P')
    DROP PROCEDURE sp_Voucher_ExpiringSoon;
GO 

CREATE PROCEDURE sp_Voucher_ExpiringSoon
    @p_week       INT = 2,   -- số tuần cần kiểm tra sắp hết hạn
    @p_PageNumber INT = 1,   -- số trang
    @p_PageSize   INT = 20   -- số bản ghi mỗi trang
AS
BEGIN
    SET NOCOUNT ON;

    -- Đưa kết quả vào bảng tạm để dễ phân trang + đếm
    SELECT 
        v.*
    INTO #ExpiringSoon
    FROM Voucher v
    WHERE v.ActivationDate IS NOT NULL 
      AND v.ExpiryDate BETWEEN GETDATE() AND DATEADD(DAY, @p_week * 7, GETDATE());

 
    -- Recordset 2: Danh sách phân trang
    SELECT *
    FROM #ExpiringSoon
    ORDER BY ExpiryDate
    OFFSET (@p_PageNumber - 1) * @p_PageSize ROWS
    FETCH NEXT @p_PageSize ROWS ONLY;
    
       -- Recordset 1: Tổng số voucher sắp hết hạn
    SELECT COUNT(*) AS TotalCount
    FROM #ExpiringSoon;

END
GO
