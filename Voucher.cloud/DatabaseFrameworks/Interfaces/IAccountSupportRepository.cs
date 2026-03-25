using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Voucher.cloud.DatabaseFrameworks.Interfaces
{
    public interface IAccountSupportRepository
    {
        List<Object> GetAccountInfo(string accountName);
    }
}
