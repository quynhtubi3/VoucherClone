ALTER PROCEDURE DMPHONGBAN_GetSoLuongNhanVien

	@PHONGBAN_Id			T_D256

AS
BEGIN
--20230802

	DECLARE @SQLString NVARCHAR(MAX)
	SET @SQLString =' select a.Id, a.Name, COUNT(b.Id) as SoLuongNhanVien'
	
	SET @SQLString = @SQLString + ' from DMPHONGBAN a'
	SET @SQLString = @SQLString + ' join UserProfile b on a.Id = b.PHONGBAN_Id'
	SET @SQLString = @SQLString + ' join GroupWareService.dbo.UserList c on b.Id = c.Id'
	SET @SQLString = @SQLString + ' where c.LockoutEnd is null and c.FullName like N''% %'''
	
	IF @PHONGBAN_Id is not null and @PHONGBAN_Id != '' 
	BEGIN
		SET @SQLString = @SQLString + ' and a.Id = ''' + @PHONGBAN_Id + ''''
	END
	
	SET @SQLString = @SQLString + ' group by a.Id, a.Name'
	SET @SQLString = @SQLString + ' order by a.Name'

	EXECUTE sp_executesql @SQLString
	

END

