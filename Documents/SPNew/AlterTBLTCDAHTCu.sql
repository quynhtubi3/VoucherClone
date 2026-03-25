CREATE TABLE TBLTCDAHTCu
   (	"IDTCDA" nvarchar(255), 
	"MADUAN"nvarchar(255), 
	"DUANID" nvarchar(255), 
	"NOIDUNG" [nvarchar](max), 
	"NGAYTHANG" DATE, 
	"KHACHHANGID" nvarchar(255), 
	"AMID" nvarchar(255), 
	"PHONGBANID" nvarchar(255), 
	"SOTIEN" [dbo].[T_TIEN], 
	"NGUOITHUHUONGID" nvarchar(255), 
	"EMAIL" nvarchar(255), 
	"LOAICHIPHI" nvarchar(255), 
	"SOTIENGROSS" [dbo].[T_TIEN], 
	"THUE" [dbo].[T_TIEN], 
	"MALOAICHIPHI" nvarchar(255),
	NGUOITHUHUONG nvarchar(255)
   )