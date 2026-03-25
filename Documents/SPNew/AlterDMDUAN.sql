alter table DMDUAN
add AMAD nvarchar(256)

alter table DMDUAN
add LOAIDUAN int

alter table DMDUAN
add NAMQUYETTOAN varchar(4)

alter table DMDUAN
add DOANHTHUDUKIEN [dbo].[T_TIEN] NULL

alter table DMDUAN
add DOANHTHUTHUCTE [dbo].[T_TIEN] NULL

alter table DMDUAN
add GIAVONMUANGOAIDUKIEN [dbo].[T_TIEN] NULL

alter table DMDUAN
add GIAVONMUANGOAITHUCTE [dbo].[T_TIEN] NULL

alter table DMDUAN
add INCENTIVETAMUNG [dbo].[T_TIEN] NULL

alter table DMDUAN
add INCENTIVE [dbo].[T_TIEN] NULL

alter table DMDUAN
alter column AMAD nvarchar(256)

--
alter table DMDUAN
add PMID [uniqueidentifier]

alter table DMDUAN
add PICID [uniqueidentifier]

alter table DMDUAN
add QTHDID [uniqueidentifier]

alter table DMDUAN
add PMAD [nvarchar](256)

alter table DMDUAN
add PICAD [nvarchar](256)

alter table DMDUAN
add QTHDAD [nvarchar](256)

alter table DMDUAN
add PHAPNHANID [uniqueidentifier]
