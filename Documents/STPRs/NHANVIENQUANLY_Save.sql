---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'NHANVIENQUANLY_Save')
	DROP PROCEDURE NHANVIENQUANLY_Save
GO

CREATE PROCEDURE NHANVIENQUANLY_Save
(	@p_UserId			T_ID,	@p_NHANVIEN_Id		T_ID	) WITH ENCRYPTION
/********************************************************************************
--Routine: NHANVIENQUANLY_Save
--Task: Save a record into table NHANVIENQUANLY
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN	
	BEGIN TRANSACTION
	BEGIN TRY
		INSERT INTO NHANVIENQUANLY				(					UserId,					NHANVIEN_Id				)			VALUES				(					@p_UserId,					@p_NHANVIEN_Id				)
		COMMIT TRANSACTION		RETURN 1	END TRY	BEGIN CATCH		SELECT   
        ERROR_NUMBER() AS ErrorNumber  
        ,ERROR_MESSAGE() AS ErrorMessage;  		ROLLBACK TRANSACTION		RETURN 0	END CATCHEND
