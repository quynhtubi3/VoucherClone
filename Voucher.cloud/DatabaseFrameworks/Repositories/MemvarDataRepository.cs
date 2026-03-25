using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using System.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Voucher.cloud.DatabaseFrameworks.Interfaces;
using Voucher.cloud.Models;
using Voucher.cloud.Models.Identity;
using Voucher.cloud.Commons;
using Voucher.cloud.Context;
using Voucher.cloud.Models.DB;

namespace Voucher.cloud.DatabaseFrameworks.Repositories
{
    public class MemvarDataRepository : IMemvarDataRepository
    {
        private readonly ILogger<MemvarDataRepository> _logger;
        private readonly HttpContext _httpContext;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        public MemvarDataRepository(IWebHostEnvironment env, ILogger<MemvarDataRepository> logger, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            this._logger = logger;
            this._httpContext = httpContextAccessor.HttpContext;
            this._configuration = configuration;
            this._env = env;
        }

        public async Task<UservarModel> GetUservar(ApplicationUser user)
        {            
            return new UservarModel() { BillingualLanguage = 0, Has_Avatar = System.IO.File.Exists(Common.GetImagePath(user, _env.WebRootPath, "UserList", user.Id)), Theme = "s3t-theme1" };
        }

        public async Task<SystemvarModel> GetSystemvar(ApplicationUser user)
        {
            DataTable table = GetMemvarFromStored(user);

            List<Memvar> list = new List<Memvar>();
            if (table != null)
            {
                foreach (DataRow row in table.Rows)
                {
                    list.Add(Common.CreateItemFromRow<Memvar>(row));
                }
            }

            SystemvarModel systemvarModel = new SystemvarModel();
            foreach (var memvar in list)
            {                
                if (memvar.Var_Name.Equals("KhauTruCaNhan"))
                {
                    if (!string.IsNullOrEmpty(memvar.Var_Value))
                    {
                        try
                        {
                            systemvarModel.KhauTruCaNhan = decimal.Parse(memvar.Var_Value);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex.Message);
                        }
                    }
                }
                if (memvar.Var_Name.Equals("KhauTruNguoiPhuThuoc"))
                {
                    if (!string.IsNullOrEmpty(memvar.Var_Value))
                    {
                        try
                        {
                            systemvarModel.KhauTruNguoiPhuThuoc = decimal.Parse(memvar.Var_Value);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex.Message);
                        }
                    }
                }
                if (memvar.Var_Name.Equals("MucDongBHXH"))
                {
                    if (!string.IsNullOrEmpty(memvar.Var_Value))
                    {
                        try
                        {
                            systemvarModel.MucDongBHXH = decimal.Parse(memvar.Var_Value);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex.Message);
                        }
                    }
                }
                if (memvar.Var_Name.Equals("MucDongBHYT"))
                {
                    if (!string.IsNullOrEmpty(memvar.Var_Value))
                    {
                        try
                        {
                            systemvarModel.MucDongBHYT = decimal.Parse(memvar.Var_Value);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex.Message);
                        }
                    }
                }
                if (memvar.Var_Name.Equals("MucDongBHTN"))
                {
                    if (!string.IsNullOrEmpty(memvar.Var_Value))
                    {
                        try
                        {
                            systemvarModel.MucDongBHTN = decimal.Parse(memvar.Var_Value);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex.Message);
                        }
                    }
                }
                if (memvar.Var_Name.Equals("MucDongCongDoan"))
                {
                    if (!string.IsNullOrEmpty(memvar.Var_Value))
                    {
                        try
                        {
                            systemvarModel.MucDongCongDoan = decimal.Parse(memvar.Var_Value);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex.Message);
                        }
                    }
                }
                if (memvar.Var_Name.Equals("SoNgayKhoa"))
                {
                    if (!string.IsNullOrEmpty(memvar.Var_Value))
                    {
                        try
                        {
                            systemvarModel.SoNgayKhoa = decimal.Parse(memvar.Var_Value);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex.Message);
                        }
                    }
                }
            }
            return systemvarModel;
        }

        public List<GioCongCapBacModel> GetListGioCongCapBac(ApplicationUser user)
        {
            List<GioCongCapBacModel> list = new List<GioCongCapBacModel>();

            try
            {
                DataTable table = GetMemvarFromStored(user);

                List<Memvar> list2 = new List<Memvar>();
                if (table != null)
                {
                    foreach (DataRow row in table.Rows)
                    {
                        list2.Add(Common.CreateItemFromRow<Memvar>(row));
                    }
                }

                foreach (var item in list2)
                {
                    if (!string.IsNullOrEmpty(item.Var_Value) && item.Var_Name.Length == 1)
                    {
                        try
                        {
                            GioCongCapBacModel t = new GioCongCapBacModel();

                            t.CapBac = item.Var_Name.Trim();
                            t.GioCong = decimal.Parse(item.Var_Value.Trim());

                            list.Add(t);
                        }
                        catch (Exception ex)
                        {

                        }
                    }
                }

                list = list.OrderBy(p => p.GioCong).ToList();
            }
            catch(Exception ex)
            {

            }

            return list;
        }

        public int GetSoNgayKhoaBC(ApplicationUser user)
        {
            int iSoNgayKhoaBC = -1;

            try
            {
                DataTable table = GetMemvarFromStored(user);

                List<Memvar> list2 = new List<Memvar>();
                if (table != null)
                {
                    foreach (DataRow row in table.Rows)
                    {
                        list2.Add(Common.CreateItemFromRow<Memvar>(row));
                    }
                }

                foreach (var item in list2)
                {
                    if (item.Var_Name == "SoNgayKhoaBC")
                    {
                        try
                        {
                            iSoNgayKhoaBC = Convert.ToInt32(item.Var_Value.Trim());
                        }
                        catch (Exception ex)
                        {

                        }
                    }
                }                
            }
            catch (Exception ex)
            {

            }

            return iSoNgayKhoaBC;
        }

        private DataTable GetMemvarFromStored(ApplicationUser user)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                oEZCommand.CommandText = "Memvar_Get";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;

                oEZAdapter.SelectCommand = oEZCommand;
                oEZAdapter.Fill(oEZDataTable);

                DataAccess.CloseConnection(oEZConn);

                return oEZDataTable;
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                _logger.LogError(oEZCommand.CommandText + "  " + ex.Message);
                return null;
            }
        }

        public void SetMemvar(ApplicationUser user, Memvar memvar)
        {
            SqlParameter[] oEZParams = new SqlParameter[2];

            oEZParams[0] = new SqlParameter()
            {
                ParameterName = "@p_Var_Name",
                Value = memvar.Var_Name,
                SqlDbType = SqlDbType.NVarChar
            };
            oEZParams[1] = new SqlParameter()
            {
                ParameterName = "@p_Var_Value",
                Value = memvar.Var_Value,
                SqlDbType = SqlDbType.NVarChar
            };

            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                oEZCommand.CommandText = "Memvar_Save";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;
                oEZCommand.Parameters.AddRange(oEZParams);
                oEZCommand.ExecuteNonQuery();
                DataAccess.CloseConnection(oEZConn);
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
            }
        }
    }
}