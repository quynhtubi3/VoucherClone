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
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using Voucher.cloud.Models.DB;
using Voucher.cloud.Commons.Filter;

namespace Voucher.cloud.Controllers
{

    [Route("api/[controller]")]
    [Authorize]
    //[TypeFilter(typeof(ThrottleActionFilter))]
    //[TypeFilter(typeof(PrivilegeActionFilter))]
    [ApiController]
    public class BaoCaoThongKeController : ControllerBase
    {
        string FuncId = "4a41cfa9-78b9-4cc7-ab58-cbe3d20173c2";
        private readonly IWebHostEnvironment _env;
        private readonly IBaoCaoThongKeDataRepository _context;
        private readonly ILogger<BaoCaoThongKeController> _logger;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IUserRightDataRepository _userRightDataRepository;

        public BaoCaoThongKeController(IBaoCaoThongKeDataRepository context, IWebHostEnvironment env, ILogger<BaoCaoThongKeController> logger, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, IUserRightDataRepository userRightDataRepository)
        {
            _context = context;
            _env = env;
            _logger = logger;
            _userManager = userManager;
            _roleManager = roleManager;
            _userRightDataRepository = userRightDataRepository;
        }
        /// <summary>
        /// DoanhThuNguoiBan
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("DoanhThuNguoiBan")]
        public async Task<APIResult> DoanhThuNguoiBan(JObject model)
        {
            return await _context.GetDoanhThuTheoNguoiBan(await _userManager.GetUserAsync(HttpContext.User), model);
        }
        /// <summary>
        /// DoanhThuNguoiBan
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("HoaHongCacBen")]
        public async Task<APIResult> HoaHongCacBen(JObject model)
        {
            return await _context.GetHoaHongCacBen(await _userManager.GetUserAsync(HttpContext.User), model);
        }
        /// <summary>
        /// GetDoanhThuTheoLoaiVoucher
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("GetDoanhThuTheoLoaiVoucher")]
        public async Task<APIResult> GetDoanhThuTheoLoaiVoucher(JObject model)
        {
            return await _context.GetDoanhThuTheoLoaiVoucher(await _userManager.GetUserAsync(HttpContext.User), model);
        }
        /// <summary>
        /// GetTiLeKichHoatVoucher
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("GetTiLeKichHoatVoucher")]
        public async Task<APIResult> GetTiLeKichHoatVoucher(JObject model)
        {
            return await _context.GetTiLeKichHoatVoucher(await _userManager.GetUserAsync(HttpContext.User), model);
        }
        /// <summary>
        /// GetDanhSachVoucherSapHetHan
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("GetDanhSachVoucherSapHetHan")]
        public async Task<APIResult> GetDanhSachVoucherSapHetHan(JObject model)
        {
            return await _context.GetDanhSachVoucherSapHetHan(await _userManager.GetUserAsync(HttpContext.User), model);
        }

        [HttpPost("SendMailRemind")]
        public async Task<ActionResult<APIResult>> SendMailRemind(List<Guid> email)
        {
            return await _context.SendMailRemind(await _userManager.GetUserAsync(HttpContext.User), email);

        }
    }
}
