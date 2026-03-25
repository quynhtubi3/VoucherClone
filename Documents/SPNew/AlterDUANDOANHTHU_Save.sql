ALTER PROCEDURE DUANDOANHTHU_Save

	@MADUAN						[T_D256] = NULL,
	@NGAYNHANTIEN			[T_DATE] = NULL,
	@SOTIEN						[T_TIEN] = null,	
	@SOTIENNET						[T_TIEN] = null,
	@DIENGIAI						[NVARCHAR](MAX) = NULL,
	@LOAIDOANHTHU					[T_D256] = null,
	@DOITUONG						[T_D256] = NULL,
	@p_ModifiedBy				T_ID,
	@mode						T_BIT,
	@ERROR		T_D256		OUTPUT

/********************************************************************************
--Routine: TBLS_Save
--Task: Save a record into table TBLS
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
--20231016

	IF (EXISTS(select * from DOANHTHUDUAN where DOANHTHUDUAN.MADUAN = @MADUAN))
	BEGIN
		if @mode = 0
		begin
			return 1
		end
	end
		BEGIN TRANSACTION
		BEGIN TRY

		declare @DUAN_Id T_ID
		declare @THUE [T_TIEN] = 0

		select @DUAN_Id = DMDUAN.Id from DMDUAN where DMDUAN.Code = @MADUAN

		if (@SOTIENNET = 0)
			set @SOTIENNET = @SOTIEN
		
		set @THUE = @SOTIEN - @SOTIENNET

			INSERT INTO DOANHTHUDUAN
				(
					Id,
					DUAN_Id,
					MADUAN,
					NGAYNHANTIEN,
					SOTIEN,
					DIENGIAI,
					LOAIDOANHTHU,
					DOITUONG,
					CreatedAt,
					CreatedBy,
					ModifiedAt,
					ModifiedBy,
					THUE,
					SOTIENNET
				)
				VALUES
				(
					NEWID(),					
					@DUAN_Id,
					@MADUAN,
					@NGAYNHANTIEN,
					@SOTIEN,
					@DIENGIAI,
					@LOAIDOANHTHU,
					@DOITUONG,	
					GETDATE(),
					@p_ModifiedBy,
					GETDATE(),
					@p_ModifiedBy,
					@THUE,
					@SOTIENNET
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
