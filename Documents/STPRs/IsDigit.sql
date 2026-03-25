---TRANSFORM FUNCTION---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'IsDigit')
	DROP FUNCTION IsDigit
GO


CREATE FUNCTION dbo.IsDigit
(
	@p_Char		NCHAR(1)
)
RETURNS T_BIT
/********************************************************************************
--Routine: IsDigit
--Task: Save a record into table DmNhMh
--Version: 
--    1.0 Jul  5 2004  4:32PM:    NVTAM        Created
********************************************************************************/
AS
BEGIN
	DECLARE @v_Result		T_BIT
	SET @v_Result = 0

	IF ASCII(@p_Char) BETWEEN 48 AND 57
		SET @v_Result = 1

	RETURN @v_Result
END