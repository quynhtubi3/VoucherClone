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
using System.Threading.Tasks;

namespace Voucher.cloud.DatabaseFrameworks.Repositories
{
    public class CHUCVUDataRepository : ICHUCVUDataRepository
    {
        private readonly ILogger<CHUCVUDataRepository> _logger;
        private readonly HttpContext _httpContext;
        private readonly IConfiguration _configuration;
        private readonly string ChucNang = "Quản lý chức vụ";
        private readonly string HanhDong = "{0} {1} chức vụ {2}";
        public CHUCVUDataRepository(ILogger<CHUCVUDataRepository> logger, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            this._logger = logger;
            this._httpContext = httpContextAccessor.HttpContext;
            this._configuration = configuration;
        }
        
        public List<CHUCVU> Get(ApplicationUser user, JObject model)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<CHUCVU> list = new List<CHUCVU>();
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[2];
                oEZParams[0] = new SqlParameter("p_Name", model["Name"].ToString());
                oEZParams[1] = new SqlParameter("p_Code", model["Code"].ToString());
                oEZCommand.CommandText = "CHUCVU_Get";
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
                        list.Add(Common.CreateItemFromRow<CHUCVU>(row));
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

        public async Task<APIResult> GetPagination(ApplicationUser user, JObject model)
        {
            APIResult rs = new APIResult();
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<CHUCVU> list = new List<CHUCVU>();
            int totalCount = 0;

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[4];
                oEZParams[0] = new SqlParameter("p_Name", model["Name"].ToString());
                oEZParams[1] = new SqlParameter("p_Code", model["Code"].ToString());
                // Paging
                oEZParams[2] = new SqlParameter("p_PageNumber", string.IsNullOrEmpty(model["PageNumber"]?.ToString()) ? 1 : int.Parse(model["PageNumber"].ToString()));
                oEZParams[3] = new SqlParameter("p_PageSize", string.IsNullOrEmpty(model["PageSize"]?.ToString()) ? 10 : int.Parse(model["PageSize"].ToString()));

                oEZCommand.CommandText = "CHUCVUPagination_Get";
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
                        list.Add(Common.CreateItemFromRow<CHUCVU>(row));
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
            QTNHATKYHETHONGDataRepository.Save(user, new Voucher.cloud.Models.DB.QTNHATKYHETHONG() { ChucNang = ChucNang, HanhDong = string.Format(HanhDong, user.UserName2, "xem", "") }, _configuration);
            rs.Data = list;
            rs.TotalCount = totalCount;
            return rs;
        }

        public int Save(ApplicationUser user, ref CHUCVU row)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[12];

                oEZParams[0] = new SqlParameter("p_Moi_Sua", row.RowState == State.Added);
                oEZParams[1] = new SqlParameter("p_Id", row.RowState == State.Added ? Guid.NewGuid() : new Guid(row.Id));
                oEZParams[2] = new SqlParameter("p_Code", row.Code ?? (object)DBNull.Value);
                oEZParams[3] = new SqlParameter("p_Name", row.Name ?? (object)DBNull.Value);
                oEZParams[4] = new SqlParameter("p_HHCaNhan", row.HHCaNhan);
                oEZParams[5] = new SqlParameter("p_HHTruongCuaHang", row.HHTruongCuaHang);
                oEZParams[6] = new SqlParameter("p_HHPhoCuaHang", row.HHPhoCuaHang);
                oEZParams[7] = new SqlParameter("p_QuyDoiPhaChe", row.QuyDoiPhaChe);
                oEZParams[8] = new SqlParameter("p_QuyChung", row.QuyChung);
                oEZParams[9] = new SqlParameter("p_Note", row.Note ?? (object)DBNull.Value);
                oEZParams[10] = new SqlParameter("p_ModifiedBy", row.ModifiedBy);
                oEZParams[11] = new SqlParameter("p_ModifiedAt", row.RowState == State.Added ? DateTime.Now : (object)row.ModifiedAt);

                // Đặt hướng Output
                oEZParams[1].Direction = ParameterDirection.InputOutput;
                oEZParams[1].SqlDbType = SqlDbType.UniqueIdentifier;

                oEZParams[11].Direction = ParameterDirection.InputOutput;
                oEZParams[11].SqlDbType = SqlDbType.DateTime;

                oEZCommand.CommandText = "CHUCVU_Save";
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
                    row.ModifiedAt = (DateTime)oEZParams[11].Value;
                    QTNHATKYHETHONGDataRepository.Save(user, new Voucher.cloud.Models.DB.QTNHATKYHETHONG() { ChucNang = ChucNang, HanhDong = string.Format(HanhDong, user.UserName2, row.RowState == State.Added ? "thêm" : "sửa", row.Name) }, _configuration);
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

                oEZCommand.CommandText = "CHUCVU_Delete";
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
    }
}