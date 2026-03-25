---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'UserRights_Save')
	DROP PROCEDURE UserRights_Save
GO


CREATE PROCEDURE UserRights_Save
(
	@p_IsUser		T_BIT,
	@p_UserId		T_ID,
	@p_FuncType		T_D001,
	@p_FuncId		T_ID,
	@p_Right_1		T_BIT = NULL,	@p_Right_2		T_BIT = NULL,	@p_Right_3		T_BIT = NULL,	@p_Right_4		T_BIT = NULL,
	@p_Right_5		T_BIT = NULL,
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
	IF EXISTS(SELECT * FROM UserRights WHERE IsUser = @p_IsUser AND UserID = @p_UserId AND FuncType = @p_FuncType AND
			FuncId = @p_FuncId)
	BEGIN
		UPDATE UserRights SET
			Right_1 = @p_Right_1,
			Right_2 = @p_Right_2,
			Right_3 = @p_Right_3,
			Right_4 = @p_Right_4,
			Right_5 = @p_Right_5
		WHERE IsUser = @p_IsUser AND UserID = @p_UserId AND FuncType = @p_FuncType AND FuncId = @p_FuncId
	END
	ELSE
	BEGIN
		INSERT INTO UserRights
			(
				UserID,
				FuncType,
				FuncId,
				Right_1,
				Right_2,
				Right_3,
				Right_4,
				Right_5,
				IsUser
			)
		VALUES
			(
				@p_UserId,
				@p_FuncType,
				@p_FuncId,
				@p_Right_1,
				@p_Right_2,
				@p_Right_3,
				@p_Right_4,
				@p_Right_5,
				@p_IsUser
			)
	END

	SET @p_Result = 1
	RETURN 1
END
