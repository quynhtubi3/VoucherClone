using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Voucher.cloud.Models
{
    public class DmRightModel : UserRights
    {
        public string ParentId { get; set; }
        public string Name { get; set; }
        public bool IsDeny { get; set; }
        public bool IsEnabled1 { get; set; }
        public bool IsEnabled2 { get; set; }
        public bool IsEnabled3 { get; set; }
        public bool IsEnabled4 { get; set; }
        public bool IsEnabled5 { get; set; }
    }
}
