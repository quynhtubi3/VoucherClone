---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'UserRights_Delete')
	DROP PROCEDURE UserRights_Delete
GO


CREATE PROCEDURE UserRights_Delete
(
	@p_IsUser		T_BIT,
	@p_UserId		T_ID,
	@p_FuncType		T_D001,
	@p_FuncId		T_ID,
	@p_Result		SMALLINT	OUTPUT
) WITH ENCRYPTION
/********************************************************************************
--Routine: UserRights_Save
--Task: Save a record into table UserRights
--Version: 
--    1.0 Aug 26 2004  9:57AM:    NVTAM        Created
********************************************************************************/
AS
BEGIN
	DELETE FROM UserRights WHERE IsUser = @p_IsUser AND UserID = @p_UserId AND FuncType = @p_FuncType AND FuncId = @p_FuncId

	SET @p_Result = 1
	RETURN 1
END
