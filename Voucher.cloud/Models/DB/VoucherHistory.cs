using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Voucher.cloud.Models.DB;

namespace Voucher.cloud.Models.DB
{
    public class VoucherHistory
    {
        public Guid Id { get; set; }
        public Guid VoucherID { get; set; }
        public string DataFieldOld { get; set; }
        public string DataFieldNew { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
public class VoucherHistory2 : VoucherHistory
{
        public string HOVATEN { get; set; }
        public string CHUCVU { get; set; }
        public string DIENTHOAI { get; set; }
    
}
