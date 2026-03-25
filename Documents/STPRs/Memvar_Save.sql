---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'Memvar_Save')
	DROP PROCEDURE Memvar_Save
GO


CREATE PROCEDURE Memvar_Save
(    @p_Var_Name	    T_D032,
	@p_Var_Value	T_D256 = NULL) WITH ENCRYPTION
/********************************************************************************
--Routine: Memvar_Save
--Task: Save a record into table Memvar
--Version: 
--    1.0 Jul  6 2004 11:09AM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	IF @p_Var_Value IS NULL
		SET @p_Var_Value = ''

	IF EXISTS(SELECT * FROM Memvar WHERE Var_Name = @p_Var_Name)
	BEGIN
		UPDATE Memvar SET			Var_Value	 = @p_Var_Value		WHERE Var_Name = @p_Var_Name
	 	END
	ELSE
	BEGIN
		INSERT INTO Memvar			(
				Var_Name,
				Var_Value			)		VALUES			(
				@p_Var_Name,				@p_Var_Value			)
	END
	RETURN 1
END
