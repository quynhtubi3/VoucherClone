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
    public class VoucherTypeDataRepository : IVoucherTypeDataRepository
    {
        private readonly ILogger<VoucherTypeDataRepository> _logger;
        private readonly HttpContext _httpContext;
        private readonly IConfiguration _configuration;
        private readonly string ChucNang = "Loại voucher";
        private readonly string HanhDong = "{0} {1} Loại voucher {2}";
        public VoucherTypeDataRepository(ILogger<VoucherTypeDataRepository> logger, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            this._logger = logger;
            this._httpContext = httpContextAccessor.HttpContext;
            this._configuration = configuration;
        }

        public async Task<int> Delete(ApplicationUser user, DeleteModel model)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[1];

                oEZParams[0] = new SqlParameter("p_Id", model.Id);
                oEZCommand.CommandText = "VoucherType_Delete";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.Parameters.AddRange(oEZParams);
                oEZCommand.Parameters.Add("@retValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.ReturnValue;
                oEZCommand.CommandTimeout = 0;

                await oEZCommand.ExecuteNonQueryAsync();
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

        public async Task<APIResult> Get(ApplicationUser user, JObject model)
        {
            APIResult rs = new APIResult();
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<VoucherType> list = new List<VoucherType>();
            int totalCount = 0;
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[10];
                oEZParams[0] = new SqlParameter("p_Code", model["Code"].ToString());
                oEZParams[1] = new SqlParameter("p_Name", model["Name"].ToString());
                oEZParams[2] = new SqlParameter("p_Type", Int32.Parse(model["Type"].ToString()) == 0 ?(object)DBNull.Value : Int32.Parse(model["Type"].ToString()));
                oEZParams[3] = new SqlParameter("p_DefaultValidityPeriod", Int32.Parse(model["DefaultValidityPeriod"].ToString()) == 0 ? (object)DBNull.Value : Int32.Parse(model["DefaultValidityPeriod"].ToString()));
                oEZParams[4] = new SqlParameter("p_DefaultPrice", Int32.Parse(model["DefaultPrice"].ToString()) == 0 ? (object)DBNull.Value : Int32.Parse(model["DefaultPrice"].ToString()));
                oEZParams[5] = new SqlParameter("p_DefaultRealPrice", Int32.Parse(model["DefaultRealPrice"].ToString()) == 0 ? (object)DBNull.Value : Int32.Parse(model["DefaultRealPrice"].ToString()));
                oEZParams[6] = new SqlParameter("p_DefaultNumberOfUse", Int32.Parse(model["DefaultNumberOfUse"].ToString()) == 0 ? (object)DBNull.Value : Int32.Parse(model["DefaultNumberOfUse"].ToString()));
                oEZParams[7] = new SqlParameter("p_DefaultNumberOfFree", Int32.Parse(model["DefaultNumberOfFree"].ToString()) == 0 ? (object)DBNull.Value : Int32.Parse(model["DefaultNumberOfFree"].ToString()));
                // Paging
                oEZParams[8] = new SqlParameter("p_PageNumber", string.IsNullOrEmpty(model["PageNumber"]?.ToString()) ? 1 : int.Parse(model["PageNumber"].ToString()));
                oEZParams[9] = new SqlParameter("p_PageSize", string.IsNullOrEmpty(model["PageSize"]?.ToString()) ? 10 : int.Parse(model["PageSize"].ToString()));

                oEZCommand.CommandText = "VoucherType_Get";
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
                        list.Add(Common.CreateItemFromRow2<VoucherType>(row));
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

        public async Task<(int, VoucherType)> Save(ApplicationUser user, VoucherType row)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[14];

                oEZParams[0] = new SqlParameter("p_Moi_Sua", row.RowState == State.Added);
                oEZParams[1] = new SqlParameter("p_Id", row.RowState == State.Added ? new Guid() : row.Id);
                oEZParams[2] = new SqlParameter("p_Name", row.Name);
                oEZParams[3] = new SqlParameter("p_Code", row.Code);
                oEZParams[4] = new SqlParameter("p_Type", row.Type);
                oEZParams[5] = new SqlParameter("p_DefaultValidityPeriod", row.DefaultValidityPeriod);
                oEZParams[6] = new SqlParameter("p_DefaultPrice", row.DefaultPrice);
                oEZParams[7] = new SqlParameter("p_DefaultRealPrice", row.DefaultRealPrice);
                oEZParams[8] = new SqlParameter("p_DefaultNumberOfUse", row.DefaultNumberOfUse);
                oEZParams[9] = new SqlParameter("p_DefaultNumberOfFree", row.DefaultNumberOfFree);
                oEZParams[10] = new SqlParameter("p_Description", row.Description);
                oEZParams[11] = new SqlParameter("p_CostSave", row.CostSave);
                oEZParams[12] = new SqlParameter("p_ModifiedBy", row.Updateby);
                oEZParams[13] = new SqlParameter("p_ModifiedAt", (row.UpdateAt == null ? DateTime.Now : row.UpdateAt));

                oEZParams[1].Direction = ParameterDirection.InputOutput;
                oEZParams[1].SqlDbType = SqlDbType.UniqueIdentifier;

                oEZParams[13].Direction = ParameterDirection.InputOutput;
                oEZParams[13].SqlDbType = SqlDbType.DateTime;

                oEZCommand.CommandText = "VoucherType_Save";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.Parameters.AddRange(oEZParams);
                oEZCommand.Parameters.Add("@retValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.ReturnValue;
                oEZCommand.CommandTimeout = 0;

                await oEZCommand.ExecuteNonQueryAsync();
                int status = (int)oEZCommand.Parameters["@retValue"].Value;
                if (status == 1)
                {
                    row.Id = new Guid(oEZParams[1].Value.ToString());
                    row.UpdateAt = (DateTime)oEZParams[13].Value;
                    QTNHATKYHETHONGDataRepository.Save(user, new Voucher.cloud.Models.DB.QTNHATKYHETHONG() { ChucNang = ChucNang, HanhDong = string.Format(HanhDong, user.UserName2, row.RowState == State.Added ? "thêm" : "sửa", row.Code) }, _configuration);
                }

                DataAccess.CloseConnection(oEZConn);
                return (status, row);

            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                _logger.LogError(oEZCommand.CommandText + "  " + ex.Message);
                return (0, null);
            }
        }
    }
}
