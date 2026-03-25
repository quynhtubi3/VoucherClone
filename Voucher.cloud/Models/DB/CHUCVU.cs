using System;
using System.Text.Json.Serialization;
using Voucher.cloud.Converter;

namespace Voucher.cloud.Models.DB
{
    public partial class CHUCVU : Base
    {
        public string Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal HHCaNhan { get; set; }
        public decimal HHTruongCuaHang { get; set; }
        public decimal HHPhoCuaHang { get; set; }
        public decimal QuyDoiPhaChe { get; set; }
        public decimal QuyChung { get; set; }
        public string Note { get; set; }

        [JsonConverter(typeof(DateLongFormatConverter))]
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        [JsonConverter(typeof(DateLongFormatConverter))]
        public DateTime? ModifiedAt { get; set; }
        public string ModifiedBy { get; set; }
    }
}
