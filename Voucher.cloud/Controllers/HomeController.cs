using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Voucher.cloud.Models;
using Voucher.cloud.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
namespace Voucher.cloud.Controllers
{
    [Authorize]
    //[TypeFilter(typeof(ThrottleActionFilter))]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public string Username { get; set; }
        public HomeController(ILogger<HomeController> logger, UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _logger = logger;
            _userManager = userManager;
            _signInManager = signInManager;
        }
        [Authorize]
        public async Task<IActionResult> IndexAsync()
        {
            try
            {
                ViewData["Theme"] = "s3t-theme1";
                return View();
            }
            catch
            {
                await _signInManager.SignOutAsync();
                _logger.LogInformation("User logged out.");
                return RedirectToAction("Login", "Account");
            }            
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
