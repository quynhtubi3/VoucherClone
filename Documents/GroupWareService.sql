USE [master]
GO
/****** Object:  Database [GroupWareService]    Script Date: 3/15/2022 1:03:03 AM ******/
CREATE DATABASE [GroupWareService]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'GroupWareService', FILENAME = N'/var/opt/mssql/data/GroupWareService.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'GroupWareService_log', FILENAME = N'/var/opt/mssql/data/GroupWareService_log.ldf' , SIZE = 73728KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [GroupWareService] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [GroupWareService].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [GroupWareService] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [GroupWareService] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [GroupWareService] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [GroupWareService] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [GroupWareService] SET ARITHABORT OFF 
GO
ALTER DATABASE [GroupWareService] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [GroupWareService] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [GroupWareService] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [GroupWareService] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [GroupWareService] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [GroupWareService] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [GroupWareService] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [GroupWareService] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [GroupWareService] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [GroupWareService] SET  DISABLE_BROKER 
GO
ALTER DATABASE [GroupWareService] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [GroupWareService] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [GroupWareService] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [GroupWareService] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [GroupWareService] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [GroupWareService] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [GroupWareService] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [GroupWareService] SET RECOVERY FULL 
GO
ALTER DATABASE [GroupWareService] SET  MULTI_USER 
GO
ALTER DATABASE [GroupWareService] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [GroupWareService] SET DB_CHAINING OFF 
GO
ALTER DATABASE [GroupWareService] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [GroupWareService] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [GroupWareService] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [GroupWareService] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [GroupWareService] SET QUERY_STORE = OFF
GO
USE [GroupWareService]
GO
/****** Object:  Table [dbo].[GrpList]    Script Date: 3/15/2022 1:03:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GrpList](
	[Id] [nvarchar](450) NOT NULL,
	[Name] [nvarchar](256) NOT NULL,
	[Role] [nvarchar](256) NOT NULL,
	[NormalizedName] [nvarchar](256) NULL,
	[Description] [nvarchar](256) NULL,
	[ConcurrencyStamp] [nvarchar](max) NULL,
	[NotDelete] [bit] NULL,
	[TK] [nvarchar](256) NOT NULL,
	[Database] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_AspNetRoles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RoleClaims]    Script Date: 3/15/2022 1:03:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RoleClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RoleId] [nvarchar](450) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserClaims]    Script Date: 3/15/2022 1:03:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](450) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserList]    Script Date: 3/15/2022 1:03:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserList](
	[Id] [nvarchar](450) NOT NULL,
	[UserName] [nvarchar](256) NULL,
	[NormalizedUserName] [nvarchar](256) NULL,
	[FullName] [nvarchar](256) NULL,
	[Email] [nvarchar](256) NULL,
	[Email2] [nvarchar](256) NULL,
	[UserName2] [nvarchar](256) NULL,
	[NormalizedEmail] [nvarchar](256) NULL,
	[EmailConfirmed] [bit] NOT NULL,
	[PasswordHash] [nvarchar](max) NULL,
	[SecurityStamp] [nvarchar](max) NULL,
	[ConcurrencyStamp] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[PhoneNumberConfirmed] [bit] NOT NULL,
	[TwoFactorEnabled] [bit] NOT NULL,
	[LockoutEnd] [datetimeoffset](7) NULL,
	[LockoutEnabled] [bit] NOT NULL,
	[AccessFailedCount] [int] NOT NULL,
	[NotDelete] [bit] NULL,
	[TK] [nvarchar](256) NOT NULL,
	[Database] [nvarchar](256) NOT NULL,
	[Server] [nvarchar](256) NULL,
 CONSTRAINT [PK_AspNetUsers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserLogins]    Script Date: 3/15/2022 1:03:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserLogins](
	[LoginProvider] [nvarchar](128) NOT NULL,
	[ProviderKey] [nvarchar](128) NOT NULL,
	[ProviderDisplayName] [nvarchar](max) NULL,
	[UserId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY CLUSTERED 
(
	[LoginProvider] ASC,
	[ProviderKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserRoles]    Script Date: 3/15/2022 1:03:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserRoles](
	[UserId] [nvarchar](450) NOT NULL,
	[RoleId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserTokens]    Script Date: 3/15/2022 1:03:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserTokens](
	[UserId] [nvarchar](450) NOT NULL,
	[LoginProvider] [nvarchar](128) NOT NULL,
	[Name] [nvarchar](128) NOT NULL,
	[Value] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[LoginProvider] ASC,
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[RoleClaims]  WITH CHECK ADD  CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[GrpList] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[RoleClaims] CHECK CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[UserClaims]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[UserList] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[UserClaims] CHECK CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[UserRoles]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[UserList] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[UserRoles] CHECK CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[UserTokens]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[UserList] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[UserTokens] CHECK CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId]
GO
USE [master]
GO
ALTER DATABASE [GroupWareService] SET  READ_WRITE 
GO
