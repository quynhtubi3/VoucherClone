using Voucher.cloud.Commons;
using Voucher.cloud.DatabaseFrameworks.Interfaces;
using Voucher.cloud.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace Voucher.cloud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountSupportController : ControllerBase
    {
        private readonly IAccountSupportRepository _context;
        private readonly IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        public AccountSupportController(IAccountSupportRepository context, IConfiguration configuration, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
        {
            _configuration = configuration;
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet("Get")]
        public ActionResult<List<Object>> Get(string accountName)
        {
            return _context.GetAccountInfo(accountName);
        }

        [HttpGet("GetInfo")]
        public ActionResult<object> GetInfo(string TK, string Database, string Username)
        {
            String loginInfoCookie = Request.Cookies["LoginInfoCookie"];
            List<LoginInfo> loginInfos = new List<LoginInfo>();
            if (!string.IsNullOrEmpty(loginInfoCookie))
            {
                try
                {
                    loginInfoCookie = Crypto.DecryptStringAES(loginInfoCookie, Crypto.KEY);
                    loginInfos = JsonConvert.DeserializeObject<List<LoginInfo>>(loginInfoCookie);
                }
                catch (Exception e)
                {

                }
            }
            var current = loginInfos.Where(x => x.TK.Equals(TK) && x.Database.Equals(Database) && x.Username.ToUpper().Equals(Username.ToUpper())).FirstOrDefault();
            return current == null ? new { RememberMe = false, Password = String.Empty } : new { RememberMe = true, Password = current.Password };
        }

        [HttpGet("Create")]
        public async Task CreateAsync()
        {
            //var TK = "TK-GW-00001";
            //var DB = "TK-GW-00001-DB0001";
            //var EMail = "thaivuminh1013@gmail.com";
            //var Server = "3tcloud.sapiai.com";
            //var role = new ApplicationRole
            //{
            //    Name = TK + "." + DB + ".ADMIN",
            //    Role = "ADMIN",
            //    Description = "Administrator",
            //    NotDelete = true,
            //    TK = TK,
            //    Database = DB
            //};

            //await _roleManager.CreateAsync(role);

            //var user = new ApplicationUser
            //{
            //    UserName = TK + "." + DB + ".ADMIN",
            //    UserName2 = "ADMIN",
            //    Email = TK + "." + DB + "." + EMail,
            //    Email2 = EMail,
            //    EmailConfirmed = true,
            //    FullName = "Administrator",
            //    NotDelete = true,
            //    TK = TK,
            //    Database = DB,
            //    Server = Server
            //};

            //var result = await _userManager.CreateAsync(user, "Tt@123");
            //await _userManager.AddToRoleAsync(user, role.Name);
            //List<AccountInfo> dbConnections = new List<AccountInfo>();

            //string filePath = Path.Combine("DBConfiguration", TK + ".json");
            //if (System.IO.File.Exists(filePath))
            //{
            //    string json = System.IO.File.ReadAllText(filePath);
            //    dbConnections = JsonConvert.DeserializeObject<List<AccountInfo>>(json);
            //}
            
            //AccountInfo accountInfo = new AccountInfo();
            //accountInfo.Server = Server;
            //accountInfo.TK = TK;
            //accountInfo.Database = DB;
            //accountInfo.CompanyName = "TẬP ĐOÀN HiPT";
            //accountInfo.Email = EMail;
            //accountInfo.StartDate = DateTime.Now;
            //accountInfo.EndDate = DateTime.Now.AddYears(10);
            //accountInfo.UserCount = 100;

            //dbConnections.Add(accountInfo);
            //System.IO.File.WriteAllText(filePath, JsonConvert.SerializeObject(dbConnections));

        }
    }
}
