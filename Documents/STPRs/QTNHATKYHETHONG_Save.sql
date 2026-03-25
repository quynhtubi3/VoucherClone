---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'QTNHATKYHETHONG_Save')
	DROP PROCEDURE QTNHATKYHETHONG_Save
GO

CREATE PROCEDURE QTNHATKYHETHONG_Save
(	@p_UserId		T_ID,	@p_ChucNang		T_D256,	@p_HanhDong		T_D256) WITH ENCRYPTION
/********************************************************************************
--Routine: QTNHATKYHETHONG_Save
--Task: Save a record into table NHATKYHETHONG
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	INSERT INTO [dbo].[NHATKYHETHONG] ([Id],[User_Id],[CHUCNANG],[HANHDONG],[THOIGIAN]) VALUES (NEWID() ,@p_UserId,@p_ChucNang,@p_HanhDong,GETDATE())END
