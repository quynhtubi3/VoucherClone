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
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;

namespace Voucher.cloud.DatabaseFrameworks.Repositories
{
    public class VoucherDataRepository : IVoucherDataRepository
    {
        private readonly ILogger<VoucherDataRepository> _logger;
        private readonly HttpContext _httpContext;
        private readonly IConfiguration _configuration;
        private readonly string ChucNang = "Voucher";
        private readonly string HanhDong = "{0} {1} Voucher {2}";
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        public VoucherDataRepository(ILogger<VoucherDataRepository> logger, IHttpContextAccessor httpContextAccessor, IConfiguration configuration, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
        {
            this._logger = logger;
            this._httpContext = httpContextAccessor.HttpContext;
            this._configuration = configuration;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<int> Delete(ApplicationUser user, DeleteModel model)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[1];

                oEZParams[0] = new SqlParameter("p_Id", model.Id);
                oEZCommand.CommandText = "Voucher_Delete";
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
            var ro = await _userManager.GetRolesAsync(user);
            var currentRole = await _roleManager.FindByNameAsync(ro.FirstOrDefault());
            string roleName = currentRole?.Role ?? string.Empty;

            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<Voucher.cloud.Models.DB.Voucher> list = new List<Voucher.cloud.Models.DB.Voucher>();
            int totalCount = 0;

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[10];
                oEZParams[0] = new SqlParameter("p_Serial", model["Serial"].ToString());
                oEZParams[1] = new SqlParameter("p_VoucherType", Int32.Parse(model["VoucherType"].ToString()) == 0 ? (object)DBNull.Value : Int32.Parse(model["Type"].ToString()));
                oEZParams[2] = new SqlParameter("p_ValidityPeriod", Int32.Parse(model["ValidityPeriod"].ToString()) == 0 ? (object)DBNull.Value : Int32.Parse(model["DefaultValidityPeriod"].ToString()));
                // SellerId
                //oEZParams[3] = new SqlParameter("p_SellerId",roleName.Trim().ToLower() != "seller" ? (object)DBNull.Value: user.Id);
                oEZParams[3] = new SqlParameter("p_SellerId", (object)DBNull.Value);
                // DateFrom
                DateTime dateFrom;
                oEZParams[4] = new SqlParameter("p_DateFrom", DateTime.TryParse(model["fromDate"]?.ToString(), out dateFrom) ? (object)dateFrom : (object)DBNull.Value);
                // DateTo
                DateTime dateTo;
                oEZParams[5] = new SqlParameter("p_DateTo", DateTime.TryParse(model["toDate"]?.ToString(), out dateTo) ? (object)dateTo : (object)DBNull.Value);

                oEZParams[6] = new SqlParameter("p_NumberOfUse", Int32.Parse(model["NumberOfUse"].ToString()) == 0 ? (object)DBNull.Value : Int32.Parse(model["NumberOfUse"].ToString()));
                oEZParams[7] = new SqlParameter("p_NumberOfFree", Int32.Parse(model["NumberOfFree"].ToString()) == 0 ? (object)DBNull.Value : Int32.Parse(model["NumberOfFree"].ToString()));
                // Paging
                oEZParams[8] = new SqlParameter("p_PageNumber", string.IsNullOrEmpty(model["PageNumber"]?.ToString()) ? 1 : int.Parse(model["PageNumber"].ToString()));
                oEZParams[9] = new SqlParameter("p_PageSize", string.IsNullOrEmpty(model["PageSize"]?.ToString()) ? 10 : int.Parse(model["PageSize"].ToString()));

                oEZCommand.CommandText = "Voucher_Get";
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

        public async Task<List<Voucher.cloud.Models.DB.Voucher>> Get2(ApplicationUser user, JObject model)
        {
            var ro = await _userManager.GetRolesAsync(user);
            var currentRole = await _roleManager.FindByNameAsync(ro.FirstOrDefault());
            string roleName = string.Empty;
            if(currentRole != null)
            {
                roleName = currentRole.Role;
            }
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<Voucher.cloud.Models.DB.Voucher> list = new List<Voucher.cloud.Models.DB.Voucher>();
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[6];
                oEZParams[0] = new SqlParameter("p_Serial", model["Serial"].ToString());
                oEZParams[1] = new SqlParameter("p_VoucherType", Int32.Parse(model["VoucherType"].ToString()) == 0 ?(object)DBNull.Value : Int32.Parse(model["Type"].ToString()));
                oEZParams[2] = new SqlParameter("p_ValidityPeriod", Int32.Parse(model["ValidityPeriod"].ToString()) == 0 ? (object)DBNull.Value : Int32.Parse(model["DefaultValidityPeriod"].ToString()));

                // SellerId
                //oEZParams[3] = new SqlParameter("p_SellerId",roleName.Trim().ToLower() != "seller" ? (object)DBNull.Value: user.Id);
                oEZParams[3] = new SqlParameter("p_SellerId", (object)DBNull.Value);
                // DateFrom
                DateTime dateFrom;
                oEZParams[4] = new SqlParameter("p_DateFrom",DateTime.TryParse(model["fromDate"]?.ToString(), out dateFrom)? (object)dateFrom: (object)DBNull.Value);
                // DateTo
                DateTime dateTo;
                oEZParams[5] = new SqlParameter("p_DateTo",DateTime.TryParse(model["toDate"]?.ToString(), out dateTo)? (object)dateTo: (object)DBNull.Value);
                oEZCommand.CommandText = "Voucher_Get";
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
            try
            {
                QTNHATKYHETHONGDataRepository.Save(user, new Voucher.cloud.Models.DB.QTNHATKYHETHONG() { ChucNang = ChucNang, HanhDong = string.Format(HanhDong, user.UserName2, "xem", "") }, _configuration);
            }
            catch (Exception e)
            {

            }
            return list;
        }
        public async Task<List<VoucherHistory2>> GetVoucherHistory(ApplicationUser user, Guid voucherID)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<VoucherHistory2> list = new List<VoucherHistory2>();
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[1];
                oEZParams[0] = new SqlParameter("p_VoucherID", voucherID);
                oEZCommand.CommandText = "GetVoucherHistory";
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
                        list.Add(Common.CreateItemFromRow2<VoucherHistory2>(row));
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
            catch (Exception e)
            {

            }
            return list;
        }

        public async Task<Voucher.cloud.Models.DB.Voucher> GetDetail(ApplicationUser user, Guid Id)

        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<Voucher.cloud.Models.DB.Voucher> list = new List<Voucher.cloud.Models.DB.Voucher>();
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[1];
                oEZParams[0] = new SqlParameter("@p_Id", Id);
                oEZCommand.CommandText = "VoucherType_GetDetail";
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
            try
            {
                QTNHATKYHETHONGDataRepository.Save(user, new Voucher.cloud.Models.DB.QTNHATKYHETHONG() { ChucNang = ChucNang, HanhDong = string.Format(HanhDong, user.UserName2, "xem", "") }, _configuration);
            }
            catch (Exception e)
            {

            }
            return list.FirstOrDefault();
        }

        public async Task<(int, Voucher.cloud.Models.DB.Voucher)> Save(ApplicationUser user, Voucher.cloud.Models.DB.Voucher row)
        {

            var oldValue =await GetDetail(user, row.RowState == State.Added ? new Guid() : row.Id);
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[28];

                oEZParams[0] = new SqlParameter("p_Moi_Sua", row.RowState == State.Added);
                oEZParams[1] = new SqlParameter("p_Id", row.RowState == State.Added ? new Guid() : row.Id);
                oEZParams[2] = new SqlParameter("p_Serial", row.Serial ?? (object)DBNull.Value);
                oEZParams[3] = new SqlParameter("p_BatchId", row.BatchId ?? (object)DBNull.Value);
                oEZParams[4] = new SqlParameter("p_Status", row.Status );
                oEZParams[5] = new SqlParameter("p_VoucherTypeId", row.VoucherTypeId ?? (object)DBNull.Value);
                oEZParams[6] = new SqlParameter("P_NumberOfUse", row.NumberOfUse );
                oEZParams[7] = new SqlParameter("p_NumberOfFree", row.NumberOfFree);
                oEZParams[8] = new SqlParameter("p_NumberOfUseRemaining", row.NumberOfUseRemaining);
                oEZParams[9] = new SqlParameter("p_NumberOfFreeRemaining", row.NumberOfFreeRemaining);
                oEZParams[10] = new SqlParameter("p_ValidityPeriod", row.ValidityPeriod);
                oEZParams[11] = new SqlParameter("p_SalePrice", row.SalePrice);
                oEZParams[12] = new SqlParameter("p_VoucherType", row.VoucherType);
                oEZParams[13] = new SqlParameter("p_SellerId", row.SellerId ?? (object)DBNull.Value);
                oEZParams[14] = new SqlParameter("p_SaleDate", row.SaleDate ?? (object)DBNull.Value);
                oEZParams[15] = new SqlParameter("p_IndividualCommission", row.IndividualCommission);
                oEZParams[16] = new SqlParameter("p_GroupCommission", row.GroupCommission);
                oEZParams[17] = new SqlParameter("p_ApplicableLocation", row.ApplicableLocation);
                oEZParams[18] = new SqlParameter("p_CoSoCuaHangId", row.CoSoCuaHangId ?? (object)DBNull.Value);
                oEZParams[19] = new SqlParameter("p_KhachHangId", row.KhachHangId ?? (object)DBNull.Value);
                oEZParams[20] = new SqlParameter("p_BuyerName", row.BuyerName ?? (object)DBNull.Value);
                oEZParams[21] = new SqlParameter("p_BuyerPhone", row.BuyerPhone ?? (object)DBNull.Value);
                oEZParams[22] = new SqlParameter("p_BuyerAddress", row.BuyerAddress ?? (object)DBNull.Value);
                oEZParams[23] = new SqlParameter("p_BuyerEmail", row.BuyerEmail ?? (object)DBNull.Value);
                oEZParams[24] = new SqlParameter("p_ActivationDate", row.ActivationDate ?? (object)DBNull.Value);
                oEZParams[25] = new SqlParameter("p_ExpiryDate", row.ExpiryDate ?? (object)DBNull.Value);
                oEZParams[26] = new SqlParameter("p_ModifiedBy", row.Updateby);
                oEZParams[27] = new SqlParameter("p_ModifiedAt", (row.UpdateAt == null ? DateTime.Now : row.UpdateAt));
                
                oEZParams[1].Direction = ParameterDirection.InputOutput;
                oEZParams[1].SqlDbType = SqlDbType.UniqueIdentifier;

                oEZParams[27].Direction = ParameterDirection.InputOutput;
                oEZParams[27].SqlDbType = SqlDbType.DateTime;


                oEZCommand.CommandText = "Voucher_Save";
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
                    row.UpdateAt = (DateTime)oEZParams[27].Value;
                    if(oldValue != null)
                    {
                        await SaveHistory(user, oldValue, row);
                    }
                    QTNHATKYHETHONGDataRepository.Save(user, new Voucher.cloud.Models.DB.QTNHATKYHETHONG() { ChucNang = ChucNang, HanhDong = string.Format(HanhDong, user.UserName2, row.RowState == State.Added ? "thêm" : "sửa", row.Serial) }, _configuration);                       
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



        public async Task SaveHistory(ApplicationUser user, Voucher.cloud.Models.DB.Voucher rowold, Voucher.cloud.Models.DB.Voucher rownew)
        {

            string oldValue = JsonConvert.SerializeObject(rowold);

            string newValue = JsonConvert.SerializeObject(rownew);

            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[5];
                oEZParams[0] = new SqlParameter("p_VoucherID", rownew.Id);
                oEZParams[1] = new SqlParameter("p_DataFieldOld", oldValue);
                oEZParams[2] = new SqlParameter("p_DataFieldNew", newValue);
                oEZParams[3] = new SqlParameter("p_CreatedBy", user.Id);
                oEZParams[4] = new SqlParameter("p_CreatedAt", DateTime.Now);
             
                oEZCommand.CommandText = "VoucherHistory_Save";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.Parameters.AddRange(oEZParams);
                oEZCommand.Parameters.Add("@retValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.ReturnValue;
                oEZCommand.CommandTimeout = 0;

                await oEZCommand.ExecuteNonQueryAsync();
                int status = (int)oEZCommand.Parameters["@retValue"].Value;
                DataAccess.CloseConnection(oEZConn);

            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                _logger.LogError(oEZCommand.CommandText + "  " + ex.Message);
            }
        }
    }
}
