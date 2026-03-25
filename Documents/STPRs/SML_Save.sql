  ---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'SML_Save')
	DROP PROCEDURE SML_Save
GO

CREATE PROCEDURE SML_Save
(
	@SALID					T_ID output,
	@NHANVIENEMAIL			T_D256 = NULL,
	@COQUANID				T_ID = NULL,
	@STK					T_D020 = NULL,
	@NGANHANG				T_D256 = NULL,
	@THANG				T_INT = NULL,
	@NAM				T_INT = NULL,
	@SOLANTRONGTHANG				T_INT = NULL,
	@XEPLOAI				T_D020 = NULL,
	@NGAYCONGTIEUCHUAN				T_INT = NULL,
	@NGAYCONGTHUCTE				T_TIEN = NULL,
	@DIEUCHINHTRUOCTHUE1				T_TIEN = NULL,
	@DIEUCHINHTRUOCTHUE2				T_TIEN = NULL,
	@DIEUCHINHSAUTHUE1				T_TIEN = NULL,
	@DIEUCHINHSAUTHUE2				T_TIEN = NULL,
	@GHICHUCANHAN					nvarchar(max) = NULL,
	@TAMUNG					T_TIEN = NULL,
	@LUONG					T_TIEN = NULL,
	@THUONGHIEUQUA					T_TIEN = NULL,
	@PCTRACHNHIEM					T_TIEN = NULL,
	@PCANTRUA					T_TIEN = NULL,
	@PCDIENTHOAI					T_TIEN = NULL,
	@PCVPP					T_TIEN = NULL,
	@PCTRANGPHUC					T_TIEN = NULL,
	@PCKHAC					T_TIEN = NULL,
	@GIAMTRUCANHAN					T_TIEN = NULL,
	@SONGUOIPHUTHUOC					T_INT = NULL,
	@GIAMTRUGIACANH					T_TIEN = NULL,
	@BHXH					T_TIEN = NULL,
	@BHYT					T_TIEN = NULL,
	@BHTN					T_TIEN = NULL,
	@CONGDOAN					T_TIEN = NULL,
	@TONGTHUNHAPCHIUTHUE					T_TIEN = NULL,
	@THUETNCN					T_TIEN = NULL,
	@THUCLINH					T_TIEN = NULL,
	@CHILUONGPHUCAP					T_TIEN = NULL,
	@CHIBAOHIEM					T_TIEN = NULL,
	@TONGCHIPHINHANSU					T_TIEN = NULL,
	@QUYLUONGBHXH					T_TIEN = NULL,
	@GHICHUHETHONG					nvarchar(max) = NULL,
	@ERROR		T_D256		OUTPUT
) WITH ENCRYPTION
/********************************************************************************
--Routine: TBLS_Save
--Task: Save a record into table TBLS
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN

	declare @NHANVIENID T_ID
	declare @PHONGBANID	 T_ID	

	IF (EXISTS(select * from GroupWareService.dbo.UserList tblUser left join TBLS on TBLS.NHANVIENID = tblUser.Id where tblUser.Email2 = @NHANVIENEMAIL and TBLS.COQUANID = @COQUANID))
	BEGIN	
		select @NHANVIENID = tblUser.Id from GroupWareService.dbo.UserList tblUser left join UserProfile on UserProfile.Id= tblUser.Id where tblUser.Email2 = @NHANVIENEMAIL and UserProfile.COQUANBO_Id = @COQUANID
		select @PHONGBANID = UserProfile.PHONGBAN_Id from GroupWareService.dbo.UserList tblUser left join UserProfile on UserProfile.Id = tblUser.Id where tblUser.Email2 = @NHANVIENEMAIL and UserProfile.COQUANBO_Id = @COQUANID

		delete from SML where SML.NHANVIENID = @NHANVIENID and SML.SOLANTRONGTHANG = @SOLANTRONGTHANG and SML.THANG = @THANG and SML.NAM = @NAM and SML.COQUANID = @COQUANID
	end
	else
	begin
		return 1
	end
		SET @SALID = NEWID()

		BEGIN TRANSACTION

		BEGIN TRY
		
			INSERT INTO SML
				(
					SALID
				  ,NHANVIENID
				  ,COQUANID
				  ,PHONGBANID
				  ,SOTAIKHOAN
				  ,NGANHANG
				  ,THANG
				  ,NAM
				  ,SOLANTRONGTHANG
				  ,XEPLOAI
				  ,NGAYCONGTIEUCHUAN
				  ,NGAYCONGTHUCTE
				  ,DIEUCHINHTRUOCTHUE1
				  ,DIEUCHINHTRUOCTHUE2
				  ,DIEUCHINHSAUTHUE1
				  ,DIEUCHINHSAUTHUE2
				  ,GHICHUCANHAN
				  ,TAMUNG
				  ,LUONG
				  ,THUONGHIEUQUA
				  ,PCTRACHNHIEM
				  ,PCANTRUA
				  ,PCDIENTHOAI
				  ,PCVPP
				  ,PCTRANGPHUC
				  ,PCKHAC
				  ,GIAMTRUCANHAN
				  ,SONGUOIPHUTHUOC
				  ,GIAMTRUGIACANH
				  ,BHXH
				  ,BHYT
				  ,BHTN
				  ,CONGDOAN
				  ,TONGTHUNHAPCHIUTHUE
				  ,THUETNCN
				  ,THUCLINH
				  ,CHILUONGPHUCAP
				  ,CHIBAOHIEM
				  ,TONGCHIPHINHANSU
				  ,QUYLUONGBHXH
				  ,GHICHUHETHONG
				)
				VALUES
				(
					@SALID					,
					@NHANVIENID				,
					@COQUANID				,
					@PHONGBANID				,
					@STK					,
					@NGANHANG				,
					@THANG					,
				    @NAM					,
				    @SOLANTRONGTHANG		,
				    @XEPLOAI				,
				    @NGAYCONGTIEUCHUAN		,
				    @NGAYCONGTHUCTE			,
				    @DIEUCHINHTRUOCTHUE1	,
				    @DIEUCHINHTRUOCTHUE2	,
				    @DIEUCHINHSAUTHUE1		,
				    @DIEUCHINHSAUTHUE2		,
				    @GHICHUCANHAN			,
					@TAMUNG					,
					@LUONG					,
					@THUONGHIEUQUA			,
					@PCTRACHNHIEM			,
					@PCANTRUA				,
					@PCDIENTHOAI			,
					@PCVPP					,
					@PCTRANGPHUC			,
					@PCKHAC					,
					@GIAMTRUCANHAN			,
					@SONGUOIPHUTHUOC		,
					@GIAMTRUGIACANH			,
					@BHXH					,
					@BHYT					,
					@BHTN					,
					@CONGDOAN				,
					@TONGTHUNHAPCHIUTHUE	,
					@THUETNCN				,
					@THUCLINH				,
					@CHILUONGPHUCAP			,
					@CHIBAOHIEM				,
					@TONGCHIPHINHANSU		,
					@QUYLUONGBHXH			,
					@GHICHUHETHONG
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
