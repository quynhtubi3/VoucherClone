using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Voucher.cloud.Commons;
using Voucher.cloud.DatabaseFrameworks.Interfaces;
using Voucher.cloud.Models;
using Voucher.cloud.Models.DB;
using Voucher.cloud.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace Voucher.cloud.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    //[TypeFilter(typeof(ThrottleActionFilter))]
    [ApiController]
    public class MemvarController : ControllerBase
    {
        string FuncId = "a46dfcc4-28e6-4ca5-b125-edc0f16044cd";

        private readonly IWebHostEnvironment _env;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IMemvarDataRepository _memVarDataRepository;
        private readonly IUserProfileDataRepository _userProfileDataRepository;
        private readonly IUserRightDataRepository _userRightDataRepository;

        public MemvarController(IUserProfileDataRepository userProfileDataRepository, IWebHostEnvironment env, IMemvarDataRepository memVarDataRepository, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, IUserRightDataRepository userRightDataRepository)
        {
            _memVarDataRepository = memVarDataRepository;
            _env = env;
            _userManager = userManager;
            _roleManager = roleManager;
            _userProfileDataRepository = userProfileDataRepository;
            _userRightDataRepository = userRightDataRepository;
        }

        [HttpPost("InitMemvar")]
        public async Task<ActionResult<ApplicationInstance>> InitMemvar()
        {
            ApplicationInstance instance = new ApplicationInstance();
            try
            {
                var user = await _userManager.GetUserAsync(HttpContext.User);
                var roleList = await _userManager.GetRolesAsync(user);
                var role = await _roleManager.FindByNameAsync(roleList[0]);
                instance.FullName = string.IsNullOrEmpty(user.FullName) ? user.UserName2 : user.FullName;
                AccountInfo accountInfo = AccountManager.Get(user.TK, user.Database);
                instance.accountInfo = accountInfo;
                instance.UserId = user.Id;
                instance.UserName = user.UserName2;                
                instance.Database = user.Database;
                instance.TK = user.TK;
                instance.Email = user.Email2;
                instance.Role = role.Role;
                instance.ExpiredDate = (DateTime)accountInfo.EndDate;
                instance.Uservar = new Models.UservarModel() { BillingualLanguage = 0, Has_Avatar = false, Theme = "s3t-theme1" };
                instance.Systemvar = await _memVarDataRepository.GetSystemvar(user);
                instance.UserProfile = _userProfileDataRepository.Get(user, user.Id.ToString());
                instance.AvatarFilePath = Common.GetAvatarFileWebPath(user, _env.WebRootPath);

                //20230613 Start: Them UserType Admin
                if (instance.Role == "ADMIN")
                    instance.UserType = 1;
                //End
            }
            finally { }

            return instance;
        }

        [HttpPost("SetMemvars")]
        public async Task<ActionResult<string>> SetMemvarsAsync([FromBody] List<Memvar> memvars)
        {
            //20230825 Start: Co quyen moi duoc
            bool bDuocQuyen = false;
            var user = await _userManager.GetUserAsync(HttpContext.User);

            try
            {
                var curRole = await _userManager.GetRolesAsync(user);
                var curRole2 = await _roleManager.FindByNameAsync(curRole[0]);

                var listCurUserChucNang = (List<DmRightModel>)_userRightDataRepository.GetAll(user, curRole2.Id, user.Id).Result;

                var t = listCurUserChucNang.FirstOrDefault(p => p.Id == FuncId);

                if (t != null && t.Right_3 == true)
                    bDuocQuyen = true;
            }
            catch (Exception ex)
            {

            }

            if (bDuocQuyen == false)
                return StatusCode(423, new APIResult
                {
                    Code = 423,
                    Data = "Bạn không có quyền truy cập chức năng này."
                });
            //End

            foreach (var memvar in memvars)
            {
                _memVarDataRepository.SetMemvar(user, memvar);
            }

            return String.Empty;
        }

    }
}
