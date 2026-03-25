CREATE PROCEDURE DMNGUOIBAN_Save
(
    @p_Moi_Sua              T_BIT,
    @p_Id                   T_ID        OUTPUT,
    @p_Code                 T_D256,
    @p_Name                 T_D256,
    @p_ChucVuId             T_ID,
    @p_DiaChi      T_D256,
    @p_DienThoai         T_D256,
    @p_Email         T_D256,
    @p_GioiTinh             int,
    @p_NamSinh             date,
    @p_Note                 NVARCHAR(MAX),
    @p_Identifier           NVARCHAR(15),
    @p_ModifiedBy           T_ID,
    @p_ModifiedAt           T_DATE      OUTPUT
) WITH ENCRYPTION
AS
BEGIN
    IF (@p_Moi_Sua = 1 AND EXISTS(SELECT * FROM DMNGUOIBAN WHERE [Code] = @p_Code )) OR 
       (@p_Moi_Sua = 0 AND EXISTS(SELECT * FROM DMNGUOIBAN WHERE Id != @p_Id AND [Code] = @p_Code))
    BEGIN
        RETURN -1
    END

    BEGIN TRANSACTION
    BEGIN TRY
        -- SET @p_ModifiedAt = GETDATE()

        IF @p_Moi_Sua = 1
        BEGIN
            SET @p_Id = NEWID()

            INSERT INTO DMNGUOIBAN
            (
                Id,
                Code,
                Name,
                ChucVuId,
                DiaChi,
                DienThoai,
                Email,
                GioiTinh,
                NamSinh,
                Note,
                Identifier,
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
                @p_ChucVuId,
                @p_DiaChi,
                @p_Email,
                @p_Email,
                @p_GioiTinh,
                @p_NamSinh,
                @p_Note,
                @p_Identifier,
                @p_ModifiedAt,
                @p_ModifiedBy,
                @p_ModifiedAt,
                @p_ModifiedBy
            )
        END
        ELSE
        BEGIN
            UPDATE DMNGUOIBAN SET
                Code            =@p_Code,
                Name            = @p_Name,
                ChucVuId        = @p_ChucVuId,
                DiaChi = @p_DiaChi,
                DienThoai    = @p_DienThoai,
                Email    = @p_Email,
                GioiTinh        = @p_GioiTinh,
                NamSinh        = @p_NamSinh,
                Note            = @p_Note,
                Identifier      = @P_Identifier,
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
