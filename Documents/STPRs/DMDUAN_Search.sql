  ---SELECT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMDUAN_Search')
	DROP PROCEDURE DMDUAN_Search
GO

CREATE PROCEDURE DMDUAN_Search
(
	@p_Value				T_D256

) WITH ENCRYPTION
/********************************************************************************
--Routine: DMDUAN_Search
--Task: Save a record into table DMDUAN
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	DECLARE @SQLString NVARCHAR(MAX)
	SET @SQLString = 'SELECT DU.Id,DU.Mota,DU.StartDate,DU.EndDate,DU.TheoDoi,DU.Code,DU.Name,DU.SoHopDong,DU.NamDuAn,DU.NgayKyHD,DU.GiaTriHD,DU.CreatedAt,DU.CreatedBy,DU.ModifiedAt,DU.ModifiedBy,KH.Id AS KId, KH.Name as KName,PB.Id AS PId, PB.Code as PName,U.Id as UId, U.UserName2 as UName FROM DMDUAN as DU INNER JOIN DMKHACHHANG as KH ON DU.KHACHHANG_Id = KH.Id INNER JOIN DMPHONGBAN as PB ON PB.Id = DU.PHONGBAN_Id INNER JOIN GroupWareService.dbo.UserList as U ON DU.AM_Id = U.Id INNER JOIN UserProfile as UP ON UP.Id = U.Id'
	SET @SQLString = @SQLString + ' WHERE UP.HoVaTen Like ''%' + @p_Value + '%'' OR U.Email2 Like ''%' + @p_Value + '%'' OR DU.Code Like ''%' + @p_Value + '%'' OR DU.[Name] Like ''%' + @p_Value + '%'' OR KH.[Name] Like ''%' + @p_Value + '%'''	
	
	EXECUTE sp_executesql @SQLString
END
