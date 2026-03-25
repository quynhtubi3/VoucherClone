using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Voucher.cloud.Models.Identity
{
    public class AccountInfo
    {
        [JsonProperty("Server")]
        public string Server { get; set; }
        [JsonProperty("TK")]
        public string TK { get; set; }

        [JsonProperty("Database")]
        public string Database { get; set; }

        [JsonProperty("CompanyName")]
        public string CompanyName { get; set; }        

        [JsonProperty("StartDate")]
        public DateTime StartDate { get; set; }

        [JsonProperty("EndDate")]
        public DateTime EndDate { get; set; }
        
        [JsonProperty("UserCount")]
        public int UserCount { get; set; }

        [JsonProperty("Email")]
        public string Email { get; set; }

        [JsonProperty("IsLock")]
        public bool IsLock { get; set; }              

        public static List<AccountInfo> FromJson(string json) => JsonConvert.DeserializeObject<List<AccountInfo>>(json, Converter.Settings);
    }

    internal static class Converter
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            Converters =
            {
                new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
            },
        };
    }
}
