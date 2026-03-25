using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Voucher.cloud.Models
{
    public class DoanhThuNguoiBan
    {
        public Guid Id { get; set; }
        public string SellerEmail { get; set; }
        public string SellerName { get; set; }
        public string SellerPhone { get; set; }
        public string ChucVuName { get; set; }
        public int SoldCount { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal TotalHHCaNhan { get; set; }
        public decimal TotalHHTruongCuaHang { get; set; }
        public decimal TotalHHPhoCuaHang { get; set; }
        public decimal TotalQuyDoiPhaChe { get; set; }
        public decimal TotalQuyChung { get; set; }

    }

    public class HoaHongCacBen
    {
        public Guid Id { get; set; }
        public string Hoten { get; set; }
        public string DienThoai { get; set; }
        public string GioiTinh { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string ChucVu_Code { get; set; }
        public string ChucVu_Name { get; set; }
        public decimal Commission { get; set; }

    }
    public class DoanhThuTheoLoaiVoucher
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int Type { get; set; }
        public int DefaultValidityPeriod { get; set; }
        public decimal DefaultPrice { get; set; }
        public int SalesQuantity { get; set; }
        public decimal TotalRevenue { get; set; }

    }

    public class TiLeKichHoatVoucher
    {
        public string SaleDate { get; set; }
        public int Sold { get; set; }
        public int Activated { get; set; }
        public decimal UsageRate { get; set; }
    }
}
