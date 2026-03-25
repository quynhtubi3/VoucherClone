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
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace Voucher.cloud.DatabaseFrameworks.Repositories
{
    public class DMCOSOCUAHANGDataRepository : IDMCOSOCUAHANGDataRepository
    {
        private readonly ILogger<DMCOSOCUAHANGDataRepository> _logger;
        private readonly HttpContext _httpContext;
        private readonly IConfiguration _configuration;
        private readonly string ChucNang = "Danh mục cơ quan";
        private readonly string HanhDong = "{0} {1} danh mục cơ quan {2}";
        public DMCOSOCUAHANGDataRepository(ILogger<DMCOSOCUAHANGDataRepository> logger, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            this._logger = logger;
            this._httpContext = httpContextAccessor.HttpContext;
            this._configuration = configuration;
        }
        
        public List<DMCOSOCUAHANG> Get(ApplicationUser user, JObject model)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<DMCOSOCUAHANG> list = new List<DMCOSOCUAHANG>();
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[2];
                oEZParams[0] = new SqlParameter("p_Code", model["Code"].ToString());
                oEZParams[1] = new SqlParameter("p_Name", model["Name"].ToString());

                oEZCommand.CommandText = "DMCOSOCUAHANG_Get";
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
                        list.Add(Common.CreateItemFromRow<DMCOSOCUAHANG>(row));
                    }
                }
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                _logger.LogError(oEZCommand.CommandText + "  " + ex.Message);
                return null;
            }
            try
            {
                QTNHATKYHETHONGDataRepository.Save(user, new Voucher.cloud.Models.DB.QTNHATKYHETHONG() { ChucNang = ChucNang, HanhDong = string.Format(HanhDong, user.UserName2, "xem", "") }, _configuration);
            }
            catch(Exception e)
            {
                
            }            
            return list;
        }


        public async Task<APIResult> GetPagination(ApplicationUser user, JObject model)
        {
            APIResult rs = new APIResult();
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<DMCOSOCUAHANG> list = new List<DMCOSOCUAHANG>();
            int totalCount = 0;

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[4];
                oEZParams[0] = new SqlParameter("p_Code", model["Code"].ToString());
                oEZParams[1] = new SqlParameter("p_Name", model["Name"].ToString());
                // Paging
                oEZParams[2] = new SqlParameter("p_PageNumber", string.IsNullOrEmpty(model["PageNumber"]?.ToString()) ? 1 : int.Parse(model["PageNumber"].ToString()));
                oEZParams[3] = new SqlParameter("p_PageSize", string.IsNullOrEmpty(model["PageSize"]?.ToString()) ? 10 : int.Parse(model["PageSize"].ToString()));
               
                oEZCommand.CommandText = "DMCOSOCUAHANGPagination_Get";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;
                oEZCommand.Parameters.AddRange(oEZParams);

                oEZAdapter.SelectCommand = oEZCommand;
                DataSet ds = new DataSet();
                oEZAdapter.Fill(ds);

                DataAccess.CloseConnection(oEZConn);

                if (ds.Tables.Count > 0 && ds.Tables[0] != null)
                {
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        list.Add(Common.CreateItemFromRow<DMCOSOCUAHANG>(row));
                    }
                }

                if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
                {
                    totalCount = Convert.ToInt32(ds.Tables[1].Rows[0]["TotalCount"]);
                }
               
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                _logger.LogError(oEZCommand.CommandText + "  " + ex.Message);
                return null;
            }
            try
            {
                QTNHATKYHETHONGDataRepository.Save(user, new Voucher.cloud.Models.DB.QTNHATKYHETHONG() { ChucNang = ChucNang, HanhDong = string.Format(HanhDong, user.UserName2, "xem", "") }, _configuration);
            }
            catch (Exception e)
            {

            }
            rs.Data = list;
            rs.TotalCount = totalCount;
            return rs;
        }

        public int Save(ApplicationUser user, ref DMCOSOCUAHANG row)
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
                oEZParams[4] = new SqlParameter("p_Address", row.Address);

                oEZParams[5] = new SqlParameter("p_ModifiedBy", row.ModifiedBy);
                oEZParams[6] = new SqlParameter("p_ModifiedAt", (row.ModifiedAt == null ? DateTime.Now : row.ModifiedAt));

                oEZParams[1].Direction = ParameterDirection.InputOutput;
                oEZParams[1].SqlDbType = SqlDbType.UniqueIdentifier;

                oEZParams[6].Direction = ParameterDirection.InputOutput;
                oEZParams[6].SqlDbType = SqlDbType.DateTime;

                oEZCommand.CommandText = "DMCOSOCUAHANG_Save";
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

                oEZCommand.CommandText = "DMCOSOCUAHANG_Delete";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.Parameters.AddRange(oEZParams);
                oEZCommand.Parameters.Add("@retValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.ReturnValue;
                oEZCommand.CommandTimeout = 0;

                oEZCommand.ExecuteNonQuery();
                int status = (int)oEZCommand.Parameters["@retValue"].Value;
                DataAccess.CloseConnection(oEZConn);
                QTNHATKYHETHONGDataRepository.Save(user, new Voucher.cloud.Models.DB.QTNHATKYHETHONG() { ChucNang = ChucNang, HanhDong = string.Format(HanhDong, user.UserName2, "xóa", model.Code) }, _configuration);
                return status;
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                _logger.LogError(oEZCommand.CommandText + "  " + ex.Message);
                return 0;
            }
        }

        public int Import(ApplicationUser user, bool isAll, List<DMCOSOCUAHANG> rows)
        {
            string SQLCmd = "SET DATEFORMAT dmy";
            SQLCmd += "\nDECLARE @TEMP TABLE (IDKey INT IDENTITY(1,1), Code NVARCHAR(256), Name NVARCHAR(256))";

            for (int index = 0; index < rows.Count; index++)
            {
                var code = "N'" + rows[index].Code + "'";
                var name = String.IsNullOrEmpty(rows[index].Name) ? "NULL" : "N'" + rows[index].Name + "'";                

                SQLCmd += "\nINSERT INTO @TEMP (Code, Name) VALUES (";
                SQLCmd += code + ", " + name + ")";

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
                SQLCmd += "\nUPDATE DMCOQUANBO SET Code = b.Code, Name = b.Name, " +
                    "ModifiedAt = GETDATE(), ModifiedBy = N'" + user.Id + "' " +
                    "FROM DMCOQUANBO a JOIN @TEMP b ON a.Code = b.Code";
            }

            SQLCmd += "\nINSERT INTO DMCOQUANBO (Id, Code, Name, CreatedAt, CreatedBy, ModifiedAt, ModifiedBy)";
            SQLCmd += "\nSELECT Id = NEWID(), a.Code, a.Name, CreatedAt = GETDATE(), CreatedBy = N'" + user.Id + "', ModifiedAt = GETDATE(), ModifiedBy = N'" + user.Id + "' ";
            SQLCmd += " FROM @TEMP a LEFT OUTER JOIN DMCOQUANBO b ON a.Code = b.Code WHERE b.Code IS NULL";

            SQLCmd += "\nCOMMIT";
            SQLCmd += "\nEND TRY";

            SQLCmd += "\nBEGIN CATCH";
            SQLCmd += "\nROLLBACK";
            SQLCmd += "\nRAISERROR(N'Error!', 16, 1)";
            SQLCmd += "\nEND CATCH";

            bool status = DataAccess.RunSQLCommand(user, _configuration, SQLCmd);

            SQLCmd = "SET DATEFORMAT dmy";
            SQLCmd += "\nDECLARE @TEMP TABLE (IDKey INT IDENTITY(1,1), Code NVARCHAR(256), Name NVARCHAR(256))";

            return status;
        }
    }
}