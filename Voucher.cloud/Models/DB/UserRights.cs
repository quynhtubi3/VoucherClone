using System;
using System.Collections.Generic;

namespace Voucher.cloud.Models
{
    public partial class UserRights : Base
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string FuncId { get; set; }
        public string FuncType { get; set; }
        public bool Right_1 { get; set; } = true;
        public bool Right_2 { get; set; } = true;
        public bool Right_3 { get; set; } = true;
        public bool Right_4 { get; set; } = true;
        public bool Right_5 { get; set; } = true;
        public bool IsUser { get; set; } = true;
    }
}
