using Voucher.cloud.Converter;
using Voucher.cloud.Models;
using System;
using System.Text.Json.Serialization;

namespace Voucher.cloud.Models.DB
{
    public class DMCOSOCUAHANG : Base
    {
        public string Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }

        [JsonConverter(typeof(DateLongFormatConverter))]
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        [JsonConverter(typeof(DateLongFormatConverter))]
        public DateTime? ModifiedAt { get; set; }
        public string ModifiedBy { get; set; }
    }
}
