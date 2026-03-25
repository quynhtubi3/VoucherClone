---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'Memvar_One_Get')
	DROP PROCEDURE Memvar_One_Get
GO


CREATE PROCEDURE Memvar_One_Get
(
	@p_Var_Name		T_D032,
	@p_Var_Value	T_D256		OUTPUT
)
WITH ENCRYPTION
/********************************************************************************
--Routine: Memvar_One_Get
--Task: Get record(s) from table Memvar
--Version: 
--    1.0 Jul  5 2004  2:21PM:    NVTAM        Created
********************************************************************************/
AS
BEGIN
	SELECT
			@p_Var_Value = ISNULL(Var_Value, '')
		FROM Memvar
		WHERE Var_Name = @p_Var_Name

	SET @p_Var_Value = ISNULL(@p_Var_Value, '')END
