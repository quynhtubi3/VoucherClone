IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'funcDanhSachNhanVienPhongBanQuanLy')
	DROP FUNCTION funcDanhSachNhanVienPhongBanQuanLy
GO

CREATE FUNCTION funcDanhSachNhanVienPhongBanQuanLy(@UserId		T_D256)
RETURNS TABLE
AS
RETURN
(
	select distinct * from
	(
    select NHANVIEN_Id from NHANVIENQUANLY where UserId = @UserId
	union all 
	select @UserId
	union all 
	select UserProfile.Id 
	from PHONGBANQUANLY 	
	inner join UserProfile on UserProfile.PHONGBAN_Id = PHONGBANQUANLY.PHONGBAN_Id 
	where PHONGBANQUANLY.UserId = @UserId
	) as T
)