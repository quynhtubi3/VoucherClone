using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Voucher.cloud.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    public class ShowError : PageModel
    {
        public void OnGet()
        {
        }
    }
}
