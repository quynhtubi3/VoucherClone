
using Voucher.cloud.Models.Identity;
using Newtonsoft.Json.Linq;
using Voucher.cloud.Models;
using Voucher.cloud.Models.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Voucher.cloud.DatabaseFrameworks.Interfaces
{
    public interface ICHUCVUDataRepository
    {
        List<CHUCVU> Get(ApplicationUser user, JObject model);

        Task<APIResult> GetPagination(ApplicationUser user, JObject model);

        int Delete(ApplicationUser user, DeleteModel model);
        int Save(ApplicationUser user, ref CHUCVU row);
    }
}
