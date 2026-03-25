using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Voucher.cloud.Models
{
    public class SystemvarModel
    {
        public string SoftwareName { get; set; } = "Voucher-Cloud"; //Tên chương trình
        public string DEMOString { get; set; } = "TRIAL"; //Nội dung hiển thị trên báo cáo khi sử dụng thử
        public string MainLanguageId { get; set; } //Mã ngôn ngữ chính
        public string MainLanguageName { get; set; } //Tên ngôn ngữ chính
        public string SubLanguageId { get; set; } //Mã ngôn ngữ phụ
        public string SubLanguageName { get; set; } //Tên ngôn ngữ phụ 

        public decimal KhauTruCaNhan { get; set; } = 11000000;
        public decimal KhauTruNguoiPhuThuoc { get; set; } = 4400000;
        public decimal MucDongBHXH { get; set; } = 8;
        public decimal MucDongBHYT { get; set; } = (decimal)1.5;
        public decimal MucDongBHTN { get; set; } = 1;
        public decimal MucDongCongDoan { get; set; } = 1;
        public decimal SoNgayKhoa { get; set; } = 360;
    }
}
