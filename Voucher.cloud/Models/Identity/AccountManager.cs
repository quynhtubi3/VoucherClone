using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Voucher.cloud.Models.Identity
{
    public static class AccountManager
    {
        public static AccountInfo Get(string Tk, string database)
        {
            return FromJson(Tk).Where(x => x.Database.Equals(database)).FirstOrDefault();             
        }

        public static List<AccountInfo> FromJson(string Tk)
        {
            List<AccountInfo> result = new List<AccountInfo>();

            try
            {
                if (!string.IsNullOrEmpty(Tk))
                {
                    string path = Path.Combine("DBConfiguration", Tk.ToUpper() + ".json");
                    using (StreamReader r = new StreamReader(path))
                    {
                        string json = r.ReadToEnd();
                        result = AccountInfo.FromJson(json);
                    }
                }
            }
            catch
            {

            }

            return result;
        }
    }
}
