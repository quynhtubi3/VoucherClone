IF EXISTS (SELECT * FROM sysobjects WHERE [Name] = 'UserProfile_Update_Info_UyQuyen')
    DROP PROCEDURE UserProfile_Update_Info_UyQuyen
GO

CREATE PROCEDURE UserProfile_Update_Info_UyQuyen
(
    @Id T_ID,
    @TAIKHOANNGANHANG_UYQUYEN nvarchar(MAX),
    @TENNGANHANG_UYQUYEN nvarchar(MAX),
    @CHINHANH_UYQUYEN nvarchar(MAX),
    @GIAYTHANHTOAN_UYQUYEN nvarchar(MAX),
    @NAMEGIAYTHANHTOAN_UYQUYEN nvarchar(MAX)
) WITH ENCRYPTION
/********************************************************************************
--Routine: UserProfile_Update_Info_UyQuyen
--Task: Save a record into table UserProfile
--Version: 
--    1.0 13/07/2025  9:33PM:    ANBD        Created
********************************************************************************/
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF EXISTS (SELECT 1 FROM UserProfile WHERE Id = @Id)
        BEGIN
            UPDATE UserProfile 
            SET 
                TAIKHOANNGANHANG_UYQUYEN = @TAIKHOANNGANHANG_UYQUYEN,
                TENNGANHANG_UYQUYEN = @TENNGANHANG_UYQUYEN,
                CHINHANH_UYQUYEN = @CHINHANH_UYQUYEN,
                GIAYTHANHTOAN_UYQUYEN = @GIAYTHANHTOAN_UYQUYEN,
                NAMEGIAYTHANHTOAN_UYQUYEN = @NAMEGIAYTHANHTOAN_UYQUYEN
            WHERE Id = @Id;
            RETURN 1; -- Cập nhật thành công
        END
        ELSE
        BEGIN
            RETURN 0; -- Bản ghi không tồn tại
        END
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
        RETURN -1; -- Lỗi
    END CATCH
END
GO