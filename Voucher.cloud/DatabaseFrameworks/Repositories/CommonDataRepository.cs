using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using System.Data;
using Microsoft.Extensions.Configuration;
using System.Reflection;
using System.Text;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Http;
using Voucher.cloud.Models.Identity;
using Voucher.cloud.DatabaseFrameworks.Interfaces;
using Voucher.cloud.Context;
using Voucher.cloud.Models.DB;
using Voucher.cloud.Commons;
using Voucher.cloud.Models;
using System.Security.Cryptography;
using System.Linq;

namespace Voucher.cloud.DatabaseFrameworks.Repositories
{
    public class CommonDataRepository : ICommonDataRepository
    {
        private readonly HttpContext _httpContext;
        private readonly IConfiguration _configuration;
        public CommonDataRepository(IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            this._httpContext = httpContextAccessor.HttpContext;
            this._configuration = configuration;
        }

        public object NewDictionaryCode(ApplicationUser user, JObject model)
        {
            string tableName = model.GetValue("TableName").ToString();
            string fieldName = model.GetValue("FieldName").ToString();
            string currentCode = model.GetValue("CurrentCode").ToString();
            int fieldWidth = (model["FieldWidth"] == null || String.IsNullOrEmpty(model.GetValue("FieldWidth").ToString()) ? 32 : model.GetValue("FieldWidth").Value<int>());

            if (tableName.ToUpper() == "DMDUAN")
                return SinhMaDuAn(user, model);
            if (tableName == "VoucherType")
                return SinhMaVoucher(user, model);
            if (tableName == "Voucher")
                return GenSerial(user, model);
            if (tableName == "DMCOSOCUAHANG")
                return GenCode(user, model);

            #region Generate code to add new code

            string SQLCmd = "";
            SQLCmd += "\nDECLARE @v_i            T_INT,";
            SQLCmd += "\n		@v_j			T_INT,";
            SQLCmd += "\n		@v_Len          T_INT,";
            SQLCmd += "\n		@v_First		T_D032,";
            SQLCmd += "\n		@v_Last         T_D032,";
            SQLCmd += "\n		@v_Max_Code		T_INT,";
            SQLCmd += "\n		@v_Old_Code     T_D032";
            SQLCmd += "\n";
            SQLCmd += "\nSET @v_Code = RTRIM(LTRIM(@v_Code))";
            SQLCmd += "\nSET @v_Len = LEN(@v_Code)";
            SQLCmd += "\nSET @v_i = @v_Len";
            SQLCmd += "\n";
            SQLCmd += "\nWHILE @v_i > 0";
            SQLCmd += "\nBEGIN";
            SQLCmd += "\n	IF dbo.IsDigit(SUBSTRING(@v_Code, @v_i, 1)) = 1";
            SQLCmd += "\n	BEGIN";
            SQLCmd += "\n		BREAK";
            SQLCmd += "\n	END";
            SQLCmd += "\n	SET @v_i = @v_i - 1";
            SQLCmd += "\nEND";
            SQLCmd += "\n";
            SQLCmd += "\nSET @v_j = 0";
            SQLCmd += "\n";
            SQLCmd += "\nIF NOT @v_i < 1";
            SQLCmd += "\nBEGIN";
            SQLCmd += "\n	SET @v_j = @v_i - 1";
            SQLCmd += "\n	WHILE @v_j > 0";
            SQLCmd += "\n	BEGIN";
            SQLCmd += "\n		IF dbo.IsDigit(SUBSTRING(@v_Code, @v_j, 1)) = 0";
            SQLCmd += "\n		BEGIN";
            SQLCmd += "\n			BREAK";
            SQLCmd += "\n		END";
            SQLCmd += "\n		SET @v_j = @v_j - 1";
            SQLCmd += "\n	END";
            SQLCmd += "\nEND";
            SQLCmd += "\n";
            SQLCmd += "\nSET @v_Last = RIGHT(@v_Code, LEN(@v_Code) - @v_i)";
            SQLCmd += "\nSET @v_First = LEFT(@v_Code, @v_j)";
            SQLCmd += "\n";
            SQLCmd += "\nSELECT @v_Old_Code = MAX(" + fieldName + ") FROM " + tableName + " WHERE LEFT(" + fieldName + ", @v_j) = @v_First AND RIGHT(" + fieldName + ", LEN(@v_Code) - @v_i) = @v_Last AND LEN(" + fieldName + ") = LEN(@v_Code)";
            SQLCmd += "\n";
            SQLCmd += "\nIF @v_Old_Code IS NOT NULL";
            SQLCmd += "\nBEGIN";
            SQLCmd += "\n	IF @v_i = 0";
            SQLCmd += "\n	BEGIN";
            SQLCmd += "\n		SET @v_New_Code = @v_Last + dbo.TRANSFORM(1, 'L ' + REPLICATE('9', 3))";
            SQLCmd += "\n	END";
            SQLCmd += "\n	ELSE";
            SQLCmd += "\n	BEGIN";
            SQLCmd += "\n		SET @v_Len = @v_i - @v_j";
            SQLCmd += "\n		SET @v_Max_Code = CONVERT(BIGINT, SUBSTRING(@v_Old_Code, @v_j + 1, @v_i - @v_j)) + 1";
            SQLCmd += "\n";
            SQLCmd += "\n		IF LEN(CONVERT(VARCHAR(32), @v_Max_Code)) > @v_Len";
            SQLCmd += "\n		BEGIN";
            SQLCmd += "\n			SET @v_Len = LEN(CONVERT(VARCHAR(32), @v_Max_Code))";
            SQLCmd += "\n		END";
            SQLCmd += "\n			SET @v_New_Code = @v_First + dbo.TRANSFORM(@v_Max_Code, 'L ' + REPLICATE('9', @v_Len)) + @v_Last";
            SQLCmd += "\n		END";
            SQLCmd += "\n	END";
            SQLCmd += "\nELSE";
            SQLCmd += "\nBEGIN";
            SQLCmd += "\n	SET @v_New_Code = @v_Code";
            SQLCmd += "\nEND";

            #endregion Generate code to add new code

            SqlParameter[] oEZParams = new SqlParameter[2];

            oEZParams[0] = new SqlParameter("v_Code", currentCode);
            oEZParams[1] = new SqlParameter("v_New_Code", null);
            oEZParams[1].Direction = ParameterDirection.Output;
            oEZParams[1].Size = fieldWidth;
            oEZParams[1].SqlDbType = SqlDbType.NVarChar;

            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                oEZCommand.CommandText = SQLCmd;
                oEZCommand.CommandType = CommandType.Text;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;
                oEZCommand.Parameters.AddRange(oEZParams);

                oEZCommand.ExecuteNonQuery();

                DataAccess.CloseConnection(oEZConn);

                return oEZParams[1].Value;
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                return DBNull.Value;
            }
        }

        public object SinhMaDuAn(ApplicationUser user, JObject model)
        {
            string tableName = model.GetValue("TableName").ToString();
            string fieldName = model.GetValue("FieldName").ToString();
            string currentCode = model.GetValue("CurrentCode").ToString();
            int fieldWidth = (model["FieldWidth"] == null || String.IsNullOrEmpty(model.GetValue("FieldWidth").ToString()) ? 32 : model.GetValue("FieldWidth").Value<int>());

            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                string SQLCmd = @"select MAPHONG from DMPHONGBAN
                                   where Code = '" + currentCode + "'";

                oEZCommand.CommandText = SQLCmd;
                oEZCommand.CommandType = CommandType.Text;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;

                string sMaPhong = oEZCommand.ExecuteScalar().ToString();

                if (string.IsNullOrEmpty(sMaPhong))
                {
                    try
                    {
                        SQLCmd = @"select PHONGBAN_Id from UserProfile
                                   where Id = '" + user.Id + "'";

                        oEZCommand.CommandText = SQLCmd;

                        string t = oEZCommand.ExecuteScalar().ToString();

                        SQLCmd = @"select MAPHONG from DMPHONGBAN
                                   where Id = '" + t + "'";

                        oEZCommand.CommandText = SQLCmd;

                        sMaPhong = oEZCommand.ExecuteScalar().ToString();
                    }
                    catch (Exception ex)
                    {

                    }
                }

                if (string.IsNullOrEmpty(sMaPhong))
                    return DBNull.Value;

                SQLCmd = @"select Id from DMPHONGBAN
                                   where Code = '" + currentCode + "'";

                oEZCommand.CommandText = SQLCmd;
                string sPHONGBAN_Id = oEZCommand.ExecuteScalar().ToString();

                if (string.IsNullOrEmpty(sPHONGBAN_Id))
                {
                    try
                    {
                        SQLCmd = @"select PHONGBAN_Id from UserProfile
                                   where Id = '" + user.Id + "'";

                        oEZCommand.CommandText = SQLCmd;

                        sPHONGBAN_Id = oEZCommand.ExecuteScalar().ToString();
                    }
                    catch (Exception ex)
                    {

                    }
                }

                SQLCmd = @"select count(Code) from DMDUAN
                            where PHONGBAN_Id = '" + sPHONGBAN_Id + "'" + " and NamDuAn = " + DateTime.Now.Year;

                oEZCommand.CommandText = SQLCmd;
                int iSoLuong = Convert.ToInt32(oEZCommand.ExecuteScalar());

                string ma = "";
                do
                {
                    iSoLuong++;

                    ma = sMaPhong + DateTime.Now.Year.ToString().Substring(2, 2) + (iSoLuong).ToString("D5");

                    SQLCmd = "select count(Code) from DMDUAN where Code = '" + ma + "'";
                    oEZCommand.CommandText = SQLCmd;

                } while (oEZCommand.ExecuteScalar().ToString() != "0");

                DataAccess.CloseConnection(oEZConn);

                if (string.IsNullOrEmpty(ma))
                    return DBNull.Value;

                return ma;
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                return DBNull.Value;
            }
        }
        public object SinhMaVoucher(ApplicationUser user, JObject model)
        {
            string tableName = model.GetValue("TableName").ToString();  // Không dùng trong logic, giữ để đồng nhất
            string fieldName = model.GetValue("FieldName").ToString();  // Không dùng trong logic, giữ để đồng nhất
            int fieldWidth = (model["FieldWidth"] == null || String.IsNullOrEmpty(model.GetValue("FieldWidth").ToString())
                                ? 32
                                : model.GetValue("FieldWidth").Value<int>());

            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                string today = DateTime.Now.ToString("ddMMyy");
                string prefix = "VC-" + today;

                string SQLCmd = $@"SELECT Code FROM {tableName}
                           WHERE {fieldName} LIKE '{prefix}-%'";

                oEZCommand.CommandText = SQLCmd;
                oEZCommand.CommandType = CommandType.Text;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;

                SqlDataReader reader = oEZCommand.ExecuteReader();
                List<string> existingCodes = new List<string>();

                while (reader.Read())
                {
                    existingCodes.Add(reader["Code"].ToString());
                }
                reader.Close();

                int maxOrder = 0;
                foreach (var code in existingCodes)
                {
                    // Tách phần số thứ tự ở cuối
                    var parts = code.Split('-');
                    if (parts.Length == 3 && int.TryParse(parts[2], out int order))
                    {
                        if (order > maxOrder)
                            maxOrder = order;
                    }
                }

                int nextOrder = maxOrder + 1;
                string newCode = $"{prefix}-{nextOrder}";

                // Kiểm tra trùng
                do
                {
                    SQLCmd = $"SELECT COUNT(*) FROM {tableName} WHERE {fieldName} = '{newCode}'";
                    oEZCommand.CommandText = SQLCmd;
                    int exists = Convert.ToInt32(oEZCommand.ExecuteScalar());

                    if (exists == 0)
                        break;

                    nextOrder++;
                    newCode = $"{prefix}-{nextOrder}";

                } while (true);

                DataAccess.CloseConnection(oEZConn);

                return newCode;
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                return DBNull.Value;
            }
        }

        public object GenSerial(ApplicationUser user, JObject model)
        {
            string tableName = model.GetValue("TableName").ToString();
            string fieldName = model.GetValue("FieldName").ToString();

            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                string GenerateSecureCode(int length)
                {
                    const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                    var data = new byte[length];
                    using (var rng = RandomNumberGenerator.Create())
                    {
                        rng.GetBytes(data);
                    }

                    char[] result = new char[length];
                    for (int i = 0; i < length; i++)
                    {
                        result[i] = chars[data[i] % chars.Length];
                    }
                    return new string(result);
                }

                string rawSerial;
                do
                {
                    rawSerial = GenerateSecureCode(16); // 16 ký tự chữ + số

                    string SQLCmd = $"SELECT COUNT(*) FROM {tableName} WHERE {fieldName} = '{rawSerial}'";
                    oEZCommand.CommandText = SQLCmd;
                    oEZCommand.CommandType = CommandType.Text;
                    oEZCommand.Connection = oEZConn;
                    oEZCommand.CommandTimeout = 0;

                    int exists = Convert.ToInt32(oEZCommand.ExecuteScalar());
                    if (exists == 0)
                        break;

                } while (true);

                DataAccess.CloseConnection(oEZConn);

                // === Mã đã được random bảo mật, giờ mask để đưa cho khách ===
                return MaskSerial(rawSerial, "CoffeTayHo@123");

                //// Nếu muốn lưu cả 2:
                //return new
                //{
                //    RawSerial = rawSerial,       
                //    VoucherCode = MaskSerial(rawSerial, "CoffeTayHo@123") 
                //};
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                return DBNull.Value;
            }
        }


        public object GenSerial2(ApplicationUser user, JObject model)
        {
            string tableName = model.GetValue("TableName").ToString();
            string fieldName = model.GetValue("FieldName").ToString();
            int fieldWidth = (model["FieldWidth"] == null || String.IsNullOrEmpty(model.GetValue("FieldWidth").ToString())
                                ? 32
                                : model.GetValue("FieldWidth").Value<int>());

            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                string today = DateTime.Now.ToString("ddMMyyHHmmss");
                string prefix = today;

                string SQLCmd = $@"SELECT {fieldName} FROM {tableName}
                           WHERE {fieldName} LIKE '{prefix}%'";

                oEZCommand.CommandText = SQLCmd;
                oEZCommand.CommandType = CommandType.Text;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;

                SqlDataReader reader = oEZCommand.ExecuteReader();
                List<string> existingCodes = new List<string>();

                while (reader.Read())
                {
                    existingCodes.Add(reader[fieldName].ToString());
                }
                reader.Close();

                int maxOrder = 0;
                foreach (var code in existingCodes)
                {
                    if (code.StartsWith(prefix))
                    {
                        string suffix = code.Substring(prefix.Length);
                        if (int.TryParse(suffix, out int order))
                        {
                            if (order > maxOrder)
                                maxOrder = order;
                        }
                    }
                }

                int nextOrder = maxOrder + 1;
                string rawSerial = $"{prefix}{nextOrder}"; // serial nội bộ

                // Kiểm tra trùng
                do
                {
                    SQLCmd = $"SELECT COUNT(*) FROM {tableName} WHERE {fieldName} = '{rawSerial}'";
                    oEZCommand.CommandText = SQLCmd;
                    int exists = Convert.ToInt32(oEZCommand.ExecuteScalar());

                    if (exists == 0)
                        break;

                    nextOrder++;
                    rawSerial = $"{prefix}{nextOrder}";

                } while (true);

                DataAccess.CloseConnection(oEZConn);

                // === Sinh mã an toàn cho khách hàng ===
                return MaskSerial(rawSerial, "CoffeTayHo@123");

                //// Trả ra 2 loại: raw để lưu, masked để in ra cho khách
                //return new
                //{
                //    RawSerial = rawSerial,       // lưu DB nội bộ
                //    VoucherCode = maskedSerial   // gửi khách hàng
                //};
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                return DBNull.Value;
            }
        }

        /// <summary>
        /// Hàm băm mã raw thành voucher code an toàn
        /// </summary>
        private string MaskSerial(string rawSerial, string secretKey)
        {
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretKey)))
            {
                var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(rawSerial));
                // Rút gọn, loại ký tự đặc biệt
                string base64 = Convert.ToBase64String(hash).Replace("=", "").Replace("+", "").Replace("/", "");
                return $"VCH-{base64.Substring(0, 12).ToUpper()}"; // mã ngắn gọn
            }
        }
        public object GenCode(ApplicationUser user, JObject model)
        {
            string tableName = model.GetValue("TableName").ToString();
            string fieldName = model.GetValue("FieldName").ToString();

            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandType = CommandType.Text;
                oEZCommand.CommandTimeout = 0;

                // Lấy danh sách các mã đã tồn tại
                string sqlCmd = $"SELECT {fieldName} FROM {tableName}";
                oEZCommand.CommandText = sqlCmd;

                SqlDataReader reader = oEZCommand.ExecuteReader();
                HashSet<int> existingCodes = new HashSet<int>();

                while (reader.Read())
                {
                    string value = reader[fieldName].ToString();
                    if (int.TryParse(value, out int code))
                    {
                        existingCodes.Add(code);
                    }
                }
                reader.Close();

                // Tìm số nhỏ nhất chưa tồn tại bắt đầu từ 1
                int nextCode = 1;
                while (existingCodes.Contains(nextCode))
                {
                    nextCode++;
                }

                string newCode = nextCode.ToString(); // Không căn lề
                DataAccess.CloseConnection(oEZConn);
                return newCode;
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                return DBNull.Value;
            }
        }


        public object Search(ApplicationUser user, string table, string term, string fieldName, bool filterType, string filterFields, string displayFields, string orderFields, int maxRows, string firstFilter = null)
        {
            DmFile dmFile = Common.CreateItemFromRow<DmFile>(DataAccess.GetTableSQLCommand(user, _configuration, "SELECT * FROM DmFile WHERE Ma_File = N'" + table + "'").Rows[0]);
            if (dmFile == null)
            {
                return null;
            }

            if (string.IsNullOrEmpty(displayFields))
            {
                //fieldName = dmFile.FieldName;
                filterType = dmFile.EachWord;
                filterFields = dmFile.FilterFieldList.Replace(" ", "");
                displayFields = dmFile.FieldList.Replace(" ", "");
                orderFields = dmFile.FieldOrder;
                maxRows = dmFile.MaxRows == 0 ? 1000 : dmFile.MaxRows;
            }

            var data = new
            {
                fieldName = fieldName,
                filterType = filterType,
                filterFields = filterFields,
                orderFields = orderFields,
                displayFields = displayFields,
                maxRows = maxRows,
                rows = DataAccess.GetTableSQLCommand(user, _configuration, BuildSearchQuery(table.Trim(), term, filterType, filterFields, displayFields, orderFields, maxRows, firstFilter))
            };

            return data;
        }

        public object Search2(ApplicationUser user, string table, string term, string fieldName, bool filterType, string filterFields, string displayFields, string orderFields, int maxRows, string firstFilter = null)
        {
            DmFile dmFile = Common.CreateItemFromRow<DmFile>(DataAccess.GetTableSQLCommand(user, _configuration, "SELECT * FROM DmFile WHERE Ma_File = N'" + table + "'").Rows[0]);
            if (dmFile == null)
            {
                return null;
            }

            if (string.IsNullOrEmpty(displayFields))
            {
                //fieldName = dmFile.FieldName;
                filterType = dmFile.EachWord;
                filterFields = dmFile.FilterFieldList.Replace(" ", "");
                displayFields = dmFile.FieldList.Replace(" ", "");
                orderFields = dmFile.FieldOrder;
                maxRows = dmFile.MaxRows == 0 ? 1000 : dmFile.MaxRows;
            }

            var data = new
            {
                fieldName = fieldName,
                filterType = filterType,
                filterFields = filterFields,
                orderFields = orderFields,
                displayFields = displayFields,
                maxRows = maxRows,
                rows = DataAccess.GetTableSQLCommand(user, _configuration, BuildSearchQuery2(user, table.Trim(), term, filterType, filterFields, displayFields, orderFields, maxRows, firstFilter))
            };

            return data;
        }

        public object ValidateSearch(ApplicationUser user, string table, string column, string value, string firstFilter)
        {
            DmFile dmFile = Common.CreateItemFromRow<DmFile>(DataAccess.GetTableSQLCommand(user, _configuration, "SELECT * FROM DmFile WHERE Ma_File = N'" + table + "'").Rows[0]);
            if (dmFile == null)
            {
                return null;
            }

            DataTable dataTable = DataAccess.GetTableSQLCommand(user, _configuration, BuildValidateSearchQuery(table, column, value, firstFilter));

            if (dataTable == null || dataTable.Rows.Count == 0)
            {
                return null;
            }

            return Common.CreateItemFromTable(dataTable);
        }

        public object MultiSelect(ApplicationUser user, string table, string term, string captionField, string valueField)
        {
            DmFile dmFile = Common.CreateItemFromRow<DmFile>(DataAccess.GetTableSQLCommand(user, _configuration, "SELECT * FROM DmFile WHERE Ma_File = N'" + table + "'").Rows[0]);
            if (dmFile == null)
            {
                return null;
            }

            DataTable dataTable = DataAccess.GetTableSQLCommand(user, _configuration, BuildMultiSelectQuery(table.Trim(), term, dmFile, captionField, valueField));
            List<MultiSelectModel> list = new List<MultiSelectModel>();

            if (dataTable != null)
            {
                foreach (DataRow row in dataTable.Rows)
                {
                    list.Add(Common.CreateItemFromRow<MultiSelectModel>(row));
                }
            }

            return list;
        }

        private string BuildMultiSelectQuery(string table, string term, DmFile dmFile, string captionField, string valueField)
        {
            List<string> condition = new List<string>();
            if (term != null && !string.IsNullOrEmpty(term))
            {
                foreach (string column in dmFile.FilterFieldList.Replace(" ", "").Split(","))
                {
                    condition.Add(column + " LIKE N'%" + term.ToLower().Replace("'", "''") + "%'");
                }
            }

            string SQLCmd = "SELECT TOP(" + (dmFile.MaxRows <= 0 ? 1000 : dmFile.MaxRows).ToString() + ") " + captionField + " AS caption, " + valueField + " AS value FROM " + table;
            SQLCmd += (condition.Count > 0 ? " WHERE " + String.Join(" OR ", condition) : "") + " ORDER BY " + dmFile.FieldOrder;

            return SQLCmd;
        }

        private string BuildSearchQuery(string table, string term, bool filterType, string filterFields, string displayFields, string orderFields, int maxRows, string firstFilter)
        {
            //
            string SQLCmd = "SELECT TOP(" + maxRows.ToString() + ") " + displayFields + " FROM " + table;

            List<string> condition = new List<string>();
            if (term != null && !string.IsNullOrEmpty(term))
            {
                foreach (string column in filterFields.Split(','))
                {
                    if (filterType) //Tìm từ trái
                    {
                        condition.Add(" LEFT(" + column + ", " + term.Trim().Length.ToString() + ") = N'" + term.Trim().Replace("'", "''") + "'");
                    }
                    else
                    {
                        condition.Add(column + " LIKE N'%" + term.Trim().Replace("'", "''") + "%'");
                    }
                }
            }

            if (firstFilter != null && !string.IsNullOrEmpty(firstFilter))
            {
                SQLCmd += " WHERE " + firstFilter + (condition.Count > 0 ? " AND (" + String.Join(" OR ", condition) + ")" : "") + " ORDER BY " + orderFields;
            }
            else
            {
                SQLCmd += (condition.Count > 0 ? " WHERE " + String.Join(" OR ", condition) : "") + " ORDER BY " + orderFields;
            }

            return SQLCmd;
        }

        private string BuildSearchQuery2(ApplicationUser user, string table, string term, bool filterType, string filterFields, string displayFields, string orderFields, int maxRows, string firstFilter)
        {
            //
            string SQLCmd = "SELECT TOP(" + maxRows.ToString() + ") " + displayFields + " FROM " + table;

            List<string> condition = new List<string>();
            if (term != null && !string.IsNullOrEmpty(term))
            {
                foreach (string column in filterFields.Split(','))
                {
                    if (filterType) //Tìm từ trái
                    {
                        condition.Add(" LEFT(" + column + ", " + term.Trim().Length.ToString() + ") = N'" + term.Trim().Replace("'", "''") + "'");
                    }
                    else
                    {
                        condition.Add(column + " LIKE N'%" + term.Trim().Replace("'", "''") + "%'");
                    }
                }
            }

            if (firstFilter != null && !string.IsNullOrEmpty(firstFilter))
            {
                SQLCmd += " WHERE " + firstFilter + (condition.Count > 0 ? " AND (" + String.Join(" OR ", condition) + ")" : "");

                if (table == "DMDUAN")
                    SQLCmd += " AND AM_Id IN (select * from funcDanhSachNhanVienPhongBanQuanLy('" + user.Id + "'))";

                SQLCmd += " ORDER BY " + orderFields;
            }
            else
            {
                SQLCmd += (condition.Count > 0 ? " WHERE " + String.Join(" OR ", condition) : " WHERE 1 = 1");

                if (table == "DMDUAN")
                    SQLCmd += " AND AM_Id IN (select * from funcDanhSachNhanVienPhongBanQuanLy('" + user.Id + "'))";

                SQLCmd += " ORDER BY " + orderFields;
            }

            return SQLCmd;
        }

        private string BuildValidateSearchQuery(string table, string column, string value, string firstFilter)
        {
            string SQLCmd;

            if (firstFilter == null || string.IsNullOrEmpty(firstFilter))
            {
                SQLCmd = "SELECT TOP(1) * FROM " + table + " WHERE [" + column + "] = N'" + value.Replace("'", "''") + "'";
            }
            else
            {
                SQLCmd = "SELECT TOP(1) * FROM " + table + " WHERE " + firstFilter + " AND [" + column + "] = N'" + value.Replace("'", "''") + "'";
            }

            return SQLCmd;
        }

        public object RPT_Chart_01_Get(ApplicationUser user, JObject model)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                //    SqlParameter[] oEZParams = new SqlParameter[1];
                //    oEZParams[0] = new SqlParameter("p_Count", model.GetValue("Count").ToString());
                oEZCommand.CommandText = "RPT_Voucher_Revenue_ByDay";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;
                //oEZCommand.Parameters.AddRange(oEZParams);

                oEZAdapter.SelectCommand = oEZCommand;
                oEZAdapter.Fill(oEZDataTable);

                DataAccess.CloseConnection(oEZConn);

                return Common.BindDynamics(oEZDataTable);
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                return null;
            }
        }

        public object RPT_Chart_02_Get(ApplicationUser user, JObject model)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                //SqlParameter[] oEZParams = new SqlParameter[1];
                //oEZParams[0] = new SqlParameter("p_Count", model.GetValue("Count").ToString());
                oEZCommand.CommandText = "RPT_Voucher_Revenue_ByMonth";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;
                //oEZCommand.Parameters.AddRange(oEZParams);

                oEZAdapter.SelectCommand = oEZCommand;
                oEZAdapter.Fill(oEZDataTable);

                DataAccess.CloseConnection(oEZConn);

                return Common.BindDynamics(oEZDataTable);
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                return null;
            }
        }

        public object RPT_Chart_03_Get(ApplicationUser user, JObject model)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[1];
                //oEZParams[0] = new SqlParameter("p_Count", model.GetValue("Count").ToString());
                oEZCommand.CommandText = "RPT_Voucher_Revenue_ByQuarter";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;
                //oEZCommand.Parameters.AddRange(oEZParams);

                oEZAdapter.SelectCommand = oEZCommand;
                oEZAdapter.Fill(oEZDataTable);

                DataAccess.CloseConnection(oEZConn);

                return Common.BindDynamics(oEZDataTable);
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                return null;
            }
        }

        public object RPT_Chart_04_Get(ApplicationUser user, JObject model)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                //SqlParameter[] oEZParams = new SqlParameter[1];
                //oEZParams[0] = new SqlParameter("p_Count", model.GetValue("Count").ToString());
                oEZCommand.CommandText = "RPT_Voucher_Activated_ByMonth";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;
                //oEZCommand.Parameters.AddRange(oEZParams);

                oEZAdapter.SelectCommand = oEZCommand;
                oEZAdapter.Fill(oEZDataTable);

                DataAccess.CloseConnection(oEZConn);

                return Common.BindDynamics(oEZDataTable);
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                return null;
            }
        }

        public object RPT_Chart_05_Get(ApplicationUser user, JObject model)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[1];
                oEZParams[0] = new SqlParameter("p_Count", model.GetValue("Count").ToString());
                oEZCommand.CommandText = "RPT_Voucher_Status_Get";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;
                oEZCommand.Parameters.AddRange(oEZParams);

                oEZAdapter.SelectCommand = oEZCommand;
                oEZAdapter.Fill(oEZDataTable);

                DataAccess.CloseConnection(oEZConn);

                return Common.BindDynamics(oEZDataTable);
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                return null;
            }
        }

        public object RPT_Chart_06_Get(ApplicationUser user, JObject model)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                //SqlParameter[] oEZParams = new SqlParameter[1];
                //oEZParams[0] = new SqlParameter("p_Count", model.GetValue("Count").ToString());
                oEZCommand.CommandText = "RPT_Voucher_Commission_Get";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;
                //oEZCommand.Parameters.AddRange(oEZParams);

                oEZAdapter.SelectCommand = oEZCommand;
                oEZAdapter.Fill(oEZDataTable);

                DataAccess.CloseConnection(oEZConn);

                return Common.BindDynamics(oEZDataTable);
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                return null;
            }
        }
    }
}
