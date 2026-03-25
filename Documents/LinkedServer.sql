--Cách 1
EXEC master.dbo.sp_addlinkedserver
	@server = 'GWServer',
	@provider = N'SQLOLEDB',
	@datasrc = N'vdev.sapiai.com',
	@srvproduct = N''

EXEC master.dbo.sp_addlinkedsrvlogin
	@rmtsrvname = 'GWServer',
	@useself = 'false',
	@locallogin = null,
	@rmtuser = 'sa',
	@rmtpassword = N'xxxxxxx'

SELECT * FROM [GWServer].GroupWareService.dbo.UserList
