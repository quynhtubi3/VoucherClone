IF EXISTS (SELECT * FROM sys.objects WHERE name = 'sp_Voucher_GetByListId' AND type = 'P')
    DROP PROCEDURE sp_Voucher_GetByListId;
GO

CREATE PROCEDURE sp_Voucher_GetByListId
    @p_ListId NVARCHAR(MAX) -- Chuỗi Id dạng 'guid1,guid2,...'
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Voucher
    WHERE Id IN (
        SELECT TRY_CAST(value AS UNIQUEIDENTIFIER)
        FROM STRING_SPLIT(@p_ListId, ',')
        WHERE ISNULL(value, '') <> ''
    );
END
GO