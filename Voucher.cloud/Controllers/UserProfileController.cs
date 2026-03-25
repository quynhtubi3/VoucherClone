using Voucher.cloud.Commons;
using Voucher.cloud.DatabaseFrameworks.Interfaces;
using Voucher.cloud.Models;
using Voucher.cloud.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Voucher.cloud.Models.DB;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using System.Linq;

namespace Voucher.cloud.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    //[TypeFilter(typeof(ThrottleActionFilter))]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        string FuncId = "c53c76da-22ea-4eb4-a642-f31f8da038ef";
        string FuncId2 = "DD17FF30-B88F-4051-89AA-00D60BE02F34";

        private readonly IWebHostEnvironment _env;
        private readonly IUserProfileDataRepository _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IUserRightDataRepository _userRightDataRepository;

        private readonly UrlEncoder _urlEncoder;
        private const string AuthenticatorUriFormat = "otpauth://totp/{0}:{1}?secret={2}&issuer={0}&digits=6";
        public UserProfileController(IUserProfileDataRepository context, IWebHostEnvironment env, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, UrlEncoder urlEncoder, RoleManager<ApplicationRole> roleManager, IUserRightDataRepository userRightDataRepository)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _urlEncoder = urlEncoder;
            _env = env;
            _context = context;
            _roleManager = roleManager;
            _userRightDataRepository = userRightDataRepository;
        }

        [HttpGet("Get")]
        public async Task<ActionResult<object>> Get()
        {
            var user = await _userManager.GetUserAsync(User);
            //var a = await _userManager.GetAuthenticatorKeyAsync(user);

            var file = Common.GetAvatarFile(user, _env.WebRootPath);            
            var has_image = System.IO.File.Exists(file);

            return new
            {
                HasAuthenticator = await _userManager.GetAuthenticatorKeyAsync(user) != null,
                Is2faEnabled = await _userManager.GetTwoFactorEnabledAsync(user),
                IsMachineRemembered = await _signInManager.IsTwoFactorClientRememberedAsync(user),
                RecoveryCodesLeft = await _userManager.CountRecoveryCodesAsync(user),
                User = new
                {
                    UserName = user.UserName2,
                    PhoneNumber = user.PhoneNumber,
                    FullName = user.FullName,
                    AvatarFile = (has_image ? file : "")
                }
            };
        }

        [HttpPost("Search")]
        public async Task<ActionResult<List<UserProfile>>> Search(JObject model)
        {
            //20230825 Start: Co quyen moi duoc
            bool bDuocQuyen = false;
            var user = await _userManager.GetUserAsync(HttpContext.User);

            try
            {
                var curRole = await _userManager.GetRolesAsync(user);
                var curRole2 = await _roleManager.FindByNameAsync(curRole[0]);

                var listCurUserChucNang = (List<DmRightModel>)_userRightDataRepository.GetAll(user, curRole2.Id, user.Id).Result;

                var t = listCurUserChucNang.FirstOrDefault(p => p.Id.ToLower() == FuncId.ToLower());

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

            return _context.Search(user, model);
        }

        [HttpPost("Search_UyQuyen")]
        public async Task<ActionResult<List<UserProfile>>> Search_UyQuyen(JObject model)
        {
            //20230825 Start: Co quyen moi duoc
            bool bDuocQuyen = false;
            var user = await _userManager.GetUserAsync(HttpContext.User);

            try
            {
                var curRole = await _userManager.GetRolesAsync(user);
                var curRole2 = await _roleManager.FindByNameAsync(curRole[0]);

                var listCurUserChucNang = (List<DmRightModel>)_userRightDataRepository.GetAll(user, curRole2.Id, user.Id).Result;

                var t = listCurUserChucNang.FirstOrDefault(p => p.Id.ToLower() == FuncId2.ToLower());

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

            return _context.SearchUyQuyen(user, model);
        }


        [HttpPost("Save")]
        public async Task<ActionResult<APIResult>> Save(JObject model)
        {
            var user = await _userManager.GetUserAsync(User);
            user.PhoneNumber = model.GetValue("PhoneNumber").ToString();
            user.FullName = model.GetValue("FullName").ToString();

            APIResult response = new APIResult();
            response.Code = 0;
            response.Code = _context.UpdateUserFullName(user, user.Id, user.FullName);
            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded) response.Code = 1;
            return response;
        }

        [HttpPost("Save_UyQuyen")]
        public async Task<ActionResult<APIResult>> Save_UyQuyen(JObject model)
        {
            var user = await _userManager.GetUserAsync(User);
            string TAIKHOANNGANHANG_UYQUYEN = model.GetValue("TAIKHOANNGANHANG_UYQUYEN")?.ToString();
            string TENNGANHANG_UYQUYEN = model.GetValue("TENNGANHANG_UYQUYEN")?.ToString();
            string CHINHANH_UYQUYEN = model.GetValue("CHINHANH_UYQUYEN")?.ToString();
            string GIAYTHANHTOAN_UYQUYEN = model.GetValue("GIAYTHANHTOAN_UYQUYEN")?.ToString();
            string NAMEGIAYTHANHTOAN_UYQUYEN = model.GetValue("NAMEGIAYTHANHTOAN_UYQUYEN")?.ToString();

            APIResult response = new APIResult();
            response.Code = 0;
            response.Code = _context.UpdateUyQuyen(user, user.Id, TAIKHOANNGANHANG_UYQUYEN, TENNGANHANG_UYQUYEN, CHINHANH_UYQUYEN, GIAYTHANHTOAN_UYQUYEN, NAMEGIAYTHANHTOAN_UYQUYEN);
            return response;
        }

        [HttpPost("SaveAvatar")]
        public async Task<ActionResult<bool>> SaveAvatar(JObject model)
        {
            var dataout = true;
            var user = await _userManager.GetUserAsync(User);
            var file = Common.GetAvatarFile(user, _env.WebRootPath);
            var has_image = System.IO.File.Exists(file);

            if (model["IsDeleted"].Value<bool>())
            {
                if (has_image)
                {
                    try
                    {
                        System.IO.File.Delete(file);
                    }
                    catch (Exception ex)
                    {
                        dataout = false;
                        //_logger.LogError(ex.Message);
                    }
                }
            }
            else
            {
                try
                {
                    byte[] bytes = Convert.FromBase64String(model["AvatarData"].ToString());
                    System.IO.File.WriteAllBytes(file, bytes);
                }
                catch (Exception ex)
                {
                    dataout = false;
                    //_logger.LogError(ex.Message);
                }
            }

            return dataout;
        }


        [HttpPost("AddFavorite")]
        public async Task<ActionResult<APIResult>> AddFavorite(JObject model)
        {
            string id = model.GetValue("Id").ToString();
            string title = model.GetValue("Title").ToString();
            string value = JsonConvert.SerializeObject(model);
            var user = await _userManager.GetUserAsync(User);
            string path = Path.Combine(_env.WebRootPath, Path.Combine(Common.MetadataFolder, Path.Combine(Path.Combine(user.TK, user.Database), "Favorites")));
            if (!Directory.Exists(path)) Directory.CreateDirectory(path);
            string filePath = Path.Combine(path, user.Id + ".json");
            if (System.IO.File.Exists(filePath))
            {
                try
                {
                    List<FavoriteModel> favoriteModels = JsonConvert.DeserializeObject<List<FavoriteModel>>(System.IO.File.ReadAllText(filePath));
                    var x = favoriteModels.Find(x => x.Id.Equals(id) && x.Title.Equals(title));
                    if (x == null)
                    {
                        FavoriteModel favoriteModel = new FavoriteModel();
                        favoriteModel.Id = id;
                        favoriteModel.Title = title;
                        favoriteModel.Value = value;
                        favoriteModels.Add(favoriteModel);
                        System.IO.File.WriteAllText(filePath, JsonConvert.SerializeObject(favoriteModels));
                    }
                }
                catch (IOException e)
                {

                }
            }
            else
            {
                List<FavoriteModel> favoriteModels = new List<FavoriteModel>();
                FavoriteModel favoriteModel = new FavoriteModel();
                favoriteModel.Id = id;
                favoriteModel.Title = title;
                favoriteModel.Value = value;
                favoriteModels.Add(favoriteModel);
                try
                {
                    System.IO.File.WriteAllText(filePath, JsonConvert.SerializeObject(favoriteModels));
                }
                catch (IOException e)
                {

                }
            }

            APIResult response = new APIResult();
            response.Code = 1;

            return response;
        }

        [HttpPost("RemoveFavorite")]
        public async Task<ActionResult<APIResult>> RemoveFavorite(JObject model)
        {
            string id = model.GetValue("Id").ToString();
            string title = model.GetValue("Title").ToString();
            var user = await _userManager.GetUserAsync(User);

            string path = Path.Combine(_env.WebRootPath, Path.Combine(Common.MetadataFolder, Path.Combine(Path.Combine(user.TK, user.Database), "Favorites")));
            if (!Directory.Exists(path)) Directory.CreateDirectory(path);
            string filePath = Path.Combine(path, user.Id + ".json");
            if (System.IO.File.Exists(filePath))
            {
                try
                {
                    List<FavoriteModel> favoriteModels = JsonConvert.DeserializeObject<List<FavoriteModel>>(System.IO.File.ReadAllText(filePath));
                    var x = favoriteModels.Find(x => x.Id.Equals(id) && x.Title.Equals(title));
                    favoriteModels.Remove(x);
                    if (x != null)
                    {
                        favoriteModels.Remove(x);
                        System.IO.File.WriteAllText(filePath, JsonConvert.SerializeObject(favoriteModels));
                    }
                }
                catch (IOException e)
                {

                }
            }

            APIResult response = new APIResult();
            response.Code = 1;

            return response;
        }

        [HttpGet("GetFavorite")]
        public async Task<ActionResult<bool>> GetFavorite(string id, string title)
        {
            bool flag = false;
            var user = await _userManager.GetUserAsync(User);
            string path = Path.Combine(_env.WebRootPath, Path.Combine(Common.MetadataFolder, Path.Combine(Path.Combine(user.TK, user.Database), "Favorites")));
            if (!Directory.Exists(path)) Directory.CreateDirectory(path);
            string filePath = Path.Combine(path, user.Id + ".json");
            if (System.IO.File.Exists(filePath))
            {
                try
                {
                    List<FavoriteModel> favoriteModels = JsonConvert.DeserializeObject<List<FavoriteModel>>(System.IO.File.ReadAllText(filePath));
                    var x = favoriteModels.Find(x => x.Id.Equals(id) && x.Title.Equals(title));
                    if (x != null)
                    {
                        flag = true;
                    }
                }
                catch (IOException e)
                {

                }
            }
            else
            {

            }
            return flag;
        }

        [HttpPost("ChangePass")]
        public async Task<ActionResult<APIResult>> ChangePass(JObject model)
        {
            var user = await _userManager.GetUserAsync(User);
            var NewPass = model.GetValue("NewPass").ToString();
            var ConfirmNewPass = model.GetValue("ConfirmNewPass").ToString();
            var CurrentPass = model.GetValue("CurrentPass").ToString();

            APIResult response = new APIResult();
            response.Code = 1;

            var changePasswordResult = await _userManager.ChangePasswordAsync(user, CurrentPass, ConfirmNewPass);
            if (!changePasswordResult.Succeeded)
            {
                foreach (var error in changePasswordResult.Errors)
                {
                    if (error.Code.Equals("PasswordMismatch"))
                    {
                        response.Data = "UserProfile_Msg_PasswordMismatch";
                    }
                }
            }

            return response;
        }

        [HttpGet("Enable2FA_Key")]
        public async Task<ActionResult<object>> Enable2FA_Key()
        {
            var user = await _userManager.GetUserAsync(User);
            return await LoadSharedKeyAndQrCodeUriAsync(user);
        }

        [HttpPost("Enable2FA")]
        public async Task<ActionResult<object>> Enable2FA(JObject model)
        {
            var user = await _userManager.GetUserAsync(User);
            var code = model.GetValue("Code").ToString();
            // Strip spaces and hypens
            var verificationCode = code.Replace(" ", string.Empty).Replace("-", string.Empty);

            var is2faTokenValid = await _userManager.VerifyTwoFactorTokenAsync(
                user, _userManager.Options.Tokens.AuthenticatorTokenProvider, verificationCode);
            APIResult response = new APIResult();
            response.Code = 1;
            if (!is2faTokenValid)
            {
                response.Code = -9998;
                return response;
            }
            await _userManager.SetTwoFactorEnabledAsync(user, true);
            response.Data = await _userManager.GenerateNewTwoFactorRecoveryCodesAsync(user, 10);

            return response;
        }

        [HttpPost("Disable2FA")]
        public async Task<ActionResult<object>> Disable2FA(JObject model)
        {
            var user = await _userManager.GetUserAsync(User);
            var code = model.GetValue("Code").ToString();
            // Strip spaces and hypens
            var verificationCode = code.Replace(" ", string.Empty).Replace("-", string.Empty);

            var is2faTokenValid = await _userManager.VerifyTwoFactorTokenAsync(
                user, _userManager.Options.Tokens.AuthenticatorTokenProvider, verificationCode);
            APIResult response = new APIResult();
            response.Code = 1;
            if (!is2faTokenValid)
            {
                response.Code = -9998;
                return response;
            }
            await _userManager.SetTwoFactorEnabledAsync(user, false);
            return response;
        }

        [HttpPost("Get_Detail")]
        public async Task<ActionResult<object>> Get_Detail(JObject model)
        {
            var user = await _userManager.GetUserAsync(User);
            var result = _context.Get(user, model["uid"].ToString());


            if (result != null)
            {//Khoi tao de tranh bi loi js


                if (string.IsNullOrEmpty(result.GioiTinh))
                    result.GioiTinh = "1";

            }


            return result;
        }

        private async Task<object> LoadSharedKeyAndQrCodeUriAsync(ApplicationUser user)
        {
            // Load the authenticator key & QR code URI to display on the form
            await _userManager.ResetAuthenticatorKeyAsync(user);
            var unformattedKey = await _userManager.GetAuthenticatorKeyAsync(user);

            var SharedKey = FormatKey(unformattedKey);

            var email = await _userManager.GetEmailAsync(user);
            var AuthenticatorUri = GenerateQrCodeUri(email, unformattedKey);
            return new
            {
                SharedKey = SharedKey,
                AuthenticatorUri = AuthenticatorUri
            };
        }

        private string FormatKey(string unformattedKey)
        {
            var result = new StringBuilder();
            int currentPosition = 0;
            while (currentPosition + 4 < unformattedKey.Length)
            {
                result.Append(unformattedKey.Substring(currentPosition, 4)).Append(" ");
                currentPosition += 4;
            }
            if (currentPosition < unformattedKey.Length)
            {
                result.Append(unformattedKey.Substring(currentPosition));
            }

            return result.ToString().ToLowerInvariant();
        }

        private string GenerateQrCodeUri(string email, string unformattedKey)
        {
            return string.Format(
                AuthenticatorUriFormat,
                _urlEncoder.Encode("GroupWare"),
                _urlEncoder.Encode(email),
                unformattedKey);
        }
    }
}
