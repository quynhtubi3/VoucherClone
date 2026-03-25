IF EXISTS(SELECT * FROM sysobjects WHERE [Name] = 'Change_Code')
	DROP PROCEDURE Change_Code
GO

CREATE PROCEDURE Change_Code
(
	@p_Ma_File	 	T_D032,
	@p_Ma_Field 	T_D032,
	@p_Old_Value 	T_D032,
	@p_New_Value 	T_D032
) WITH ENCRYPTION
/********************************************************************************
--Routine: Change_Code
--Task: Update all fields of the table CDV
--Version: 
--    1.0 Dec 24 2002:    NVTAM        Created
********************************************************************************/
AS
BEGIN
	DECLARE @v_Ma_File     		T_D032,
			@v_Field_Name		T_D032,
			@v_Old_File			T_D032,
			@v_InUsed			T_BIT,
			@v_SQL 				NVARCHAR(2000)

--Kiểm tra mã đích có phải là mã nhóm không
	IF EXISTS(SELECT * FROM sysobjects o LEFT OUTER JOIN syscolumns c ON o.[Id] = c.[Id] WHERE UPPER(o.[Name]) = UPPER(@p_Ma_File) AND UPPER(c.[Name]) = N'PARENTID')
			AND EXISTS(SELECT * FROM sysobjects o LEFT OUTER JOIN syscolumns c ON o.[Id] = c.[Id] WHERE UPPER(o.[Name]) = UPPER(@p_Ma_File) AND UPPER(c.[Name]) = N'ISEND')
	BEGIN
		SET @v_SQL = N''
		SET @v_SQL = @v_SQL + N'SET @v_InUsed = 0' + CHAR(13)
		SET @v_SQL = @v_SQL + N'IF EXISTS(SELECT * FROM ' + @p_Ma_File + ' WHERE ' + @p_Ma_Field + ' = N''' + @p_New_Value + ''' AND IsEnd = 0)' + CHAR(13)
		SET @v_SQL = @v_SQL + N'BEGIN' + CHAR(13)
		SET @v_SQL = @v_SQL + N'SET @v_InUsed = 1' + CHAR(13)
		SET @v_SQL = @v_SQL + N'END' + CHAR(13)

		EXEC sp_executesql @v_SQL,
		N'	@v_InUsed		T_BIT			OUTPUT',
			@v_InUsed		= @v_InUsed		OUTPUT

		IF @v_InUsed = 1
		BEGIN
			RETURN -1
		END
	END

	BEGIN TRANSACTION
	BEGIN TRY
		IF CURSOR_STATUS('global','M_DmField') >= -1
		BEGIN
			DEALLOCATE M_DmField
		END

		DECLARE M_DmField CURSOR FAST_FORWARD FOR
			SELECT Ma_File, Field_Name FROM DmField
			WHERE UPPER(Ma_Field) = UPPER(@p_Ma_Field)

		OPEN M_DmField
		FETCH NEXT FROM M_DmField INTO @v_Ma_File, @v_Field_Name

		WHILE @@FETCH_STATUS = 0
		BEGIN
			IF EXISTS(SELECT * FROM sysobjects o LEFT OUTER JOIN syscolumns c
				ON o.[ID] = c.[ID] WHERE UPPER(o.[Name]) = UPPER(@v_Ma_File)
					AND UPPER(c.[Name]) = UPPER(@v_Field_Name))
			BEGIN
				SET @v_SQL = 'UPDATE ' + @v_Ma_File + ' SET ' + @v_Field_Name + ' = N''' +
						REPLACE(LTRIM(@p_New_Value), '''', '''''') + ''' WHERE UPPER(' + @v_Field_Name + ') = UPPER(N''' + REPLACE(@p_Old_Value, '''', '''''') + ''')'
				--PRINT @v_SQL
				EXECUTE(@v_SQL)
			END
			FETCH NEXT FROM M_DmField INTO @v_Ma_File, @v_Field_Name
		END
		
		CLOSE M_DmField
		DEALLOCATE M_DmField

		COMMIT
		RETURN 1
	END TRY
	BEGIN CATCH
		ROLLBACK
		RETURN -2
	END CATCH
END
