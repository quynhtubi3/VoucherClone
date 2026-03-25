using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
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
    public class ResetPasswordModel : PageModel
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ResetPasswordModel(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [BindProperty]
        public InputModel Input { get; set; }

        public class InputModel
        {
            //[Required(ErrorMessage = "Trường email là bắt buộc")]
            //[EmailAddress]
            public string Email { get; set; }
            public string TK { get; set; }
            public string Database { get; set; }

            [Required(ErrorMessage = "LoginForm_Validate_Password_Require")]
            [Display(Name = "Password")]
            [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*])[A-Za-z\d.!@#$%^&*]{8,}", ErrorMessage = "LoginForm_Validate_Password_Format")]
            [DataType(DataType.Password)]
            public string Password { get; set; }

            [DataType(DataType.Password)]
            [Display(Name = "Confirm password")]
            [Compare("Password", ErrorMessage = "LoginForm_Validate_Password_Confirm")]
            public string ConfirmPassword { get; set; }

            public string Code { get; set; }
        }

        public IActionResult OnGet(string code = null, string email = null, string companyCode = null, string databaseName = null)
        {
            if (code == null)
            {
                return RedirectToPage("./ShowError");
            }
            else
            {
                Input = new InputModel
                {
                    Code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code)),
                    Email = email,
                    TK = companyCode,
                    Database = databaseName
                };
                return Page();
            }
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }
            CookieOptions option = new CookieOptions();
            option.Expires = DateTime.Now.AddDays(1000);
            option.HttpOnly = true;
            option.IsEssential = true;
            Response.Cookies.Append("TK", Input.TK, option);
            Response.Cookies.Append("Database", Input.Database, option);
            var account = AccountManager.Get(Input.TK, Input.Database);
            if (account == null)
            {
                ModelState.AddModelError("TK", "LoginForm_Validate_Company_Invalid");
                return Page();
            }
            
            var user = await _userManager.FindByEmailAsync(account.TK + "." + Input.Database + "." + Input.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return RedirectToPage("./ShowError");
            }

            var result = await _userManager.ResetPasswordAsync(user, Input.Code, Input.Password);
            if (result.Succeeded)
            {
                return RedirectToPage("./ResetPasswordConfirmation");
            }

            return RedirectToPage("./Expired");
        }
    }
}
