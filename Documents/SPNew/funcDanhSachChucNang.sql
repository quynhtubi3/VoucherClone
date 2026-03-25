IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'funcDanhSachChucNang')
	DROP FUNCTION funcDanhSachChucNang
GO

CREATE FUNCTION funcDanhSachChucNang(@p_RoleId		T_ID)
RETURNS nvarchar(4000)
AS
BEGIN
	DECLARE @TEMP TABLE (Id T_ID, ParentId T_ID NULL, [Name] T_D256 NULL, IsEnabled1 T_BIT DEFAULT 1, IsEnabled2 T_BIT DEFAULT 1,
		IsEnabled3 T_BIT DEFAULT 1, IsEnabled4 T_BIT DEFAULT 1, IsEnabled5 T_BIT DEFAULT 1, IsDeny T_BIT DEFAULT 0, 
		Right_1 T_BIT DEFAULT 1, Right_2 T_BIT DEFAULT 1, Right_3 T_BIT DEFAULT 1, Right_4 T_BIT DEFAULT 1, Right_5 T_BIT DEFAULT 1,IsContract T_BIT DEFAULT 1,OrderId T_INT NULL)

	INSERT INTO @TEMP (Id, ParentId, [Name],OrderId)
	SELECT Id, ParentId, Bar, OrderId FROM Menu WHERE IsContract = 1

	UPDATE @TEMP SET
			Right_1 = b.Right_1, Right_2 = b.Right_2, Right_3 = b.Right_3, Right_4 = b.Right_4, Right_5 = b.Right_5
		FROM @TEMP a JOIN
			(
				SELECT DISTINCT
						FuncId AS Id, Right_1, Right_2, Right_3, Right_4, Right_5
					FROM UserRights
					WHERE UserId = @p_RoleId AND IsUser = 0
			) b ON a.Id = b.Id


			declare @s nvarchar(4000) = ''

	SELECT @s = @s  + ',' + CONVERT(nvarchar(255), b.Name)
from @TEMP b
where b.Right_1 = 1
order by b.Name


return @s

END