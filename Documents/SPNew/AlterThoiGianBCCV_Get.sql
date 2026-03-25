ALTER PROCEDURE ThoiGianBCCV_Get

	@MaNguoiDung		T_D256,
	@NguoiDuyet			T_D256,
	@tu_ngay			T_D256,
	@den_ngay			T_D256,
	@TrangThai			T_D256,
	@DUAN_Id			T_D256 = NULL,
	@CurrentUserID	T_ID = NULL

/********************************************************************************
--Routine: BCCONGVIEC_Get
--Task: Get record(s) from table BAOCAOCHITIET
--Version: 
--    1.0 Mar 27 2022  2:14PM:    HAINP        Created
********************************************************************************/
AS
BEGIN
--20240425

	DECLARE @SQLString NVARCHAR(MAX)
	SET @SQLString = 'select tblBaoCao.Id,NhanXetChung,tblBaoCao.TRANGTHAI_Id as TrangThai,tblDmPhongBan.[Name] as TenPhongBan,'
	SET @SQLString = @SQLString + ' ND1.FullName as NguoiGui, ND2.FullName as NguoiDuyet, ' 
	SET @SQLString = @SQLString + ' tblBaoCao.[NGAYBAOCAO] as NgayBaoCao, '
	SET @SQLString = @SQLString + ' tblBaoCao.THOIGIANGUIBAOCAO as ThoiGianGuiBaoCao, '
	SET @SQLString = @SQLString + ' tblBaoCao.THOIGIANDUYETBAOCAO as ThoiGianDuyetBaoCao '
	SET @SQLString = @SQLString + ' , COALESCE(sum(bcct.TrongGio),0) as TrongGio'
	SET @SQLString = @SQLString + ' , COALESCE(sum(bcct.CHIPHITRONGGIO),0) as ChiPhiTrongGio'
	SET @SQLString = @SQLString + ' , COALESCE(sum(bcct.NgoaiGio),0) as NgoaiGio'
	SET @SQLString = @SQLString + ' , COALESCE(sum(bcct.CHIPHINGOAIGIO),0) as ChiPhiNgoaiGio'
	SET @SQLString = @SQLString + ' , COALESCE(sum(bcct.TONGCHIPHI),0) as TongChiPhi'
	--Cham
	--SET @SQLString = @SQLString + ' , (SELECT STUFF((SELECT '','' + TENCONGVIEC FROM BAOCAOCHITIET tblBaoCaoChiTiet where tblBaoCaoChiTiet.BAOCAO_Id = tblBaoCao.Id FOR XML PATH ('''')), 1, 1, '''')) as TenCongViec '
	SET @SQLString = @SQLString + ' , tblBaoCao.CreatedAt,tblBaoCao.CreatedBy,tblBaoCao.ModifiedAt,tblBaoCao.ModifiedBy '
	SET @SQLString = @SQLString + ' , tblBaoCao.NGUOIPHEDUYET_Id, ND2.Email2 EmailNguoiDuyet '
	SET @SQLString = @SQLString + ' from BAOCAO tblBaoCao '

	SET @SQLString = @SQLString + ' join BAOCAOCHITIET bcct on tblBaoCao.Id = bcct.BAOCAO_Id '

	SET @SQLString = @SQLString + ' LEFT JOIN DMPHONGBAN tblDmPhongBan ON tblDmPhongBan.id= tblBaoCao. PHONGBAN_Id '
	SET @SQLString = @SQLString + ' LEFT JOIN GroupWareService.dbo.UserList ND1 ON ND1.Id = tblBaoCao.NGUOIBAOCAO_Id '
	SET @SQLString = @SQLString + ' LEFT JOIN GroupWareService.dbo.UserList ND2 ON ND2.Id = tblBaoCao.NGUOIPHEDUYET_Id'
	SET @SQLString = @SQLString + ' WHERE FORMAT(tblBaoCao.NGAYBAOCAO, ''yyyy/MM/dd'') between ''' + @tu_ngay + ''' and ''' + @den_ngay + ''''	
	
	IF (@MaNguoiDung is not null and @MaNguoiDung != '')
	BEGIN
		SET @SQLString = @SQLString + ' and tblBaoCao.NGUOIBAOCAO_Id = ''' + @MaNguoiDung + ''''
	END

	IF (@NguoiDuyet is not null and @NguoiDuyet != '')
	BEGIN
		SET @SQLString = @SQLString + ' and tblBaoCao.NGUOIPHEDUYET_Id  = ''' + @NguoiDuyet + ''''
	END

	IF (@TrangThai is not null and @TrangThai != '' and @TrangThai != '0' )
	BEGIN
		SET @SQLString = @SQLString + ' AND tblBaoCao.TRANGTHAI_Id = ''' + @TrangThai + ''''
	END

	IF (@DUAN_Id is not null and @DUAN_Id != '')
	BEGIN
		SET @SQLString = @SQLString + ' and bcct.DUAN_Id = ''' + @DUAN_Id + ''''
	END

	--SET @SQLString = @SQLString + ' AND ND1.Id IN (
	--SELECT DISTINCT id FROM [dbo].[UserProfile] 
	--WHERE PHONGBAN_Id IN (
	--	SELECT PHONGBAN_Id FROM [dbo].[PHONGBANQUANLY] WHERE USERID = ''' + CONVERT(varchar(50) ,@CurrentUserID) + ''')
	--OR id IN (
	--	SELECT NHANVIEN_Id FROM [dbo].[NHANVIENQUANLY] WHERE USERID =''' + CONVERT(varchar(50) ,@CurrentUserID) + ''')
	--OR id =''' + CONVERT(varchar(50) ,@CurrentUserID) + ''')'


	--QuachPhu 20230512 Start
	--SET @SQLString = @SQLString + ' AND ND1.Id IN (select * from funcDanhSachNhanVienPhongBanQuanLy(''' + CONVERT(varchar(255),@CurrentUserID) + '''))'
	--QuachPhu 20230512 End

	SET @SQLString = @SQLString + ' group by tblBaoCao.Id,NhanXetChung,tblBaoCao.TRANGTHAI_Id,tblDmPhongBan.[Name],ND1.FullName,ND2.FullName,  tblBaoCao.[NGAYBAOCAO]' 
	SET @SQLString = @SQLString + ' , tblBaoCao.THOIGIANGUIBAOCAO, tblBaoCao.THOIGIANDUYETBAOCAO' 
	SET @SQLString = @SQLString + ' , tblBaoCao.CreatedAt,tblBaoCao.CreatedBy' 
	SET @SQLString = @SQLString + ' , tblBaoCao.ModifiedAt,tblBaoCao.ModifiedBy' 
	SET @SQLString = @SQLString + ' , tblBaoCao.NGUOIPHEDUYET_Id, ND2.Email2' 

	SET @SQLString = @SQLString + ' ORDER BY tblBaoCao.NGAYBAOCAO DESC' 


	EXECUTE sp_executesql @SQLString

END



                
            
            
GO
