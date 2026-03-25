using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Newtonsoft.Json;
using Voucher.cloud.Models.Identity;
using Voucher.cloud.Commons;
using Voucher.cloud.DatabaseFrameworks.Repositories;
using Microsoft.Extensions.Configuration;
using System.Net;

namespace Voucher.cloud.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    public class LoginModel : PageModel
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger<LoginModel> _logger;
        private readonly IConfiguration _configuration;
        private readonly string User_Msg_Company_Invalid = "LoginForm_Validate_Company_Invalid";
        private readonly string User_Msg_UserName_Invalid = "LoginForm_Validate_UserName_Invalid";
        private readonly string User_Msg_UserName_Locked = "LoginForm_Validate_UserName_Locked";
        private readonly string User_Msg_UserName_NotAllowed = "LoginForm_Validate_UserName_NotAllowed";
        private readonly string User_Msg_Password_Incorrect = "LoginForm_Validate_Password_Incorrect";

        public LoginModel(SignInManager<ApplicationUser> signInManager, ILogger<LoginModel> logger, UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _configuration = configuration;
        }

        [BindProperty]
        public InputModel Input { get; set; }

        public IList<AuthenticationScheme> ExternalLogins { get; set; }

        [TempData]
        public string ErrorMessage { get; set; }

        public class InputModel
        {
            [Required(ErrorMessage = "LoginForm_Validate_CompanyCode_Require")]
            public string TK { get; set; }
            [Required(ErrorMessage = "LoginForm_Validate_DatabaseName_Require")]
            public string Database { get; set; }

            [Required(ErrorMessage = "LoginForm_Validate_Username_Require")]
            public string UserName { get; set; }

            [Required(ErrorMessage = "LoginForm_Validate_Password_Require")]
            [DataType(DataType.Password)]
            public string Password { get; set; }

            [Display(Name = "Remember me?")]
            public bool RememberMe { get; set; }
        }

        public async Task<IActionResult> OnGetAsync(bool force)
        {
            if (HttpContext.User.Identity.IsAuthenticated)
            {
                if (force)
                {
                    await _signInManager.SignOutAsync();
                } else
                {
                    return RedirectToAction("Index", "Home");
                }                
            }

            if (!string.IsNullOrEmpty(ErrorMessage))
            {
                ModelState.AddModelError(string.Empty, ErrorMessage);
            }
            // Clear the existing external cookie to ensure a clean login process
            await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();
            String TK = Request.Cookies["TK"];
            String database = Request.Cookies["Database"];
            String userName = Request.Cookies["UserName"];

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
            var current = loginInfos.Where(x => x.TK.Equals(TK) && x.Database.Equals(database) && x.Username.ToUpper().Equals(userName.ToUpper())).FirstOrDefault();
            if (Input == null)
                Input = new InputModel();
            Input.TK = String.IsNullOrEmpty(TK) ? String.Empty : TK;
            Input.Database = String.IsNullOrEmpty(database) ? String.Empty : database;
            Input.UserName = String.IsNullOrEmpty(userName) ? String.Empty : userName;
            Input.Password = current == null ? String.Empty : current.Password;
            Input.RememberMe = current == null ? false : true;

            return Page();
        }

        public async Task<IActionResult> OnPostAsync(string lang)
        {
            Input.TK = Input.TK.ToUpper().Trim();
            //Input.UserName = Input.UserName.ToUpper();

            if (ModelState.IsValid)
            {
                if (!String.IsNullOrEmpty(Input.UserName) && Input.UserName.IndexOf('@') > -1)
                {
                    //Validate email format
                    string emailRegex = @"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}" +
                                           @"\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\" +
                                              @".)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$";
                    Regex re = new Regex(emailRegex);
                    if (!re.IsMatch(Input.UserName))
                    {
                        ModelState.AddModelError("UserName", User_Msg_UserName_Invalid);
                    }
                }
                else
                {
                    //validate Username format
                    string emailRegex = @"^[a-zA-Z0-9_\-\.]*$";
                    Regex re = new Regex(emailRegex);
                    if (!re.IsMatch(Input.UserName))
                    {
                        ModelState.AddModelError("UserName", User_Msg_UserName_Invalid);
                    }
                }
            }

            string sIP = "";

            var ip = Response.HttpContext.Connection.RemoteIpAddress;

            if (ip != null)
            {
                if (ip.ToString() == "::1")
                {//localhost
                    try
                    {
                        sIP = Dns.GetHostEntry(Dns.GetHostName()).AddressList[1].ToString();
                    }
                    catch { }
                }
                else
                    sIP = ip.MapToIPv4().ToString();
            }
            

            if (ModelState.IsValid)
            {
                var account = AccountManager.Get(Input.TK, Input.Database);
                if (account == null)
                {
                    ModelState.AddModelError("TK", "LoginForm_Validate_Company_Invalid");
                    return Page();
                } else
                {
                    if (DateTime.Compare(DateTime.Now, (DateTime)account.EndDate) > 0)
                    {
                        ModelState.AddModelError("TK", "LoginForm_Expired");
                        return Page();
                    }
                }

                CookieOptions option = new CookieOptions();
                option.Expires = DateTime.Now.AddDays(1000);
                option.HttpOnly = true;
                option.IsEssential = true;
                Response.Cookies.Append("TK", Input.TK, option);
                Response.Cookies.Append("Database", Input.Database, option);
                Response.Cookies.Append("UserName", Input.UserName, option);

                var userName = Input.UserName;
                ApplicationUser user;
                if (userName.IndexOf('@') > -1)
                {
                    user = await _userManager.FindByEmailAsync(account.TK + "." + Input.Database + "." + Input.UserName);
                    if (user == null)
                    {
                        ModelState.AddModelError("UserName", User_Msg_UserName_Invalid);
                        return Page();
                    }
                    else
                    {
                        userName = user.UserName;
                    }
                }
                else
                {
                    user = await _userManager.FindByNameAsync(account.TK + "." + Input.Database + "." + Input.UserName);
                    if (user == null)
                    {
                        ModelState.AddModelError("UserName", User_Msg_UserName_Invalid);
                        return Page();
                    }
                }

                DateTimeOffset now = (DateTimeOffset)DateTime.UtcNow;
                string LoginTime = now.ToUnixTimeSeconds().ToString();
                var customClaims = new[]
                    {
                        new Claim("LoginTime", LoginTime),
                    };

                
                //Lưu LoginTime theo User
                var currentClaims = await _userManager.GetClaimsAsync(user);                

                var claimTime = currentClaims.Where(x => x.Type.Equals("LoginTime")).FirstOrDefault();
                if (claimTime != null)
                    await _userManager.RemoveClaimAsync(user, claimTime);

                await _userManager.AddClaimsAsync(user, customClaims);
                var password = Input.Password;
                var pwHash = Input.Password;
                bool isHash = false;
                try
                {
                    password = Crypto.DecryptStringAES(password, Crypto.KEY);
                    isHash = true;
                }
                catch (Exception e)
                {

                }

                var result = await _signInManager.PasswordSignInAsync(user, password, Input.RememberMe, lockoutOnFailure: false);
                if (result.Succeeded)
                {                                        
                    //Log
                    _logger.LogInformation("User logged in - " + user.Email2 + " - " + sIP);
                    String loginInfoCookie = Request.Cookies["LoginInfoCookie"];
                    List<LoginInfo> loginInfos = new List<LoginInfo>();
                    if (!string.IsNullOrEmpty(loginInfoCookie))
                    {
                        try
                        {
                            loginInfoCookie = Crypto.DecryptStringAES(loginInfoCookie, Crypto.KEY);
                            loginInfos = JsonConvert.DeserializeObject<List<LoginInfo>>(loginInfoCookie);
                        }
                        catch(Exception e)
                        {

                        }                        
                    }
                    var current = loginInfos.Where(x => x.TK.Equals(Input.TK) && x.Database.Equals(Input.Database) && x.Username.ToUpper().Equals(Input.UserName.ToUpper())).FirstOrDefault();
                    if (Input.RememberMe)
                    {
                        if(current == null)
                        {
                            LoginInfo loginInfo = new LoginInfo();
                            loginInfo.TK = Input.TK;
                            loginInfo.Database = Input.Database;
                            loginInfo.Username = Input.UserName;
                            loginInfo.Password = isHash ? pwHash : Crypto.EncryptStringAES(pwHash, Crypto.KEY);
                            loginInfo.RememberMe = true;
                            loginInfos.Add(loginInfo);
                        }
                        else
                        {
                            current.Password = isHash ? pwHash : Crypto.EncryptStringAES(pwHash, Crypto.KEY);
                        }
                    } else
                    {
                        if (current != null)
                        {
                            loginInfos.Remove(current);
                        }                        
                    }
                    Response.Cookies.Append("LoginInfoCookie", Crypto.EncryptStringAES(JsonConvert.SerializeObject(loginInfos), Crypto.KEY), option);                    
                    QTNHATKYHETHONGDataRepository.Save(user, new Voucher.cloud.Models.DB.QTNHATKYHETHONG() {ChucNang = "Đăng nhập hệ thống", HanhDong = string.Format("{0} đăng nhập hệ thống",user.UserName2) }, _configuration);
                    //Go home
                    return RedirectToAction("Index", "Home");
                }
                if (result.RequiresTwoFactor)
                {
                    return RedirectToPage("./LoginWith2fa", new { RememberMe = Input.RememberMe });
                }
                if (result.IsLockedOut)
                {
                    _logger.LogWarning("User account locked out.");
                    ModelState.AddModelError("UserName", User_Msg_UserName_Locked);
                    return Page();
                }
                else if (result.IsNotAllowed)
                {
                    ModelState.AddModelError("UserName", User_Msg_UserName_NotAllowed);
                    return Page();
                }
                else
                {
                    ModelState.AddModelError("Password", User_Msg_Password_Incorrect);
                    return Page();
                }
            }

            // If we got this far, something failed, redisplay form
            return Page();
        }
    }
}
