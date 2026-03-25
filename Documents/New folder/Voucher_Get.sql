

IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'Voucher_Get')
    DROP PROCEDURE Voucher_Get
GO

CREATE PROCEDURE Voucher_Get
(
    @p_Serial nvarchar(256) = NULL,
    @p_VoucherType int = NULL,
    @p_ValidityPeriod int = NULL,
    @p_DateFrom datetime = NULL,
    @p_DateTo datetime = NULL,
    @p_SellerId uniqueidentifier = NULL,
    @p_NumberOfUse int = NULL,
    @p_NumberOfFree int = NULL,
    @p_PageNumber INT = 1,
    @p_PageSize INT = 10
)
WITH ENCRYPTION
AS
BEGIN
    SET NOCOUNT ON;

    -- Lấy dữ liệu có phân trang
    SELECT *
    FROM Voucher
    WHERE
        (@p_Serial IS NULL OR @p_Serial = '' OR Serial LIKE '%' + @p_Serial + '%')
        AND (@p_VoucherType IS NULL  OR [VoucherType] = @p_VoucherType)
        AND (@p_ValidityPeriod IS NULL OR [ValidityPeriod] = @p_ValidityPeriod)
        AND (@p_SellerId IS NULL OR SellerId = @p_SellerId)
        AND (@p_DateFrom IS NULL OR CreatedAt >= @p_DateFrom)
        AND (@p_DateTo IS NULL OR CreatedAt <= @p_DateTo)
        AND (@p_NumberOfUse IS NULL OR [NumberOfUse] = @p_NumberOfUse)
        AND (@p_NumberOfFree IS NULL OR [NumberOfFree] = @p_NumberOfFree)
    ORDER BY CreatedAt DESC
    OFFSET (@p_PageNumber - 1) * @p_PageSize ROWS
    FETCH NEXT @p_PageSize ROWS ONLY;

    -- Lấy tổng số bản ghi (phục vụ tính tổng số trang)
    SELECT COUNT(*) AS TotalCount
    FROM Voucher
    WHERE
        (@p_Serial IS NULL OR @p_Serial = '' OR Serial LIKE '%' + @p_Serial + '%')
        AND (@p_VoucherType IS NULL  OR [VoucherType] = @p_VoucherType)
        AND (@p_ValidityPeriod IS NULL OR [ValidityPeriod] = @p_ValidityPeriod)
        AND (@p_SellerId IS NULL OR SellerId = @p_SellerId)
        AND (@p_DateFrom IS NULL OR CreatedAt >= @p_DateFrom)
        AND (@p_DateTo IS NULL OR CreatedAt <= @p_DateTo)
        AND (@p_NumberOfUse IS NULL OR [NumberOfUse] = @p_NumberOfUse)
        AND (@p_NumberOfFree IS NULL OR [NumberOfFree] = @p_NumberOfFree);
END
GO
