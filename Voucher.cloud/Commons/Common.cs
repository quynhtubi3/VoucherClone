using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using MimeKit;
using Voucher.cloud.Models.Identity;
using Voucher.cloud.Converter;
using System.Text;
using Aspose.Cells;
using System.Globalization;
using Microsoft.Extensions.Logging;
using DocumentFormat.OpenXml.Office2010.Excel;
using Voucher.cloud.Models;

namespace Voucher.cloud.Commons
{
    public class Common
    {
        public static string MetadataFolder = "Metadata";
        private static  ILogger<Common> _logger;
        public Common(ILogger<Common> logger)
        {
            _logger = logger;
        }
        public static string GetImagePath(ApplicationUser user, string wwwroot, string dmCode, string code)
        {
            string path = Path.Combine(user.TK, user.Database);
            string dmCodePath = Path.Combine(wwwroot, Path.Combine(MetadataFolder, Path.Combine(path, dmCode)));
            if (!Directory.Exists(dmCodePath))
                Directory.CreateDirectory(dmCodePath);
            return Path.Combine(dmCodePath, code.ToLower() + ".jpg");
        }

        public static string GetPath(ApplicationUser user, string wwwroot, string dmCode, string code, string extentison)
        {
            string path = Path.Combine(user.TK, user.Database);
            string dmCodePath = Path.Combine(wwwroot, Path.Combine(MetadataFolder, Path.Combine(path, dmCode)));
            if (!Directory.Exists(dmCodePath))
                Directory.CreateDirectory(dmCodePath);
            return Path.Combine(dmCodePath, code.ToLower() + "." + extentison);
        }

        public static string GetWebPath(ApplicationUser user, string dmCode, string code, string extentison)
        {
            string path = Path.Combine(user.TK, user.Database);
            string dmCodePath = Path.Combine(MetadataFolder, Path.Combine(path, dmCode));
            return Path.Combine(dmCodePath, code + "." + extentison);
        }
        public static string GetWebPathWithoutExt(ApplicationUser user, string dmCode)
        {
            string path = Path.Combine(user.TK, user.Database);
            string dmCodePath = Path.Combine(MetadataFolder, Path.Combine(path, dmCode));
            return Path.Combine(dmCodePath);
        }

        public static string GetImageWebPath(ApplicationUser user, string dmCode, string code)
        {
            string path = Path.Combine(user.TK, user.Database);
            string dmCodePath = Path.Combine(MetadataFolder, Path.Combine(path, dmCode));
            return Path.Combine(dmCodePath, code + ".jpg");
        }

        public static string GetAvatarFile(ApplicationUser user, string wwwroot)
        {
            string path = Path.Combine(user.TK, user.Database);
            string dmCodePath = Path.Combine(wwwroot, Path.Combine(MetadataFolder, Path.Combine(path, "UserList")));            
            if (!Directory.Exists(dmCodePath))
                Directory.CreateDirectory(dmCodePath);

            return Path.Combine(dmCodePath, user.Id.ToLower() + ".jpg");
        }

        public static string GetAvatarFileWebPath(ApplicationUser user, string wwwroot)
        {
            string path = Path.Combine(user.TK, user.Database);
            string dmCodePath = Path.Combine(MetadataFolder, Path.Combine(path, "UserList"));
            if (!Directory.Exists(dmCodePath))
                Directory.CreateDirectory(dmCodePath);

            return Path.Combine(dmCodePath, user.Id.ToLower() + ".jpg");
        }

        public static string GetReportInfosPath(ApplicationUser user)
        {
            string directory = Path.Combine(MetadataFolder, user.TK, user.Database);

            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory);

            return Path.Combine(directory, user.Id + "-Infos.json");
        }

        public static T CreateItemFromRow<T>(DataRow row) where T : new()
        {
            // create a new object
            T item = new T();

            // set the item
            SetItemFromRow(item, row);

            // return 
            return item;
        }

        public static void SetItemFromRow<T>(T item, DataRow row) where T : new()
        {
            // go through each column
            foreach (DataColumn c in row.Table.Columns)
            {
                // find the property for the column
                PropertyInfo p = item.GetType().GetProperty(c.ColumnName);

                // if exists, set the value
                if (p != null && row[c] != DBNull.Value)
                {
                    if (row[c].GetType() == typeof(Guid))
                    {
                        p.SetValue(item, row[c].ToString(), null);
                    }
                    else
                    {
                        p.SetValue(item, row[c], null);
                    }
                }
            }
        }

        public static T CreateItemFromRow2<T>(DataRow row) where T : new()
        {
            // create a new object
            T item = new T();

            // set the item
            SetItemFromRow2(item, row);

            // return 
            return item;
        }

        public static void SetItemFromRow2<T>(T item, DataRow row) where T : new()
        {
            // go through each column
            foreach (DataColumn c in row.Table.Columns)
            {
                // find the property for the column
                PropertyInfo p = item.GetType().GetProperty(c.ColumnName);

                // if exists, set the value
                if (p != null && row[c] != DBNull.Value)
                {
                    p.SetValue(item, row[c], null);
                }
            }
        }
        public static dynamic BindDynamic(DataRow dataRow)
        {
            dynamic result = null;
            if (dataRow != null)
            {
                result = new System.Dynamic.ExpandoObject();
                var resultDictionary = (IDictionary<string, object>)result;
                foreach (DataColumn column in dataRow.Table.Columns)
                {
                    var dataValue = dataRow[column.ColumnName];
                    resultDictionary.Add(column.ColumnName, DBNull.Value.Equals(dataValue) ? "" : dataValue);
                }
            }
            return result;
        }

        public static IEnumerable<dynamic> BindDynamics(DataTable dataTable)
        {
            foreach (DataRow row in dataTable.Rows)
            {
                yield return BindDynamic(row);
            }
        }

        public static IEnumerable<dynamic> BindDynamics(DataSet dataSet, int tableIndex = 0)
        {
            return BindDynamics(dataSet.Tables[tableIndex]);
        }

        public static IEnumerable<dynamic> BindDynamics(DataSet dataSet, string tableName)
        {
            return BindDynamics(dataSet.Tables[tableName]);
        }
        public static string sinhcongthuctongcuoi(string dongcotong = "", int col = 0)
        {
            string[] subs = dongcotong.Split('|');
            string prefix = CellsHelper.ColumnIndexToName(col);
            string congthuc = "=";
            for (int i = 1; i < subs.Length; i++)
                congthuc += prefix + subs[i] + "+";

            congthuc += "0";

            return congthuc;
        }

        public static string sinhcongthuctong(int dong = 0, int col = 0, Cells cells = null)
        {
            int j = dong;
            string prefix = CellsHelper.ColumnIndexToName(col);
            do
            {
                j--;
            } while (cells[j, 0].StringValue != "1");

            string congthuc = "=SUM(" + prefix + (j + 1).ToString() + ":" + prefix + dong.ToString() + ")";
            return congthuc;
        }

        public static void WriteCell(string value, string mode, Aspose.Cells.Cell cell, int size, bool wrap)
        {
            Aspose.Cells.Style st = new Aspose.Cells.Style();
            try
            {

                st = cell.GetStyle();

                if (!mode.Contains("no-border"))
                {

                    if (mode.Contains("solid-border"))
                        st.Borders[Aspose.Cells.BorderType.TopBorder].LineStyle = Aspose.Cells.CellBorderType.Thin;
                    st.Borders[Aspose.Cells.BorderType.BottomBorder].LineStyle = Aspose.Cells.CellBorderType.Dotted;
                    st.Borders[Aspose.Cells.BorderType.LeftBorder].LineStyle = Aspose.Cells.CellBorderType.Thin;
                    st.Borders[Aspose.Cells.BorderType.RightBorder].LineStyle = Aspose.Cells.CellBorderType.Thin;


                    if (mode.Contains("close-border"))
                    {
                        st.Borders[Aspose.Cells.BorderType.TopBorder].LineStyle = Aspose.Cells.CellBorderType.Thin;
                        st.Borders[Aspose.Cells.BorderType.BottomBorder].LineStyle = Aspose.Cells.CellBorderType.Thin;
                    }
                }

                //st.Font.Name = "Arial";
                //st.Font.Size = size;
                //st.IsTextWrapped = wrap;
                //st.Number = 3;



                if (mode.Contains("B")) st.Font.IsBold = true;
                if (mode.Contains("I")) st.Font.IsItalic = true;
                if (mode.Contains("C")) st.HorizontalAlignment = Aspose.Cells.TextAlignmentType.Center;
                if (mode.Contains("L")) st.HorizontalAlignment = Aspose.Cells.TextAlignmentType.Left;
                if (mode.Contains("R")) st.HorizontalAlignment = Aspose.Cells.TextAlignmentType.Right;

                if (mode.Contains("T")) st.VerticalAlignment = Aspose.Cells.TextAlignmentType.Top;
                if (mode.Contains("M")) st.VerticalAlignment = Aspose.Cells.TextAlignmentType.Center;
                if (mode.Contains("D")) st.VerticalAlignment = Aspose.Cells.TextAlignmentType.Bottom;



                if (mode.Contains("N") || mode.Contains("F"))
                {
                    if (mode.Contains("N"))
                    {

                        st.Number = 3;
                        cell.SetStyle(st);
                        //MA-20230609: sửa lỗi convert thẳng về số nguyên
                        //if (IsNumeric(value)) cell.PutValue(Convert.ToInt32(value)); else cell.PutValue(0);
                        if (IsNumeric(value)) cell.PutValue(Convert.ToInt32(Convert.ToDouble(value))); else cell.PutValue(0);
                    }                    

                    if (mode.Contains("F2"))
                    {//20230721: Thap phan 2 chu so sau dau phay
                        st.Number = 4;
                        cell.SetStyle(st);
                        cell.PutValue(IsNumeric(value) ? Convert.ToDouble(value) : 0);
                    }
                    else
                    {
                        if (mode.Contains("F"))
                        {

                            st.Custom = "#,##0;[Red]#,##0";
                            cell.SetStyle(st);
                            cell.PutValue(IsNumeric(value) ? Convert.ToDouble(value) : 0);
                            st.Number = 4;

                        }
                    }
                }
                else
                {
                    cell.SetStyle(st);
                    cell.PutValue(value);
                }
            }
            catch (Exception ex)
            {

            }
        }

        public static bool IsNumeric(object ValueToCheck)
        {
            double Dummy = new double();
            string InputValue = Convert.ToString(ValueToCheck);
            bool Numeric;
            if (InputValue.Trim() == "")
                Numeric = false;
            else
                Numeric = double.TryParse(InputValue, System.Globalization.NumberStyles.Any, null, out Dummy);
            return Numeric;
        }
        public static long GioCongTheoCapBac(string CapBac, List<GioCongCapBacModel> listGioCongCapBac)
        {
            long GioCong = 0;

            if (string.IsNullOrEmpty(CapBac))
                return GioCong;

            try
            {
                //if (CapBac.Equals("E")) GioCong = 100000;
                //if (CapBac.Equals("N")) GioCong = 150000;
                //if (CapBac.Equals("C")) GioCong = 200000;
                //if (CapBac.Equals("D")) GioCong = 300000;
                //if (CapBac.Equals("S")) GioCong = 600000;

                var t = listGioCongCapBac.FirstOrDefault(p => p.CapBac == CapBac);

                if (t != null)
                    GioCong = Convert.ToInt64(t.GioCong);                
            }
            catch(Exception ex)
            {

            }
            

            return GioCong;
        }


        public static string CreateItemFromTable(DataTable table)
        {
            var settings = new JsonSerializerSettings
            {

            };
            settings.Converters.Add(new DateShortFormatConverter());
            return Newtonsoft.Json.JsonConvert.SerializeObject(table, settings);
        }

        public static void SendMail(string email, string subject, string body, IConfiguration _configuration)
        {
            try
            {
                var builder = new BodyBuilder();
                builder.HtmlBody = body;
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(Encoding.UTF8, _configuration["MailConfiguration:from_email_name"], _configuration["MailConfiguration:from_email"]));
                message.To.Add(new MailboxAddress(Encoding.UTF8, email, email));
                message.Bcc.Add(new MailboxAddress(Encoding.UTF8, _configuration["MailConfiguration:from_email_name"], _configuration["MailConfiguration:from_email"]));
                message.Subject = subject;
                message.Body = builder.ToMessageBody();

                using (var client = new MailKit.Net.Smtp.SmtpClient())
                {

                    client.Connect(_configuration["MailConfiguration:host"], int.Parse(_configuration["MailConfiguration:port"]), bool.Parse(_configuration["MailConfiguration:enable_ssl"]));

                    //SMTP server authentication if needed
                    client.Authenticate(_configuration["MailConfiguration:username"], _configuration["MailConfiguration:password"]);

                    var res = client.Send(message);
                    client.Disconnect(true);
                }
            }
            catch (Exception ex)
            {
                //do something here
                _logger.LogWarning(subject, ex, "SendMail({Id})", email);
               // _logger.LogError(ex.Message);
            }
        }
        public static string GetFolderPath(ApplicationUser user, string wwwroot, string dmCode)
        {
            string path = Path.Combine(user.TK, user.Database);
            string dmCodePath = Path.Combine(wwwroot, Path.Combine(MetadataFolder, Path.Combine(path, dmCode)));
            if (!Directory.Exists(dmCodePath))
                Directory.CreateDirectory(dmCodePath);
            return Path.Combine(dmCodePath);
        }

        public static string ChuyenSo(string number)
        {
            string[] dv = { "", "mươi", "trăm", "nghìn", "triệu", "tỉ" };
            string[] cs = { "không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín" };
            string doc;
            int i, j, k, n, len, found, ddv, rd;

            len = number.Length;
            number += "ss";
            doc = "";
            found = 0;
            ddv = 0;
            rd = 0;

            i = 0;
            while (i < len)
            {
                //So chu so o hang dang duyet
                n = (len - i + 2) % 3 + 1;

                //Kiem tra so 0
                found = 0;
                for (j = 0; j < n; j++)
                {
                    if (number[i + j] != '0')
                    {
                        found = 1;
                        break;
                    }
                }

                //Duyet n chu so
                if (found == 1)
                {
                    rd = 1;
                    for (j = 0; j < n; j++)
                    {
                        ddv = 1;
                        switch (number[i + j])
                        {
                            case '0':
                                if (n - j == 3) doc += cs[0] + " ";
                                if (n - j == 2)
                                {
                                    if (number[i + j + 1] != '0') doc += "lẻ ";
                                    ddv = 0;
                                }
                                break;
                            case '1':
                                if (n - j == 3) doc += cs[1] + " ";
                                if (n - j == 2)
                                {
                                    doc += "mười ";
                                    ddv = 0;
                                }
                                if (n - j == 1)
                                {
                                    if (i + j == 0) k = 0;
                                    else k = i + j - 1;

                                    if (number[k] != '1' && number[k] != '0')
                                        doc += "mốt ";
                                    else
                                        doc += cs[1] + " ";
                                }
                                break;
                            case '5':
                                if (i + j == len - 1)
                                    doc += "lăm ";
                                else
                                    doc += cs[5] + " ";
                                break;
                            default:
                                doc += cs[(int)number[i + j] - 48] + " ";
                                break;
                        }

                        //Doc don vi nho
                        if (ddv == 1)
                        {
                            doc += dv[n - j - 1] + " ";
                        }
                    }
                }


                //Doc don vi lon
                if (len - i - n > 0)
                {
                    if ((len - i - n) % 9 == 0)
                    {
                        if (rd == 1)
                            for (k = 0; k < (len - i - n) / 9; k++)
                                doc += "tỉ ";
                        rd = 0;
                    }
                    else
                        if (found != 0) doc += dv[((len - i - n + 1) % 9) / 3 + 2] + " ";
                }

                i += n;
            }

            if (len == 1)
                if (number[0] == '0' || number[0] == '5') return cs[(int)number[0] - 48];
            string ret = doc.Replace("  ", " ");
            ret = ret.Substring(0, 1).ToUpper() + ret.Substring(1, ret.Length - 1);
            return ret;
        }
        public static decimal mahoaso(string email, string hovaten, decimal so = 0)
        {
            string value = email;
            // Convert the string into a byte[].
            byte[] asciiBytes = Encoding.ASCII.GetBytes(value);

            int total = 0;

            foreach (var i in asciiBytes)
            {
                total += i;
            }


            value = hovaten;
            // Convert the string into a byte[].
            asciiBytes = Encoding.ASCII.GetBytes(value);


            foreach (var i in asciiBytes)
            {
                total += i;
            }

            return so * hovaten.Length + total;
        }



        public static decimal giaimaso(string email, string hovaten, decimal so = 0)
        {
            string value = email;
            // Convert the string into a byte[].
            byte[] asciiBytes = Encoding.ASCII.GetBytes(value);

            int total = 0;

            foreach (var i in asciiBytes)
            {
                total += i;
            }

            value = hovaten;
            // Convert the string into a byte[].
            asciiBytes = Encoding.ASCII.GetBytes(value);


            foreach (var i in asciiBytes)
            {
                total += i;
            }

            return (so - total) / hovaten.Length;
        }

        public static DateTime parseDateTime(string s)
        {
            DateTime d;
            DateTime dt;

            if (DateTime.TryParseExact(s, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out d))
            {
                dt = d;
            }
            else
            {
               dt = DateTime.ParseExact(s, "MM/dd/yyyy", CultureInfo.InvariantCulture);
            }

            return dt;
        }

        public static DateTime parseDateTime(string s,string format)
        {
            DateTime d;
            DateTime dt;

            if (format == "dd-mm-yyyy")
            {
                string[] t = s.Split('-');

                dt = new DateTime(Convert.ToInt32(t[2].Trim()), Convert.ToInt32(t[1].Trim()), Convert.ToInt32(t[0].Trim()));
            }
            else
            {
                if (DateTime.TryParseExact(s, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out d))
                {
                    dt = d;
                }
                else
                {
                    dt = DateTime.ParseExact(s, format, CultureInfo.InvariantCulture);
                }
            }

            return dt;
        }

        public static int GetNoOfLeaveDays(DateTime fromDate, DateTime toDate, Boolean excludeWeekends, List<DateTime> excludeDates)
        {
            var count = 0;
            for (DateTime index = fromDate; index <= toDate; index = index.AddDays(1))
            {
                if (!excludeWeekends || index.DayOfWeek == DayOfWeek.Saturday || index.DayOfWeek == DayOfWeek.Sunday) continue;
                var excluded = excludeDates.Any(t => index.Date.CompareTo(t.Date) == 0);
                if (!excluded) count++;
            }
            return count;
        }

        public static decimal GetHeSoNgoaiGio(DateTime dNgayBaoCao, List<DateTime> listNgayLe)
        {
            decimal dHeSoNgoaiGio = Convert.ToDecimal(1.5);

            if (dNgayBaoCao.DayOfWeek == DayOfWeek.Saturday || dNgayBaoCao.DayOfWeek == DayOfWeek.Sunday)
                dHeSoNgoaiGio = 2;

            var chk = listNgayLe.Any(p => dNgayBaoCao.Date == p.Date);

            if (chk)
                dHeSoNgoaiGio = 3;

            return dHeSoNgoaiGio;
        }

        public static List<T> ConvertDataTable<T>(DataTable dt) where T : new()
        {
            List<T> data = new List<T>();
            foreach (DataRow row in dt.Rows)
            {
                T item = CreateItemFromRow<T>(row);
                data.Add(item);
            }
            return data;
        }


    }
}
