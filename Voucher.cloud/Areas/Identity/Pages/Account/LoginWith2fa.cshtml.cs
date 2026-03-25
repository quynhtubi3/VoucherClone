using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Voucher.cloud.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace Voucher.cloud.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    public class LoginWith2faModel : PageModel
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger<LoginWith2faModel> _logger;
        private readonly string User_Msg_UserName_Locked = "LoginForm_Validate_UserName_Locked";
        private readonly string User_Msg_2FA_Invalid = "LoginForm_Validate_2FA_Invalid";
        public LoginWith2faModel(SignInManager<ApplicationUser> signInManager, ILogger<LoginWith2faModel> logger)
        {
            _signInManager = signInManager;
            _logger = logger;
        }

        [BindProperty]
        public InputModel Input { get; set; }

        public bool RememberMe { get; set; }

        public class InputModel
        {
            [Required(ErrorMessage = "LoginForm_Validate_2FA_Invalid")]
            //[StringLength(7, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
            [DataType(DataType.Text)]
            [Display(Name = "Authenticator code")]
            public string TwoFactorCode { get; set; }

            [Display(Name = "Remember this machine")]
            public bool RememberMachine { get; set; }
        }

        public async Task<IActionResult> OnGetAsync(bool rememberMe)
        {
            // Ensure the user has gone through the username & password screen first
            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();

            if (user == null)
            {
                //throw new InvalidOperationException($"Unable to load two-factor authentication user.");
                return RedirectToPage("./ShowError");
            }

            RememberMe = rememberMe;

            return Page();
        }

        public async Task<IActionResult> OnPostAsync(bool rememberMe)
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }


            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
            if (user == null)
            {
                //throw new InvalidOperationException($"Unable to load two-factor authentication user.");
                return RedirectToPage("./ShowError");
            }

            var authenticatorCode = Input.TwoFactorCode.Replace(" ", string.Empty).Replace("-", string.Empty);

            var result = await _signInManager.TwoFactorAuthenticatorSignInAsync(authenticatorCode, rememberMe, Input.RememberMachine);

            if (result.Succeeded)
            {
                _logger.LogInformation("User with ID '{UserId}' logged in with 2fa.", user.Id);
                CookieOptions option = new CookieOptions();
                option.Expires = DateTime.Now.AddDays(1000);
                option.HttpOnly = true;
                option.IsEssential = true;                
                return RedirectToAction("Index", "Home");
            }
            else if (result.IsLockedOut)
            {
                _logger.LogWarning("User with ID '{UserId}' account locked out.", user.Id);
                ModelState.AddModelError("UserName", User_Msg_UserName_Locked);
                return Page();
            }
            else
            {
                _logger.LogWarning("Invalid authenticator code entered for user with ID '{UserId}'.", user.Id);
                ModelState.AddModelError("TwoFactorCode", User_Msg_2FA_Invalid);
                return Page();
            }
        }
    }
}
