---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'UserRights_GetAll')
	DROP PROCEDURE UserRights_GetAll
GO


CREATE PROCEDURE UserRights_GetAll
(
	@p_RoleId		T_ID = NULL,
	@p_UserId		T_ID = NULL
) WITH ENCRYPTION
/********************************************************************************
--Routine: UserRights_GetAll
--Task: Get record(s) from table UserRights
--Version: 
--    1.0 Oct 14 2020  8:04AM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	DECLARE @TEMP TABLE (Id T_ID, ParentId T_ID NULL, [Name] T_D256 NULL, IsEnabled1 T_BIT DEFAULT 1, IsEnabled2 T_BIT DEFAULT 1,
		IsEnabled3 T_BIT DEFAULT 1, IsEnabled4 T_BIT DEFAULT 1, IsEnabled5 T_BIT DEFAULT 1, IsDeny T_BIT DEFAULT 0, 
		Right_1 T_BIT DEFAULT 1, Right_2 T_BIT DEFAULT 1, Right_3 T_BIT DEFAULT 1, Right_4 T_BIT DEFAULT 1, Right_5 T_BIT DEFAULT 1,IsContract T_BIT DEFAULT 1,OrderId T_INT NULL)

	INSERT INTO @TEMP (Id, ParentId, [Name],OrderId)
	SELECT Id, ParentId, Bar, OrderId FROM Menu WHERE IsContract = 1

	IF @p_UserId IS NULL --Phân quyền theo nhóm người dùng
	BEGIN
		UPDATE @TEMP SET
			Right_1 = b.Right_1, Right_2 = b.Right_2, Right_3 = b.Right_3, Right_4 = b.Right_4, Right_5 = b.Right_5
		FROM @TEMP a JOIN
			(
				SELECT DISTINCT
						FuncId AS Id, Right_1, Right_2, Right_3, Right_4, Right_5
					FROM UserRights
					WHERE UserId = @p_RoleId AND IsUser = 0
			) b ON a.Id = b.Id
	END
	ELSE --Phân quyền theo người dùng
	BEGIN
		--Nếu bị cấm quyền theo nhóm người dùng thì không được thay đổi khi phân quyền theo người dùng
		UPDATE @TEMP SET
			Right_1 = b.Right_1, Right_2 = b.Right_2, Right_3 = b.Right_3, Right_4 = b.Right_4, Right_5 = b.Right_5,
			IsEnabled1 = b.Right_1, IsEnabled2 = b.Right_2, IsEnabled3 = b.Right_3, IsEnabled4 = b.Right_4, IsEnabled5 = b.Right_5
		FROM @TEMP a JOIN
			(
				SELECT DISTINCT
						FuncId AS Id, Right_1, Right_2, Right_3, Right_4, Right_5
					FROM UserRights
					WHERE UserId = @p_RoleId AND IsUser = 0
			) b ON a.Id = b.Id

		UPDATE @TEMP SET
			Right_1 = CASE WHEN a.Right_1 = 0 THEN 0 ELSE b.Right_1 END, Right_2 = CASE WHEN a.Right_2 = 0 THEN 0 ELSE b.Right_2 END, Right_3 = CASE WHEN a.Right_3 = 0 THEN 0 ELSE b.Right_3 END,
			Right_4 = CASE WHEN a.Right_4 = 0 THEN 0 ELSE b.Right_4 END, Right_5 = CASE WHEN a.Right_5 = 0 THEN 0 ELSE b.Right_5 END
		FROM @TEMP a JOIN
			(
				SELECT DISTINCT
						FuncId AS Id, Right_1, Right_2, Right_3, Right_4, Right_5
					FROM UserRights
					WHERE UserId = @p_UserId AND IsUser = 1
			) b ON a.Id = b.Id
	END

	SELECT * FROM @TEMP ORDER BY OrderId
END
