
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
    public interface IDMPHONGBANDataRepository
    {
        List<DMPHONGBAN> Get(ApplicationUser user, JObject model);
        int Delete(ApplicationUser user, DeleteModel model);
        int Save(ApplicationUser user, ref DMPHONGBAN row);
        int Import(ApplicationUser user, bool isAll, List<DMPHONGBAN> rows);
    }
}
