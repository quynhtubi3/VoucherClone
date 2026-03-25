ALTER PROCEDURE TBLTCDA_Save

	@MADUAN						[T_D256] = NULL,
	@NGAYTHANG			[T_DATE] = NULL,
	@SOTIENGROSS						[T_TIEN] = null,
	@SOTIENNET						[T_TIEN] = null,
	@NOIDUNG						[NVARCHAR](MAX) = NULL,
	@MALOAICHIPHI					[T_D256] = null,
	@DOITUONG						[T_D256] = NULL,
	@p_ModifiedBy				T_ID,
	@mode						T_BIT,
	@ERROR		T_D256		OUTPUT

AS
BEGIN
--20231016

	IF (EXISTS(select * from tblTCDA where MADUAN = @MADUAN))
	BEGIN
		if @mode = 0
		begin
			return 1
		end
	end
		BEGIN TRANSACTION
		BEGIN TRY

		declare @DUAN_Id T_ID
		declare @KHACHHANGID T_ID
		declare @AMID T_ID
		declare @PHONGBANID T_ID
		declare @NGUOITHUHUONGID T_ID
		declare @THUE [T_TIEN] = 0

		if (@SOTIENNET = 0)
			set @SOTIENNET = @SOTIENGROSS

		set @THUE = @SOTIENGROSS - @SOTIENNET
			

		select @DUAN_Id = DMDUAN.Id, @KHACHHANGID = DMDUAN.KHACHHANG_Id, @AMID = DMDUAN.AM_Id, @PHONGBANID = DMDUAN.PHONGBAN_Id
		from DMDUAN where DMDUAN.Code = @MADUAN

		select @NGUOITHUHUONGID = Id
		from [GroupWareService].[dbo].[UserList] where UPPER(Email2) = UPPER(@DOITUONG)

			INSERT INTO tblTCDA
				(
					Id,
					MADUAN,
					DUANID,		
					NOIDUNG,
					NGAYTHANG,
					KHACHHANGID,
					AMID,
					PHONGBANID,
					SOTIEN,
					NGUOITHUHUONGID,
					EMAIL,
					SOTIENGROSS,														
					THUE,
					MALOAICHIPHI,
					CreatedAt,
					CreatedBy,
					ModifiedAt,
					ModifiedBy
				)
				VALUES
				(
					NEWID(),					
					@MADUAN,
					@DUAN_Id,					
					@NOIDUNG,
					@NGAYTHANG,
					@KHACHHANGID,
					@AMID,
					@PHONGBANID,
					@SOTIENNET,
					@NGUOITHUHUONGID,
					@DOITUONG,
					@SOTIENGROSS,										
					@THUE,
					@MALOAICHIPHI,
					GETDATE(),
					@p_ModifiedBy,
					GETDATE(),
					@p_ModifiedBy
				)
			COMMIT TRANSACTION
			RETURN 1
		END TRY
		BEGIN CATCH
			SELECT  ERROR_NUMBER() AS ErrorNumber;
			SELECT @ERROR = ERROR_MESSAGE();  
			ROLLBACK TRANSACTION
			RETURN 0
		END CATCH
END
GO
