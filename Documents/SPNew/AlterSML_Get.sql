GO

ALTER PROCEDURE SML_Get
(
	@NHANVIENID				T_D256 = NULL
) WITH ENCRYPTION
/********************************************************************************
--Routine: SML_Get
--Task: Save a record into table SML
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
--20240410
	DECLARE @SQLString NVARCHAR(MAX)
	SET @SQLString = 'select distinct SML.GHICHUHETHONG as GhiChuHeThong, SML.COQUANID as Id, DMCOQUANBO.Code as Code , DMCOQUANBO.Name as [Name], SML.THANG as Thang, SML.NAM as Nam, SML.SOLANTRONGTHANG as SoLanTrongThang from SML inner join DMCOQUANBO on DMCOQUANBO.Id = SML.COQUANID'
	SET @SQLString = @SQLString + ' WHERE 1=1'

	IF @NHANVIENID != NULL or @NHANVIENID != ''
	BEGIN
		SET @SQLString = @SQLString + ' and SML.NHANVIENID = ''' + @NHANVIENID + ''''
	END

	SET @SQLString = @SQLString + ' order by Nam desc, Thang desc '
	
	EXECUTE sp_executesql @SQLString
END
GO
