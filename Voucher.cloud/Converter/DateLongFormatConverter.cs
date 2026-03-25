using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;

namespace Voucher.cloud.Converter
{
    public class DateLongFormatConverter : JsonConverter<DateTime?>
    {
        public override DateTime? ReadJson(JsonReader reader, Type objectType, DateTime? existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            return reader.Value == null || string.IsNullOrEmpty(reader.Value.ToString()) ? (DateTime?)null : DateTime.ParseExact(reader.Value.ToString(),
                    "yyyy/MM/dd HH:mm:ss.fff", CultureInfo.InvariantCulture);
        }

        public override void WriteJson(JsonWriter writer, DateTime? dateTimeValue, JsonSerializer serializer)
        {
            DateTime oDate = DateTime.ParseExact("31/12/9999", "dd/MM/yyyy", CultureInfo.InvariantCulture);
            if (DateTime.Compare(oDate, (DateTime)dateTimeValue) == 0)
            {
                writer.WriteValue("");
            }
            else
            {
                writer.WriteValue(dateTimeValue?.ToString("yyyy/MM/dd HH:mm:ss.fff", CultureInfo.InvariantCulture));
            }
        }
    }
}
