---DELETE PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'CHUCVU_Delete')
	DROP PROCEDURE CHUCVU_Delete
GO


CREATE PROCEDURE CHUCVU_Delete
(	
    @p_Id         T_ID,
    @p_ModifiedBy T_ID,
    @p_ModifiedAt T_DATE
)
WITH ENCRYPTION
AS
/********************************************************************************
--Routine: CHUCVU_Delete
--Task: Delete record(s) from table CHUCVU
--Version: 
--    1.0 Mar 25 2022 11:55AM:    THAIVM        Created
********************************************************************************/
BEGIN
    DECLARE @v_InUsed T_INT;
    DECLARE @v_InUsed2 T_INT;

    IF EXISTS(SELECT 1 FROM CHUCVU WHERE Id = @p_Id AND ModifiedAt <> @p_ModifiedAt)
    BEGIN
        RETURN -2;
    END
    
    SET @v_InUsed = (SELECT COUNT(Id) FROM DMNGUOIBAN WHERE ChucVuId = @p_Id)	

	IF @v_InUsed > 0
	BEGIN
		RETURN -3
	END
    
	
	SET @v_InUsed2= (SELECT COUNT(Id) FROM UserProfile WHERE CHUCVU_ID = @p_Id)	

	IF @v_InUsed2 > 0
	BEGIN
		RETURN -3
	END

    DELETE FROM CHUCVU WHERE Id = @p_Id;

    RETURN 1;
END
