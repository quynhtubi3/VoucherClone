using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Voucher.cloud.DatabaseFrameworks.Interfaces;
using Voucher.cloud.Models;
using Voucher.cloud.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using Voucher.cloud.Models;
using Voucher.cloud.Models.DB;
using Voucher.cloud.Commons.Filter;

namespace Voucher.cloud.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    //[TypeFilter(typeof(ThrottleActionFilter))]
    [TypeFilter(typeof(PrivilegeActionFilter))]
    [ApiController]
    public class DMKHACHHANGController : ControllerBase
    {
        string FuncId = "27b28de0-0aaf-4089-9a01-bc84743f651a";

        private readonly IWebHostEnvironment _env;
        private readonly IDMKHACHHANGDataRepository _context;
        private readonly ILogger<DMKHACHHANGController> _logger;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IUserRightDataRepository _userRightDataRepository;

        public DMKHACHHANGController(IDMKHACHHANGDataRepository context, IWebHostEnvironment env, ILogger<DMKHACHHANGController> logger, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, IUserRightDataRepository userRightDataRepository)
        {
            _context = context;
            _env = env;
            _logger = logger;
            _userManager = userManager;
            _roleManager = roleManager;
            _userRightDataRepository = userRightDataRepository;
        }

        [HttpPost("Get")]
        public async Task<ActionResult<IEnumerable<DMKHACHHANG>>> GetAsync(JObject model)
        {
            return _context.Get(await _userManager.GetUserAsync(HttpContext.User), model);
        }
        [HttpPost("GetPagination")]
        public async Task<APIResult> GetPagination(JObject model)
        {
            return await _context.GetPagination(await _userManager.GetUserAsync(HttpContext.User), model);
        }

        [HttpPost("Save")]
        public async Task<ActionResult<APIResult>> Save(DMKHACHHANG data)
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

            APIResult response = new APIResult();
            response.Code = _context.Save(user, ref data);
            response.Id = data.Id;
            response.ModifiedAt = data.ModifiedAt;

            return response;
        }

        [HttpDelete("Delete")]
        public async Task<ActionResult<APIResult>> Delete(List<DeleteModel> obj)
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

            int code = 1;
            List<string> succeed = new List<string>();
            for(int i = 0;i < obj.Count; i++)
            {                
                code = _context.Delete(user, obj[i]);

                if(code == 1)
                {
                    succeed.Add(obj[i].Id);
                }
            }

            APIResult response = new APIResult();

            response.Code = obj.Count > 1 ? 1 : code;
            response.Data = succeed;

            return response;
        }

        [HttpPost("Import")]
        public async Task<ActionResult<APIResult>> Import(List<DMKHACHHANG> rows)
        {//20230925
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

            APIResult response = new APIResult();

            for (var i = 0; i < rows.Count; i++)
            {
                DMKHACHHANG x = rows[i];
                x.Id = "";
                x.RowState = State.Added;
                x.ModifiedAt = null;
                x.ModifiedBy = user.Id;

                response.Code = _context.Save(user, ref x);
            }

            return response;
        }

    }
}
