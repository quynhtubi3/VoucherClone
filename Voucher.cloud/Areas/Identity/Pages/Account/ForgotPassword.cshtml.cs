using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Encodings.Web;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using Voucher.cloud.Models.Identity;
using Voucher.cloud.Commons;

namespace Voucher.cloud.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    public class ForgotPasswordModel : PageModel
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;

        public ForgotPasswordModel(UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        [BindProperty]
        public InputModel Input { get; set; }

        public class InputModel
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; }
            [Required]
            public string TK { get; set; }
            [Required]
            public string Database { get; set; }
        }
        public async Task<IActionResult> OnGetAsync()
        {
            //String TK = Request.Cookies["TK"];
            //String database = Request.Cookies["Database"];
            //if (Input == null)
            //    Input = new InputModel();     
            //Input.TK = String.IsNullOrEmpty(TK) ? String.Empty : TK;
            //Input.Database = String.IsNullOrEmpty(database) ? String.Empty : database;            
            return Page();
        }
        public async Task<IActionResult> OnPostAsync()
        {
            //Input.TK = Input.TK.ToUpper().Trim();

            //if (ModelState.IsValid)
            //{
            //    var account = AccountManager.Get(Input.TK, Input.Database);
            //    if (account == null)
            //    {
            //        ModelState.AddModelError("TK", "LoginForm_Validate_Company_Invalid");
            //        return Page();
            //    } else
            //    {
            //        if (DateTime.Compare(DateTime.Now, (DateTime)account.EndDate) > 0){
            //            ModelState.AddModelError("TK", "LoginForm_Expired");
            //            return Page();
            //        }
            //    }

            //    CookieOptions option = new CookieOptions();
            //    option.Expires = DateTime.Now.AddDays(1000);
            //    option.HttpOnly = true;
            //    option.IsEssential = true;
            //    Response.Cookies.Append("TK", Input.TK, option);
            //    Response.Cookies.Append("Database", Input.Database, option);
            //    var user = await _userManager.FindByEmailAsync(account.TK + "." + Input.Database + "." + Input.Email);
            //    if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
            //    {
            //        ModelState.AddModelError("Email", "LoginForm_Validate_Email_NotRegister");
            //        return Page();
            //    }

            //    try
            //    {
            //        AccountInfo accountInfo = AccountManager.Get(user.TK, user.Database);
            //        var code = await _userManager.GeneratePasswordResetTokenAsync(user);
            //        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
            //        var callbackUrl = Url.Page(
            //            "/Account/ResetPassword",
            //            pageHandler: null,
            //            values: new { area = "Identity", code, email = Input.Email, companyCode = Input.TK, databaseName = Input.Database },
            //            protocol: Request.Scheme);

            //        string subject = "Thông tin đặt lại mật khẩu phần mềm Voucher";
            //        string body = System.IO.File.ReadAllText("Template/forgot-password.html");
            //        body = body.Replace("{Callback}", HtmlEncoder.Default.Encode(callbackUrl));
            //        body = body.Replace("{Account}", HtmlEncoder.Default.Encode(user.TK));
            //        body = body.Replace("{ClientName}", HtmlEncoder.Default.Encode(accountInfo.CompanyName));
                    
            //        Common.SendMail(Input.Email, subject, body, _configuration);
            //        return RedirectToPage("./ForgotPasswordConfirmation");
            //    }
            //    catch (Exception e)
            //    {
            //        ModelState.AddModelError("TK", "LoginForm_Validate_Company_Invalid");
            //    }                
            //}

            return Page();
        }
    }
}
