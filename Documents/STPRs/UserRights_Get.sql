---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'UserRights_Get')
	DROP PROCEDURE UserRights_Get
GO


CREATE PROCEDURE UserRights_Get
(
	@p_RoleId		T_ID,
	@p_UserId		T_ID,
	@p_FuncId		T_ID,
	@p_FuncType		T_D001,
	@p_Right_1		T_BIT = 1		OUTPUT,
	@p_Right_2		T_BIT = 1		OUTPUT,
	@p_Right_3		T_BIT = 1		OUTPUT,
	@p_Right_4		T_BIT = 1		OUTPUT,
	@p_Right_5		T_BIT = 1		OUTPUT
) WITH ENCRYPTION
/********************************************************************************
--Routine: UserRights_Get
--Task: Get record(s) from table UserRights
--Version: 
--    1.0 Oct 14 2020  8:04AM:    NVTAM        Created
********************************************************************************/
AS
BEGIN
	IF @p_UserId IS NULL --Phân quyền theo nhóm người dùng
	BEGIN
		SELECT
				@p_Right_1 = Right_1,
				@p_Right_2 = Right_2,
				@p_Right_3 = Right_3,
				@p_Right_4 = Right_4,
				@p_Right_5 = Right_5
			FROM UserRights 		
			WHERE UserId = @p_RoleId AND FuncType = @p_FuncType AND FuncId = @p_FuncId AND IsUser = 0
	END
	ELSE --Phân quyền theo người dùng
	BEGIN
		--Nếu bị cấm quyền theo nhóm người dùng thì không được thay đổi khi phân quyền theo người dùng
		--Theo nhóm người dùng
		SELECT
				@p_Right_1 = Right_1,
				@p_Right_2 = Right_2,
				@p_Right_3 = Right_3,
				@p_Right_4 = Right_4,
				@p_Right_5 = Right_5
			FROM UserRights 		
			WHERE UserId = @p_RoleId AND FuncType = @p_FuncType AND FuncId = @p_FuncId AND IsUser = 0

		--Theo người dùng
		IF @@ROWCOUNT = 0
		BEGIN
			SELECT
					@p_Right_1 = Right_1,
					@p_Right_2 = Right_2,
					@p_Right_3 = Right_3,
					@p_Right_4 = Right_4,
					@p_Right_5 = Right_5
				FROM UserRights 		
				WHERE UserId = @p_UserId AND FuncType = @p_FuncType AND FuncId = @p_FuncId AND IsUser = 1
		END
	END

	SELECT
			@p_Right_1 = ISNULL(@p_Right_1, 1),
			@p_Right_2 = ISNULL(@p_Right_2, 1),
			@p_Right_3 = ISNULL(@p_Right_3, 1),
			@p_Right_4 = ISNULL(@p_Right_4, 1),
			@p_Right_5 = ISNULL(@p_Right_5, 1)
END
