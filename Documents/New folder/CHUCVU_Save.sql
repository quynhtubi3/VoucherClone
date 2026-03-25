---INSERT PROCEDURE---
IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'CHUCVU_Save')
	DROP PROCEDURE CHUCVU_Save
GO

CREATE PROCEDURE CHUCVU_Save
(
    @p_Moi_Sua              T_BIT,
    @p_Id                   T_ID        OUTPUT,
    @p_Name                 T_D256,
    @p_Code                 T_D256,
    @p_HHCaNhan             DECIMAL(10,2),
    @p_HHTruongCuaHang      DECIMAL(10,2),
    @p_HHPhoCuaHang         DECIMAL(10,2),
    @p_QuyDoiPhaChe         DECIMAL(10,2),
    @p_QuyChung             DECIMAL(10,2),
    @p_Note                 NVARCHAR(MAX),
    @p_ModifiedBy           T_ID,
    @p_ModifiedAt           T_DATE      OUTPUT
) WITH ENCRYPTION
AS
BEGIN
    IF (@p_Moi_Sua = 1 AND EXISTS(SELECT * FROM CHUCVU WHERE [Name] = @p_Name)) OR 
       (@p_Moi_Sua = 0 AND EXISTS(SELECT * FROM CHUCVU WHERE Id != @p_Id AND [Name] = @p_Name))
    BEGIN
        RETURN -1
    END

    BEGIN TRANSACTION
    BEGIN TRY
        -- SET @p_ModifiedAt = GETDATE()

        IF @p_Moi_Sua = 1
        BEGIN
            SET @p_Id = NEWID()

            INSERT INTO CHUCVU
            (
                Id,
                Code,
                Name,
                HHCaNhan,
                HHTruongCuaHang,
                HHPhoCuaHang,
                QuyDoiPhaChe,
                QuyChung,
                Note,
                CreatedAt,
                CreatedBy,
                ModifiedAt,
                ModifiedBy
            )
            VALUES
            (
                @p_Id,
                @p_Code,
                @p_Name,
                @p_HHCaNhan,
                @p_HHTruongCuaHang,
                @p_HHPhoCuaHang,
                @p_QuyDoiPhaChe,
                @p_QuyChung,
                @p_Note,
                @p_ModifiedAt,
                @p_ModifiedBy,
                @p_ModifiedAt,
                @p_ModifiedBy
            )
        END
        ELSE
        BEGIN
            UPDATE CHUCVU SET
                Code            = @p_Code,
                Name            = @p_Name,
                HHCaNhan        = @p_HHCaNhan,
                HHTruongCuaHang = @p_HHTruongCuaHang,
                HHPhoCuaHang    = @p_HHPhoCuaHang,
                QuyDoiPhaChe    = @p_QuyDoiPhaChe,
                QuyChung        = @p_QuyChung,
                Note            = @p_Note,
                ModifiedAt      = @p_ModifiedAt,
                ModifiedBy      = @p_ModifiedBy
            WHERE Id = @p_Id
        END

        COMMIT TRANSACTION
        RETURN 1
    END TRY
    BEGIN CATCH
        SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
        ROLLBACK TRANSACTION
        RETURN 0
    END CATCH
END
