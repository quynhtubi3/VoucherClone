
---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'VoucherType_Get')
	DROP PROCEDURE VoucherType_Get
GO

CREATE PROCEDURE VoucherType_Get
(
	@p_Code nvarchar(256) = NULL,
	@p_Name nvarchar(256) = NULL,
	@p_Type	int = NULL,
	@p_DefaultValidityPeriod  int = NULL,
	@p_DefaultPrice	decimal(18,2) = NULL,
	@p_DefaultRealPrice	decimal(18,2) = NULL,
	@p_DefaultNumberOfUse	int = NULL,
	@p_DefaultNumberOfFree	int = NULL,
	@p_PageNumber INT = 1,
    @p_PageSize INT = 10
)
WITH ENCRYPTION
/********************************************************************************
--Routine: VoucherType_Get
--Task: Get record(s) from table VoucherType
--Version: 
--    1.2 25/07/2025  3:15PM:    AnBD        Fixed int condition
********************************************************************************/
AS
BEGIN
	SELECT *
	FROM VoucherType
	WHERE
		(@p_Code IS NULL OR @p_Code = '' OR Code LIKE '%' + @p_Code + '%')
		AND
		(@p_Name IS NULL OR @p_Name = '' OR Name LIKE '%' + @p_Name + '%')
		AND
		(@p_Type IS NULL  OR [Type] = @p_Type)
		AND
		(@p_DefaultValidityPeriod IS NULL OR [DefaultValidityPeriod] = @p_DefaultValidityPeriod)
		AND
		(@p_DefaultPrice IS NULL OR [DefaultPrice] = @p_DefaultPrice)
		AND
		(@p_DefaultRealPrice IS NULL OR [DefaultRealPrice] = @p_DefaultRealPrice)
		AND
		(@p_DefaultNumberOfUse IS NULL OR [DefaultNumberOfUse] = @p_DefaultNumberOfUse)
		AND
		(@p_DefaultNumberOfFree IS NULL OR [DefaultNumberOfFree] = @p_DefaultNumberOfFree)
	ORDER BY CreatedAt DESC
    OFFSET (@p_PageNumber - 1) * @p_PageSize ROWS
    FETCH NEXT @p_PageSize ROWS ONLY;

     -- Lấy tổng số bản ghi (phục vụ tính tổng số trang)
    SELECT COUNT(*) AS TotalCount
    FROM VoucherType
	WHERE
		(@p_Code IS NULL OR @p_Code = '' OR Code LIKE '%' + @p_Code + '%')
		AND
		(@p_Name IS NULL OR @p_Name = '' OR Name LIKE '%' + @p_Name + '%')
		AND
		(@p_Type IS NULL  OR [Type] = @p_Type)
		AND
		(@p_DefaultValidityPeriod IS NULL OR [DefaultValidityPeriod] = @p_DefaultValidityPeriod)
		AND
		(@p_DefaultPrice IS NULL OR [DefaultPrice] = @p_DefaultPrice)
		AND
		(@p_DefaultRealPrice IS NULL OR [DefaultRealPrice] = @p_DefaultRealPrice)
		AND
		(@p_DefaultNumberOfUse IS NULL OR [DefaultNumberOfUse] = @p_DefaultNumberOfUse)
		AND
		(@p_DefaultNumberOfFree IS NULL OR [DefaultNumberOfFree] = @p_DefaultNumberOfFree)
END

