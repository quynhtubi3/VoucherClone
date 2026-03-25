using System;
using System.ComponentModel;

namespace Voucher.cloud.Commons
{
    public static class Extentions
    {       
        /// <summary>
        /// lấy Attribute Description của thuộc tính trong enum
        /// </summary>
        /// <param name="value"></param>
        /// <returns>string description</returns>
        public static string GetDescription(this Enum value)
        {
            if (value == null) return string.Empty;
            var fi = value.GetType().GetField(value.ToString());
            if (fi == null) return string.Empty;
            var attributes = (DescriptionAttribute[])fi.GetCustomAttributes(typeof(DescriptionAttribute), false);
            if (attributes.Length > 0)
                return attributes[0].Description;
            return value.ToString();
        }

        public static string DateToString(this DateTime? date)
        {
            if (date == null)
                return string.Empty;

            try
            {
                return date.Value.ToString("dd/MM/yyyy");
            }
            catch (Exception e)
            {
                return string.Empty;
            }
        }

        public static string DateToString(this DateTime date)
        {
            try
            {
                return date.ToString("dd/MM/yyyy");
            }
            catch (Exception e)
            {
                return string.Empty;
            }
        }

        public static string DateTimeToStringHHmm(this DateTime? date)
        {
            if (date == null)
                return string.Empty;

            try
            {
                return date.Value.ToString("dd/MM/yyyy HH:mm");
            }
            catch (Exception e)
            {
                return string.Empty;
            }
        }

        public static string DateTimeToStringHHmm(this DateTime date)
        {
            try
            {
                return date.ToString("dd/MM/yyyy HH:mm");
            }
            catch (Exception e)
            {
                return string.Empty;
            }
        }

    }

}
