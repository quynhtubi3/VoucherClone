using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Voucher.cloud.DatabaseFrameworks.Interfaces;
using Voucher.cloud.Models;
using Voucher.cloud.Models.DB;
using Voucher.cloud.Models.Identity;

namespace Voucher.cloud.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    //[TypeFilter(typeof(ThrottleActionFilter))]
    [ApiController]
    public class RightAssignmentController : ControllerBase
    {
        string FuncId = "aadc1929-ca4d-4680-95ad-d1ddea2771a6";

        private readonly IUserRightDataRepository _userRightDataRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<RightAssignmentController> _logger;
        private readonly RoleManager<ApplicationRole> _roleManager;

        public RightAssignmentController(IUserRightDataRepository userRightDataRepository, UserManager<ApplicationUser> userManager, ILogger<RightAssignmentController> logger, RoleManager<ApplicationRole> roleManager)
        {
            _userRightDataRepository = userRightDataRepository;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet("Get")]
        public async Task<ActionResult<object>> Get(string roleId, string userId)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            return await _userRightDataRepository.GetAll(user, roleId, userId); ;
        }

        [HttpGet("Privilege")]
        public async Task<ActionResult<object>> PrivilegeAsync(string id, string type)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if(user == null) return Unauthorized();
            return await _userRightDataRepository.getPrivilege(user, id, type);
        }

        [HttpPost("Save")]
        public async Task<ActionResult<APIResult>> Save(List<UserRights> data)
        {
            APIResult response = new APIResult();
            response.Code = 0;

            //20230825 Start: Co quyen Quan ly tai khoan moi duoc sua quyen

            bool bDuocSuaQuyen = false;

            try
            {
                var user = await _userManager.GetUserAsync(HttpContext.User);
                var curRole = await _userManager.GetRolesAsync(user);
                var curRole2 = await _roleManager.FindByNameAsync(curRole[0]);

                var listCurUserChucNang = (List<DmRightModel>)_userRightDataRepository.GetAll(user, curRole2.Id, user.Id).Result;

                var t = listCurUserChucNang.FirstOrDefault(p => p.Name.ToLower() == "quản lý tài khoản");

                if (t != null && t.Right_3 == true)
                    bDuocSuaQuyen = true;
            }
            catch (Exception ex)
            {

            }

            //End

            if (bDuocSuaQuyen)
                response.Code = _userRightDataRepository.Save(await _userManager.GetUserAsync(HttpContext.User), data);

            return response;
        }
    }
}
