USE [TK-GW-00001-DB-0001]
GO

/************************************************/
/* Tao kieu du lieu */

exec sp_addtype T_BIT, "bit", "NOT NULL DEFAULT 0"
go

exec sp_addtype T_DATE, "datetime", "NULL"
go

exec sp_addtype T_GIA, "numeric(26,6)", "NOT NULL DEFAULT 0"
go

exec sp_addtype T_ID, "uniqueidentifier", "NULL"
go

exec sp_addtype T_INT, "int", "NULL"
go

exec sp_addtype T_LUONG, "numeric(26,6)", "NOT NULL DEFAULT 0"
go

exec sp_addtype T_PT, "numeric(10,6)", "NOT NULL DEFAULT 0"
go

exec sp_addtype T_TGIA, "numeric(26,9)", "NOT NULL DEFAULT 0"
go

exec sp_addtype T_TIEN, "numeric(26,4)", "NOT NULL DEFAULT 0"
go

exec sp_addtype T_D001, "nvarchar(1)", "NOT NULL"
go

exec sp_addtype T_D002, "nvarchar(2)", "NOT NULL"
go

exec sp_addtype T_D003, "nvarchar(3)", "NOT NULL"
go

exec sp_addtype T_D004, "nvarchar(4)", "NOT NULL"
go

exec sp_addtype T_D006, "nvarchar(6)", "NOT NULL"
go

exec sp_addtype T_D020, "nvarchar(20)", "NULL"
go

exec sp_addtype T_D032, "nvarchar(32)", "NULL"
go

exec sp_addtype T_D128, "nvarchar(128)", "NULL"
go

exec sp_addtype T_D256, "nvarchar(256)", "NULL"
go


/* End kieu du lieu */


CREATE TABLE DmFile (
       Id                   T_ID DEFAULT NEWID() NOT NULL,
       Ma_File              T_D032 NOT NULL,
       Ten_File             T_D128 NOT NULL,
       Ten_File_E           T_D128 NOT NULL,
       FieldList            T_D128 NOT NULL,
       FieldName            T_D032 NOT NULL,
       FieldOrder           T_D128,
       FilterFieldList      T_D128 NOT NULL,
       StartPos             T_INT NOT NULL DEFAULT 0,
       MaxRows              T_INT NOT NULL DEFAULT 0,
       EachWord             T_BIT NOT NULL DEFAULT 0,
       Access               T_BIT NOT NULL DEFAULT 1
)
go

ALTER TABLE DmFile
       ADD PRIMARY KEY (Id)
go

CREATE TABLE DmField (
       Ma_Field             T_D032 NOT NULL, --Tên trường trong danh mục
       Ma_File              T_D032 NOT NULL, --Tên table có chứa trường cần thay đổi
       Field_Name           T_D032 NOT NULL  --Tên trường cần thay đổi
)
go

ALTER TABLE DmField ADD PRIMARY KEY (Ma_Field, Ma_File, Field_Name)
go

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[UserRights](
	[UserId] [dbo].[T_ID] NOT NULL,
	[FuncId] [dbo].[T_ID] NOT NULL,
	[FuncType] [dbo].[T_D001] NOT NULL,
	[Right_1] [dbo].[T_BIT] NOT NULL,
	[Right_2] [dbo].[T_BIT] NOT NULL,
	[Right_3] [dbo].[T_BIT] NOT NULL,
	[Right_4] [dbo].[T_BIT] NOT NULL,
	[Right_5] [dbo].[T_BIT] NOT NULL,
	[IsUser] [dbo].[T_BIT] NOT NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[[HIEUQUADUAN]]    Script Date: 3/17/2022 9:08:30 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[HIEUQUADUAN](
	[Id]							[T_ID] DEFAULT NEWID() NOT NULL,
	[DUAN_Id]						[T_ID] NULL,
	[MADUAN]						[T_D256] NULL,
	[AM_Id]							[T_ID] NULL,
	[PHONGBAN_Id]					[T_ID] NULL,
	[KHACHHANG_Id]					[T_ID] NULL,
	[NGAYGHINHANDOANHTHU]			[T_DATE] NULL,
	[GHICHU]						[NVARCHAR](MAX) NULL,
	[LANTHANHTOAN]					[T_INT] NULL,
	[DOANHTHU]						[T_TIEN] DEFAULT 0 NOT NULL,
	[GIAVONMUANGOAI]				[T_TIEN] DEFAULT 0 NOT NULL,
	[GIAVONNOIBO]					[T_TIEN] DEFAULT 0 NOT NULL,
	[LAIGOP]						[T_TIEN] DEFAULT 0 NOT NULL,
	[CHIPHITAICHINH]				[T_TIEN] DEFAULT 0 NOT NULL,
	[CHIPHIKINHDOANHTRUCTIEP]		[T_TIEN] DEFAULT 0 NOT NULL,
	[CHIPHIKHAC]					[T_TIEN] DEFAULT 0 NOT NULL,
	[HIEUQUAKINHDOANH]				[T_TIEN] DEFAULT 0 NOT NULL,
	[CreatedAt]						[T_DATE] NOT NULL,
	[CreatedBy]						[T_ID] NOT NULL,
	[ModifiedAt]					[T_DATE] NOT NULL,
	[ModifiedBy]					[T_ID] NOT NULL,
 CONSTRAINT [PK_HIEUQUADUAN] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[[THANHTOANDUAN]]    Script Date: 3/17/2022 9:08:30 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO
 
CREATE TABLE [dbo].THANHTOANDUAN(
	[Id]							[T_ID] DEFAULT NEWID() NOT NULL,
	[DUAN_Id]						[T_ID] NULL,
	[MADUAN]						[T_D256] NULL,
	[NGAYYEUCAUTHANHTOAN]			[T_DATE] NULL,
	[DEADLINE]						[T_DATE] NULL,
	[DIENGIAI]						[NVARCHAR](MAX) NULL,
	[SOTIEN]						[T_TIEN] DEFAULT 0 NOT NULL,
	[VAT]							[T_INT] DEFAULT 0 NOT NULL,
	[CreatedAt]						[T_DATE] NOT NULL,
	[CreatedBy]						[T_ID] NOT NULL,
	[ModifiedAt]					[T_DATE] NOT NULL,
	[ModifiedBy]					[T_ID] NOT NULL,
 CONSTRAINT PK_THANHTOANDUAN PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[THANHTOANDUAN] WITH CHECK ADD  CONSTRAINT [FK_THANHTOANDUAN_DMDUAN_DUAN_Id] FOREIGN KEY([DUAN_Id])
REFERENCES [dbo].[DMDUAN] ([Id])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[THANHTOANDUAN] CHECK CONSTRAINT [FK_THANHTOANDUAN_DMDUAN_DUAN_Id]
GO

/****** Object:  Table [dbo].[[CHIPHIDUAN]]    Script Date: 3/17/2022 9:08:30 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO
 
CREATE TABLE [dbo].CHIPHIDUAN(
	[Id]							[T_ID] DEFAULT NEWID() NOT NULL,
	[DUAN_Id]						[T_ID] NULL,
	[MADUAN]						[T_D256] NULL,
	[NGAYTHANG]						[T_DATE] NULL,
	[SOTIENGROSS]					[T_TIEN] DEFAULT 0 NOT NULL,
	[SOTIENNET]						[T_TIEN] DEFAULT 0 NOT NULL,
	[NOIDUNG]						[NVARCHAR](MAX) NULL,
	[LOAICHIPHI]					[T_D256] NOT NULL,
	[DOITUONG]						[T_D256] NOT NULL,
	[CreatedAt]						[T_DATE] NOT NULL,
	[CreatedBy]						[T_ID] NOT NULL,
	[ModifiedAt]					[T_DATE] NOT NULL,
	[ModifiedBy]					[T_ID] NOT NULL,
 CONSTRAINT PK_CHIPHIDUAN PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[CHIPHIDUAN] WITH CHECK ADD  CONSTRAINT [FK_CHIPHIDUAN_DMDUAN_DUAN_Id] FOREIGN KEY([DUAN_Id])
REFERENCES [dbo].[DMDUAN] ([Id])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[CHIPHIDUAN] CHECK CONSTRAINT [FK_CHIPHIDUAN_DMDUAN_DUAN_Id]
GO


/****** Object:  Table [dbo].[[DOANHTHUDUAN]]    Script Date: 3/17/2022 9:08:30 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO
 
CREATE TABLE [dbo].DOANHTHUDUAN(
	[Id]							[T_ID] DEFAULT NEWID() NOT NULL,
	[DUAN_Id]						[T_ID] NULL,
	[MADUAN]						[T_D256] NULL,
	[NGAYNHANTIEN]					[T_DATE] NULL,
	[SOTIEN]						[T_TIEN] DEFAULT 0 NOT NULL,
	[DIENGIAI]						[NVARCHAR](MAX) NULL,
	[LOAIDOANHTHU]					[T_D256] NOT NULL,
	[DOITUONG]						[T_D256] NOT NULL,
	[CreatedAt]						[T_DATE] NOT NULL,
	[CreatedBy]						[T_ID] NOT NULL,
	[ModifiedAt]					[T_DATE] NOT NULL,
	[ModifiedBy]					[T_ID] NOT NULL,
 CONSTRAINT PK_DOANHTHUDUAN PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[DOANHTHUDUAN] WITH CHECK ADD  CONSTRAINT [FK_DOANHTHUDUAN_DMDUAN_DUAN_Id] FOREIGN KEY([DUAN_Id])
REFERENCES [dbo].[DMDUAN] ([Id])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[DOANHTHUDUAN] CHECK CONSTRAINT [FK_DOANHTHUDUAN_DMDUAN_DUAN_Id]
GO

/****** Object:  Table [dbo].[DMCOQUANBO]    Script Date: 3/17/2022 9:08:30 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[DMCOQUANBO](
	[Id] [uniqueidentifier] DEFAULT NEWID() NOT NULL,
	[Code] [nvarchar](256) NOT NULL,
	[Name] [nvarchar](256) NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedAt] [datetime] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_DMCOQUANBO] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[DMPHONGBAN]    Script Date: 3/17/2022 9:08:39 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[DMPHONGBAN](
	[Id] [uniqueidentifier] DEFAULT NEWID() NOT NULL,
	[COQUANBO_Id] [uniqueidentifier] NOT NULL,
	[Code] [nvarchar](5) NULL,
	[Name] [nvarchar](256) NULL,
	[CreatedAt] [datetime] NOT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedAt] [datetime] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_DMPHONGBAN] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[DMPHONGBAN]  WITH CHECK ADD  CONSTRAINT [FK_DMPHONGBAN_DMCOQUANBO_COQUANBO_Id] FOREIGN KEY([COQUANBO_Id])
REFERENCES [dbo].[DMCOQUANBO] ([Id])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[DMPHONGBAN] CHECK CONSTRAINT [FK_DMPHONGBAN_DMCOQUANBO_COQUANBO_Id]
GO

/****** Object:  Table [dbo].[DMKHACHHANG]    Script Date: 3/17/2022 9:16:01 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[DMKHACHHANG](
	[Id] [uniqueidentifier] DEFAULT NEWID() NOT NULL,
	[Name] [nvarchar](256) NULL,
	[DiaChi] [nvarchar](max) NULL,
	[DienThoai] [nvarchar](256) NULL,
	[Other] [nvarchar](max) NULL,
	[TheoDoi] [T_BIT] NULL,
	[Loai] [nvarchar](1) NULL,
	[DKKD] [nvarchar](20) NULL,
	[Note] [nvarchar](max) NULL,
	[CreatedAt] [datetime] NOT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedAt] [datetime] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_DMKHACHHANG] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Object:  Table [dbo].[DMDUAN]    Script Date: 3/17/2022 9:37:37 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[DMDUAN](
	[Id] [uniqueidentifier] DEFAULT NEWID() NOT NULL,
	[KHACHHANG_Id] [uniqueidentifier] NOT NULL,
	[Mota] [nvarchar](max) NULL,
	[StartDate] [datetime] NULL,
	[EndDate] [datetime] NULL,
	[TheoDoi] [nvarchar](2) NULL,
	[Code] [nvarchar](256) NULL,
	[Name] [nvarchar](256) NULL,
	[SoHopDong] [nvarchar](256) NULL,
	[NamDuAn] [nvarchar](4) NULL,
	[PHONGBAN_Id] [uniqueidentifier] NOT NULL,
	[AM_Id] [uniqueidentifier] NOT NULL,
	[NgayKyHD] [datetime] NULL,
	[GiaTriHD] [numeric](18, 0) NULL,
	[CreatedAt] [datetime] NOT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedAt] [datetime] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_DMDUAN] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


/****** Object:  Table [dbo].[Menu]    Script Date: 3/17/2022 10:07:00 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [Menu](
	[Id] [uniqueidentifier] NOT NULL,
	[Bar] [nvarchar](256) NOT NULL,
	[ParentId] [uniqueidentifier] NULL,
	[Type] [nvarchar](2) NULL,
	[SubId] [uniqueidentifier] NULL,
	[ChildId] [uniqueidentifier] NULL,
	[Ma_File] [nvarchar](256) NULL,
	[ControlId] [nvarchar](256) NULL,
	[ControlType] [nvarchar](256) NULL,
	[DockStyle] [nvarchar](256) NULL,
	[ChildControlId] [nvarchar](256) NULL,
	[Image_Name] [nvarchar](256) NULL,
	[OrderId] [integer] NOT NULL,
	[ExtraVar] [nvarchar](256) NULL,
	[IsContract] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [Menu] ADD  DEFAULT (newid()) FOR [Id]
GO

ALTER TABLE [Menu] ADD  DEFAULT ((1)) FOR [IsContract]
GO


/****** Object:  Table [dbo].[BAOCAO]    Script Date: 3/17/2022 9:08:30 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[BAOCAO](
	[Id]					[T_ID] DEFAULT NEWID() NOT NULL,
	[NGAYBAOCAO]			[T_DATE] NULL,
	[THOIGIANGUIBAOCAO]		[T_DATE] NULL,
	[NGUOIBAOCAO_Id]		[T_ID] NULL,
	[PHONGBAN_Id]			[T_ID] NULL,
	[HOVATEN]				[T_D256] NULL,
	[TRANGTHAI_Id]			[T_D256] NULL,
	[DALAYVEKHAY]			[T_D001] NULL,
	[NGUOIPHEDUYET_Id]		[T_ID] NULL,
	[THOIGIANDUYETBAOCAO]	[T_DATE] NULL,
	[NHANXETCHUNG]			[NVARCHAR](MAX) NULL,
	[NGUOINHANCC_Id]		[T_ID] NULL,
	[NGUOIDUNG_Id]			[T_ID] NULL,
	[CreatedAt]				[T_DATE] NOT NULL,
	[CreatedBy]				[T_ID] NOT NULL,
	[ModifiedAt]			[T_DATE] NOT NULL,
	[ModifiedBy]			[T_ID] NOT NULL
 CONSTRAINT [PK_BAOCAO] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


/****** Object:  Table [dbo].[BAOCAOCHITIET]    Script Date: 3/17/2022 9:08:30 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[BAOCAOCHITIET](
	[Id]				[T_ID] DEFAULT NEWID() NOT NULL,
	[BAOCAO_Id]			[T_ID] NULL,
	[TENCONGVIEC]		[nvarchar](max) NULL,
	[DEXUAT]			[nvarchar](max) NULL,
	[XEMXET]			[nvarchar](max) NULL,
	[VIECDUOCGIAO_Id]	[uniqueidentifier] NULL,
	[KHACHHANG_Id]		[uniqueidentifier] NULL,
	[PHEDUYET]			[T_D001] NULL,
	[TYLEHOANTHANH]		[T_D001] NULL,
	[CC]				[nvarchar](max) NULL,
	[NGUOIDUYET_Id]		[T_ID] NULL,
	[DUAN_Id]			[T_ID] NULL,
	[SOCONGDADUNG]		[T_TIEN] NULL,
	[SOCONGDUOCDUYET]	[T_TIEN] NULL,
	[TRONGGIO]			[T_TIEN] NULL,
	[NGOAIGIO]			[T_TIEN] NULL,
	[NHANVIEN_Id]		[T_ID] NULL,
	[BAM_Id]			[T_ID] NULL,
	[BNGAYBAOCAO]		[T_DATE] NULL,
	[BTRANGTHAIID]		[T_D020] NULL,
	[BPHANCAP]			[T_D001] NULL,
	[CHIPHITRONGGIO]	[T_TIEN] NULL,
	[CHIPHINGOAIGIO]	[T_TIEN] NULL,
	[TONGCHIPHI]		[T_TIEN] NULL,
	[CreatedAt]			[datetime] NOT NULL,
	[CreatedBy]			[uniqueidentifier] NOT NULL,
	[ModifiedAt]		[datetime] NOT NULL,
	[ModifiedBy]		[uniqueidentifier] NOT NULL
 CONSTRAINT [PK_BAOCAOCHITIET] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


/****** Object:  Table [dbo].[NHATKYHETHONG]    Script Date: 3/17/2022 9:08:30 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[NHATKYHETHONG](
	[Id]				[T_ID] DEFAULT NEWID() NOT NULL,
	[User_Id]			[T_ID] NOT NULL,
	[CHUCNANG]			[T_D256] NOT NULL,
	[HANHDONG]			[nvarchar](max) NOT NULL,
	[THOIGIAN]			[T_DATE] NOT NULL
	
 CONSTRAINT [PK_NHATKYHETHONG] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


/****** Object:  Table [dbo].[PHONGBANQUANLY]    Script Date: 4/28/2022 10:06:46 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[PHONGBANQUANLY](
	[UserId] [dbo].[T_ID] NOT NULL,
	[PHONGBAN_Id] [dbo].[T_ID] NOT NULL,
 CONSTRAINT [PK_PHONGBANQUANLY] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[PHONGBAN_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


/****** Object:  Table [dbo].[NHANVIENQUANLY]    Script Date: 4/28/2022 10:06:46 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[NHANVIENQUANLY](
	[UserId] [dbo].[T_ID] NOT NULL,
	[NHANVIEN_Id] [dbo].[T_ID] NOT NULL,
 CONSTRAINT [PK_NHANVIENQUANLY] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[NHANVIEN_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


/****** Object:  Table [dbo].[UserProfile]    Script Date: 3/17/2022 9:08:30 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[UserProfile](
	[Id]						[T_ID] NOT NULL,
	[HOVATEN]					[T_D256] NULL,
	[DANHSACHUYQUYEN]			[T_D256] NULL,
	[PHONGBAN_Id]				[T_ID] NULL,
	[COQUANBO_Id]				[T_ID] NULL,
	[BAOCAODEN]					[T_ID] NULL,
	[NGAYSINH]					[T_DATE] NULL,
	[GIOITINH]					[T_D001] NULL,
	[CHUCVU]					[T_D256] NULL,
	[CAPBAC]					[T_D001] NULL,
	[NAMTOTNGHIEP]				[T_INT] NULL,
	[DIENTHOAI]					[T_D256] NULL,
	[TINHTRANGCONGVIEC]			[T_D256] NULL,
	[SOCCCD]					[T_D256] NULL,
	[NGAYCAP]					[T_DATE] NULL,
	[NOICAP]					[T_D256] NULL,
	[QUEQUAN]					[NVARCHAR](MAX) NULL,
	[DIACHIHIENTAI]				[NVARCHAR](MAX) NULL,
	[TRUONGHOC]					[NVARCHAR](MAX) NULL,
	[NGANHHOC]					[NVARCHAR](MAX) NULL,
	[TRINHDONGOAINGU]			[NVARCHAR](MAX) NULL,
	[NGAYCHINHTHUCLAMVIEC]		[T_DATE] NULL,
	[MASOTHUE]					[T_D256] NULL,
	[SOSOBH]					[T_D256] NULL,
	[BIENSOXE]					[T_D256] NULL,
	[THANHPHANGIADINH]			[NVARCHAR](MAX) NULL,
	[TINHTRANGHONNHAN]			[NVARCHAR](MAX) NULL,
	[NGOAINGUKHAC]				[NVARCHAR](MAX) NULL,
	[CHUYENNGANHKHAC]			[NVARCHAR](MAX) NULL,
	[HOPDONGHIENTAI]			[NVARCHAR](MAX) NULL,
	[SOHOPDONGLAODONG]			[NVARCHAR](MAX) NULL,
	[TUNGAY]					[T_DATE] NULL,
	[DENNGAY]					[T_DATE] NULL,
	[SOTAIKHOANLUONG]			[NVARCHAR](MAX) NULL,
	[NGUOILIENHE]				[NVARCHAR](MAX) NULL,
	[DIENTHOAINGUOILIENHE]		[NVARCHAR](MAX) NULL,
	[QUANHE]					[NVARCHAR](MAX) NULL,
	[SONGUOIGIAMTRU]			[T_INT] NULL,
	[MASONGUOIPHUTHUOC]			[NVARCHAR](MAX) NULL,
	[DATIEMVACXIN]				[NVARCHAR](MAX) NULL,
	[LOAIVACXIN]				[NVARCHAR](MAX) NULL
 CONSTRAINT [PK_UserProfile] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


/****** Object:  Table [dbo].[TBLS]    Script Date: 6/9/2022 6:42:22 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE TABLE [dbo].[TBLS](
	[SALID] [dbo].[T_ID] NOT NULL,
	[NHANVIENID] [dbo].[T_ID] NULL,
	[PHONGBANID] [dbo].[T_ID] NULL,
	[SOTAIKHOAN] [dbo].[T_D020] NULL,
	[NGANHANG] [dbo].[T_D256] NULL,
	[LUONG] [dbo].[T_TIEN] NULL,
	[THUONGHIEUQUA] [dbo].[T_TIEN] NULL,
	[PCTRACHNHIEM] [dbo].[T_TIEN] NULL,
	[PCANTRUA] [dbo].[T_TIEN] NULL,
	[PCDIENTHOAI] [dbo].[T_TIEN] NULL,
	[PCTRANGPHUC] [dbo].[T_TIEN] NULL,
	[PCKHAC] [dbo].[T_TIEN] NULL,
	[SONGUOIPHUTHUOC] [dbo].[T_TIEN] NULL,
	[GIAMTRUCANHAN] [dbo].[T_TIEN] NULL,
	[GIAMTRUGIACANH] [dbo].[T_TIEN] NULL,
	[BHXH] [dbo].[T_TIEN] NULL,
	[BHYT] [dbo].[T_TIEN] NULL,
	[BHTN] [dbo].[T_TIEN] NULL,
	[CONGDOAN] [dbo].[T_TIEN] NULL,
	[TONGTHUNHAPCHIUTHUE] [dbo].[T_TIEN] NULL,
	[THUETNCN] [dbo].[T_TIEN] NULL,
	[THUCLINH] [dbo].[T_TIEN] NULL,
	[CHILUONGPHUCAP] [dbo].[T_TIEN] NULL,
	[CHIBAOHIEM] [dbo].[T_TIEN] NULL,
	[TONGCHIPHINHANSU] [dbo].[T_TIEN] NULL,
	[NGAYCONGTIEUCHUAN] [dbo].[T_TIEN] NULL,
	[NGAYCONGTHUCTE] [dbo].[T_TIEN] NULL,
	[DIEUCHINHTRUOCTHUE1] [dbo].[T_TIEN] NULL,
	[DIEUCHINHTRUOCTHUE2] [dbo].[T_TIEN] NULL,
	[DIEUCHINHSAUTHUE1] [dbo].[T_TIEN] NULL,
	[DIEUCHINHSAUTHUE2] [dbo].[T_TIEN] NULL,
	[DANHANLAN1] [dbo].[T_INT] NULL,
	[DANHANLAN2] [dbo].[T_INT] NULL,
	[THANG] [dbo].[T_INT] NULL,
	[NAM] [dbo].[T_INT] NULL,
	[GHICHUHETHONG] [nvarchar](max) NULL,
	[GHICHUCANHAN] [nvarchar](max) NULL,
	[XEPLOAI] [dbo].[T_D020] NULL,
	[COQUANID] [dbo].[T_ID] NULL,
	[TAMUNG] [dbo].[T_TIEN] NULL,
	[DIEUCHINHTRUOCTHUE3] [dbo].[T_TIEN] NULL,
	[DIEUCHINHSAUTHUE3] [dbo].[T_TIEN] NULL,
	[SOLANTRONGTHANG] [dbo].[T_INT] NULL,
	[TRANGTHAIID] [dbo].[T_D256] NULL,
	[PCVPP] [dbo].[T_TIEN] NULL,
	[QUYLUONGBHXH] [dbo].[T_TIEN] NULL,
	[TROCAPTHOIVIEC] [dbo].[T_TIEN] NULL,
 CONSTRAINT [PK_TBLS] PRIMARY KEY CLUSTERED 
(
	[SALID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


/****** Object:  Table [dbo].[SML]    Script Date: 5/13/2022 2:40:50 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE TABLE [dbo].[SML](
	[SALID] [dbo].[T_ID] NOT NULL,
	[NHANVIENID] [dbo].[T_ID] NULL,
	[PHONGBANID] [dbo].[T_ID] NULL,
	[SOTAIKHOAN] [dbo].[T_D020] NULL,
	[NGANHANG] [dbo].[T_D256] NULL,
	[LUONG] [dbo].[T_TIEN] NULL,
	[THUONGHIEUQUA] [dbo].[T_TIEN] NULL,
	[PCTRACHNHIEM] [dbo].[T_TIEN] NULL,
	[PCANTRUA] [dbo].[T_TIEN] NULL,
	[PCDIENTHOAI] [dbo].[T_TIEN] NULL,
	[PCTRANGPHUC] [dbo].[T_TIEN] NULL,
	[PCKHAC] [dbo].[T_TIEN] NULL,
	[SONGUOIPHUTHUOC] [dbo].[T_TIEN] NULL,
	[GIAMTRUCANHAN] [dbo].[T_TIEN] NULL,
	[GIAMTRUGIACANH] [dbo].[T_TIEN] NULL,
	[BHXH] [dbo].[T_TIEN] NULL,
	[BHYT] [dbo].[T_TIEN] NULL,
	[BHTN] [dbo].[T_TIEN] NULL,
	[CONGDOAN] [dbo].[T_TIEN] NULL,
	[TONGTHUNHAPCHIUTHUE] [dbo].[T_TIEN] NULL,
	[THUETNCN] [dbo].[T_TIEN] NULL,
	[THUCLINH] [dbo].[T_TIEN] NULL,
	[CHILUONGPHUCAP] [dbo].[T_TIEN] NULL,
	[CHIBAOHIEM] [dbo].[T_TIEN] NULL,
	[TONGCHIPHINHANSU] [dbo].[T_TIEN] NULL,
	[NGAYCONGTIEUCHUAN] [dbo].[T_TIEN] NULL,
	[NGAYCONGTHUCTE] [dbo].[T_TIEN] NULL,
	[DIEUCHINHTRUOCTHUE1] [dbo].[T_TIEN] NULL,
	[DIEUCHINHTRUOCTHUE2] [dbo].[T_TIEN] NULL,
	[DIEUCHINHSAUTHUE1] [dbo].[T_TIEN] NULL,
	[DIEUCHINHSAUTHUE2] [dbo].[T_TIEN] NULL,
	[DANHANLAN1] [dbo].[T_TIEN] NULL,
	[DANHANLAN2] [dbo].[T_TIEN] NULL,
	[THANG] [dbo].[T_INT] NULL,
	[NAM] [dbo].[T_INT] NULL,
	[GHICHUHETHONG] [nvarchar](max) NULL,
	[GHICHUCANHAN] [nvarchar](max) NULL,
	[XEPLOAI] [dbo].[T_D020] NULL,
	[COQUANID] [dbo].[T_ID] NULL,
	[TAMUNG] [dbo].[T_TIEN] NULL,
	[DIEUCHINHTRUOCTHUE3] [dbo].[T_TIEN] NULL,
	[DIEUCHINHSAUTHUE3] [dbo].[T_TIEN] NULL,
	[SOLANTRONGTHANG] [dbo].[T_INT] NULL,
	[TRANGTHAIID] [dbo].[T_D256] NULL,
	[PCVPP] [dbo].[T_TIEN] NULL,
	[QUYLUONGBHXH] [dbo].[T_TIEN] NULL,
	[TROCAPTHOIVIEC] [dbo].[T_TIEN] NULL,
 CONSTRAINT [PK_SML] PRIMARY KEY CLUSTERED 
(
	[SALID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO



truncate table menu

select * from menu

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [SubId], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Khai báo tham số hệ thống', '7C8F92F5-6635-426E-A612-8ED4CFEE04FD', 'S', null, 'SystemParameters', null, 'none', null, 'setting.svg', 100)

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [SubId], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Quản lý người sử dụng', '7C8F92F5-6635-426E-A612-8ED4CFEE04FD', 'S', null, 'manageruserlister', 'userlister', 'full', 'managerusereditor', 'users.svg', 200)

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [SubId], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Khai báo tham số tìm kiếm', '7C8F92F5-6635-426E-A612-8ED4CFEE04FD', 'S', null, 'DmFileLister', null, 'none', null, 'list_decleration.svg', 300)

INSERT INTO [dbo].[Menu]
    ([Id], [Bar], [ParentId], [Type], [SubId], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    ('A1AE92C2-2E8D-4C37-858D-B591CD008C0F', N'Quản trị hệ thống', null, 'M', null, null, null, null, null, 'menu_tai_san_cong_cu.svg', 1000)

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Quản lý tài khoản', 'A1AE92C2-2E8D-4C37-858D-B591CD008C0F', 'L', 'DmTkLister', 'listlister', 'full', 'DmTkEditor', null, 1100)

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Quản lý vai trò', 'A1AE92C2-2E8D-4C37-858D-B591CD008C0F', 'L', 'DmTkLister', 'listlister', 'full', 'DmTkEditor', null, 1200)

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Quản lý cấu hình hệ thống', 'A1AE92C2-2E8D-4C37-858D-B591CD008C0F', 'L', 'DmTkLister', 'listlister', 'full', 'DmTkEditor', null, 1300)	

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Quản lý thông tin lương', 'A1AE92C2-2E8D-4C37-858D-B591CD008C0F', 'L', 'DmTkLister', 'listlister', 'full', 'DmTkEditor', null, 1400)	

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Nhật ký sử dụng phần mềm', 'A1AE92C2-2E8D-4C37-858D-B591CD008C0F', 'L', 'DmTkLister', 'listlister', 'full', 'DmTkEditor', null, 1500)	

INSERT INTO [dbo].[Menu]
    ([Id], [Bar], [ParentId], [Type], [SubId], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    ('F8E8F198-EE39-4EC6-83E5-CFB41032DA36',N'Báo cáo thống kê', null, 'M', null, null, null, null, null, 'menu_tai_san_cong_cu.svg', 2000)

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Tổng hợp chi phí nhân công các bộ phận đã thực hiện', 'F8E8F198-EE39-4EC6-83E5-CFB41032DA36', 'L', 'DmTkLister', 'listlister', 'full', 'DmTkEditor', null, 2100)

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Tổng hợp chi phí nhân công các bộ phận đã sử dụng', 'F8E8F198-EE39-4EC6-83E5-CFB41032DA36', 'L', 'DmTkLister', 'listlister', 'full', 'DmTkEditor', null, 2200)

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Tổng hợp báo cáo theo khách hàng - dự án', 'F8E8F198-EE39-4EC6-83E5-CFB41032DA36', 'L', 'DmTkLister', 'listlister', 'full', 'DmTkEditor', null, 2300)	

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Báo cáo theo dự án', 'F8E8F198-EE39-4EC6-83E5-CFB41032DA36', 'L', 'DmTkLister', 'listlister', 'full', 'DmTkEditor', null, 2400)	

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Tổng hợp hiệu quả dự án', 'F8E8F198-EE39-4EC6-83E5-CFB41032DA36', 'L', 'DmTkLister', 'listlister', 'full', 'DmTkEditor', null, 2500)

INSERT INTO [dbo].[Menu]
    ([Id], [Bar], [ParentId], [Type], [SubId], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    ('74861C02-D645-4E58-9093-6BF232E099E1', N'Quản trị danh mục', null, 'M', null, null, null, null, null, 'menu_tong_hop.svg', 3000)


INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Danh mục công ty', '74861C02-D645-4E58-9093-6BF232E099E1', 'L', 'DMCOQUANBOLister', 'listlister', 'full', 'DMCOQUANBOEditor', null, 3100)

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Danh mục phòng ban', '74861C02-D645-4E58-9093-6BF232E099E1', 'L', 'DMPHONGBANLister', 'listlister', 'full', 'DMPHONGBANEditor', null, 3200)

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Danh mục dự án', '74861C02-D645-4E58-9093-6BF232E099E1', 'L', 'DmTkLister', 'listlister', 'full', 'DmTkEditor', null, 3300)	

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Danh mục khách hàng', '74861C02-D645-4E58-9093-6BF232E099E1', 'L', 'DmTkLister', 'listlister', 'full', 'DmTkEditor', null, 3400)	

INSERT INTO [dbo].[Menu]
    ([Id], [Bar], [ParentId], [Type], [SubId], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    ('21D56BBB-8049-4522-83DF-2E0BA6FF03F4', N'Báo cáo công việc cá nhân', null, 'M', null, null, null, null, null, 'menu_tong_hop.svg', 4000)


INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Báo cáo công việc hằng ngày', '21D56BBB-8049-4522-83DF-2E0BA6FF03F4', 'L', 'DmTkLister', 'listlister', 'full', 'DmTkEditor', null, 4100)

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Báo cáo chờ phê duyệt', '21D56BBB-8049-4522-83DF-2E0BA6FF03F4', 'L', 'DmTkLister', 'listlister', 'full', 'DmTkEditor', null, 4200)

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Báo cáo đã phê duyệt', '21D56BBB-8049-4522-83DF-2E0BA6FF03F4', 'L', 'DmTkLister', 'listlister', 'full', 'DmTkEditor', null, 4300)	

INSERT INTO [dbo].[Menu]
    ([Bar], [ParentId], [Type], [ControlId], [ControlType], [DockStyle], [ChildControlId], [Image_Name], [OrderId])
VALUES
    (N'Tự động duyệt báo cáo', '21D56BBB-8049-4522-83DF-2E0BA6FF03F4', '', '', '', '', '', null, 4400)	

INSERT INTO [dbo].[DmFile]
    (Id, [Ma_File], [Ten_File], [Ten_File_E], [FieldList], [FieldName], [FieldOrder], [FilterFieldList], [StartPos], [MaxRows], [EachWord], [Access])
VALUES
    ('2EBE264F-C61B-4934-8275-D87D96ED4A99', 'DMCOQUANBO', N'Danh mục công ty', N'', N'Code, Name', N'Code', N'Code', N'Code', 1, 50, 1, 1)
GO

INSERT INTO [dbo].[DmFile]
    (Id, [Ma_File], [Ten_File], [Ten_File_E], [FieldList], [FieldName], [FieldOrder], [FilterFieldList], [StartPos], [MaxRows], [EachWord], [Access])
VALUES
    ('3EBE264F-C61B-4934-8275-D87D96ED4A99', 'DMPHONGBAN', N'Danh mục phòng ban', N'', N'Code, Name', N'Code', N'Code', N'Code', 1, 50, 1, 1)
GO

INSERT INTO [dbo].[DmFile]
    (Id, [Ma_File], [Ten_File], [Ten_File_E], [FieldList], [FieldName], [FieldOrder], [FilterFieldList], [StartPos], [MaxRows], [EachWord], [Access])
VALUES
    ('4EBE264F-C61B-4934-8275-D87D96ED4A99', 'DMKHACHHANG', N'Danh mục khách hàng', N'', N'Name, DiaChi', N'Name', N'Name', N'Name', 1, 50, 1, 1)
GO