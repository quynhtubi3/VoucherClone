using Voucher.cloud.Converter;
using Voucher.cloud.Models;
using System;
using System.Text.Json.Serialization;

namespace Voucher.cloud.Models.DB
{
    public partial class DMPHONGBAN : Base
    {
        public string Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string CName { get; set; }
        public string CCode { get; set; }
        public string CId { get; set; }
        [JsonConverter(typeof(DateLongFormatConverter))]
        public DateTime CreatedAt { get; set; }        
        public string CreatedBy { get; set; }
        [JsonConverter(typeof(DateLongFormatConverter))]
        public DateTime? ModifiedAt { get; set; }
        public string ModifiedBy { get; set; }
        public int SoLuongNhanVien { get; set; }
    }
}
