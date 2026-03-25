
CREATE TABLE [dbo].[tblTCDA](
	[Id] [uniqueidentifier] NOT NULL,
	[MADUAN] [nvarchar](256) NULL,
	[DUANID] [uniqueidentifier] NULL,
	[NOIDUNG] [nvarchar](max) NULL,
	[NGAYTHANG] [datetime] NULL,
	[KHACHHANGID] [uniqueidentifier] NULL,
	[AMID] [uniqueidentifier] NULL,
	[PHONGBANID] [uniqueidentifier] NULL,
	[SOTIEN] [dbo].[T_TIEN] NULL,
	[NGUOITHUHUONGID] [uniqueidentifier] NULL,
	[EMAIL] [nvarchar](256) NULL,
	[LOAICHIPHI] [int] NULL,
	[SOTIENGROSS] [dbo].[T_TIEN] NULL,
	[THUE] [dbo].[T_TIEN] NULL,
	[MALOAICHIPHI] [nvarchar](20) NULL,
	[CreatedAt] [dbo].[T_DATE] NULL,
	[CreatedBy] [dbo].[T_ID] NULL,
	[ModifiedAt] [dbo].[T_DATE] NULL,
	[ModifiedBy] [dbo].[T_ID] NULL,
 CONSTRAINT [PK_tblTCDA] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[tblTCDA] ADD  CONSTRAINT [DF_tblTCDA_Id]  DEFAULT (newid()) FOR [Id]
GO


