using Voucher.cloud.Commons;
using Voucher.cloud.DatabaseFrameworks.Interfaces;
using Voucher.cloud.Models;
using Voucher.cloud.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Voucher.cloud.Models.DB;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using ClosedXML.Excel;
using Aspose.Cells;
using Microsoft.EntityFrameworkCore;

namespace Voucher.cloud.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    //[TypeFilter(typeof(ThrottleActionFilter))]
    //[TypeFilter(typeof(AdminPrivilegeActionFilter))]
    [ApiController]
    public class AdminController : ControllerBase
    {
        string FuncId = "aadc1929-ca4d-4680-95ad-d1ddea2771a6";
        string FuncId2 = "c2c21203-e339-4863-88c4-0a2e37dd8866";
        string RoleSeller = "seller";

        private readonly IWebHostEnvironment _env;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IUserProfileDataRepository _context;
        private readonly IUserRightDataRepository _userRightDataRepository;
        private readonly IUserProfileDataRepository _userProfileDataRepository;
        public AdminController(IWebHostEnvironment env, IUserProfileDataRepository context, UserManager<ApplicationUser> userManager
            , RoleManager<ApplicationRole> roleManager, IConfiguration configuration
            , IUserRightDataRepository userRightDataRepository
            , IUserProfileDataRepository userProfileDataRepository
            )
        {
            _env = env;
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _context = context;
            _userRightDataRepository = userRightDataRepository;
            _userProfileDataRepository = userProfileDataRepository;
        }

        [HttpGet("IsAuthorize")]
        public void IsAuthorize()
        {

        }

        [HttpGet("Users2")]
        public async Task<ActionResult<object>> Users2Async()
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

            var users = _userManager.Users.Where(x => x.TK.Equals(user.TK) && x.Database.Equals(user.Database)).ToList();
            List<object> result = new List<object>();

            if (user.NotDelete == true) // administrator
            {
                foreach (var x in users)
                {
                    var r = await _userManager.GetRolesAsync(x);
                    string role = r.Count > 0 ? (await _roleManager.FindByNameAsync(r[0])).Role : "";
                    string avatarPath = Common.GetImagePath(user, _env.WebRootPath, "UserList", x.Id);

                    bool hasAvatar = false;
                    string avatar = "";
                    if (System.IO.File.Exists(avatarPath))
                    {
                        hasAvatar = true;
                        avatar = Common.GetImageWebPath(user, "UserList", x.Id);
                    }

                    bool hasCV = false;
                    string CV = "";
                    if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", x.Id, "doc")))
                    {
                        hasCV = true;
                        CV = Common.GetWebPath(user, "UserList", x.Id, "doc");
                    }

                    if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", x.Id, "docx")))
                    {
                        hasCV = true;
                        CV = Common.GetWebPath(user, "UserList", x.Id, "docx");
                    }

                    if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", x.Id, "pdf")))
                    {
                        hasCV = true;
                        CV = Common.GetWebPath(user, "UserList", x.Id, "pdf");
                    }

                    result.Add(new { Id = x.Id, UserName = x.UserName2, Email = x.Email2, FullName = x.FullName, PhoneNumber = x.PhoneNumber, EmailConfirmed = x.EmailConfirmed, TwoFactorEnabled = x.TwoFactorEnabled, LockoutEnd = x.LockoutEnd, LockoutEnabled = x.LockoutEnabled, NotDelete = x.NotDelete, Role = role, HasAvatar = hasAvatar, Avatar = avatar, HasCV = hasCV, CV = CV });
                }
            }
            else
            {
                var ro = await _userManager.GetRolesAsync(user);
                var currentRole = await _roleManager.FindByNameAsync(ro.FirstOrDefault());

                foreach (var x in users)
                {
                    ro = await _userManager.GetRolesAsync(x);
                    if (ro.FirstOrDefault() != null)
                    {
                        var role = await _roleManager.FindByNameAsync(ro.FirstOrDefault());
                        if (role != null)
                        {
                            //if (currentRole.Type == true && role.Type == false)//20230613: Sua loi tai khoan khong phai admin nhung co quyen quan ly tai khoan thi khong hien duoc danh sach user
                            {
                                string avatarPath = Common.GetImagePath(user, _env.WebRootPath, "UserList", x.Id);
                                bool hasAvatar = false;
                                string avatar = "";
                                if (System.IO.File.Exists(avatarPath))
                                {
                                    hasAvatar = true;
                                    avatar = Common.GetImageWebPath(user, "UserList", x.Id);
                                }

                                bool hasCV = false;
                                string CV = "";
                                if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", x.Id, "doc")))
                                {
                                    hasCV = true;
                                    CV = Common.GetWebPath(user, "UserList", x.Id, "doc");
                                }

                                if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", x.Id, "docx")))
                                {
                                    hasCV = true;
                                    CV = Common.GetWebPath(user, "UserList", x.Id, "docx");
                                }

                                if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", x.Id, "pdf")))
                                {
                                    hasCV = true;
                                    CV = Common.GetWebPath(user, "UserList", x.Id, "pdf");
                                }

                                var roleName = ro.Count > 0 ? (await _roleManager.FindByNameAsync(ro[0])).Role : "";
                                result.Add(new { Id = x.Id, UserName = x.UserName2, Email = x.Email2, FullName = x.FullName, PhoneNumber = x.PhoneNumber, EmailConfirmed = x.EmailConfirmed, TwoFactorEnabled = x.TwoFactorEnabled, LockoutEnd = x.LockoutEnd, LockoutEnabled = x.LockoutEnabled, NotDelete = x.NotDelete, Role = roleName, HasAvatar = hasAvatar, Avatar = avatar, HasCV = hasCV, CV = CV });
                            }
                        }
                    }
                }
            }
            return result;
        }

        [HttpGet("Users")]
        public async Task<ActionResult<object>> UsersAsync()
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

            var users = _userManager.Users.Where(x => x.TK.Equals(user.TK) && x.Database.Equals(user.Database)).ToList();
            List<object> result = new List<object>();

            var listUserProfile = _userProfileDataRepository.Search(user, new JObject());

            if (user.NotDelete == true) // administrator
            {
                foreach (var x in users)
                {
                    var r = await _userManager.GetRolesAsync(x);
                    string role = r.Count > 0 ? (await _roleManager.FindByNameAsync(r[0])).Role : "";
                    string avatarPath = Common.GetImagePath(user, _env.WebRootPath, "UserList", x.Id);

                    bool hasAvatar = false;
                    string avatar = "";
                    if (System.IO.File.Exists(avatarPath))
                    {
                        hasAvatar = true;
                        avatar = Common.GetImageWebPath(user, "UserList", x.Id);
                    }

                    bool hasCV = false;
                    string CV = "";
                    if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", x.Id, "doc")))
                    {
                        hasCV = true;
                        CV = Common.GetWebPath(user, "UserList", x.Id, "doc");
                    }

                    if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", x.Id, "docx")))
                    {
                        hasCV = true;
                        CV = Common.GetWebPath(user, "UserList", x.Id, "docx");
                    }

                    if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", x.Id, "pdf")))
                    {
                        hasCV = true;
                        CV = Common.GetWebPath(user, "UserList", x.Id, "pdf");
                    }

                    var t = listUserProfile.FirstOrDefault(p => p.Id == x.Id);

                    if (t == null)
                        continue;

                    string sDienThoai = "";
                    string sChucVu = "";
                    string sPhongBanName = "";

                    if (t != null)
                    {
                        sDienThoai = t.DienThoai;
                        sChucVu = t.ChucVu_Id;
                        sPhongBanName = t.PhongBanName;
                    }

                    result.Add(new
                    {
                        Id = x.Id,
                        UserName = x.UserName2,
                        Email = x.Email2,
                        FullName = x.FullName
                        ,
                        PhoneNumber = x.PhoneNumber,
                        EmailConfirmed = x.EmailConfirmed
                        ,
                        TwoFactorEnabled = x.TwoFactorEnabled,
                        LockoutEnd = x.LockoutEnd
                        ,
                        LockoutEnabled = x.LockoutEnabled,
                        NotDelete = x.NotDelete,
                        Role = role
                        ,
                        HasAvatar = hasAvatar,
                        Avatar = avatar,
                        HasCV = hasCV
                        ,
                        CV = CV
                        ,
                        DienThoai = sDienThoai,
                        ChucVu = sChucVu,
                        PhongBanName = sPhongBanName
                    });
                }
            }
            else
            {
                var ro = await _userManager.GetRolesAsync(user);
                var currentRole = await _roleManager.FindByNameAsync(ro.FirstOrDefault());

                foreach (var x in users)
                {
                    ro = await _userManager.GetRolesAsync(x);
                    if (ro.FirstOrDefault() != null)
                    {
                        var role = await _roleManager.FindByNameAsync(ro.FirstOrDefault());
                        if (role != null)
                        {
                            //if (currentRole.Type == true && role.Type == false)//20230613: Sua loi tai khoan khong phai admin nhung co quyen quan ly tai khoan thi khong hien duoc danh sach user
                            {
                                string avatarPath = Common.GetImagePath(user, _env.WebRootPath, "UserList", x.Id);
                                bool hasAvatar = false;
                                string avatar = "";
                                if (System.IO.File.Exists(avatarPath))
                                {
                                    hasAvatar = true;
                                    avatar = Common.GetImageWebPath(user, "UserList", x.Id);
                                }

                                bool hasCV = false;
                                string CV = "";
                                if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", x.Id, "doc")))
                                {
                                    hasCV = true;
                                    CV = Common.GetWebPath(user, "UserList", x.Id, "doc");
                                }

                                if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", x.Id, "docx")))
                                {
                                    hasCV = true;
                                    CV = Common.GetWebPath(user, "UserList", x.Id, "docx");
                                }

                                if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", x.Id, "pdf")))
                                {
                                    hasCV = true;
                                    CV = Common.GetWebPath(user, "UserList", x.Id, "pdf");
                                }

                                var t = listUserProfile.FirstOrDefault(p => p.Id == x.Id);

                                if (t == null)
                                    continue;

                                string sDienThoai = "";
                                string sChucVu = "";
                                string sPhongBanName = "";

                                if (t != null)
                                {
                                    sDienThoai = t.DienThoai;
                                    sChucVu = t.ChucVu_Id;
                                    sPhongBanName = t.PhongBanName;
                                }

                                var roleName = ro.Count > 0 ? (await _roleManager.FindByNameAsync(ro[0])).Role : "";
                                result.Add(new
                                {
                                    Id = x.Id,
                                    UserName = x.UserName2,
                                    Email = x.Email2,
                                    FullName = x.FullName
                                    ,
                                    PhoneNumber = x.PhoneNumber,
                                    EmailConfirmed = x.EmailConfirmed
                                    ,
                                    TwoFactorEnabled = x.TwoFactorEnabled,
                                    LockoutEnd = x.LockoutEnd
                                    ,
                                    LockoutEnabled = x.LockoutEnabled,
                                    NotDelete = x.NotDelete,
                                    Role = roleName
                                    ,
                                    HasAvatar = hasAvatar,
                                    Avatar = avatar,
                                    HasCV = hasCV,
                                    CV = CV
                                    ,
                                    DienThoai = sDienThoai,
                                    ChucVu = sChucVu,
                                    PhongBanName = sPhongBanName
                                });
                            }
                        }
                    }
                }
            }
            return result;
        }

        [HttpPost("Users3")]
        public async Task<ActionResult<APIResult>> Users3(JObject model)
        {
            APIResult rs = new APIResult();

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

            // Lấy pageNumber, pageSize từ body (nếu không có thì mặc định)
            int pageNumber = model.Value<int?>("PageNumber") ?? 1;
            int pageSize = model.Value<int?>("PageSize") ?? 10;


            var query = _userManager.Users.Where(x => x.TK.Equals(user.TK) && x.Database.Equals(user.Database));
            List<object> result = new List<object>();
            // Tổng số bản ghi
            var totalCount = await query.CountAsync();

            // Lấy danh sách user theo trang
            var users = await query
                .OrderBy(x => x.UserName2) // sắp xếp để phân trang ổn định
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            var listUserProfile = _userProfileDataRepository.Search(user, model);

            if (user.NotDelete == true) // administrator
            {
                foreach (var x in users)
                {
                    var r = await _userManager.GetRolesAsync(x);
                    string role = r.Count > 0 ? (await _roleManager.FindByNameAsync(r[0])).Role : "";
                    string avatarPath = Common.GetImagePath(user, _env.WebRootPath, "UserList", x.Id);

                    bool hasAvatar = false;
                    string avatar = "";
                    if (System.IO.File.Exists(avatarPath))
                    {
                        hasAvatar = true;
                        avatar = Common.GetImageWebPath(user, "UserList", x.Id);
                    }

                    bool hasCV = false;
                    string CV = "";
                    if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", x.Id, "doc")))
                    {
                        hasCV = true;
                        CV = Common.GetWebPath(user, "UserList", x.Id, "doc");
                    }

                    if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", x.Id, "docx")))
                    {
                        hasCV = true;
                        CV = Common.GetWebPath(user, "UserList", x.Id, "docx");
                    }

                    if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", x.Id, "pdf")))
                    {
                        hasCV = true;
                        CV = Common.GetWebPath(user, "UserList", x.Id, "pdf");
                    }

                    var t = listUserProfile.FirstOrDefault(p => p.Id == x.Id);

                    if (t == null)
                        continue;

                    string sDienThoai = "";
                    string sChucVu = "";
                    string sPhongBanName = "";

                    if (t != null)
                    {
                        sDienThoai = t.DienThoai;
                        sChucVu = t.ChucVu;
                        sPhongBanName = t.PhongBanName;
                    }

                    result.Add(new
                    {
                        Id = x.Id,
                        UserName = x.UserName2,
                        Email = x.Email2,
                        FullName = x.FullName
                        ,
                        PhoneNumber = x.PhoneNumber,
                        EmailConfirmed = x.EmailConfirmed
                        ,
                        TwoFactorEnabled = x.TwoFactorEnabled,
                        LockoutEnd = x.LockoutEnd
                        ,
                        LockoutEnabled = x.LockoutEnabled,
                        NotDelete = x.NotDelete,
                        Role = role
                        ,
                        HasAvatar = hasAvatar,
                        Avatar = avatar,
                        HasCV = hasCV
                        ,
                        CV = CV
                        ,
                        DienThoai = sDienThoai,
                        ChucVu = sChucVu,
                        PhongBanName = sPhongBanName
                    });
                }
            }
            else
            {
                var ro = await _userManager.GetRolesAsync(user);
                var currentRole = await _roleManager.FindByNameAsync(ro.FirstOrDefault());

                foreach (var x in users)
                {
                    ro = await _userManager.GetRolesAsync(x);
                    if (ro.FirstOrDefault() != null)
                    {
                        var role = await _roleManager.FindByNameAsync(ro.FirstOrDefault());
                        if (role != null)
                        {
                            //if (currentRole.Type == true && role.Type == false)//20230613: Sua loi tai khoan khong phai admin nhung co quyen quan ly tai khoan thi khong hien duoc danh sach user
                            {
                                string avatarPath = Common.GetImagePath(user, _env.WebRootPath, "UserList", x.Id);
                                bool hasAvatar = false;
                                string avatar = "";
                                if (System.IO.File.Exists(avatarPath))
                                {
                                    hasAvatar = true;
                                    avatar = Common.GetImageWebPath(user, "UserList", x.Id);
                                }

                                bool hasCV = false;
                                string CV = "";
                                if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", x.Id, "doc")))
                                {
                                    hasCV = true;
                                    CV = Common.GetWebPath(user, "UserList", x.Id, "doc");
                                }

                                if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", x.Id, "docx")))
                                {
                                    hasCV = true;
                                    CV = Common.GetWebPath(user, "UserList", x.Id, "docx");
                                }

                                if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", x.Id, "pdf")))
                                {
                                    hasCV = true;
                                    CV = Common.GetWebPath(user, "UserList", x.Id, "pdf");
                                }

                                var t = listUserProfile.FirstOrDefault(p => p.Id == x.Id);

                                if (t == null)
                                    continue;

                                string sDienThoai = "";
                                string sChucVu = "";
                                string sPhongBanName = "";

                                if (t != null)
                                {
                                    sDienThoai = t.DienThoai;
                                    sChucVu = t.ChucVu;
                                    sPhongBanName = t.PhongBanName;
                                }

                                var roleName = ro.Count > 0 ? (await _roleManager.FindByNameAsync(ro[0])).Role : "";
                                result.Add(new
                                {
                                    Id = x.Id,
                                    UserName = x.UserName2,
                                    Email = x.Email2,
                                    FullName = x.FullName
                                    ,
                                    PhoneNumber = x.PhoneNumber,
                                    EmailConfirmed = x.EmailConfirmed
                                    ,
                                    TwoFactorEnabled = x.TwoFactorEnabled,
                                    LockoutEnd = x.LockoutEnd
                                    ,
                                    LockoutEnabled = x.LockoutEnabled,
                                    NotDelete = x.NotDelete,
                                    Role = roleName
                                    ,
                                    HasAvatar = hasAvatar,
                                    Avatar = avatar,
                                    HasCV = hasCV,
                                    CV = CV
                                    ,
                                    DienThoai = sDienThoai,
                                    ChucVu = sChucVu,
                                    PhongBanName = sPhongBanName
                                });
                            }
                        }
                    }
                }
            }
            rs.Data = result;
            rs.TotalCount = totalCount;
            return rs;
        }

        [HttpPost("GetDropdownSeller")]
        public async Task<ActionResult<object>> GetDropdownSeller(JObject model)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var users = _userManager.Users.Where(x => x.TK.Equals(user.TK) && x.Database.Equals(user.Database)).ToList();
            List<object> result = new List<object>();

            var listUserProfile = _userProfileDataRepository.Search(user, model);

            foreach (var x in users)
            {
                var r = await _userManager.GetRolesAsync(x);
                string role = r.Count > 0 ? (await _roleManager.FindByNameAsync(r[0])).Role : "";

                var t = listUserProfile.FirstOrDefault(p => p.Id == x.Id);

                if (t == null)
                    continue;

                string sDienThoai = "";
                string sChucVu = "";
                string sPhongBanName = "";
                string sHovaten = "";
                string sManhanvien = "";

                if (t != null)
                {
                    sDienThoai = t.DienThoai;
                    sChucVu = t.ChucVu_Id;
                    sPhongBanName = t.PhongBanName;
                    sHovaten = t.HoVaTen;
                    sManhanvien = t.MANHANVIEN;
                }
                if (role.ToLower().Trim() == RoleSeller)
                {
                    result.Add(new
                    {
                        Id = x.Id,
                        UserName = x.UserName2,
                        Email = x.Email2,
                        FullName = x.FullName,
                        PhoneNumber = x.PhoneNumber,
                        EmailConfirmed = x.EmailConfirmed,
                        Role = role,
                        DienThoai = sDienThoai,
                        ChucVu = sChucVu,
                        PhongBanName = sPhongBanName,
                        HoVaTen = sHovaten,
                        Manhanvien = sManhanvien
                    });
                }


            }
            return result;
        }

        [HttpGet("User")]
        public async Task<ActionResult<object>> UserAsync()
        {
            return await _userManager.GetUserAsync(HttpContext.User);
        }

        [HttpGet("Export")]
        public async Task<IActionResult> Export()
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

            var users = _context.GetAll(user);
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Users");
                var currentRow = 1;
                worksheet.Cell(currentRow, 1).Value = "Id";
                worksheet.Cell(currentRow, 2).Value = "HOVATEN";
                worksheet.Cell(currentRow, 3).Value = "TENDANGNHAP";
                worksheet.Cell(currentRow, 4).Value = "CHUCVU";
                worksheet.Cell(currentRow, 5).Value = "TENCOQUANBO";
                worksheet.Cell(currentRow, 6).Value = "TENPHONGBAN";
                worksheet.Cell(currentRow, 7).Value = "DIACHITHUONGTRU";
                worksheet.Cell(currentRow, 8).Value = "NGAYSINH";
                worksheet.Cell(currentRow, 9).Value = "SOCCCD";
                worksheet.Cell(currentRow, 10).Value = "NGAYCAP";
                worksheet.Cell(currentRow, 11).Value = "DIENTHOAI";
                worksheet.Cell(currentRow, 12).Value = "EMAIL";
                worksheet.Cell(currentRow, 13).Value = "DIACHITHUONGTRU1";
                worksheet.Cell(currentRow, 14).Value = "DIACHIHIENTAI";
                worksheet.Cell(currentRow, 15).Value = "QUEQUAN";
                foreach (var u in users)
                {
                    currentRow++;
                    worksheet.Cell(currentRow, 1).Value = u.Id;
                    worksheet.Cell(currentRow, 2).Value = u.HoVaTen;
                    worksheet.Cell(currentRow, 3).Value = u.Code;
                    worksheet.Cell(currentRow, 4).Value = u.ChucVu_Id;
                    worksheet.Cell(currentRow, 5).Value = u.CoQuanCode;
                    worksheet.Cell(currentRow, 6).Value = u.PhongBanName;
                    worksheet.Cell(currentRow, 7).Value = u.DiaChiThuongTru;
                    worksheet.Cell(currentRow, 8).Value = u.NgaySinh;
                    worksheet.Cell(currentRow, 9).Value = u.SoCCCD;
                    worksheet.Cell(currentRow, 10).Value = u.NgayCap;
                    worksheet.Cell(currentRow, 11).Value = u.DienThoai;
                    worksheet.Cell(currentRow, 12).Value = u.PhongBanCode;
                    worksheet.Cell(currentRow, 13).Value = u.DiaChiThuongTru;
                    worksheet.Cell(currentRow, 14).Value = u.DiaChiHienTai;
                    worksheet.Cell(currentRow, 15).Value = u.QueQuan;
                }

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();

                    return File(
                        content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        string.Format("TaiKhoanCanBoBTC_{0}.xlsx", DateTime.Now.ToString("yyyy_MM_dd_hh_mm")));
                }
            }

        }

        [HttpPost("Search")]
        public async Task<ActionResult<List<UserProfile>>> Search(JObject model)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            return _context.Search(user, model);
        }

        [HttpPost("SearchTrangTongQuan")]
        public async Task<ActionResult<List<UserProfile>>> SearchTrangTongQuan(JObject model)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var list = _context.GetAll(user);

            string sKey = model["HoVaTen"] != null ? model["HoVaTen"].ToString() : "";

            if (model["HoVaTen"] != null && !string.IsNullOrEmpty(sKey))
            {
                sKey = sKey.ToUpper();

                list = list.Where(p => p.HoVaTen.ToUpper().Contains(sKey) || p.DienThoai.ToUpper().Contains(sKey)).ToList();
            }

            return list;
        }

        [HttpGet("Roles")]
        public async Task<ActionResult<object>> RolesAsync()
        {
            //20230825 Start: Co quyen moi duoc
            bool bDuocQuyen = false;
            var user = await _userManager.GetUserAsync(HttpContext.User);

            try
            {
                var curRole = await _userManager.GetRolesAsync(user);
                var curRole2 = await _roleManager.FindByNameAsync(curRole[0]);

                var listCurUserChucNang = (List<DmRightModel>)_userRightDataRepository.GetAll(user, curRole2.Id, user.Id).Result;

                var t = listCurUserChucNang.FirstOrDefault(p => p.Id == FuncId2);

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

            var query = _roleManager.Roles.Where(x => x.TK.Equals(user.TK) && x.Database.Equals(user.Database)).Select(x => new { Id = x.Id, Name = x.Role, Description = x.Description, Type = x.Type, NotDelete = x.NotDelete }).ToList();
            return query;
        }


        [HttpPost("RolesPagination")]
        public async Task<ActionResult<APIResult>> RolesPanigation(JObject model)
        {

            int pageNumber = string.IsNullOrEmpty(model["PageNumber"]?.ToString()) ? 1 : int.Parse(model["PageNumber"].ToString());
            int pageSize = string.IsNullOrEmpty(model["PageSize"]?.ToString()) ? 10 : int.Parse(model["PageSize"].ToString());

            APIResult rs = new APIResult();

            //20230825 Start: Co quyen moi duoc
            bool bDuocQuyen = false;
            var user = await _userManager.GetUserAsync(HttpContext.User);

            try
            {
                var curRole = await _userManager.GetRolesAsync(user);
                var curRole2 = await _roleManager.FindByNameAsync(curRole[0]);

                var listCurUserChucNang = (List<DmRightModel>)_userRightDataRepository.GetAll(user, curRole2.Id, user.Id).Result;

                var t = listCurUserChucNang.FirstOrDefault(p => p.Id == FuncId2);

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
            var queryable = _roleManager.Roles
        .Where(x => x.TK.Equals(user.TK) && x.Database.Equals(user.Database));

            var totalCount = await queryable.CountAsync();

            var items = await queryable
                .OrderBy(x => x.Name) // sắp xếp theo cột nào đó để ổn định phân trang
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new
                {
                    Id = x.Id,
                    Name = x.Role,
                    Description = x.Description,
                    Type = x.Type,
                    NotDelete = x.NotDelete
                })
                .ToListAsync();

            rs.Data = items;
            rs.TotalCount = totalCount;
            return rs;
        }

        [HttpGet("Role")]
        public async Task<ActionResult<object>> RoleAsync()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            return await _roleManager.FindByNameAsync((await _userManager.GetRolesAsync(user))[0]);
        }

        [HttpPost("CreateRole")]
        public async Task<ActionResult<APIResult>> CreateRole(ApplicationRole model)
        {
            //20230825 Start: Co quyen moi duoc
            bool bDuocQuyen = false;
            var user = await _userManager.GetUserAsync(HttpContext.User);

            try
            {
                var curRole = await _userManager.GetRolesAsync(user);
                var curRole2 = await _roleManager.FindByNameAsync(curRole[0]);

                var listCurUserChucNang = (List<DmRightModel>)_userRightDataRepository.GetAll(user, curRole2.Id, user.Id).Result;

                var t = listCurUserChucNang.FirstOrDefault(p => p.Id == FuncId2);

                if (t != null && t.Right_2 == true)
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
            response.Code = -1;

            var role = new ApplicationRole
            {
                Name = user.TK + "." + user.Database + "." + model.Name.ToUpper(),
                Role = model.Name.ToUpper(),
                Description = model.Description,
                Type = model.Type,
                NotDelete = false,
                TK = user.TK,
                Database = user.Database
            };

            var result = await _roleManager.CreateAsync(role);
            if (result.Succeeded)
            {
                response.Code = 1;
                response.Id = role.Id;
            }

            return response;
        }

        [HttpPost("EditRole")]
        public async Task<ActionResult<APIResult>> EditRole(ApplicationRole model)
        {
            APIResult response = new APIResult();
            response.Code = 0;
            response.Id = model.Id;
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var role = await _roleManager.FindByIdAsync(model.Id);
            if (!role.TK.Equals(user.TK) || !role.Database.Equals(user.Database))
            {
                return response;
            }

            role.Description = model.Description;
            role.Type = model.Type;

            var result = await _roleManager.UpdateAsync(role);
            if (result.Succeeded)
                response.Code = 1;
            return response;
        }

        [HttpDelete("DeleteRole")]
        public async Task<ActionResult<bool>> DeleteRoleAsync(string id)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var role = await _roleManager.FindByIdAsync(id);
            if (role.TK.Equals(user.TK) && role.Database.Equals(user.Database))
            {
                var result = await _roleManager.DeleteAsync(role);
                if (result.Succeeded) return true;
            }

            return false;
        }

        [HttpPost("CreateUser")]
        public async Task<ActionResult<APIResult>> CreateUser(UserModel model)
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

                if (t != null && t.Right_2 == true)
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
            response.Code = -1;

            AccountInfo dbConfig = AccountManager.Get(Request.Cookies["TK"], user.Database);
            if (dbConfig.UserCount > 0 && _userManager.Users.Where(x => x.TK.Equals(user.TK) && x.Database.Equals(user.Database) && x.LockoutEnd == null).Count() >= dbConfig.UserCount)
            {
                response.Code = -100;
                return response;
            }
            else
            {
                //var u = new ApplicationUser
                //{
                //    UserName = user.TK + "." + user.Database + "." + model.Email.ToUpper(),
                //    UserName2 = model.Email.ToUpper(),
                //    Email = user.TK + "." + user.Database + "." + model.Email.ToUpper(),
                //    Email2 = model.Email.ToUpper(),
                //    EmailConfirmed = false,
                //    NotDelete = false,
                //    TK = user.TK,
                //    Database = user.Database,
                //    Server = user.Server
                //};

                var u = new ApplicationUser
                {
                    UserName = user.TK + "." + user.Database + "." + model.Email.ToUpper(),
                    UserName2 = model.Email.ToUpper().Split('@')[0],
                    Email = user.TK + "." + user.Database + "." + model.Email.ToUpper(),
                    Email2 = model.Email.ToUpper(),
                    EmailConfirmed = true,
                    NotDelete = false,
                    TK = user.TK,
                    Database = user.Database,
                    Server = user.Server
                };

                u.FullName = u.UserName2;

                var result = await _userManager.CreateAsync(u, _configuration["Default:Password"]);

                if (result.Succeeded == false)
                    return response;

                // add new user profile
                UserProfile temp = new UserProfile();
                temp.Id = u.Id;
                temp.HoVaTen = u.FullName;
                temp.GioiTinh = "1";

                var status = _context.Save(u, ref temp, true);
                model.profile = temp;
                if (result.Succeeded && status == 1)
                {
                    var isExist = await _roleManager.FindByNameAsync(user.TK + "." + user.Database + "." + model.Role);

                    await _userManager.AddToRoleAsync(u, isExist.Name);

                    //20230704 Start: Bo email confirm
                    //var code = await _userManager.GenerateEmailConfirmationTokenAsync(u);
                    //code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
                    //var callbackUrl = Url.Page(
                    //    "/Account/ConfirmEmail",
                    //    pageHandler: null,
                    //    values: new { area = "Identity", userId = u.Id, code = code, companyCode = dbConfig.TK, databaseName = user.Database },
                    //    protocol: Request.Scheme);

                    //string subject = "Thông tin đăng ký sử dụng phần mềm Voucher";
                    //string body = System.IO.File.ReadAllText("Template/register.html");
                    //body = body.Replace("{Callback}", HtmlEncoder.Default.Encode(callbackUrl));
                    //body = body.Replace("{Account}", HtmlEncoder.Default.Encode(dbConfig.TK));
                    //body = body.Replace("{ClientName}", HtmlEncoder.Default.Encode(dbConfig.CompanyName));

                    //Common.SendMail(model.Email, subject, body, _configuration);
                    //End

                    response.Code = 1;
                    response.Data = new { UserName = u.UserName2, PhoneNumber = u.PhoneNumber, Role = isExist.Role, EmailConfirmed = u.EmailConfirmed, LockoutEnd = u.LockoutEnd, ModifiedAt = DateTime.Now };
                    response.Id = u.Id;

                }
                return response;
            }
        }

        [HttpPost("EditUser")]
        public async Task<ActionResult<APIResult>> EditUser(UserModel model)
        {
            APIResult response = new APIResult();
            response.Code = 0;
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var u = await _userManager.FindByIdAsync(model.Id);

            if (u == null || (!u.TK.Equals(user.TK) || !u.Database.Equals(user.Database)))
            {
                return response;
            }

            bool bDuocSuaQuyen = false;
            string sDANHSACHUYQUYEN = "";

            //20230601 Start: Co quyen Quan ly tai khoan moi duoc sua quyen
            try
            {
                var curRole = await _userManager.GetRolesAsync(user);
                var curRole2 = await _roleManager.FindByNameAsync(curRole[0]);

                var listCurUserChucNang = (List<DmRightModel>)_userRightDataRepository.GetAll(user, curRole2.Id, user.Id).Result;

                var t = listCurUserChucNang.FirstOrDefault(p => p.Id == FuncId);

                if (t != null && t.Right_3 == true)
                    bDuocSuaQuyen = true;
            }
            catch (Exception ex)
            {

            }

            //End

            if (bDuocSuaQuyen)
            {
                var rl = await _userManager.GetRolesAsync(u);
                foreach (var r in rl)
                {
                    var role = await _roleManager.FindByNameAsync(r);
                    if (role != null)
                    {
                        sDANHSACHUYQUYEN = role.Role;
                        await _userManager.RemoveFromRoleAsync(u, role.Name);
                    }
                }
            }

            var isExist = await _roleManager.FindByNameAsync(user.TK + "." + user.Database + "." + model.Role);
            if (isExist != null)
            {
                if (bDuocSuaQuyen)
                {
                    await _userManager.AddToRoleAsync(u, isExist.Name);
                }

                u.PhoneNumber = model.profile.DienThoai;
                u.FullName = model.profile.HoVaTen;
                await _userManager.UpdateAsync(u);

                response.Code = 1;
                response.Data = new { UserName = u.UserName2, PhoneNumber = u.PhoneNumber, Role = isExist.Role, EmailConfirmed = u.EmailConfirmed, LockoutEnd = u.LockoutEnd, ModifiedAt = DateTime.Now };
                response.Id = model.Id;

                // edit user profile
                UserProfile temp = model.profile;

                if (bDuocSuaQuyen == false)
                {//20230601: Khong co quyen Quan ly tai khoan thi khong duoc sua DANHSACHUYQUYEN
                    //temp.DanhSachUyQuyen = sDANHSACHUYQUYEN;
                }

                _context.Save(u, ref temp, false);

                model.profile = temp;

                string avatarPath = Common.GetImagePath(user, _env.WebRootPath, "UserList", model.Id);
                if (model.Avatar != null && !model.Avatar.Equals(""))
                {
                    byte[] bytes = Convert.FromBase64String(model.Avatar);
                    System.IO.File.WriteAllBytes(avatarPath, bytes);
                }

                if (System.IO.File.Exists(avatarPath))
                {
                    response.Data = new { UserName = u.UserName2, PhoneNumber = u.PhoneNumber, Role = isExist.Role, EmailConfirmed = u.EmailConfirmed, LockoutEnd = u.LockoutEnd, ModifiedAt = DateTime.Now, HasAvatar = true, Avatar = Common.GetImageWebPath(user, "UserList", model.Id) };
                }

                if (model.CV != null && !model.CV.Equals(""))
                {
                    string cvPath = "";
                    switch (model.CVExtension.ToLower())
                    {
                        case "pdf":
                            cvPath = Common.GetPath(user, _env.WebRootPath, "UserList", model.Id, "pdf");
                            if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", model.Id, "doc")))
                            {
                                System.IO.File.Delete(Common.GetPath(user, _env.WebRootPath, "UserList", model.Id, "doc"));
                            }
                            if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", model.Id, "docx")))
                            {
                                System.IO.File.Delete(Common.GetPath(user, _env.WebRootPath, "UserList", model.Id, "docx"));
                            }
                            break;
                        case "msword":
                            cvPath = Common.GetPath(user, _env.WebRootPath, "UserList", model.Id, "doc");
                            if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", model.Id, "pdf")))
                            {
                                System.IO.File.Delete(Common.GetPath(user, _env.WebRootPath, "UserList", model.Id, "pdf"));
                            }
                            if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", model.Id, "docx")))
                            {
                                System.IO.File.Delete(Common.GetPath(user, _env.WebRootPath, "UserList", model.Id, "docx"));
                            }
                            break;
                        case "vnd.openxmlformats-officedocument.wordprocessingml.document":
                            cvPath = Common.GetPath(user, _env.WebRootPath, "UserList", model.Id, "docx");
                            if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", model.Id, "doc")))
                            {
                                System.IO.File.Delete(Common.GetPath(user, _env.WebRootPath, "UserList", model.Id, "doc"));
                            }
                            if (System.IO.File.Exists(Common.GetPath(user, _env.WebRootPath, "UserList", model.Id, "pdf")))
                            {
                                System.IO.File.Delete(Common.GetPath(user, _env.WebRootPath, "UserList", model.Id, "pdf"));
                            }
                            break;
                    }
                    byte[] bytes = Convert.FromBase64String(model.CV);
                    System.IO.File.WriteAllBytes(cvPath, bytes);
                }

                if (System.IO.File.Exists(avatarPath))
                {
                    response.Data = new { UserName = u.UserName2, PhoneNumber = u.PhoneNumber, Role = isExist.Role, EmailConfirmed = u.EmailConfirmed, LockoutEnd = u.LockoutEnd, ModifiedAt = DateTime.Now, HasAvatar = true, Avatar = Common.GetImageWebPath(user, "UserList", model.Id) };
                }
            }

            return response;
        }

        [HttpPost("LockUser")]
        public async Task<ActionResult<APIResult>> LockUser(UserModel model)
        {
            APIResult response = new APIResult();
            response.Code = 0;

            var user = await _userManager.GetUserAsync(HttpContext.User);
            var u = await _userManager.FindByIdAsync(model.Id);
            if (u == null || (!u.TK.Equals(user.TK) || !u.Database.Equals(user.Database)))
            {
                return response;
            }

            if (model.Status == true)
            {
                u.LockoutEnd = DateTime.ParseExact("31/12/9999", "dd/MM/yyyy", CultureInfo.InvariantCulture);
                await _userManager.UpdateAsync(u);
            }
            else
            {
                AccountInfo dbConfig = AccountManager.Get(Request.Cookies["TK"], user.Database);
                if (_userManager.Users.Where(x => x.LockoutEnd == null && x.TK.Equals(user.TK) && x.Database.Equals(user.Database)).Count() >= dbConfig.UserCount)
                {
                    response.Code = -100;
                    return response;
                }
                else
                {
                    u.LockoutEnd = null;
                    await _userManager.UpdateAsync(u);
                }
            }
            var role = await _userManager.GetRolesAsync(u);
            var roleM = await _roleManager.FindByNameAsync(role[0]);
            response.Code = 1;
            response.Data = new { UserName = u.UserName2, PhoneNumber = u.PhoneNumber, Role = roleM.Role, EmailConfirmed = u.EmailConfirmed, LockoutEnd = u.LockoutEnd, ModifiedAt = DateTime.Now };
            response.Id = model.Id;
            return response;
        }

        [HttpPost("Activation")]
        public async Task<ActionResult<APIResult>> Activation(UserModel model)
        {
            APIResult response = new APIResult();
            response.Code = 0;

            var user = await _userManager.GetUserAsync(HttpContext.User);
            AccountInfo dbConfig = AccountManager.Get(Request.Cookies["TK"], user.Database);

            var u = await _userManager.FindByIdAsync(model.Id);
            if (u == null || (!u.TK.Equals(user.TK) || !u.Database.Equals(user.Database)))
            {
                return response;
            }

            var code = await _userManager.GenerateEmailConfirmationTokenAsync(u);
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
            var callbackUrl = Url.Page(
                "/Account/ConfirmEmail",
                pageHandler: null,
                values: new { area = "Identity", userId = u.Id, code = code, companyCode = dbConfig.TK, databaseName = user.Database },
                protocol: Request.Scheme);

            string subject = "Thông tin đăng ký sử dụng phần mềm Voucher";
            string body = System.IO.File.ReadAllText("Template/register.html");
            body = body.Replace("{Callback}", HtmlEncoder.Default.Encode(callbackUrl));
            body = body.Replace("{Account}", HtmlEncoder.Default.Encode(dbConfig.TK));
            body = body.Replace("{ClientName}", HtmlEncoder.Default.Encode(dbConfig.CompanyName));

            Common.SendMail(model.Email, subject, body, _configuration);

            var role = await _userManager.GetRolesAsync(u);
            var roleM = await _roleManager.FindByNameAsync(role[0]);
            response.Code = 1;
            response.Data = new { UserName = u.UserName2, PhoneNumber = u.PhoneNumber, Role = roleM.Role, EmailConfirmed = u.EmailConfirmed, LockoutEnd = u.LockoutEnd, ModifiedAt = DateTime.Now };
            response.Id = model.Id;
            return response;
        }

        [HttpDelete("DeleteUser")]
        public async Task<ActionResult<APIResult>> DeleteUserAsync(string id)
        {
            APIResult response = new APIResult();
            response.Code = 0;
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var u = await _userManager.FindByIdAsync(id);
            if (u == null || (!u.TK.Equals(user.TK) || !u.Database.Equals(user.Database)))
            {
                return response;
            }
            bool canDelete = true;
            if (u.LockoutEnd != null)
            {
                canDelete = false;
            }
            else
            {
                if (u.EmailConfirmed == true)
                {
                    canDelete = false;
                }
            }
            if (canDelete)
            {
                var result = await _userManager.DeleteAsync(u);
                if (result.Succeeded)
                    response.Code = 1;
            }
            else
            {
                this.Response.StatusCode = 423;
            }
            return response;
        }

        [HttpPost("ResetPassword")]
        public async Task<ActionResult<APIResult>> ResetPassword(UserModel model)
        {
            APIResult response = new APIResult();
            response.Code = 0;
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var u = await _userManager.FindByIdAsync(model.Id);

            if (u == null || (!u.TK.Equals(user.TK) || !u.Database.Equals(user.Database)))
            {
                return response;
            }

            bool bDuocSua = false;

            //20230808 Start: Co quyen Quan ly tai khoan moi duoc sua
            try
            {
                var curRole = await _userManager.GetRolesAsync(user);
                var curRole2 = await _roleManager.FindByNameAsync(curRole[0]);

                var listCurUserChucNang = (List<DmRightModel>)_userRightDataRepository.GetAll(user, curRole2.Id, user.Id).Result;

                var t = listCurUserChucNang.FirstOrDefault(p => p.Name.ToLower() == "quản lý tài khoản");

                if (t != null && t.Right_3 == true)
                    bDuocSua = true;
            }
            catch (Exception ex)
            {

            }

            //End

            if (bDuocSua)
            {
                response.Data = new { UserName = u.UserName2, ModifiedAt = DateTime.Now };
                response.Id = model.Id;

                //response.Code = _context.UpdatePassword(u, model.Id, _configuration["Default:Password"]);

                string code = await _userManager.GeneratePasswordResetTokenAsync(u);
                var t2 = _userManager.ResetPasswordAsync(u, code, _configuration["Default:Password"]);

                if (t2.Result.Succeeded)
                    response.Code = 1;
            }


            return response;
        }

    }
}
