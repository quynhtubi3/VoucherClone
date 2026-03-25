using System;
using System.Text.Json.Serialization;
using Voucher.cloud.Converter;

namespace Voucher.cloud.Models.DB
{
    public partial class DMNGUOIBAN : Base
    {
        public Guid Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public Guid? ChucVuId { get; set; }
        public string DiaChi { get; set; }
        public string DienThoai { get; set; }
        public string Email { get; set; }
        public int GioiTinh { get; set; }
        public string Identifier { get; set; }
        public DateTime NamSinh { get; set; }
        public string Note { get; set; }

        [JsonConverter(typeof(DateLongFormatConverter))]
        public DateTime CreatedAt { get; set; }
        public Guid? CreatedBy { get; set; }
        [JsonConverter(typeof(DateLongFormatConverter))]
        public DateTime? ModifiedAt { get; set; }
        public Guid? ModifiedBy { get; set; }
    }
    public partial class DMNGUOIBANDto : DMNGUOIBAN
    {
        public string ChucVu { get; set; }
        public decimal HHCaNhan { get; set; }
        public decimal HHTruongCuaHang { get; set; }
        public decimal HHPhoCuaHang { get; set; }
        public decimal QuyDoiPhaChe { get; set; }
        public decimal QuyChung { get; set; }
    }
}
