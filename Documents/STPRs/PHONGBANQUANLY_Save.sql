---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'PHONGBANQUANLY_Save')
	DROP PROCEDURE PHONGBANQUANLY_Save
GO

CREATE PROCEDURE PHONGBANQUANLY_Save
(	@p_UserId			T_ID,	@p_PHONGBAN_Id		T_ID	) WITH ENCRYPTION
/********************************************************************************
--Routine: PHONGBANQUANLY_Save
--Task: Save a record into table PHONGBANQUANLY
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN	
	BEGIN TRANSACTION
	BEGIN TRY
		INSERT INTO PHONGBANQUANLY				(					UserId,					PHONGBAN_Id				)			VALUES				(					@p_UserId,					@p_PHONGBAN_Id				)
		COMMIT TRANSACTION		RETURN 1	END TRY	BEGIN CATCH		SELECT   
        ERROR_NUMBER() AS ErrorNumber  
        ,ERROR_MESSAGE() AS ErrorMessage;  		ROLLBACK TRANSACTION		RETURN 0	END CATCHEND
