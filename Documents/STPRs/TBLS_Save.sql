  ---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'TBLS_Save')
	DROP PROCEDURE TBLS_Save
GO

CREATE PROCEDURE TBLS_Save
(
	@SALID					T_ID output,
	@NHANVIENEMAIL			T_D256 = NULL,
	@COQUANID				T_ID = NULL,
	@STK					T_D256 = NULL,
	@NGANHANG				T_D256 = NULL,
	@TAMUNG					T_D256 = NULL,
	@LUONG					T_D256 = NULL,
	@THUONGHIEUQUA					T_D256 = NULL,
	@PCTRACHNHIEM					T_D256 = NULL,
	@PCANTRUA					T_D256 = NULL,
	@PCDIENTHOAI					T_D256 = NULL,
	@PCVPP					T_D256 = NULL,
	@PCTRANGPHUC					T_D256 = NULL,
	@PCKHAC					T_D256 = NULL,
	@GIAMTRUCANHAN					T_D256 = NULL,
	@SONGUOIPHUTHUOC					T_D256 = NULL,
	@GIAMTRUGIACANH					T_D256 = NULL,
	@BHXH					T_D256 = NULL,
	@BHYT					T_D256 = NULL,
	@BHTN					T_D256 = NULL,
	@CONGDOAN					T_D256 = NULL,
	@TONGTHUNHAPCHIUTHUE					T_D256 = NULL,
	@THUETNCN					T_D256 = NULL,
	@TROCAPTHOIVIEC					T_D256 = NULL,
	@THUCLINH					T_D256 = NULL,
	@CHILUONGPHUCAP					T_D256 = NULL,
	@CHIBAOHIEM					T_D256 = NULL,
	@TONGCHIPHINHANSU					T_D256 = NULL,
	@QUYLUONGBHXH					T_D256 = NULL
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
	IF (EXISTS(select * from GroupWareService.dbo.UserList tblUser where tblUser.Email2 = @NHANVIENEMAIL))
	BEGIN
		select @NHANVIENID = tblUser.Id from GroupWareService.dbo.UserList tblUser where tblUser.Email2 = @NHANVIENEMAIL
		delete from TBLS where TBLS.NHANVIENID = @NHANVIENID and TBLS.COQUANID = @COQUANID
	END
	else
	begin
		return 1
	end

		SET @SALID = NEWID()

	BEGIN TRANSACTION

	BEGIN TRY
		
		INSERT INTO TBLS
				(
					SALID
				  ,NHANVIENID
				  ,COQUANID
				  ,SOTAIKHOAN
				  ,NGANHANG
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
				  ,TROCAPTHOIVIEC
				  ,THUCLINH
				  ,CHILUONGPHUCAP
				  ,CHIBAOHIEM
				  ,TONGCHIPHINHANSU
				  ,QUYLUONGBHXH
				)
			VALUES
				(
					@SALID					,
					@NHANVIENID				,
					@COQUANID				,
					@STK					,
					@NGANHANG				,
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
					@TROCAPTHOIVIEC			,
					@THUCLINH				,
					@CHILUONGPHUCAP			,
					@CHIBAOHIEM				,
					@TONGCHIPHINHANSU		,
					@QUYLUONGBHXH			
				)
		COMMIT TRANSACTION
		RETURN 1
	END TRY
	BEGIN CATCH
		SELECT   
        ERROR_NUMBER() AS ErrorNumber  
        ,ERROR_MESSAGE() AS ErrorMessage;  
		ROLLBACK TRANSACTION
		RETURN 0
	END CATCH
END