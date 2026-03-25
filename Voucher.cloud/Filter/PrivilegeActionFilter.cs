using Voucher.cloud.DatabaseFrameworks.Interfaces;
using Voucher.cloud.Models;
using Voucher.cloud.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Voucher.cloud.Commons.Filter
{
    public class PrivilegeActionFilter : IAsyncActionFilter
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUserRightDataRepository _userRightDataRepository;
        public PrivilegeActionFilter(UserManager<ApplicationUser> userManager, IUserRightDataRepository userRightDataRepository)
        {
            _userManager = userManager;
            _userRightDataRepository = userRightDataRepository;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context,
            ActionExecutionDelegate next)
        {
            ContentResult badRequest = new ContentResult()
            {
                StatusCode = 400
            };
            ContentResult noPermision = new ContentResult()
            {
                StatusCode = 423
            };
            ContentResult unAuthorized = new ContentResult()
            {
                StatusCode = 401
            };
            
            // for expire
            if (context.HttpContext.User == null)
            {
                context.Result = unAuthorized;
                return;
            }

            var db = context.HttpContext.Request.Headers["3t-action-db"];
            string userName = _userManager.GetUserName(context.HttpContext.User);
            var tableName = context.HttpContext.Request.Headers["3t-action-table"];
            var menuType = context.HttpContext.Request.Headers["3t-action-menu-type"];
            var type = context.HttpContext.Request.Headers["3t-action-type"];
            var user = await _userManager.GetUserAsync(context.HttpContext.User);

            //string dmId = "";
            RightModel right = null;

            switch (context.HttpContext.Request.Method)
            {
                case "DELETE":
                    switch (menuType)
                    {                        
                        case "I":
                            Menu m = ((await _userRightDataRepository.GetAllMenu(user))).Where(x => x.Ma_File != null && x.Ma_File.Equals(tableName)).FirstOrDefault();
                            if (m == null)
                            {
                                context.Result = noPermision;
                                return;
                            }
                            RightModel ctRight = (RightModel)await _userRightDataRepository.getPrivilege(user, m.Id, menuType);
                            if (ctRight == null || ctRight.Right_4 == false)
                            {
                                context.Result = noPermision;
                                return;
                            }
                            break;
                        case "N":
                            await next();
                            return;
                        default:
                            context.Result = badRequest;
                            return;
                    }
                    //if (dmId.Equals(""))
                    //{
                    //    context.Result = badRequest;
                    //    return;
                    //}
                    
                    //right = (RightModel) (await _userRightDataRepository.getPrivilege(user, dmId, menuType));
                    //if (!right.Right_3)
                    //{
                    //    context.Result = noPermision;
                    //    return;
                    //}
                    break;
                case "POST":
                    if (context.HttpContext.Request.Path.Value.EndsWith("/Save"))
                    {
                        var a = await _userRightDataRepository.GetAllMenu(user);
                        Menu m = ((await _userRightDataRepository.GetAllMenu(user))).Where(x => x.Ma_File != null && x.Ma_File.Equals(tableName)).FirstOrDefault();
                        if (m == null)
                        {
                            context.Result = noPermision;
                            return;
                        }
                        RightModel ctRight = (RightModel)await _userRightDataRepository.getPrivilege(user, m.Id, menuType);
                        
                        switch (type)
                        {
                            case "CREATE":
                                if (!ctRight.Right_2)
                                {
                                    context.Result = noPermision;
                                    return;
                                }
                                break;
                            case "UPDATE":
                                if (!ctRight.Right_3)
                                {
                                    context.Result = noPermision;
                                    return;
                                }
                                break;
                            default:
                                context.Result = badRequest;
                                return;
                        }
                    } else if(context.HttpContext.Request.Path.Value.EndsWith("/Get"))
                    {
                        switch (menuType)
                        {                            
                            case "I":                                
                                Menu m = ((await _userRightDataRepository.GetAllMenu(user))).Where(x => x.Ma_File != null && x.Ma_File.Equals(tableName)).FirstOrDefault();
                                if (m == null)
                                {
                                    context.Result = noPermision;
                                    return;
                                }
                                RightModel ctRight = (RightModel)await _userRightDataRepository.getPrivilege(user, m.Id, menuType);
                                if (ctRight == null || ctRight.Right_1 == false)
                                {
                                    context.Result = noPermision;
                                    return;
                                }
                                break;
                            case "N":
                                await next();
                                return;
                            default:
                                context.Result = badRequest;
                                return;
                        }
                    }
                    break;
                default:
                    break;
            }            
            await next();
        }
    }
}
