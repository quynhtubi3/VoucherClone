---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'NHANVIENQUANLY_Get')
	DROP PROCEDURE NHANVIENQUANLY_Get
GO

CREATE PROCEDURE NHANVIENQUANLY_Get
(	@p_UserId			T_ID) WITH ENCRYPTION
/********************************************************************************
--Routine: NHANVIENQUANLY_Get
--Task: Get record(s) from table NHANVIENQUANLY
--Version: 
--    1.0 Mar 23 2022  2:14PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	SELECT Q.NHANVIEN_Id as [value],U.UserName2 as [caption] FROM NHANVIENQUANLY as Q INNER JOIN [GWServer].GroupWareService.dbo.UserList as U 
	ON Q.NHANVIEN_ID = U.Id
	WHERE Q.UserId = @p_UserId
END
