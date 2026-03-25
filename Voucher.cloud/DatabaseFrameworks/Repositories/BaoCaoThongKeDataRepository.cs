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
using System.Globalization;

namespace Voucher.cloud.DatabaseFrameworks.Repositories
{
    public class BaoCaoThongKeDataRepository : IBaoCaoThongKeDataRepository
    {
        private readonly ILogger<BaoCaoThongKeDataRepository> _logger;
        private readonly HttpContext _httpContext;
        private readonly IConfiguration _configuration;
        private readonly string ChucNang = "Báo cáo thống kê";
        private readonly string HanhDong = "{0} {1} Voucher {2}";
        public BaoCaoThongKeDataRepository(ILogger<BaoCaoThongKeDataRepository> logger, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            this._logger = logger;
            this._httpContext = httpContextAccessor.HttpContext;
            this._configuration = configuration;
        }


        public async Task<APIResult> GetDoanhThuTheoNguoiBan(ApplicationUser user, JObject model)
        {
            APIResult rs = new APIResult();
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<DoanhThuNguoiBan> list = new List<DoanhThuNguoiBan>();
            int totalCount = 0;

            try
            {

                var fromDateStr = model["fromDate"]?.ToString();
                var toDateStr = model["toDate"]?.ToString();
                DateTime dateFrom;
                DateTime dateTo;

                SqlParameter[] oEZParams = new SqlParameter[4];
                oEZParams[0] = new SqlParameter("p_DateFrom",
                    DateTime.TryParseExact(fromDateStr, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out dateFrom) ? (object)dateFrom : (object)DBNull.Value);
                oEZParams[1] = new SqlParameter("p_DateTo",
                    DateTime.TryParseExact(toDateStr, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out dateTo) ? (object)dateTo : (object)DBNull.Value);

                // Paging
                oEZParams[2] = new SqlParameter("p_PageNumber", string.IsNullOrEmpty(model["PageNumber"]?.ToString()) ? 1 : int.Parse(model["PageNumber"].ToString()));
                oEZParams[3] = new SqlParameter("p_PageSize", string.IsNullOrEmpty(model["PageSize"]?.ToString()) ? 10 : int.Parse(model["PageSize"].ToString()));

                oEZCommand.CommandText = "RPT_Voucher_Revenue_BySeller";
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
                        list.Add(Common.CreateItemFromRow2<DoanhThuNguoiBan>(row));
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

        public async Task<APIResult> GetDoanhThuTheoLoaiVoucher(ApplicationUser user, JObject model)
        {
            APIResult rs = new APIResult();
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<DoanhThuTheoLoaiVoucher> list = new List<DoanhThuTheoLoaiVoucher>();
            int totalCount = 0;
            try
            {
                var fromDateStr = model["fromDate"]?.ToString();
                var toDateStr = model["toDate"]?.ToString();
                DateTime dateFrom;
                DateTime dateTo;

                SqlParameter[] oEZParams = new SqlParameter[4];
                oEZParams[0] = new SqlParameter("p_DateFrom",
                    DateTime.TryParseExact(fromDateStr, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out dateFrom) ? (object)dateFrom : (object)DBNull.Value);
                oEZParams[1] = new SqlParameter("p_DateTo",
                    DateTime.TryParseExact(toDateStr, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out dateTo) ? (object)dateTo : (object)DBNull.Value);

                // Paging
                oEZParams[2] = new SqlParameter("p_PageNumber", string.IsNullOrEmpty(model["PageNumber"]?.ToString()) ? 1 : int.Parse(model["PageNumber"].ToString()));
                oEZParams[3] = new SqlParameter("p_PageSize", string.IsNullOrEmpty(model["PageSize"]?.ToString()) ? 10 : int.Parse(model["PageSize"].ToString()));

                oEZCommand.CommandText = "sp_VoucherRevenue_ByType";
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
                        list.Add(Common.CreateItemFromRow2<DoanhThuTheoLoaiVoucher>(row));
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

        public async Task<APIResult> GetTiLeKichHoatVoucher(ApplicationUser user, JObject model)
        {
            APIResult rs = new APIResult();
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<TiLeKichHoatVoucher> list = new List<TiLeKichHoatVoucher>();
            int totalCount = 0;

            try
            {

                SqlParameter[] oEZParams = new SqlParameter[2];
                // Paging
                oEZParams[0] = new SqlParameter("p_PageNumber", string.IsNullOrEmpty(model["PageNumber"]?.ToString()) ? 1 : int.Parse(model["PageNumber"].ToString()));
                oEZParams[1] = new SqlParameter("p_PageSize", string.IsNullOrEmpty(model["PageSize"]?.ToString()) ? 10 : int.Parse(model["PageSize"].ToString()));
                oEZCommand.CommandText = "sp_Voucher_ActivationRate_AllTime";
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
                        list.Add(Common.CreateItemFromRow2<TiLeKichHoatVoucher>(row));
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
        public async Task<APIResult> GetDanhSachVoucherSapHetHan(ApplicationUser user, JObject model)
        {
            APIResult rs = new APIResult();
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<Voucher.cloud.Models.DB.Voucher> list = new List<Voucher.cloud.Models.DB.Voucher>();
            int totalCount = 0;

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[3];
                oEZParams[0] = new SqlParameter("p_week ", Int32.Parse(model["week"].ToString()) == 0 ? (object)DBNull.Value : Int32.Parse(model["week"].ToString()));
                // Paging
                oEZParams[1] = new SqlParameter("p_PageNumber", string.IsNullOrEmpty(model["PageNumber"]?.ToString()) ? 1 : int.Parse(model["PageNumber"].ToString()));
                oEZParams[2] = new SqlParameter("p_PageSize", string.IsNullOrEmpty(model["PageSize"]?.ToString()) ? 10 : int.Parse(model["PageSize"].ToString()));
                oEZCommand.CommandText = "sp_Voucher_ExpiringSoon";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;
                oEZAdapter.SelectCommand = oEZCommand;
                oEZCommand.Parameters.AddRange(oEZParams);
                DataSet ds = new DataSet();
                oEZAdapter.Fill(ds);
                DataAccess.CloseConnection(oEZConn);


                if (ds.Tables.Count > 0 && ds.Tables[0] != null)
                {
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        list.Add(Common.CreateItemFromRow2<Voucher.cloud.Models.DB.Voucher>(row));
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
        /// <summary>
        /// SendMailRemind
        /// </summary>
        /// <param name="user"></param>
        /// <param name="email"></param>
        /// <returns></returns>
        public async Task<APIResult> SendMailRemind(ApplicationUser user, List<Guid> ids)
        {
            try
            {
                APIResult response = new APIResult();
                var vouchers = await GetVoucherByIds(user,ids);
                if(vouchers != null)
                {
                    foreach (var voucher in vouchers)
                    {
                        string subject = "Nhắc nhở Voucher sắp hết hạn";
                        string body = System.IO.File.ReadAllText("Template/remind_voucher.html");
                        body = body.Replace("{ClientName}", voucher.BuyerName);
                        body = body.Replace("{Email}", voucher.BuyerEmail);
                        body = body.Replace("{Phone}", voucher.BuyerPhone);
                        body = body.Replace("{Address}", voucher.BuyerAddress);
                        body = body.Replace("{Serial}", voucher.Serial);
                        body = body.Replace("{Price}", voucher.SalePrice.ToString("N0", new CultureInfo("vi-VN")));
                        body = body.Replace("{ExpiryDate}", voucher.ExpiryDate.Value.ToString("dd/MM/yyyy"));
                        Common.SendMail(voucher.BuyerEmail, subject, body, _configuration);
                    }
                    response.Code = 1;
                }
                else
                {
                    response.Code = -1;

                }
                return response;
            }
            catch (Exception)
            {
                throw;
            }

        }

        public async Task<List<Voucher.cloud.Models.DB.Voucher>> GetVoucherByIds(ApplicationUser user, List<Guid> ids)
        {
            
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<Voucher.cloud.Models.DB.Voucher> list = new List<Voucher.cloud.Models.DB.Voucher>();
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[1];
                oEZParams[0] = new SqlParameter("p_ListId", string.Join(",", ids));
                oEZCommand.CommandText = "sp_Voucher_GetByListId";
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

        public async Task<APIResult> GetHoaHongCacBen(ApplicationUser user, JObject model)
        {
            APIResult rs = new APIResult();
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<HoaHongCacBen> list = new List<HoaHongCacBen>();
            int totalCount = 0;

            try
            {

                var fromDateStr = model["fromDate"]?.ToString();
                var toDateStr = model["toDate"]?.ToString();
                DateTime dateFrom;
                DateTime dateTo;

                SqlParameter[] oEZParams = new SqlParameter[4];
                oEZParams[0] = new SqlParameter("p_DateFrom",
                    DateTime.TryParseExact(fromDateStr, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out dateFrom) ? (object)dateFrom : (object)DBNull.Value);
                oEZParams[1] = new SqlParameter("p_DateTo",
                    DateTime.TryParseExact(toDateStr, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out dateTo) ? (object)dateTo : (object)DBNull.Value);
                // Paging
                oEZParams[2] = new SqlParameter("p_PageNumber", string.IsNullOrEmpty(model["PageNumber"]?.ToString()) ? 1 : int.Parse(model["PageNumber"].ToString()));
                oEZParams[3] = new SqlParameter("p_PageSize", string.IsNullOrEmpty(model["PageSize"]?.ToString()) ? 10 : int.Parse(model["PageSize"].ToString()));

                oEZCommand.CommandText = "RPT_UserProfile_Commission";
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
                        list.Add(Common.CreateItemFromRow2<HoaHongCacBen>(row));
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
    }
}
