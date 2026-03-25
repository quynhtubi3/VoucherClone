
using Voucher.cloud.Models.Identity;
using Newtonsoft.Json.Linq;
using Voucher.cloud.Models;
using Voucher.cloud.Models.DB;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Voucher.cloud.DatabaseFrameworks.Interfaces
{
    public interface IQTNHATKYHETHONGDataRepository
    {
        Task<APIResult> Get(ApplicationUser user, JObject model);
        int Delete(ApplicationUser user, DeleteModel model);
    }
}
