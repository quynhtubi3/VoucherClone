
using Voucher.cloud.Models.Identity;
using Newtonsoft.Json.Linq;
using Voucher.cloud.Models;
using Voucher.cloud.Models.DB;
using System.Collections.Generic;

namespace Voucher.cloud.DatabaseFrameworks.Interfaces
{
    public interface IUserProfileDataRepository
    {
        UserProfile Get(ApplicationUser user, string model);
        List<UserProfile> GetAll(ApplicationUser user);
        List<UserProfile> Search(ApplicationUser user, JObject model);
        int Delete(ApplicationUser user, DeleteModel model);
        int Save(ApplicationUser user,ref UserProfile row, bool action);
        int UpdateUserFullName(ApplicationUser user, string uid, string fullName);
        //int UpdateProfile2(ApplicationUser user, UserProfile row);
        List<UserPrivilege> GetListUserPrivilege(ApplicationUser user);
        int UpdateUyQuyen(ApplicationUser user, string uid, string TAIKHOANNGANHANG_UYQUYEN, string TENNGANHANG_UYQUYEN, string CHINHANH_UYQUYEN, string GIAYTHANHTOAN_UYQUYEN, string NAMEGIAYTHANHTOAN_UYQUYEN);
        List<UserProfile> SearchUyQuyen(ApplicationUser user, JObject model);

    }
}
