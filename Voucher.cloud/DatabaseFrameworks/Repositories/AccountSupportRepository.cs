using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Data;
using Microsoft.AspNetCore.Hosting;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Voucher.cloud.DatabaseFrameworks.Interfaces;
using Voucher.cloud.Models.Identity;

namespace Voucher.cloud.DatabaseFrameworks.Repositories
{
    public class AccountSupportRepository : IAccountSupportRepository
    {
        private readonly ILogger<IAccountSupportRepository> _logger;
        private readonly IConfiguration _configuration;
        public AccountSupportRepository(ILogger<IAccountSupportRepository> logger, IConfiguration configuration)
        {
            this._logger = logger;
            this._configuration = configuration;
        }

        public List<Object> GetAccountInfo(string TK)
        {
            List<Object> list = new List<Object>();
            var dbs = AccountManager.FromJson(TK).Select(x => new { Name = x.CompanyName, Value = x.Database, Status = x.IsLock }).OrderBy(x => x.Name);
            foreach (var db in dbs)
            {
                list.Add(db);
            }            
            return list;
        }
    }
}