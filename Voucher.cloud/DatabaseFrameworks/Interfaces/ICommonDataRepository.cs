using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Voucher.cloud.Models.Identity;

namespace Voucher.cloud.DatabaseFrameworks.Interfaces
{
    public interface ICommonDataRepository
    {
        object NewDictionaryCode(ApplicationUser user, JObject model);
        object Search(ApplicationUser user, string table, string term, string fieldName, bool filterType, string filterFields, string displayFields, string orderFields, int maxRows, string firstFilter = null);
        object Search2(ApplicationUser user, string table, string term, string fieldName, bool filterType, string filterFields, string displayFields, string orderFields, int maxRows, string firstFilter = null);
        object ValidateSearch(ApplicationUser user, string table, string column, string value, string firstFilter = null);
        object MultiSelect(ApplicationUser user, string table, string term, string captionField, string valueField);

        object RPT_Chart_01_Get(ApplicationUser user, JObject model);
        object RPT_Chart_02_Get(ApplicationUser user, JObject model);
        object RPT_Chart_03_Get(ApplicationUser user, JObject model);
        object RPT_Chart_04_Get(ApplicationUser user, JObject model);
        object RPT_Chart_05_Get(ApplicationUser user, JObject model);
        object RPT_Chart_06_Get(ApplicationUser user, JObject model);

    }
}
