  ---SELECT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'UserLuongThang_GetAll')
	DROP PROCEDURE UserLuongThang_GetAll
GO

CREATE PROCEDURE UserLuongThang_GetAll (
	@COQUANID			T_D256 = NULL,
	@THANG			T_INT = NULL,
	@NAM			T_INT = NULL,
	@SOLAN			T_INT = NULL
)
WITH ENCRYPTION
/********************************************************************************
--Routine: UserLuongThang_GetAll.sql
--Task: Save a record into table UserProfile
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	SELECT distinct UserProfile.Id,
			[HOVATEN] as HoVaTen,
			[PHONGBAN_Id] as PhongBanId,
			DMCOQUANBO.Id as CoQuanId,
			tblUser.UserName2 as UserName,
			tblUser.Email2 as Email,
			[CHUCVU] as ChucVu,
			[CAPBAC] as CapBac,
			DMPHONGBAN.Code as PhongBanCode,
			DMPHONGBAN.[Name] as PhongBanName,
			DMCOQUANBO.[Code] as CoQuanCode,
			DMCOQUANBO.[Name] as CoQuanName,
			SML.XEPLOAI as XepLoai,
			SML.SOTAIKHOAN as STK,
			SML.NGANHANG as NganHang,
			SML.THUCLINH as ThucLinh,
			SML.NGAYCONGTHUCTE as NgayCongThucTe,
			SML.NGAYCONGTIEUCHUAN as NgayCongTieuChuan,

			SML.DIEUCHINHTRUOCTHUE1 as DieuChinhTruocThue1,
			SML.DIEUCHINHTRUOCTHUE2 as DieuChinhTruocThue2,
			SML.DIEUCHINHSAUTHUE1 as DieuChinhSauThue1,
			SML.DIEUCHINHSAUTHUE2 as DieuChinhSauThue2,

			SML.GHICHUCANHAN as GhiChuCaNhan,

			SML.TAMUNG as TamUng,
			SML.LUONG as Luong,

			SML.PCTRACHNHIEM as PCTrachNhiem,
			SML.PCANTRUA as PCAnTrua,
			SML.PCDIENTHOAI as PCDienThoai,
			SML.PCVPP as PCVPP,
			SML.PCTRANGPHUC as PCTrangPhuc,
			SML.PCKHAC as PCKhac,

			SML.GIAMTRUCANHAN as GiamTruCaNhan,
			SML.GIAMTRUGIACANH as GiamTruCaNhan,

			SML.TONGTHUNHAPCHIUTHUE as TongThuNhapChiuThue,

			SML.THUETNCN as ThueTNCN,

			SML.THUCLINH as ThucLinh,
			SML.CHILUONGPHUCAP as ChiLuongPhuCap,
			SML.CHIBAOHIEM as ChiBaoHiem,
			SML.TONGCHIPHINHANSU as TongChiPhiNhanSu,
			SML.QUYLUONGBHXH as QuyLuongBHXH,



			SML.SONGUOIPHUTHUOC as SoNguoiPhuThuoc,

			SML.BHXH as BHXH,
			SML.BHYT as BHYT,
			SML.BHTN as BHTN,
			SML.CONGDOAN as CONGDOAN

		FROM  GroupWareService.dbo.UserList tblUser LEFT JOIN [UserProfile] ON tblUser.Id = UserProfile.Id
		LEFT JOIN DMPHONGBAN ON DMPHONGBAN.Id = UserProfile.PHONGBAN_Id
		LEFT JOIN DMCOQUANBO ON DMCOQUANBO.Id = UserProfile.COQUANBO_Id
		LEFT JOIN SML ON SML.NHANVIENID= tblUser.Id where SML.COQUANID = @COQUANID
		and SML.THANG = @THANG and SML.NAM = @NAM and SML.SOLANTRONGTHANG = @SOLAN
END
