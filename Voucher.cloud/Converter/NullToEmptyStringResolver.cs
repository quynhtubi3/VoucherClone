using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace Voucher.cloud.Converter
{
    public class NullToEmptyStringResolver : DefaultContractResolver
    {
        protected override IList<JsonProperty> CreateProperties(Type type, MemberSerialization memberSerialization)
        {
            return type.GetProperties()
                    .Select(p => {
                        var jp = base.CreateProperty(p, memberSerialization);
                        jp.ValueProvider = new NullToEmptyStringValueProvider(p);
                        return jp;
                    }).ToList();
        }
    }

    public class NullToEmptyStringValueProvider : IValueProvider
    {
        PropertyInfo _MemberInfo;
        public NullToEmptyStringValueProvider(PropertyInfo memberInfo)
        {
            _MemberInfo = memberInfo;
        }

        public object GetValue(object target)
        {
            try
            {
                object result = _MemberInfo.GetValue(target);
                if ((_MemberInfo.PropertyType == typeof(string) && result == null)) return "";
                if ((_MemberInfo.PropertyType.ToString().Equals("System.Nullable`1[System.DateTime]") && result == null)) {
                    DateTime oDate = DateTime.ParseExact("31/12/9999", "dd/MM/yyyy", CultureInfo.InvariantCulture);
                    return oDate;
                } 
                return result;
            }
            catch(Exception e)
            {
                return null;
            }
        }

        public void SetValue(object target, object value)
        {
            _MemberInfo.SetValue(target, value);
        }
    }
}
