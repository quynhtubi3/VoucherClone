using Voucher.cloud.Converter;
using Voucher.cloud.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace Voucher.cloud.Models.DB
{
    public partial class UserProfile : Base
    {        
        public string PhongBanCode { get; set; }
        //public string STK { get; set; }
        //public string NganHang { get; set; }
        public string PhongBanName { get; set; }
        public string CoQuanCode { get; set; }
        public string CoQuanName { get; set; }
        public string Email { get; set; }
        public string Id { get; set; }
        public string Code { get; set; }
        public string HoVaTen { get; set; }
        public string DienThoai { get; set; }
        public string SoCCCD { get; set; }

        [JsonConverter(typeof(DateLongFormatConverter))]
        public DateTime? NgaySinh { get; set; }
        //public string DanhSachUyQuyen { get; set; }
        public string PhongBanId { get; set; }
        public string CoQuanId { get; set; }
        //public string BaoCaoDen { get; set; }
        //public List<MultiSelectModel> PhongBanQuanLy { get; set; }
        //public string TinhTrangCongViec { get; set; }
        
        //public List<MultiSelectModel> NhanVienQuanLy { get; set; }
        public string GioiTinh { get; set; }
        public string ChucVu_Id { get; set; }
        public string ChucVu { get; set; }
        public DateTime? NgayCap { get; set; }
        public string NoiCap { get; set; }
        public string QueQuan { get; set; }
        public string DiaChiHienTai { get; set; }
        //public string TruongHoc { get; set; }
        //public string NghanhHoc { get; set; }
        //public string TrinhDoNgoaiNgu { get; set; }
        ////[JsonConverter(typeof(DateLongFormatConverter))]
        //public DateTime? NgayChinhThucLamViec { get; set; }
        //public string MaSoThue { get; set; }
        //public string SoSoBH { get; set; }
        //public string BienSoXe { get; set; }
        //public string VanPhongId { get; set; }
        //public string ThongTinGiaDinh { get; set; }
        //public string DiaDiemLamViec { get; set; }
        public string DiaChiThuongTru { get; set; }
        //public string TinhTrangHonNhan { get; set; }
        //public string NgoaiNguKhac { get; set; }
        //public string ChuyenNghanhKhac { get; set; }
        //public string HopDongHienTai { get; set; }
        //public string SoHopDongLaoDong { get; set; }
        //[JsonConverter(typeof(DateLongFormatConverter))]
        //public DateTime? TuNgay { get; set; }
        //[JsonConverter(typeof(DateLongFormatConverter))]
        //public DateTime? DenNgay { get; set; }
        //public string SoTaiKhoanLuong { get; set; }
        //public string NguoiLienHe { get; set; }
        //public string DienThoaiNguoiLienHe { get; set; }
        //public string QuanHe { get; set; }
        //public int SoNguoiGiamTru { get; set; }
        //public string MaSoNguoiPhuThuoc { get; set; }
        //public string DaTiemVaccine { get; set; }
        //public string LoaiVaccine { get; set; }
        //[JsonConverter(typeof(DateLongFormatConverter))]
        //public DateTime? NgayBatDauDiLam { get; set; }


        [JsonConverter(typeof(DateLongFormatConverter))]
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        [JsonConverter(typeof(DateLongFormatConverter))]
        public DateTime? ModifiedAt { get; set; }
        public string ModifiedBy { get; set; }
        //
        public string UserName { get; set; }
        //public string TenNguoiDuyet { get; set; }
        //public string EmailNguoiDuyet { get; set; }
        public string MANHANVIEN { get; set; }
        //

    }
}
