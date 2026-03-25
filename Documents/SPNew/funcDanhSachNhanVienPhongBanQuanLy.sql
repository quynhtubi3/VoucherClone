
declare @UserId		T_D256 = '82e10d8b-0cd4-480d-89b2-ff73ec04fcb1'

select NHANVIEN_Id from NHANVIENQUANLY where UserId = @UserId
	union all 
	select @UserId
	union all 
	select UserProfile.Id 
	from PHONGBANQUANLY 	
	inner join UserProfile on UserProfile.PHONGBAN_Id = PHONGBANQUANLY.PHONGBAN_Id 
	where PHONGBANQUANLY.UserId = @UserId