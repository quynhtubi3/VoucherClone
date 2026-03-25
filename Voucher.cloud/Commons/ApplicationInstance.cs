using Voucher.cloud.Models;
using Voucher.cloud.Models.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Voucher.cloud.Models.Identity;

namespace Voucher.cloud.Commons
{
    public class ApplicationInstance
    {
        public string TK { get; set; } // Tài khoản được tạo từ hệ thống quản lý khách hàng của EZSOFT
        public string Database { get; set; }
        public string UserId { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string UserName { get; set; } //Tên đăng nhập hiện thời
        public string FullName { get; set; } //Tên đầy đủ của người đăng nhập
        public int UserType { get; set; } //-1: SystemAdministrator: Toàn quyền và không bị xoá 1: Administrator: Toàn quyền nhưng bị xoá 0: User       
        public object Menu { get; set; } = null;
        public UserProfile UserProfile { get; set; }
        public UservarModel Uservar { get; set; }
        public SystemvarModel Systemvar { get; set; }
        public DateTime ExpiredDate { get; set; }
        public string AvatarFilePath { get; set; }
        public AccountInfo accountInfo { get; set; }
    }
}
