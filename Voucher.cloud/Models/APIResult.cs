using Voucher.cloud.Converter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Voucher.cloud.Models
{
    public class APIResult
    {
        public int Code { get; set; }
        public string Id { get; set; }
        [JsonConverter(typeof(DateLongFormatConverter))]
        public DateTime? ModifiedAt { get; set; }
        public object Data { get; set; }
        public int TotalCount { get; set; }
    }
}
