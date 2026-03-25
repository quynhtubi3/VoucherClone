using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Voucher.cloud.Models.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public string Server { get; set; }
        public string TK { get; set; }
        public string UserName2 { get; set; }
        public string FullName { get; set; }
        public string Database { get; set; }
        public string Email2 { get; set; }
        public Boolean? NotDelete { get; set; }
        //
        //public string CapBac { get; set; }//Khong them duoc truong khac ten cot trong bang GroupWareService.UserList
    }
}
