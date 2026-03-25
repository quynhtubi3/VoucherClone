
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
    public interface IBaoCaoThongKeDataRepository
    {
        Task<APIResult> GetDoanhThuTheoNguoiBan(ApplicationUser user, JObject model);
        Task<APIResult> GetHoaHongCacBen(ApplicationUser user, JObject model);
        Task<APIResult> GetDoanhThuTheoLoaiVoucher(ApplicationUser user, JObject model);
        Task<APIResult> GetTiLeKichHoatVoucher(ApplicationUser user, JObject model);
        Task<APIResult> GetDanhSachVoucherSapHetHan(ApplicationUser user, JObject model);
        Task<APIResult> SendMailRemind(ApplicationUser user,List<Guid> ids);

    }
}

