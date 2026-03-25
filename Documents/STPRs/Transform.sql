---TRANSFORM FUNCTION---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'Transform')
	DROP FUNCTION Transform
GO


CREATE FUNCTION dbo.Transform
(
    @p_Number		DECIMAL(20),
	@p_Format		VARCHAR(22))
RETURNS VARCHAR(20) WITH ENCRYPTION

AS
BEGIN
	IF LEFT(@p_Format, 1) NOT IN ('Z', 'L')
		RETURN ''

	DECLARE @v_String		NVARCHAR(20)

	IF UPPER(LEFT(@p_Format, 1)) = 'Z'
	BEGIN
		SET @v_String = RTRIM(LTRIM(CONVERT(VARCHAR(20), @p_Number)))

		IF LEN(@v_String) < LEN(@p_Format) - 2
			SET @v_String = REPLICATE(' ', LEN(@p_Format) - 2 - LEN(@v_String)) + @v_String
	END
	ELSE
	BEGIN
		SET @v_String = RTRIM(LTRIM(CONVERT(VARCHAR(20), @p_Number)))
		
		IF LEN(@v_String) < LEN(@p_Format) - 2
			SET @v_String = REPLICATE('0', LEN(@p_Format) - 2 - LEN(@v_String)) + @v_String
	END

	RETURN @v_String
END