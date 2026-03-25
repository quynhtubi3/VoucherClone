using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Voucher.cloud.Models.Identity
{
    public class ApplicationRole : IdentityRole
    {
        public string Description { get; set; }
        public string TK { get; set; }
        public string Database { get; set; }
        public string Role { get; set; }
        public Boolean? NotDelete { get; set; }
        public Boolean? Type { get; set; }
    }
}
