GO

ALTER PROCEDURE UserLuong_GetAll 
	@COQUANID	T_ID


/********************************************************************************
--Routine: UserLuong_GetAll
--Task: Save a record into table UserProfile
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
--20230807
	SELECT distinct UserProfile.Id,
			[HOVATEN] as HoVaTen,
			[PHONGBAN_Id] as PhongBanId,
			--MA-20230612: xử lý như pm cũ
			--DMCOQUANBO.Id as CoQuanId,
			@COQUANID as CoQuanId,
			tblUser.UserName2 as UserName,
			tblUser.Email2 as Email,
			[BAOCAODEN] as BaoCaoDen,
			[NGAYSINH] as NgaySinh,
			[GIOITINH] as GioiTinh,
			[CHUCVU] as ChucVu,
			[CAPBAC] as CapBac,
			[NAMTOTNGHIEP] as NamTotNghiep,
			[DIENTHOAI] as DienThoai,
			[TINHTRANGCONGVIEC] as TinhTrangCongViec,
			[SOCCCD] as SoCCCD,
			[NGAYCAP] as NgayCap,
			[NOICAP] as NoiCap,
			[QUEQUAN] as QueQuan,
			[DIACHIHIENTAI] as DiaChiHienTai,
			[TRUONGHOC] as TruongHoc,
			[NGANHHOC] as NghanhHoc,
			[TRINHDONGOAINGU] as TrinhDoNgoaiNgu,
			[NGAYCHINHTHUCLAMVIEC] as NgayChinhThucLamViec,
			[MASOTHUE] as MaSoThue,
			[SOSOBH] as SoSoBH,
			[BIENSOXE] as BienSoXe,
			[THANHPHANGIADINH] as ThongTinGiaDinh,
			[TINHTRANGHONNHAN] as TinhTrangHonNhan,
			[NGOAINGUKHAC] as NgoaiNguKhac,
			[CHUYENNGANHKHAC] as ChuyenNghanhKhac,
			[HOPDONGHIENTAI] as HopDongHienTai,
			[SOHOPDONGLAODONG] as SoHopDongLaoDong,
			[TUNGAY] as TuNgay,
			[DENNGAY] as DenNgay,
			[SOTAIKHOANLUONG] as SoTaiKhoanLuong,
			[NGUOILIENHE] as NguoiLienHe,
			[DIENTHOAINGUOILIENHE] as DienThoaiNguoiLienHe,
			[QUANHE] as QuanHe,
			[SONGUOIGIAMTRU] as SoNguoiGiamTru,
			[MASONGUOIPHUTHUOC] as MaSoNguoiPhuThuoc,
			[DATIEMVACXIN] as DaTiemVaccine,
			[LOAIVACXIN] as LoaiVaccine,
			DMPHONGBAN.Code as PhongBanCode,
			DMPHONGBAN.[Name] as PhongBanName,
			DMCOQUANBO.[Code] as CoQuanCode,
			DMCOQUANBO.[Name] as CoQuanName,
			TBLS.XEPLOAI as XepLoai,
			TBLS.SOTAIKHOAN as STK,
			TBLS.NGANHANG as NganHang,
			TBLS.LUONG as Luong,
			TBLS.TAMUNG as TamUng,
			TBLS.PCTRACHNHIEM as PCTrachNhiem,
			TBLS.PCANTRUA as PCAnTrua,
			TBLS.PCDIENTHOAI as PCDienThoai,
			TBLS.PCTRANGPHUC as PCTrangPhuc,
			TBLS.PCKHAC as PCKhac,
			TBLS.SONGUOIPHUTHUOC as SoNguoiPhuThuoc,
			TBLS.PCVPP as PCVPP,
			TBLS.GIAMTRUCANHAN as GiamTruCaNhan
	FROM  GroupWareService.dbo.UserList tblUser JOIN [UserProfile] ON tblUser.Id = UserProfile.Id
													LEFT JOIN DMPHONGBAN ON DMPHONGBAN.Id = UserProfile.PHONGBAN_Id
													LEFT JOIN DMCOQUANBO ON DMCOQUANBO.Id = UserProfile.COQUANBO_Id
															LEFT JOIN TBLS ON TBLS.NHANVIENID= tblUser.Id where TBLS.COQUANID = @COQUANID
	--MA-20230609: 
	AND [TINHTRANGCONGVIEC] = 1
END
GO
