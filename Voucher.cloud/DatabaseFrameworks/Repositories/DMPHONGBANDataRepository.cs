using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using Voucher.cloud.Models;
using Voucher.cloud.Models.DB;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Voucher.cloud.DatabaseFrameworks.Interfaces;
using Voucher.cloud.Models.Identity;
using Voucher.cloud.Commons;
using Voucher.cloud.Context;
using Voucher.cloud.Models;
using Newtonsoft.Json.Linq;

namespace Voucher.cloud.DatabaseFrameworks.Repositories
{
    public class DMPHONGBANDataRepository : IDMPHONGBANDataRepository
    {
        private readonly ILogger<DMPHONGBANDataRepository> _logger;
        private readonly HttpContext _httpContext;
        private readonly IConfiguration _configuration;
        private readonly string ChucNang = "Danh mục phòng ban";
        private readonly string HanhDong = "{0} {1} danh mục phòng ban {2}";
        public DMPHONGBANDataRepository(ILogger<DMPHONGBANDataRepository> logger, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            this._logger = logger;
            this._httpContext = httpContextAccessor.HttpContext;
            this._configuration = configuration;
        }
        
        public List<DMPHONGBAN> Get(ApplicationUser user, JObject model)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<DMPHONGBAN> list = new List<DMPHONGBAN>();
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[3];
                oEZParams[0] = new SqlParameter("p_Code", model["Code"].ToString());
                oEZParams[1] = new SqlParameter("p_Name", model["Name"].ToString());
                oEZParams[2] = new SqlParameter("p_CName", model["CName"].ToString());

                oEZCommand.CommandText = "DMPHONGBAN_Get";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;
                oEZCommand.Parameters.AddRange(oEZParams);

                oEZAdapter.SelectCommand = oEZCommand;
                oEZAdapter.Fill(oEZDataTable);

                DataAccess.CloseConnection(oEZConn);

                
                if (oEZDataTable != null)
                {
                    foreach (DataRow row in oEZDataTable.Rows)
                    {
                        list.Add(Common.CreateItemFromRow<DMPHONGBAN>(row));
                    }
                }
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                _logger.LogError(oEZCommand.CommandText + "  " + ex.Message);
                return null;
            }
            QTNHATKYHETHONGDataRepository.Save(user, new Voucher.cloud.Models.DB.QTNHATKYHETHONG() { ChucNang = ChucNang, HanhDong = string.Format(HanhDong, user.UserName2, "xem", "") }, _configuration);
            return list;
        }
        
        public int Save(ApplicationUser user, ref DMPHONGBAN row)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[7];

                oEZParams[0] = new SqlParameter("p_Moi_Sua", row.RowState == State.Added);
                oEZParams[1] = new SqlParameter("p_Id", row.RowState == State.Added ? new Guid() : new Guid(row.Id));
                oEZParams[2] = new SqlParameter("p_Code", row.Code);
                oEZParams[3] = new SqlParameter("p_Name", row.Name);
                oEZParams[4] = new SqlParameter("p_CId", row.CId);
                oEZParams[5] = new SqlParameter("p_ModifiedBy", row.ModifiedBy);
                oEZParams[6] = new SqlParameter("p_ModifiedAt", (row.ModifiedAt == null ? DateTime.Now : row.ModifiedAt));

                oEZParams[1].Direction = ParameterDirection.InputOutput;
                oEZParams[1].SqlDbType = SqlDbType.UniqueIdentifier;

                oEZParams[6].Direction = ParameterDirection.InputOutput;
                oEZParams[6].SqlDbType = SqlDbType.DateTime;

                oEZCommand.CommandText = "DMPHONGBAN_Save";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.Parameters.AddRange(oEZParams);
                oEZCommand.Parameters.Add("@retValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.ReturnValue;
                oEZCommand.CommandTimeout = 0;

                oEZCommand.ExecuteNonQuery();                
                int status = (int)oEZCommand.Parameters["@retValue"].Value;
                if (status == 1)
                {
                    row.Id = oEZParams[1].Value.ToString();
                    row.ModifiedAt = (DateTime)oEZParams[6].Value;
                    QTNHATKYHETHONGDataRepository.Save(user, new Voucher.cloud.Models.DB.QTNHATKYHETHONG() { ChucNang = ChucNang, HanhDong = string.Format(HanhDong, user.UserName2, row.RowState == State.Added ? "thêm" : "sửa", row.Code) }, _configuration);
                }

                DataAccess.CloseConnection(oEZConn);
                return status;

            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                _logger.LogError(oEZCommand.CommandText + "  " + ex.Message);
                return 0;
            }
        }

        public int Delete(ApplicationUser user, DeleteModel model)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[3];
               
                oEZParams[0] = new SqlParameter("p_Id", model.Id);
                oEZParams[1] = new SqlParameter("p_ModifiedBy", user.Id);
                oEZParams[2] = new SqlParameter("p_ModifiedAt", model.ModifiedAt);

                oEZCommand.CommandText = "DMPHONGBAN_Delete";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.Parameters.AddRange(oEZParams);
                oEZCommand.Parameters.Add("@retValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.ReturnValue;
                oEZCommand.CommandTimeout = 0;

                oEZCommand.ExecuteNonQuery();
                int status = (int)oEZCommand.Parameters["@retValue"].Value;
                DataAccess.CloseConnection(oEZConn);
                QTNHATKYHETHONGDataRepository.Save(user, new Voucher.cloud.Models.DB.QTNHATKYHETHONG() { ChucNang = ChucNang, HanhDong = string.Format(HanhDong, user.UserName2, "xóa", model.Code ) }, _configuration);
                return status;
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                _logger.LogError(oEZCommand.CommandText + "  " + ex.Message);
                return 0;
            }
        }

        public int Import(ApplicationUser user, bool isAll, List<DMPHONGBAN> rows)
        {
            string SQLCmd = "SET DATEFORMAT dmy";
            SQLCmd += "\nDECLARE @TEMP TABLE (IDKey INT IDENTITY(1,1), Code NVARCHAR(256), Name NVARCHAR(256), CCode uniqueidentifier)";

            for (int index = 0; index < rows.Count; index++)
            {
                var code = "N'" + rows[index].Code + "'";
                var name = String.IsNullOrEmpty(rows[index].Name) ? "NULL" : "N'" + rows[index].Name + "'";
                var cCode = String.IsNullOrEmpty(rows[index].CCode) ? "NULL" : rows[index].CCode;
                var CoQuan = GetCOQUANBO(user, cCode);
                if(CoQuan != null)
                {
                    SQLCmd += "\nINSERT INTO @TEMP (Code, Name, CCode) VALUES (";
                    SQLCmd += code + ", " + name + ", '" + CoQuan.Id + "')";
                }
                
                if ((index > 0 && index % 1000 == 0) || (index == rows.Count - 1))
                {
                    if (!Import(user, isAll, ref SQLCmd))
                    {
                        return 0;
                    }
                }
            }

            return 1;
        }

        private bool Import(ApplicationUser user, bool isAll, ref string SQLCmd)
        {
            SQLCmd += "\nWHILE EXISTS(SELECT * FROM @TEMP GROUP BY Code HAVING COUNT(*) > 1)";
            SQLCmd += "\nBEGIN";
            SQLCmd += "\nDELETE @TEMP FROM @TEMP a JOIN (SELECT MAX(IDKey) AS IDKey FROM @TEMP GROUP BY Code HAVING COUNT(*) > 1) b ON a.IDKey = b.IDKey";
            SQLCmd += "\nEND";

            SQLCmd += "\nBEGIN TRANSACTION";
            SQLCmd += "\nBEGIN TRY";

            if (isAll)
            {
                SQLCmd += "\nUPDATE DMPHONGBAN SET Code = b.Code, Name = b.Name, COQUANBO_Id = b.CCode, " +
                    "ModifiedAt = GETDATE(), ModifiedBy = N'" + user.Id + "' " +
                    "FROM DMPHONGBAN a JOIN @TEMP b ON a.Code = b.Code";
            }

            SQLCmd += "\nINSERT INTO DMPHONGBAN (Id, COQUANBO_Id, Code, Name, CreatedAt, CreatedBy, ModifiedAt, ModifiedBy)";
            SQLCmd += "\nSELECT Id = NEWID(), a.CCode, a.Code, a.Name, CreatedAt = GETDATE(), CreatedBy = N'" + user.Id + "', ModifiedAt = GETDATE(), ModifiedBy = N'" + user.Id + "' ";
            SQLCmd += " FROM @TEMP a LEFT OUTER JOIN DMPHONGBAN b ON a.Code = b.Code WHERE b.Code IS NULL";

            SQLCmd += "\nCOMMIT";
            SQLCmd += "\nEND TRY";

            SQLCmd += "\nBEGIN CATCH";
            SQLCmd += "\nROLLBACK";
            SQLCmd += "\nRAISERROR(N'Error!', 16, 1)";
            SQLCmd += "\nEND CATCH";

            bool status = DataAccess.RunSQLCommand(user, _configuration, SQLCmd);

            SQLCmd = "SET DATEFORMAT dmy";
            SQLCmd += "\nDECLARE @TEMP TABLE (IDKey INT IDENTITY(1,1), Code NVARCHAR(256), Name NVARCHAR(256), CCode uniqueidentifier)";

            return status;
        }

        public DMCOQUANBO GetCOQUANBO(ApplicationUser user, string code)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<DMCOQUANBO> list = new List<DMCOQUANBO>();
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[2];
                oEZParams[0] = new SqlParameter("p_Code", code);
                oEZParams[1] = new SqlParameter("p_Name", "");

                oEZCommand.CommandText = "DMCOQUANBO_Get";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;
                oEZCommand.Parameters.AddRange(oEZParams);

                oEZAdapter.SelectCommand = oEZCommand;
                oEZAdapter.Fill(oEZDataTable);

                DataAccess.CloseConnection(oEZConn);


                if (oEZDataTable != null)
                {
                    foreach (DataRow row in oEZDataTable.Rows)
                    {
                        list.Add(Common.CreateItemFromRow<DMCOQUANBO>(row));
                    }
                }
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                _logger.LogError(oEZCommand.CommandText + "  " + ex.Message);
                return null;
            }
            return list.FirstOrDefault();
        }
    }
}