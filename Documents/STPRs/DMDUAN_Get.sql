---GET PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMDUAN_Get')
	DROP PROCEDURE DMDUAN_Get
GO

CREATE PROCEDURE DMDUAN_Get
(
	@p_Code			T_D256,
	@p_Name			T_D256,
	@p_KName		T_D256,
	@p_AM			T_ID = NULL,
	@p_TheoDoi		T_D002
) WITH ENCRYPTION
/********************************************************************************
--Routine: DMDUAN_Get
--Task: Get record(s) from table DMDUAN
--Version: 
--    1.0 Mar 23 2022  2:14PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN


	DECLARE @SQLString NVARCHAR(MAX)
	SET @SQLString = 'SELECT DU.Id,DU.Mota,DU.StartDate,DU.EndDate,DU.TheoDoi,DU.Code,DU.Name,DU.SoHopDong,DU.NamDuAn,DU.NgayKyHD,DU.GiaTriHD,DU.GiaVon,DU.CreatedAt,DU.CreatedBy,DU.ModifiedAt,DU.ModifiedBy,KH.Id AS KId, KH.Name as KName,PB.Id AS PId, PB.Code as PName,U.Id as UId, U.UserName2 as UName FROM DMDUAN as DU INNER JOIN DMKHACHHANG as KH ON DU.KHACHHANG_Id = KH.Id INNER JOIN DMPHONGBAN as PB ON PB.Id = DU.PHONGBAN_Id INNER JOIN GroupWareService.dbo.UserList as U ON DU.AM_Id = U.Id'
	SET @SQLString = @SQLString + ' WHERE DU.Code Like ''%' + @p_Code + '%'' AND DU.[Name] Like ''%' + @p_Name + '%'' AND KH.[Name] Like ''%' + @p_KName + '%'''
	
	IF @p_AM != NULL 
	BEGIN
		SET @SQLString = @SQLString + ' AND U.Id = ''' + CONVERT(varchar,@p_AM) + ''''
	END

	IF @p_TheoDoi != '0' 
	BEGIN
		SET @SQLString = @SQLString + ' AND DU.TheoDoi = ''' + @p_TheoDoi + ''''
	END
	
	EXECUTE sp_executesql @SQLString

	
END
