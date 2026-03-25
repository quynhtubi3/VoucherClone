GO
ALTER PROCEDURE QTNHATKYHETHONG_Get
(
    @user_name  T_D256 = NULL,
    @tu_ngay    T_D256,
    @den_ngay   T_D256,
    @chuc_nang  T_D256 = NULL,
    @PageNumber INT = 1,
    @PageSize   INT = 10
)
/********************************************************************************
--Routine: QTNHATKYHETHONG_Get
--Task: Get record(s) from table NHATKYHETHONG with pagination
--Version: 
--    1.1 Aug 22 2025  AnBD   Added paging + TotalCount
********************************************************************************/
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @SQLString NVARCHAR(MAX);

    -- Base query
    SET @SQLString = '
        SELECT tblnhatky.Id,
               tblnhatky.User_Id AS UserId,
               tblnguoidung.UserName2 AS UserName,
               tblnhatky.CHUCNANG AS ChucNang,
               tblnhatky.HANHDONG AS HanhDong,
               tblnhatky.THOIGIAN AS ThoiGian
        FROM NHATKYHETHONG tblnhatky
        JOIN [3TVoucher].dbo.UserList tblnguoidung
             ON tblnhatky.User_Id = tblnguoidung.Id
        WHERE FORMAT(tblnhatky.THOIGIAN, ''yyyy/MM/dd'')
              BETWEEN ''' + @tu_ngay + ''' AND ''' + @den_ngay + '''';

    -- Filter điều kiện động
    IF @user_name IS NOT NULL AND @user_name <> ''
        SET @SQLString += ' AND tblnguoidung.Id = ''' + @user_name + '''';

    IF @chuc_nang IS NOT NULL AND @chuc_nang <> ''
        SET @SQLString += ' AND tblnhatky.CHUCNANG = N''' + @chuc_nang + '''';

    -- Order + phân trang
    SET @SQLString += '
        ORDER BY tblnhatky.THOIGIAN DESC
        OFFSET (' + CAST(@PageNumber-1 AS VARCHAR) + ' * ' + CAST(@PageSize AS VARCHAR) + ') ROWS
        FETCH NEXT ' + CAST(@PageSize AS VARCHAR) + ' ROWS ONLY;';

    -- Query lấy TotalCount
    SET @SQLString += '
        SELECT COUNT(*) AS TotalCount
        FROM NHATKYHETHONG tblnhatky
        JOIN [3TVoucher].dbo.UserList tblnguoidung
             ON tblnhatky.User_Id = tblnguoidung.Id
        WHERE FORMAT(tblnhatky.THOIGIAN, ''yyyy/MM/dd'')
              BETWEEN ''' + @tu_ngay + ''' AND ''' + @den_ngay + '''';

    IF @user_name IS NOT NULL AND @user_name <> ''
        SET @SQLString += ' AND tblnguoidung.Id = ''' + @user_name + '''';

    IF @chuc_nang IS NOT NULL AND @chuc_nang <> ''
        SET @SQLString += ' AND tblnhatky.CHUCNANG = N''' + @chuc_nang + '''';

    -- Thực thi
    EXEC sp_executesql @SQLString;
END
GO



























GO

ALTER PROCEDURE QTNHATKYHETHONG_Get

	@user_name T_D256 = NULL,
	@tu_ngay T_D256,
	@den_ngay T_D256,
	@chuc_nang T_D256 = NULL,
	@PageSize int = NULL,
	@PageNumber int = NULL

/********************************************************************************
--Routine: QTNHATKYHETHONG_Get
--Task: Get record(s) from table NHATKYHETHONG
--Version: 
--    1.0 Mar 27 2022  2:14PM:    HAINP        Created
********************************************************************************/
AS
BEGIN
--20230927
	DECLARE @SQLString NVARCHAR(MAX)
	DECLARE @FromDate NVARCHAR(MAX)
	DECLARE @ToDate NVARCHAR(MAX)

	SET @SQLString = 'select tblnhatky.Id, tblnhatky.User_Id as UserId, tblnguoidung.UserName2 as UserName, tblnhatky.CHUCNANG as ChucNang, '
	SET @SQLString = @SQLString + ' tblnhatky.HANHDONG as HanhDong, tblnhatky.THOIGIAN as ThoiGian from NHATKYHETHONG tblnhatky, [3TVoucher].dbo.UserList tblnguoidung ' 
	SET @SQLString = @SQLString + ' where tblnhatky.User_Id = tblnguoidung.Id and FORMAT(tblnhatky.THOIGIAN, ''yyyy/MM/dd'') between ''' + @tu_ngay + ''' and ''' + @den_ngay + ''''
		
	IF @user_name is not NULL and @user_name != ''
	BEGIN
		SET @SQLString = @SQLString + ' and tblnguoidung.Id = ''' + @user_name + ''''
	END

	IF @chuc_nang is not NULL and @chuc_nang != ''
	BEGIN
		SET @SQLString = @SQLString + ' and tblnhatky.CHUCNANG = N''' + @chuc_nang + ''''
	END

	SET @SQLString = @SQLString + ' ORDER BY THOIGIAN DESC'

	IF @PageSize is not null and @PageNumber is not null
	BEGIN
		SET @SQLString = @SQLString + ' OFFSET ' + Convert(varchar(20), @PageNumber * @PageSize) + ' ROWS FETCH NEXT ' + Convert(varchar(20), @PageSize) + ' ROWS ONLY '
	END

	--print @SQLString
	EXECUTE sp_executesql @SQLString

END
GO