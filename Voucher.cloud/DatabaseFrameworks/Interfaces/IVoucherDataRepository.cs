
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
    public interface IVoucherDataRepository
    {
        Task<APIResult> Get(ApplicationUser user, JObject model);
        Task<Voucher.cloud.Models.DB.Voucher> GetDetail(ApplicationUser user, Guid Id);
        Task<List<VoucherHistory2>> GetVoucherHistory(ApplicationUser user, Guid voucherID);
        Task<int> Delete(ApplicationUser user, DeleteModel model);
        Task<(int, Voucher.cloud.Models.DB.Voucher)> Save(ApplicationUser user, Voucher.cloud.Models.DB.Voucher row);
    }
}

