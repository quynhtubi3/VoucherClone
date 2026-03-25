using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;

namespace Voucher.cloud.Converter
{
    public class DateShortFormatConverter : JsonConverter<DateTime?>
    {

        public override DateTime? ReadJson(JsonReader reader, Type objectType, DateTime? existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            return reader.Value == null ? (DateTime?)reader.Value : DateTime.ParseExact(reader.Value.ToString(),
                    "dd/MM/yyyy", CultureInfo.InvariantCulture);
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
                writer.WriteValue(dateTimeValue?.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture));
            }
            
        }
    }
}
