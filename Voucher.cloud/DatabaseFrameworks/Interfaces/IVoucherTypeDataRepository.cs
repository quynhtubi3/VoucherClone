
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
    public interface IVoucherTypeDataRepository
    {
        Task<APIResult> Get(ApplicationUser user, JObject model);
        Task<int> Delete(ApplicationUser user, DeleteModel model);
        Task<(int, VoucherType)> Save(ApplicationUser user, VoucherType row);
    }
}

