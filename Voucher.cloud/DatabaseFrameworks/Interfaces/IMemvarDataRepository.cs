using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using System.Data;
using Voucher.cloud.Models;
using Voucher.cloud.Models.Identity;
using Voucher.cloud.Models.DB;
using System.Collections.Generic;

namespace Voucher.cloud.DatabaseFrameworks.Interfaces
{
    public interface IMemvarDataRepository
    {
        Task<UservarModel> GetUservar(ApplicationUser user);
        Task<SystemvarModel> GetSystemvar(ApplicationUser user);
        List<GioCongCapBacModel> GetListGioCongCapBac(ApplicationUser user);
        int GetSoNgayKhoaBC(ApplicationUser user);
        void SetMemvar(ApplicationUser user, Memvar memvar);
    }
}
