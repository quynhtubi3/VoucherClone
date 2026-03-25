using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using Voucher.cloud.Models.Identity;
using Voucher.cloud.Commons;
using Voucher.cloud.DatabaseFrameworks.Interfaces;
using Voucher.cloud.Converter;
using Newtonsoft.Json.Converters;
using System.Globalization;
using Voucher.cloud.Models;

namespace Voucher.cloud.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    //[TypeFilter(typeof(ThrottleActionFilter))]
    [ApiController]
    public class CommonController : ControllerBase
    {
        private readonly ICommonDataRepository _context;
        private readonly IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IWebHostEnvironment _env;
        private readonly IMemvarDataRepository _MemvarDataContext;

        public CommonController(ICommonDataRepository context, IConfiguration configuration, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, IWebHostEnvironment env
            , IMemvarDataRepository memvarDataContext
            )
        {
            _env = env;
            _context = context;
            _configuration = configuration;
            _userManager = userManager;
            _roleManager = roleManager;
            _MemvarDataContext = memvarDataContext;
        }

        [HttpGet("Search")]
        public async Task<ActionResult<object>> SearchAsync(string table, string term, string fieldName, bool filterType, string filterFields, string displayFields, string orderFields, int maxRows, string firstFilter = null)
        {
            var settings = new JsonSerializerSettings
            {

            };
            settings.Converters.Add(new DateShortFormatConverter());
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (table.Equals("GrpList"))
            {
                if (term == null) term = "";
                var data = new
                {
                    fieldName = "Name",
                    filterType = false,
                    filterFields = "Name",
                    orderFields = "Name, Description",
                    displayFields = "Name, Description",
                    maxRows = 1000,
                    rows = _roleManager.Roles.Where(r => r.TK.Equals(user.TK) && r.Database.Equals(user.Database) && (string.IsNullOrEmpty(term) || r.Role.Contains(term))).Select(r => new { Name = r.Role, Description = r.Description }).ToList()
                };
                return JsonConvert.SerializeObject(data, settings);
            } else if (table.Equals("UserList"))
            {
                if (term == null) term = "";
                var data = new
                {
                    fieldName = "Name",
                    filterType = false,
                    filterFields = "Name",
                    orderFields = "Name, FullName",
                    displayFields = "Name, FullName",
                    maxRows = 1000,
                    //rows = _userManager.Users.Where(r => r.TK.Equals(user.TK) && r.Database.Equals(user.Database) && (string.IsNullOrEmpty(term) || r.UserName2.Contains(term))).Select(r => new { Name = r.Email2, FullName = r.FullName + "(" + r.Email2 + ")", Id = r.Id }).ToList()
                    //20230612: Khong lay tai khoan da khoa
                    rows = _userManager.Users.Where(r => r.LockoutEnd == null && r.TK.Equals(user.TK) && r.Database.Equals(user.Database) && (string.IsNullOrEmpty(term) || r.UserName2.Contains(term))).Select(r => new { Name = r.Email2, FullName = r.FullName + "(" + r.Email2 + ")", Id = r.Id }).ToList()
                };
                return JsonConvert.SerializeObject(data, settings);
            }
            else
            {
                return JsonConvert.SerializeObject(_context.Search(user, table, term, fieldName, filterType, filterFields, displayFields, orderFields, maxRows, firstFilter), settings);
            }
        }

        [HttpGet("Search2")]
        public async Task<ActionResult<object>> SearchAsync2(string table, string term, string fieldName, bool filterType, string filterFields, string displayFields, string orderFields, int maxRows, string firstFilter = null)
        {
            var settings = new JsonSerializerSettings
            {

            };
            settings.Converters.Add(new DateShortFormatConverter());
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (table.Equals("GrpList"))
            {
                if (term == null) term = "";
                var data = new
                {
                    fieldName = "Name",
                    filterType = false,
                    filterFields = "Name",
                    orderFields = "Name, Description",
                    displayFields = "Name, Description",
                    maxRows = 1000,
                    rows = _roleManager.Roles.Where(r => r.TK.Equals(user.TK) && r.Database.Equals(user.Database) && (string.IsNullOrEmpty(term) || r.Role.Contains(term))).Select(r => new { Name = r.Role, Description = r.Description }).ToList()
                };
                return JsonConvert.SerializeObject(data, settings);
            }
            else if (table.Equals("UserList"))
            {
                if (term == null) term = "";
                var data = new
                {
                    fieldName = "Name",
                    filterType = false,
                    filterFields = "Name",
                    orderFields = "Name, FullName",
                    displayFields = "Name, FullName",
                    maxRows = 1000,
                    rows = _userManager.Users.Where(r => r.TK.Equals(user.TK) && r.Database.Equals(user.Database) && (string.IsNullOrEmpty(term) || r.UserName2.Contains(term))).Select(r => new { Name = r.Email2, FullName = r.FullName + "(" + r.Email2 + ")", Id = r.Id }).ToList()
                };
                return JsonConvert.SerializeObject(data, settings);
            }
            else
            {
                return JsonConvert.SerializeObject(_context.Search2(user, table, term, fieldName, filterType, filterFields, displayFields, orderFields, maxRows, firstFilter), settings);
            }
        }

        [HttpGet("ValidateSearch")]
        public async Task<ActionResult<object>> ValidateSearchAsync(string table, string column, string value, string firstFilter = null)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (value == null) value = "";
            if (table.Equals("GrpList"))
            {
                return _roleManager.Roles.Where(r => r.TK.Equals(user.TK) && r.Database.Equals(user.Database) && r.Role.Equals(value)).Select(r => new { Name = r.Role, Description = r.Description }).ToArray();
            }
            else if (table.Equals("UserList"))
            {
                return _userManager.Users.Where(r => r.TK.Equals(user.TK) && r.Database.Equals(user.Database) && (r.UserName2.Equals(value) || r.Email2.Equals(value))).Select(r => new { Name = r.Email2, FullName = r.FullName + "(" + r.Email2 + ")", Id = r.Id }).ToArray();
            }
            else
            {
                return _context.ValidateSearch(user, table, column, value, firstFilter);
            }
        }

        [HttpGet("MultiSelect")]
        public async Task<ActionResult<object>> MultiSelectAsync(string table, string term, string captionField, string valueField)
        {

            var settings = new JsonSerializerSettings
            {

            };
            settings.Converters.Add(new DateShortFormatConverter());
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (table.Equals("UserList"))
            {
                if (term == null) term = "";
                return JsonConvert.SerializeObject(_userManager.Users.Where(r => r.TK.Equals(user.TK) && r.Database.Equals(user.Database) && (string.IsNullOrEmpty(term) || r.UserName2.Contains(term))).Select(r => new { caption = r.UserName2, value = r.Id }).ToList(), settings);
            }
            else
            {
                return JsonConvert.SerializeObject(_context.MultiSelect(await _userManager.GetUserAsync(HttpContext.User), table, term, captionField, valueField));
            }

        }


        [HttpPost("NewDictionaryCode")]
        public async Task<ActionResult<string>> NewDictionaryCodeAsync([Bind("TableName,FieldName,CurrentCode")] JObject model)
        {
            return _context.NewDictionaryCode(await _userManager.GetUserAsync(HttpContext.User), model).ToString();
        }

        [HttpPost("TableColumnWidthGet")]
        public async Task<ActionResult<object>> TableColumnWidthGet(JObject model)
        {
            object dataout = null;

            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            string file = Common.GetReportInfosPath(user);

            try
            {
                if (System.IO.File.Exists(file))
                {
                    IList<JObject> data = null;

                    using (System.IO.StreamReader r = new System.IO.StreamReader(file))
                    {
                        string json = r.ReadToEnd();
                        data = JsonConvert.DeserializeObject<IList<JObject>>(json, Converter.Settings);
                    }

                    dynamic report = data.FirstOrDefault(r => r["Name"].ToString() == model["Name"].ToString());

                    if (report != null)
                    {
                        dataout = JsonConvert.DeserializeObject<IList<JObject>>(((JObject)report)["Value"].ToString(), Converter.Settings);
                    }
                }
            }
            catch (Exception ex)
            {

            }

            return dataout;
        }

        [HttpPost("TableColumnWidthSave")]
        public async void TableColumnWidthSave(JObject model)
        {
            IList<dynamic> data = null;

            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            string file = Common.GetReportInfosPath(user);

            try
            {
                if (System.IO.File.Exists(file))
                {
                    using (System.IO.StreamReader r = new System.IO.StreamReader(file))
                    {
                        string json = r.ReadToEnd();
                        data = JsonConvert.DeserializeObject<IList<dynamic>>(json, Converter.Settings);
                    }
                }

                if (data == null)
                {
                    data = new List<dynamic>();
                }

                dynamic report = data.FirstOrDefault(r => r["Name"].ToString() == model["Name"].ToString());

                if (report == null)
                {
                    report = new
                    {
                        Name = model["Name"],
                        Value = model["Value"]
                    };

                    data.Add(report);
                }
                else
                {
                    report.Name = model["Name"];
                    report.Value = model["Value"];
                }

                //Write to file
                System.IO.File.WriteAllText(file, JsonConvert.SerializeObject(data));
            }
            catch (Exception ex)
            {

            }
        }

        
        [HttpGet("GetListGioCongCapBac")]
        public List<TrangThaiModel> GetListGioCongCapBac()
        {
            List<TrangThaiModel> list = new List<TrangThaiModel>();

            try
            {
                var user = _userManager.GetUserAsync(HttpContext.User);

                var list2 = _MemvarDataContext.GetListGioCongCapBac(user.Result);

                foreach (var item in list2)
                {
                    TrangThaiModel t = new TrangThaiModel();

                    t.ID = item.CapBac;
                    t.Ten = string.Format("Cấp {0} - Đơn giá giờ công: {1}đ/1 giờ", item.CapBac, item.GioCong);

                    list.Add(t);
                }
            }
            catch(Exception ex)
            {

            }
            

            return list;
        }

        [HttpGet("GetListGioCongCapBac2")]
        public string GetListGioCongCapBac2()
        {
            //string ret = "[{\"id\":\"E\", \"name\":\"UserProfile_Var_LevelE\"},{\"id\":\"D\",\"name\":\"UserProfile_Var_LevelD\"},{\"id\":\"S\",\"name\":\"UserProfile_Var_LevelS\"}]";
            string ret = "";

            try
            {
                var user = _userManager.GetUserAsync(HttpContext.User);

                var list2 = _MemvarDataContext.GetListGioCongCapBac(user.Result);

                foreach (var item in list2)
                {                    
                    string sID = item.CapBac;
                    //string sTen = string.Format("Cấp {0} - Đơn giá giờ công: {1}đ/1 giờ", item.CapBac, item.GioCong);
                    string sTen = "UserProfile_Var_LevelE";

                    string s = "{\"id\":\"" + sID + "\", \"name\":\"" + sTen + "\"}";

                    if (!string.IsNullOrEmpty(ret))
                        ret += "," + s;
                    else
                        ret = s;
                }

                if (!string.IsNullOrEmpty(ret))
                    ret = string.Format("[{0}]", ret);
            }
            catch (Exception ex)
            {

            }


            return ret;
        }

        [HttpPost("RPT_Chart_01_Get")]
        public async Task<ActionResult<object>> RPT_Chart_01_GetAsync(JObject model)
        {
            return _context.RPT_Chart_01_Get(await _userManager.GetUserAsync(HttpContext.User), model);
        }

        [HttpPost("RPT_Chart_02_Get")]
        public async Task<ActionResult<object>> RPT_Chart_02_GetAsync(JObject model)
        {
            return _context.RPT_Chart_02_Get(await _userManager.GetUserAsync(HttpContext.User), model);
        }

        [HttpPost("RPT_Chart_03_Get")]
        public async Task<ActionResult<object>> RPT_Chart_03_GetAsync(JObject model)
        {
            return _context.RPT_Chart_03_Get(await _userManager.GetUserAsync(HttpContext.User), model);
        }

        [HttpPost("RPT_Chart_04_Get")]
        public async Task<ActionResult<object>> RPT_Chart_04_GetAsync(JObject model)
        {
            return _context.RPT_Chart_04_Get(await _userManager.GetUserAsync(HttpContext.User), model);
        }

        [HttpPost("RPT_Chart_05_Get")]
        public async Task<ActionResult<object>> RPT_Chart_05_GetAsync(JObject model)
        {
            return _context.RPT_Chart_05_Get(await _userManager.GetUserAsync(HttpContext.User), model);
        }

        [HttpPost("RPT_Chart_06_Get")]
        public async Task<ActionResult<object>> RPT_Chart_06_GetAsync(JObject model)
        {
            return _context.RPT_Chart_06_Get(await _userManager.GetUserAsync(HttpContext.User), model);
        }


    }

    internal static class Converter
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            Converters =
            {
                new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
            },
        };
    }
}
