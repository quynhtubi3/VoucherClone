using System.ComponentModel;

namespace Voucher.cloud.Commons
{
    public enum EnTrangThaiBaoCao
    {
        [Description("TAMLUU")]
        TAMLUU = 1,

        [Description("CHODUYET")]
        CHODUYET = 2,

        [Description("TRALAI")]
        TRALAI = 3,

        [Description("DAPHEDUYET")]
        DAPHEDUYET = 4
    }

    public enum EnUserPrivilege
    {
        [Description("BCCVKhoa")]
        BCCVKhoa,
    }

    public enum EnAPIResultCode
    {
        [Description("BCCVKhoa")]
        BCCVKhoa = 15,
    }

}
