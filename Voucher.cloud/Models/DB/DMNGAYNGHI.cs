using Voucher.cloud.Converter;
using Voucher.cloud.Models;
using System;
using System.Text.Json.Serialization;

namespace Voucher.cloud.Models.DB
{
    public partial class DMNGAYNGHI : Base
    {
        public string Id { get; set; }
        [JsonConverter(typeof(DateLongFormatConverter))]
        public DateTime Ngay { get; set; }                
        public string MoTa { get; set; }
    }
}
