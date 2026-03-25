using System;
using System.Text.Json.Serialization;
using Voucher.cloud.Converter;
using Newtonsoft.Json.Linq;


namespace Voucher.cloud.Models
{
    public class DeleteModel
    {
        public string Id { get; set; }
        public string Code { get; set; }
        [JsonConverter(typeof(DateLongFormatConverter))]
        public DateTime ModifiedAt { get; set; }
        public JObject Source { get; set; }
    }
}
