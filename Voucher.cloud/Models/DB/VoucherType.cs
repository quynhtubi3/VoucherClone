using System;
using System.Text.Json.Serialization;
using Voucher.cloud.Converter;

namespace Voucher.cloud.Models.DB
{
    public partial class VoucherType : Base
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int Type { get; set; }
        public int DefaultValidityPeriod { get; set; }
        public decimal DefaultPrice { get; set; }
        public decimal DefaultRealPrice { get; set; }
        public int DefaultNumberOfUse { get; set; }
        public int DefaultNumberOfFree { get; set; }
        public string Description { get; set; }
        public string CostSave { get; set; }

        [JsonConverter(typeof(DateLongFormatConverter))]
        public DateTime? CreatedAt { get; set; }
        [JsonConverter(typeof(DateLongFormatConverter))]
        public DateTime? UpdateAt { get; set; }
        public Guid CreatedBy { get; set; }
        public Guid? Updateby { get; set; }
    }
}
