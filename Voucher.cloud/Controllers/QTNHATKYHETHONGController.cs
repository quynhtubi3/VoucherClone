using Voucher.cloud.DatabaseFrameworks.Interfaces;
using Voucher.cloud.Models;
using Voucher.cloud.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using Voucher.cloud.Models.DB;
using System.Collections.Generic;
using System.Threading.Tasks;
using Voucher.cloud.Commons.Filter;
using System;
using System.Linq;

namespace Voucher.cloud.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    //[TypeFilter(typeof(ThrottleActionFilter))]
    [TypeFilter(typeof(PrivilegeActionFilter))]
    [ApiController]
    public class QTNHATKYHETHONGController : ControllerBase
    {
        string FuncId = "7717cef3-2136-4932-935d-ee0c29ee46b0";

        private readonly IWebHostEnvironment _env;
        private readonly IQTNHATKYHETHONGDataRepository _context;
        private readonly ILogger<QTNHATKYHETHONGController> _logger;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IUserRightDataRepository _userRightDataRepository;

        public QTNHATKYHETHONGController(IQTNHATKYHETHONGDataRepository context, IWebHostEnvironment env, ILogger<QTNHATKYHETHONGController> logger, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, IUserRightDataRepository userRightDataRepository)
        {
            _context = context;
            _env = env;
            _logger = logger;
            _userManager = userManager;
            _roleManager = roleManager;
            _userRightDataRepository = userRightDataRepository;
        }

        [HttpPost("Get")]
        public async Task<ActionResult<APIResult>> GetAsync(JObject model)
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

                if (t != null && t.Right_1 == true)
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

            return await _context.Get(await _userManager.GetUserAsync(HttpContext.User), model);
        }

        [HttpDelete("Delete")]
        public async Task<ActionResult<APIResult>> Delete(List<DeleteModel> obj)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            int code = 1;
            List<string> succeed = new List<string>();
            for (int i = 0; i < obj.Count; i++)
            {
                code = _context.Delete(user, obj[i]);

                if (code == 1)
                {
                    succeed.Add(obj[i].Id);
                }
            }

            APIResult response = new APIResult();

            response.Code = obj.Count > 1 ? 1 : code;
            response.Data = succeed;

            return response;
        }
    }
}
