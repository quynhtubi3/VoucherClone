using Voucher.cloud.Models;
using Voucher.cloud.Models.Identity;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Voucher.cloud.DatabaseFrameworks.Interfaces
{
    public interface IUserRightDataRepository
    {
        Task<List<Menu>> GetAllMenu(ApplicationUser user);
        int Save(ApplicationUser user, List<UserRights> rows);
        Task<object> getPrivilege(ApplicationUser user, string id, string type);
        Task<object> GetAll(ApplicationUser user, string roleId, string userId);
        Task<bool> getAutoApprove(ApplicationUser user);
    }
}
