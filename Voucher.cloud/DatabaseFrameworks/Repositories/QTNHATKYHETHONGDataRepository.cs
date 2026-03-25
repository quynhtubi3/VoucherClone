using Voucher.cloud.Commons;
using Voucher.cloud.Context;
using Voucher.cloud.DatabaseFrameworks.Interfaces;
using Voucher.cloud.Models.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using Voucher.cloud.Models;
using Voucher.cloud.Models.DB;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Voucher.cloud.DatabaseFrameworks.Repositories
{
    public class QTNHATKYHETHONGDataRepository : IQTNHATKYHETHONGDataRepository
    {
        private readonly ILogger<QTNHATKYHETHONGDataRepository> _logger;
        private readonly HttpContext _httpContext;
        private readonly IConfiguration _configuration;
        public QTNHATKYHETHONGDataRepository(ILogger<QTNHATKYHETHONGDataRepository> logger, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            this._logger = logger;
            this._httpContext = httpContextAccessor.HttpContext;
            this._configuration = configuration;
        }

        public async Task<APIResult> Get(ApplicationUser user, JObject model)
        {
            APIResult rs = new APIResult();
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<QTNHATKYHETHONG> list = new List<QTNHATKYHETHONG>();
            int totalCount = 0;

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[6];
                oEZParams[0] = new SqlParameter("user_name", model["UserName"].ToString());
                if(model["TuNgay"].Type != JTokenType.Null)
                {
                    oEZParams[1] = new SqlParameter("tu_ngay", DateTime.Parse(model["TuNgay"].ToString()).ToString("yyyy/MM/dd"));
                } else
                {
                    oEZParams[1] = new SqlParameter("tu_ngay", DateTime.Parse("1990/01/01").ToString("yyyy/MM/dd"));
                }
                if (model["DenNgay"].Type != JTokenType.Null)
                {
                    oEZParams[2] = new SqlParameter("den_ngay", DateTime.Parse(model["DenNgay"].ToString()).ToString("yyyy/MM/dd"));
                }
                else
                {
                    oEZParams[2] = new SqlParameter("den_ngay", DateTime.Now.ToString("yyyy/MM/dd"));
                }
                oEZParams[3] = new SqlParameter("chuc_nang", model["ChucNang"].ToString());

                // Paging
                oEZParams[4] = new SqlParameter("PageNumber", string.IsNullOrEmpty(model["PageNumber"]?.ToString()) ? 1 : int.Parse(model["PageNumber"].ToString()));
                oEZParams[5] = new SqlParameter("PageSize", string.IsNullOrEmpty(model["PageSize"]?.ToString()) ? 10 : int.Parse(model["PageSize"].ToString()));



                oEZCommand.CommandText = "QTNHATKYHETHONG_Get";
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
                        list.Add(Common.CreateItemFromRow<QTNHATKYHETHONG>(row));
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
                QTNHATKYHETHONGDataRepository.Save(user, new Voucher.cloud.Models.DB.QTNHATKYHETHONG() { ChucNang = "Nhật ký hệ thống", HanhDong = string.Format("{0} xem nhật ký hệ thống", user.UserName2) }, _configuration);
            }
            catch (Exception e)
            {

            }
            rs.Data = list;
            rs.TotalCount = totalCount;
            return rs;
        }

        public static void Save(ApplicationUser user, QTNHATKYHETHONG row, IConfiguration _configuration)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[3];

                oEZParams[0] = new SqlParameter("p_UserId", new Guid(user.Id));
                oEZParams[1] = new SqlParameter("@p_ChucNang", row.ChucNang);
                oEZParams[2] = new SqlParameter("@p_HanhDong", row.HanhDong);                

                oEZCommand.CommandText = "QTNHATKYHETHONG_Save";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.Parameters.AddRange(oEZParams);
                oEZCommand.CommandTimeout = 0;

                oEZCommand.ExecuteNonQuery();
                DataAccess.CloseConnection(oEZConn);

            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
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
                //oEZParams[2] = new SqlParameter("p_ModifiedAt", model.ModifiedAt);
                oEZParams[2] = new SqlParameter("p_ModifiedAt", DateTime.Now);

                oEZCommand.CommandText = "QTNHATKYHETHONG_Delete";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.Parameters.AddRange(oEZParams);
                oEZCommand.Parameters.Add("@retValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.ReturnValue;
                oEZCommand.CommandTimeout = 0;

                oEZCommand.ExecuteNonQuery();
                int status = (int)oEZCommand.Parameters["@retValue"].Value;
                DataAccess.CloseConnection(oEZConn);
                //QTNHATKYHETHONGDataRepository.Save(user, new Voucher.cloud.Models.DB.QTNHATKYHETHONG() { ChucNang = "Nhật ký hệ thống", HanhDong = string.Format("{0} xóa nhật ký hệ thống", user.UserName2) }, _configuration);
                return status;
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                _logger.LogError(oEZCommand.CommandText + "  " + ex.Message);
                return 0;
            }
        }
    }
}