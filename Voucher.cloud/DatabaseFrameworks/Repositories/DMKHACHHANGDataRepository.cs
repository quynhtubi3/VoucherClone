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
    public class DMKHACHHANGDataRepository : IDMKHACHHANGDataRepository
    {
        private readonly ILogger<DMKHACHHANGDataRepository> _logger;
        private readonly HttpContext _httpContext;
        private readonly IConfiguration _configuration;
        private readonly string ChucNang = "Danh mục khách hàng";
        private readonly string HanhDong = "{0} {1} danh mục khách hàng {2}";
        public DMKHACHHANGDataRepository(ILogger<DMKHACHHANGDataRepository> logger, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            this._logger = logger;
            this._httpContext = httpContextAccessor.HttpContext;
            this._configuration = configuration;
        }
        
        public List<DMKHACHHANG> Get(ApplicationUser user, JObject model)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<DMKHACHHANG> list = new List<DMKHACHHANG>();
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[4];
                oEZParams[0] = new SqlParameter("p_Code", model["Code"].ToString());
                oEZParams[1] = new SqlParameter("p_Name", model["Name"].ToString());
                oEZParams[2] = new SqlParameter("p_DiaChi", model["DiaChi"].ToString());
                oEZParams[3] = new SqlParameter("p_DienThoai", model["DienThoai"].ToString());

                oEZCommand.CommandText = "DMKHACHHANG_Get";
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
                        list.Add(Common.CreateItemFromRow<DMKHACHHANG>(row));
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
            List<DMKHACHHANGDTO> list = new List<DMKHACHHANGDTO>();
            int totalCount = 0;

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[6];
                oEZParams[0] = new SqlParameter("p_Code", model["Code"].ToString());
                oEZParams[1] = new SqlParameter("p_Name", model["Name"].ToString());
                oEZParams[2] = new SqlParameter("p_DiaChi", model["DiaChi"].ToString());
                oEZParams[3] = new SqlParameter("p_DienThoai", model["DienThoai"].ToString());
                // Paging
                oEZParams[4] = new SqlParameter("p_PageNumber", string.IsNullOrEmpty(model["PageNumber"]?.ToString()) ? 1 : int.Parse(model["PageNumber"].ToString()));
                oEZParams[5] = new SqlParameter("p_PageSize", string.IsNullOrEmpty(model["PageSize"]?.ToString()) ? 10 : int.Parse(model["PageSize"].ToString()));

                oEZCommand.CommandText = "DMKHACHHANGPagination_Get";
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
                        list.Add(Common.CreateItemFromRow<DMKHACHHANGDTO>(row));
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
            foreach (var item in list)
            {
                item.Vouchers = await GetVoucherByOfKhachHangId(user,new  Guid(item.Id));
            }
            QTNHATKYHETHONGDataRepository.Save(user, new Voucher.cloud.Models.DB.QTNHATKYHETHONG() { ChucNang = ChucNang, HanhDong = string.Format(HanhDong, user.UserName2, "xem", "") }, _configuration);
            rs.Data = list;
            rs.TotalCount = totalCount;
            return rs;
        }


        public async Task<List<Voucher.cloud.Models.DB.Voucher>> GetVoucherByOfKhachHangId(ApplicationUser user,Guid id)
        {
            APIResult rs = new APIResult();
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<Voucher.cloud.Models.DB.Voucher> list = new List<Voucher.cloud.Models.DB.Voucher>();
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[1];
                oEZParams[0] = new SqlParameter("p_KhachHangId", id);
                oEZCommand.CommandText = "GetVoucherByOfKhachHangId_Get";
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
                        list.Add(Common.CreateItemFromRow2<Voucher.cloud.Models.DB.Voucher>(row));
                    }
                }
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                _logger.LogError(oEZCommand.CommandText + "  " + ex.Message);
                return null;
            }
            return list;
        }




        public int Save(ApplicationUser user, ref DMKHACHHANG row)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[14];

                oEZParams[0] = new SqlParameter("p_Moi_Sua", row.RowState == State.Added);
                oEZParams[1] = new SqlParameter("p_Id", row.RowState == State.Added ? Guid.NewGuid() : new Guid(row.Id));
                oEZParams[2] = new SqlParameter("p_Code", row.Code ?? (object)DBNull.Value);
                oEZParams[3] = new SqlParameter("p_Name", row.Name ?? (object)DBNull.Value);
                oEZParams[4] = new SqlParameter("p_DiaChi", row.DiaChi ?? (object)DBNull.Value);
                oEZParams[5] = new SqlParameter("p_DienThoai", row.DienThoai ?? (object)DBNull.Value);
                oEZParams[6] = new SqlParameter("p_Email", row.Email ?? (object)DBNull.Value);
                oEZParams[7] = new SqlParameter("p_NamSinh",row.NamSinh == null || row.NamSinh == DateTime.MinValue ? (object)DBNull.Value: row.NamSinh.Date);
                oEZParams[8] = new SqlParameter("p_GioiTinh", row.GioiTinh);
                oEZParams[9] = new SqlParameter("p_Other", row.Other ?? (object)DBNull.Value);
                oEZParams[10] = new SqlParameter("p_Note", row.Note ?? (object)DBNull.Value);
                oEZParams[11] = new SqlParameter("p_Identifier", row.Identifier ?? (object)DBNull.Value);
                oEZParams[12] = new SqlParameter("p_ModifiedBy", row.ModifiedBy);
                oEZParams[13] = new SqlParameter("p_ModifiedAt",  (object)row.ModifiedAt ?? DateTime.Now);

                // Đặt hướng Output
                oEZParams[1].Direction = ParameterDirection.InputOutput;
                oEZParams[1].SqlDbType = SqlDbType.UniqueIdentifier;

                oEZParams[13].Direction = ParameterDirection.InputOutput;
                oEZParams[13].SqlDbType = SqlDbType.DateTime;

                oEZCommand.CommandText = "DMKHACHHANG_Save";
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
                    row.ModifiedAt = (DateTime)oEZParams[13].Value;
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

                oEZCommand.CommandText = "DMKHACHHANG_Delete";
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