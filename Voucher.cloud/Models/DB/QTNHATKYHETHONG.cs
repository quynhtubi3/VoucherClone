using Voucher.cloud.Converter;
using Voucher.cloud.Models;
using System;
using System.Text.Json.Serialization;

namespace Voucher.cloud.Models.DB
{
    public partial class QTNHATKYHETHONG : Base
    {
        //public string Id { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string ChucNang { get; set; }
        public string HanhDong { get; set; }
        public DateTime ThoiGian { get; set; }
    }
}
