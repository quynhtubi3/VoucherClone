using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Voucher.cloud.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;

namespace Voucher.cloud.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    public class ConfirmEmailModel : PageModel
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public ConfirmEmailModel(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [BindProperty]
        public InputModel Input { get; set; }

        public class InputModel
        {
            [Required(ErrorMessage = "LoginForm_Validate_Username_Require")]
            public string Username { get; set; }
            public string Email { get; set; }
            [Required(ErrorMessage = "LoginForm_Validate_Password_Require")]
            [Display(Name = "Mật khẩu")]
            [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*])[A-Za-z\d.!@#$%^&*]{8,}", ErrorMessage = "LoginForm_Validate_Password_Format")]
            [DataType(DataType.Password)]
            public string Password { get; set; }

            [DataType(DataType.Password)]
            [Display(Name = "Confirm password")]
            [Compare("Password", ErrorMessage = "LoginForm_Validate_Password_Confirm")]
            public string ConfirmPassword { get; set; }

            public string Code { get; set; }

            public string CompanyCode { get; set; }
            public string DatabaseName { get; set; }
        }

        [TempData]
        public string StatusMessage { get; set; }
        [TempData]
        public bool Status { get; set; }

        [TempData]
        public string Email { get; set; }        

        public async Task<IActionResult> OnGetAsync(string userId, string code, string companyCode, string databaseName)
        {
            if (userId == null || code == null)
            {
                return RedirectToPage("/Index");
            }
            CookieOptions option = new CookieOptions();
            option.Expires = DateTime.Now.AddDays(1000);
            option.HttpOnly = true;
            option.IsEssential = true;
            Response.Cookies.Append("CompanyCode", companyCode, option);
            Response.Cookies.Append("DatabaseName", databaseName, option);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return RedirectToPage("./ShowError");
            }

            code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
            //var result = await _userManager.ConfirmEmailAsync(user, code);
            StatusMessage = "LoginForm_Var_ConfirmMailMessage";
            Status = true;
            Email = user.Email2;
            Input = new InputModel
            {
                Code = code,
                CompanyCode = companyCode,
                DatabaseName = databaseName,
                Username = ""
            };
            return Page();
        }

        public async Task<IActionResult> OnPostAsync(string userId, string code)
        {
            if (!ModelState.IsValid)
            {
                StatusMessage = "LoginForm_Var_ConfirmMailMessage";
                Status = true;
                return Page();
            }

            StatusMessage = "LoginForm_Var_ConfirmMailMessage";
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                StatusMessage = "LoginForm_Var_TransactionExpired";
                Status = false;
                return Page();
            }
            code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
            var status = await _userManager.ConfirmEmailAsync(user, code);
            if (!status.Succeeded)
            {
                StatusMessage = "LoginForm_Var_TransactionExpired";
                Status = false;
                return Page();
            }

            if (Input.Username.IndexOf('@') > -1)
            {
                //Validate email format
                string emailRegex = @"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}" +
                                       @"\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\" +
                                          @".)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$";
                Regex re = new Regex(emailRegex);
                if (!re.IsMatch(Input.Username))
                {
                    ModelState.AddModelError("Username", "LoginForm_Validate_UserName_Invalid");
                    Status = true;
                    return Page();
                }
            }
            else
            {
                //validate Username format
                string usernameRegex = @"^[a-zA-Z0-9_\-\.]*$";
                Regex re = new Regex(usernameRegex);
                if (!re.IsMatch(Input.Username))
                {
                    ModelState.AddModelError("Username", "LoginForm_Validate_UserName_Invalid");
                    Status = true;
                    return Page();
                }
            }

            var setUsernameResult = await _userManager.SetUserNameAsync(user, user.TK + "." + user.Database + "." + Input.Username.ToUpper());
            if (!setUsernameResult.Succeeded)
            {
                ModelState.AddModelError("Username", "LoginForm_Validate_UserName_Exist");
                Status = true;
                return Page();
            }

            var result = await _userManager.ChangePasswordAsync(user, "GroupWare@123", Input.Password);
            if (result.Succeeded)
            {
                user.UserName2 = Input.Username.ToUpper();
                await _userManager.UpdateAsync(user);

                return RedirectToPage("./ResetPasswordConfirmation");
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
                Status = true;
            }
            return Page();
        }
    }
}
