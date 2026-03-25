  ---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'SML_GetDetail')
	DROP PROCEDURE SML_GetDetail
GO

CREATE PROCEDURE SML_GetDetail
(
	@NHANVIENID			T_D256 = NULL,
	@COQUANID			T_D256 = NULL,
	@THANG			T_INT = NULL,
	@NAM			T_INT = NULL,
	@SOLAN			T_INT = NULL
) WITH ENCRYPTION
/********************************************************************************
--Routine: SML_GetDetail
--Task: Save a record into table SML
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	select
	UserProfile.HOVATEN as HoVaTen,
	tblUser.Email2 as Email,
	SML.LUONG as Luong, SML.XEPLOAI as XepLoai, SML.THUONGHIEUQUA as ThuongHieuQua, SML.PCTRACHNHIEM as PCTrachNhiem,
	SML.PCANTRUA as PCAnTrua, SML.PCDIENTHOAI as PCDienThoai,SML.PCTRANGPHUC as PCTrangPhuc, SML.PCVPP as PCVPP, SML.PCKHAC as PCKhac,
	SML.GIAMTRUGIACANH as GiamTruGiaCanh, SML.SONGUOIPHUTHUOC as SoNguoiPhuThuoc,
	SML.CONGDOAN as CongDoan, SML.THUETNCN as ThueTNCN,
	SML.GHICHUCANHAN as GhiChu,
	SML.DIEUCHINHTRUOCTHUE1 as DieuChinhTruocThue1,
	SML.DIEUCHINHTRUOCTHUE2 as DieuChinhTruocThue2,
	SML.DIEUCHINHSAUTHUE1 as DieuChinhSauThue1,
	SML.DIEUCHINHSAUTHUE2 as DieuChinhSauThue2,
	SML.BHXH as BHXH,
	SML.BHYT as BHYT,
	SML.BHTN as BHTN,
	SML.CONGDOAN as CongDoan,
	SML.THUETNCN as ThueTNCN,
	SML.THUCLINH as ThucLinh
--	(coalesce(DIEUCHINHTRUOCTHUE1 ,0) + coalesce(DIEUCHINHTRUOCTHUE2 ,0) + coalesce(DIEUCHINHTRUOCTHUE3 ,0)) as DieuChinhTruocThue,
--		(coalesce(DIEUCHINHSAUTHUE1 ,0) + coalesce(DIEUCHINHSAUTHUE2,0) + coalesce(DIEUCHINHSAUTHUE3,0)) as DieuChinhSauThue,
--		(coalesce(BHXH ,0) + coalesce(BHYT ,0) + coalesce(BHTN ,0)) as BaoHiem,
--		(coalesce(Luong ,0) + coalesce(ThuongHieuQua ,0) + coalesce(PCTrachNhiem ,0) + coalesce(PCAnTrua ,0) + coalesce(PCDienThoai ,0) + coalesce(PCTrangPhuc ,0) + coalesce(PCVPP ,0)
--		+ coalesce(PCKhac ,0) + (coalesce(DIEUCHINHTRUOCTHUE1 ,0) + coalesce(DIEUCHINHTRUOCTHUE2 ,0) + coalesce(DIEUCHINHTRUOCTHUE3 ,0))
--		+ (coalesce(DIEUCHINHSAUTHUE1 ,0) + coalesce(DIEUCHINHSAUTHUE2,0) + coalesce(DIEUCHINHSAUTHUE3,0))
--		- (coalesce(BHXH ,0) + coalesce(BHYT ,0) + coalesce(BHTN ,0))
--		- coalesce(CongDoan ,0) + coalesce(ThueTNCN ,0)) as ThucLinh
	from SML
	inner join  GroupWareService.dbo.UserList tblUser on tblUser.Id = SML.NHANVIENID
	inner join UserProfile on UserProfile.Id = SML.NHANVIENID 

	inner join DMCOQUANBO on DMCOQUANBO.Id = SML.COQUANID 
	where 1=1 and SML.THANG = @THANG and SML.NAM = @NAM and SML.SOLANTRONGTHANG = @SOLAN and SML.COQUANID = @COQUANID and SML.NHANVIENID = @NHANVIENID
END


