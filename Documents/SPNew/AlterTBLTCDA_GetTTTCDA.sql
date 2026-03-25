GO
ALTER PROCEDURE [dbo].[TBLTCDA_GetTTTCDA]

	@p_DUAN_Id			varchar(50) = NULL,
	@p_MADUAN			T_D256 = NULL,		
	@CurrentUserID	T_D256 = NULL

AS
BEGIN
--20231016

	DECLARE @SQLString NVARCHAR(MAX)

	SET @SQLString = 'select * from '
	SET @SQLString = @SQLString + ' (';
	SET @SQLString = @SQLString + 'select tblDmDuAn.Id as DuAnId, tblDmDuAn.Code as DuAnCode,tblDmDuAn.[Name] as DuAnName,'
	SET @SQLString = @SQLString + ' tblDmDuAn.MoTa as DuAnMoTa,tblDmDuAn.SoHopDong'
	SET @SQLString = @SQLString + ' , isnull(tblDmDuAn.DoanhThuDuKien,0) as DoanhThuDuKien'	
	SET @SQLString = @SQLString + ' , isnull(tblDmDuAn.GiaVon,0) as GiaVonMuaNgoaiDuKien'
	SET @SQLString = @SQLString + ' , (select isnull(sum(SOTIENNET),0) from DOANHTHUDUAN where DUAN_Id = tblDmDuAn.Id) DoanhThu'
	SET @SQLString = @SQLString + ' , (select isnull(sum(SOTIEN),0) from tblTCDA where DUANID = tblDmDuAn.Id and MaLoaiChiPhi=''GV'') GiaVonMuaNgoai'
	SET @SQLString = @SQLString + ' , (select isnull(sum(TONGCHIPHI),0) from BAOCAOCHITIET where DUAN_Id = tblDmDuAn.Id and BTRANGTHAIID=''DAPHEDUYET'') as GiaVonNoiBo'	
	SET @SQLString = @SQLString + ' , (select isnull(sum(SOTIEN),0) from tblTCDA where DUANID = tblDmDuAn.Id and MaLoaiChiPhi=''TH'') ChiPhiKDTrucTiep'
	SET @SQLString = @SQLString + ' , (select isnull(sum(SOTIEN),0) from tblTCDA where DUANID = tblDmDuAn.Id and MaLoaiChiPhi=''TC'') ChiPhiTaiChinh'
	SET @SQLString = @SQLString + ' , (select isnull(sum(SOTIEN),0) from tblTCDA where DUANID = tblDmDuAn.Id and MaLoaiChiPhi=''OT'') ChiPhiKhac'	
	SET @SQLString = @SQLString + ' from DMDUAN tblDmDuAn'

	SET @SQLString = @SQLString + ' where 1 = 1'

	IF @p_MADUAN is not NULL and @p_MADUAN != ''
	BEGIN
		SET @SQLString = @SQLString + ' and tblDmDuAn.Code = ''' + @p_MADUAN + ''''
	END

	IF @p_DUAN_Id is not NULL and @p_DUAN_Id != ''
	BEGIN
		SET @SQLString = @SQLString + ' and tblDmDuAn.Id = ''' + @p_DUAN_Id + ''''
	END
	
	--QuachPhu 20230522 Start
	SET @SQLString = @SQLString + ' AND tblDmDuAn.AM_Id IN (select * from funcDanhSachNhanVienPhongBanQuanLy(''' + @CurrentUserID + '''))'
	--QuachPhu 20230522 End

	SET @SQLString = @SQLString + ' ) T';
	--SET @SQLString = @SQLString + ' where T.DoanhThu > 0';
	--SET @SQLString = @SQLString + ' order by T.DuAnCode '
	
	
	EXECUTE sp_executesql @SQLString

END

 	
