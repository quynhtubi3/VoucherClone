---DELETE PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'DMNGUOIBAN_Delete')
	DROP PROCEDURE DMNGUOIBAN_Delete
GO


CREATE PROCEDURE DMNGUOIBAN_Delete
(	
    @p_Id         T_ID,
    @p_ModifiedBy T_ID,
    @p_ModifiedAt T_DATE
)
WITH ENCRYPTION
AS
/********************************************************************************
--Routine: DMNGUOIBAN_Delete
--Task: Delete record(s) from table DMNGUOIBAN
--Version: 
--    1.0 Mar 25 2022 11:55AM:    THAIVM        Created
********************************************************************************/
BEGIN
    DECLARE @v_InUsed T_INT;

    IF EXISTS(SELECT 1 FROM DMNGUOIBAN WHERE Id = @p_Id AND ModifiedAt <> @p_ModifiedAt)
    BEGIN
        RETURN -2;
    END

    SET @v_InUsed = (SELECT COUNT(Id) FROM Voucher WHERE SellerId = @p_Id)	

	IF @v_InUsed > 0
	BEGIN
		RETURN -3
	END
    
    
    DELETE FROM DMNGUOIBAN WHERE Id = @p_Id;

    RETURN 1;
END
