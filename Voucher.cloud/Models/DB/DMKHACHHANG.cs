using Voucher.cloud.Converter;
using Voucher.cloud.Models;
using System;
using System.Text.Json.Serialization;
using DocumentFormat.OpenXml.Office2010.ExcelAc;
using System.Collections.Generic;

namespace Voucher.cloud.Models.DB
{
    public partial class DMKHACHHANG : Base
    {
            public string Id { get; set; }
            public string Name { get; set; }
            public string Code { get; set; }
            public string DiaChi { get; set; }
            public string DienThoai { get; set; }
            public string Other { get; set; }
            public string Email { get; set; }
            public int GioiTinh { get; set; }
            public string Identifier { get; set; }
            public DateTime NamSinh { get; set; }
            public string Note { get; set; }

            [JsonConverter(typeof(DateLongFormatConverter))]
            public DateTime CreatedAt { get; set; }        
            public string CreatedBy { get; set; }
            [JsonConverter(typeof(DateLongFormatConverter))]
            public DateTime? ModifiedAt { get; set; }
            public string ModifiedBy { get; set; }
    }


    public partial class DMKHACHHANGDTO : DMKHACHHANG
    {
      public List<DB.Voucher> Vouchers { get; set; }
    }
}
