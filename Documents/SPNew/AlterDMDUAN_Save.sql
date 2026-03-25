ALTER PROCEDURE DMDUAN_Save

	@p_Moi_Sua		T_BIT,
	@p_Id			T_ID		OUTPUT,
	@p_Code			T_D256,
	@p_Name			T_D256,
	@p_Mota			NVARCHAR(MAX),
	@p_SoHopDong	T_D256,
	@p_GiaTriHD		T_TIEN,
	@p_GiaVon		T_TIEN,
	@p_NamDuAn		T_D004,
	@p_NgayKyHD		T_DATE,
	@p_TheoDoi		T_D002,
	@p_KId			T_ID,
	@p_PId			T_ID,
	@p_AMId			T_ID,
	@p_NAMQUYETTOAN			T_D004,
	@p_DOANHTHUDUKIEN			T_TIEN,
	@p_DOANHTHUTHUCTE			T_TIEN,
	@p_GIAVONMUANGOAITHUCTE			T_TIEN,
	@p_INCENTIVETAMUNG			T_TIEN,
	@p_INCENTIVE			T_TIEN,
	@p_PMId			T_ID,
	@p_PICId			T_ID,
	@p_QTHDId			T_ID,
	@p_ModifiedBy	T_ID,
	@p_ModifiedAt	T_DATE		OUTPUT

/********************************************************************************
--Routine: DMDUAN_Save
--Task: Save a record into table DMDUAN
--Version: 
--    1.0 Apr 10 2022  9:33PM:    THAIVM        Created
********************************************************************************/
AS
BEGIN
--20240315

	DECLARE @v_Code	T_D256
	DECLARE @p_AMAD	T_D256
	DECLARE @p_PMAD	T_D256 = null
	DECLARE @p_PICAD	T_D256 = null
	DECLARE @p_QTHDAD	T_D256 = null

	IF (@p_Moi_Sua = 1 AND EXISTS(SELECT * FROM DMDUAN WHERE Code = @p_Code)) OR 
			(@p_Moi_Sua = 0 AND EXISTS(SELECT * FROM DMDUAN WHERE Id != @p_Id AND Code = @p_Code))
	BEGIN
		RETURN -1
	END

	IF @p_Moi_Sua = 0
	BEGIN
		SELECT @v_Code = Code FROM DMDUAN WHERE Id = @p_Id AND ModifiedAt = @p_ModifiedAt
		IF @v_Code IS NULL
			RETURN -2
	END

	BEGIN TRANSACTION

	BEGIN TRY
		IF @p_Moi_Sua = 0 AND @v_Code <> @p_Code
		BEGIN
			EXECUTE Change_Code 'DMDUAN', 'CODE', @v_Code, @p_Code
		END

		SET @p_ModifiedAt = GETDATE()

		SELECT @p_AMAD = UserName2 FROM [GroupWareService].[dbo].[UserList] WHERE Id = @p_AMId

		if (@p_PMId is not null)-- and @p_PMId != '')--Conversion failed when converting from a character string to uniqueidentifier
			SELECT @p_PMAD = UserName2 FROM [GroupWareService].[dbo].[UserList] WHERE Id = @p_PMId

		if (@p_PICId is not null)-- and @p_PICId != '')
			SELECT @p_PICAD = UserName2 FROM [GroupWareService].[dbo].[UserList] WHERE Id = @p_PICId

		if (@p_QTHDId is not null)-- and @p_QTHDId != '')
			SELECT @p_QTHDAD = UserName2 FROM [GroupWareService].[dbo].[UserList] WHERE Id = @p_QTHDId

		IF @p_Moi_Sua = 1
		BEGIN
			SET @p_Id = NEWID()

			INSERT INTO DMDUAN
				(
					Id,
					KHACHHANG_Id,
					Mota,
					TheoDoi,
					Code,
					Name,
					SoHopDong,
					NamDuAn,
					PHONGBAN_Id,
					AM_Id,
					NgayKyHD,
					GiaTriHD,
					CreatedAt,
					CreatedBy,
					ModifiedAt,
					ModifiedBy,
					GiaVon
					, AMAD
					, NAMQUYETTOAN
					, DOANHTHUDUKIEN
					, DOANHTHUTHUCTE
					, GIAVONMUANGOAITHUCTE
					, INCENTIVETAMUNG
					, INCENTIVE
					, PMID
					, PICID
					, QTHDID
					, PMAD
					, PICAD
					, QTHDAD
				)
			VALUES
				(
					@p_Id,
					@p_KId,
					@p_Mota,
					@p_TheoDoi,
					@p_Code,
					@p_Name,	
					@p_SoHopDong,
					@p_NamDuAn,
					@p_PId,
					@p_AMId,
					@p_NgayKyHD,
					@p_GiaTriHD,
					@p_ModifiedAt,
					@p_ModifiedBy,
					@p_ModifiedAt,
					@p_ModifiedBy,
					@p_GiaVon
					, @p_AMAD
					, @p_NAMQUYETTOAN
					, @p_DOANHTHUDUKIEN
					, @p_DOANHTHUTHUCTE
					, @p_GIAVONMUANGOAITHUCTE
					, @p_INCENTIVETAMUNG
					, @p_INCENTIVE
					, @p_PMId
					, @p_PICId
					, @p_QTHDId
					, @p_PMAD
					, @p_PICAD
					, @p_QTHDAD
				)
		END
		ELSE
		BEGIN
			UPDATE DMDUAN SET
				KHACHHANG_Id	= @p_KId,
				Mota			= @p_Mota,
				TheoDoi			= @p_TheoDoi,
				Code			= @p_Code,
				Name			= @p_Name,
				SoHopDong		= @p_SoHopDong,
				NamDuAn			= @p_NamDuAn,
				PHONGBAN_Id		= @p_PId,
				AM_Id			= @p_AMId,
				NgayKyHD		= @p_NgayKyHD,
				GiaTriHD		= @p_GiaTriHD,
				GiaVon			= @p_GiaVon,
				ModifiedAt	 = @p_ModifiedAt,
				ModifiedBy	 = @p_ModifiedBy
				, AMAD			= @p_AMAD				
				, NAMQUYETTOAN			= @p_NAMQUYETTOAN
				, DOANHTHUDUKIEN			= @p_DOANHTHUDUKIEN
				, DOANHTHUTHUCTE			= @p_DOANHTHUTHUCTE
				, GIAVONMUANGOAITHUCTE			= @p_GIAVONMUANGOAITHUCTE
				, INCENTIVETAMUNG			= @p_INCENTIVETAMUNG
				, INCENTIVE			= @p_INCENTIVE
				, PMID			= @p_PMId
				, PICID			= @p_PICId
				, QTHDID			= @p_QTHDId
				, PMAD			= @p_PMAD
				, PICAD			= @p_PICAD
				, QTHDAD			= @p_QTHDAD
			WHERE Id = @p_Id
		END

		COMMIT TRANSACTION
		RETURN 1
	END TRY
	BEGIN CATCH
		SELECT   
        ERROR_NUMBER() AS ErrorNumber  
        ,ERROR_MESSAGE() AS ErrorMessage;  
		ROLLBACK TRANSACTION
		RETURN 0
	END CATCH
END
GO
