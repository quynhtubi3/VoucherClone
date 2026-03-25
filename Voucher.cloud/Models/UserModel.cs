using Voucher.cloud.Models.Identity;
using Voucher.cloud.Models.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Voucher.cloud.Models
{
    public class UserModel : ApplicationUser
    {
        public string Role { get; set; }
        public bool isAdded { get; set; }
        public bool Status { get; set; }
        public string Avatar { get; set; }
        public bool HasAvatar { get; set; }
        public string CV { get; set; }
        public bool HasCV { get; set; }
        public string CVExtension { get; set; }
        public UserProfile profile { get; set; }
    }
}
