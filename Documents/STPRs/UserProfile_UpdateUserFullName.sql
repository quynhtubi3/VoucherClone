  ---SELECT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'UserProfile_UpdateUserFullName')
	DROP PROCEDURE UserProfile_UpdateUserFullName
GO

CREATE PROCEDURE UserProfile_UpdateUserFullName
(
	@Id				T_ID,
	@HOVATEN				T_D256

) WITH ENCRYPTION
/********************************************************************************
--Routine: UserProfile_UpdateUserName
--Task: Save a record into table UserProfile
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
	IF (EXISTS(select * from UserProfile where UserProfile.Id = @Id))
	BEGIN	
		update UserProfile set HOVATEN = @HOVATEN WHERE UserProfile.Id = @Id
	end
	RETURN 1


END
