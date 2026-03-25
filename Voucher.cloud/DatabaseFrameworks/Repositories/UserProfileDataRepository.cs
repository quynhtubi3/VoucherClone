using Voucher.cloud.Commons;
using Voucher.cloud.Context;
using Voucher.cloud.DatabaseFrameworks.Interfaces;
using Voucher.cloud.Models;
using Voucher.cloud.Models.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using Voucher.cloud.Models.DB;
using System;
using System.Collections.Generic;
using System.Data;

namespace Voucher.cloud.DatabaseFrameworks.Repositories
{
    public class UserProfileDataRepository : IUserProfileDataRepository
    {
        private readonly ILogger<UserProfileDataRepository> _logger;
        private readonly HttpContext _httpContext;
        private readonly IConfiguration _configuration;
        private readonly string ChucNang = "Quản lý tài khoản";
        private readonly string HanhDong = "{0} {1} thông tin người dùng {2}";
        public UserProfileDataRepository(ILogger<UserProfileDataRepository> logger, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            this._logger = logger;
            this._httpContext = httpContextAccessor.HttpContext;
            this._configuration = configuration;
        }

        public UserProfile Get(ApplicationUser user, string uid)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            UserProfile list = new UserProfile();
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[1];
                oEZParams[0] = new SqlParameter("Id", new Guid(uid));

                oEZCommand.CommandText = "UserProfile_Get";
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
                        list = Common.CreateItemFromRow<UserProfile>(row);
                        list.Code = list.UserName;
                    }
                }
                //list.PhongBanQuanLy = GetTextMulti(user, uid, "PHONGBANQUANLY_Get");
                //list.NhanVienQuanLy = GetTextMulti(user, uid, "NHANVIENQUANLY_Get");
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                _logger.LogError(oEZCommand.CommandText + "  " + ex.Message);
                return null;
            }
            //QTNHATKYHETHONGDataRepository.Save(user, new Voucher.cloud.Models.DB.QTNHATKYHETHONG() { ChucNang = ChucNang, HanhDong = string.Format(HanhDong, user.UserName2, "xem", "") }, _configuration);
            return list;
        }

        public int UpdateUserFullName(ApplicationUser user, string uid, string fullName)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[2];
                oEZParams[0] = new SqlParameter("Id", new Guid(uid));
                oEZParams[1] = new SqlParameter("HOVATEN", fullName);

                oEZCommand.CommandText = "UserProfile_UpdateUserFullName";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;
                oEZCommand.Parameters.AddRange(oEZParams);
                oEZCommand.Parameters.Add("@retValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.ReturnValue;
                oEZCommand.CommandTimeout = 0;

                oEZCommand.ExecuteNonQuery();
                int status = (int)oEZCommand.Parameters["@retValue"].Value;
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
        public int UpdateUyQuyen(ApplicationUser user, string uid, string TAIKHOANNGANHANG_UYQUYEN, string TENNGANHANG_UYQUYEN, string CHINHANH_UYQUYEN, string GIAYTHANHTOAN_UYQUYEN, string NAMEGIAYTHANHTOAN_UYQUYEN)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[6];
                oEZParams[0] = new SqlParameter("Id", new Guid(uid));
                oEZParams[1] = new SqlParameter("TAIKHOANNGANHANG_UYQUYEN", (object)TAIKHOANNGANHANG_UYQUYEN ?? DBNull.Value);
                oEZParams[2] = new SqlParameter("TENNGANHANG_UYQUYEN", (object)TENNGANHANG_UYQUYEN ?? DBNull.Value);
                oEZParams[3] = new SqlParameter("CHINHANH_UYQUYEN", (object)CHINHANH_UYQUYEN ?? DBNull.Value);
                oEZParams[4] = new SqlParameter("GIAYTHANHTOAN_UYQUYEN", (object)GIAYTHANHTOAN_UYQUYEN ?? DBNull.Value);
                oEZParams[5] = new SqlParameter("NAMEGIAYTHANHTOAN_UYQUYEN", (object)NAMEGIAYTHANHTOAN_UYQUYEN ?? DBNull.Value);

                oEZCommand.CommandText = "UserProfile_Update_Info_UyQuyen";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;
                oEZCommand.Parameters.AddRange(oEZParams);
                oEZCommand.Parameters.Add("@retValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.ReturnValue;
                oEZCommand.CommandTimeout = 0;

                oEZCommand.ExecuteNonQuery();
                int status = (int)oEZCommand.Parameters["@retValue"].Value;
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



        public List<MultiSelectModel> GetTextMulti(ApplicationUser user, string userId, string pro)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<MultiSelectModel> list = new List<MultiSelectModel>();
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[1];
                oEZParams[0] = new SqlParameter("p_UserId", new Guid(userId));

                oEZCommand.CommandText = pro;
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
                        list.Add(Common.CreateItemFromRow<MultiSelectModel>(row));
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

        public int Save(ApplicationUser user, ref UserProfile row, bool action)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlCommand oEZCommand = new SqlCommand();
            SqlTransaction oEZTran = oEZConn.BeginTransaction();
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[15];
                oEZParams[0] = new SqlParameter("p_Moi_Sua", action);
                oEZParams[1] = new SqlParameter("Id", new Guid(row.Id));
                oEZParams[2] = new SqlParameter("HOVATEN", row.HoVaTen);
                oEZParams[3] = new SqlParameter("DIENTHOAI", row.DienThoai);
                oEZParams[4] = new SqlParameter("PHONGBAN_Id", string.IsNullOrEmpty(row.PhongBanId) ? new Guid() : new Guid(row.PhongBanId));
                oEZParams[5] = new SqlParameter("COQUANBO_Id", string.IsNullOrEmpty(row.CoQuanId) ? new Guid() : new Guid(row.CoQuanId));
                oEZParams[6] = new SqlParameter("NGAYSINH", (row.NgaySinh == null ? (object)DBNull.Value : row.NgaySinh));
                oEZParams[7] = new SqlParameter("GIOITINH", row.GioiTinh);
                oEZParams[8] = new SqlParameter("CHUCVU_Id", row.ChucVu_Id == null ? (object)DBNull.Value : new Guid(row.ChucVu_Id));
                oEZParams[9] = new SqlParameter("SOCCCD", row.SoCCCD);
                oEZParams[10] = new SqlParameter("NGAYCAP", (row.NgayCap == null ? (object)DBNull.Value : row.NgayCap));
                oEZParams[11] = new SqlParameter("NOICAP", row.NoiCap);
                oEZParams[12] = new SqlParameter("QUEQUAN", row.QueQuan);
                oEZParams[13] = new SqlParameter("DIACHIHIENTAI", row.DiaChiHienTai);
                oEZParams[14] = new SqlParameter("MANHANVIEN", row.MANHANVIEN);

                oEZParams[1].Direction = ParameterDirection.InputOutput;
                oEZParams[1].SqlDbType = SqlDbType.UniqueIdentifier;


                oEZCommand.CommandText = "UserProfile_Save";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.Transaction = oEZTran;
                oEZCommand.Parameters.AddRange(oEZParams);
                oEZCommand.Parameters.Add("@retValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.ReturnValue;
                oEZCommand.CommandTimeout = 0;

                oEZCommand.ExecuteNonQuery();
                int status = (int)oEZCommand.Parameters["@retValue"].Value;
                if (status != 1)
                {
                    oEZTran.Rollback();
                    DataAccess.CloseConnection(oEZConn);
                    return status;
                }
                oEZTran.Commit();
                DataAccess.CloseConnection(oEZConn);
                QTNHATKYHETHONGDataRepository.Save(user, new Voucher.cloud.Models.DB.QTNHATKYHETHONG() { ChucNang = ChucNang, HanhDong = string.Format(HanhDong, user.UserName2, "sửa", row.HoVaTen) }, _configuration);
                return status;
            }
            catch (Exception ex)
            {
                oEZTran.Rollback();
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

                oEZCommand.CommandText = "BCCONGVIEC_Delete";
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

        public List<UserProfile> Search(ApplicationUser user, JObject model)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<UserProfile> list = new List<UserProfile>();
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[6];
                oEZParams[0] = new SqlParameter("UserName", (model["UserName"] == null || string.IsNullOrEmpty(model["UserName"].ToString())) ? "" : model["UserName"].ToString());
                oEZParams[1] = new SqlParameter("p_HoVaTen", (model["HoVaTen"] == null || string.IsNullOrEmpty(model["HoVaTen"].ToString())) ? "" : model["HoVaTen"].ToString());
                oEZParams[2] = new SqlParameter("DienThoai", (model["DienThoai"] == null || string.IsNullOrEmpty(model["DienThoai"].ToString())) ? "" : model["DienThoai"].ToString());
                oEZParams[3] = new SqlParameter("MaPhongBan", (model["MaPhongBan"] == null || string.IsNullOrEmpty(model["MaPhongBan"].ToString())) ? "" : model["MaPhongBan"].ToString());
                oEZParams[4] = new SqlParameter("TinhTrangCongViec", (model["TinhTrangCongViec"] == null || string.IsNullOrEmpty(model["TinhTrangCongViec"].ToString())) ? "" : model["TinhTrangCongViec"].ToString());
                oEZParams[5] = new SqlParameter("ChucVu", (model["ChucVu"] == null || string.IsNullOrEmpty(model["ChucVu"].ToString())) ? "" : model["ChucVu"].ToString());

                oEZCommand.CommandText = "UserProfile_Search";
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
                        list.Add(Common.CreateItemFromRow<UserProfile>(row));
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

        public List<UserProfile> SearchUyQuyen(ApplicationUser user, JObject model)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<UserProfile> list = new List<UserProfile>();
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[6];
                oEZParams[0] = new SqlParameter("UserName", (model["UserName"] == null || string.IsNullOrEmpty(model["UserName"].ToString())) ? "" : model["UserName"].ToString());
                oEZParams[1] = new SqlParameter("p_HoVaTen", (model["HoVaTen"] == null || string.IsNullOrEmpty(model["HoVaTen"].ToString())) ? "" : model["HoVaTen"].ToString());
                oEZParams[2] = new SqlParameter("DienThoai", (model["DienThoai"] == null || string.IsNullOrEmpty(model["DienThoai"].ToString())) ? "" : model["DienThoai"].ToString());
                oEZParams[3] = new SqlParameter("MaPhongBan", (model["MaPhongBan"] == null || string.IsNullOrEmpty(model["MaPhongBan"].ToString())) ? "" : model["MaPhongBan"].ToString());
                oEZParams[4] = new SqlParameter("TinhTrangCongViec", (model["TinhTrangCongViec"] == null || string.IsNullOrEmpty(model["TinhTrangCongViec"].ToString())) ? "" : model["TinhTrangCongViec"].ToString());
                oEZParams[5] = new SqlParameter("ChucVu", (model["ChucVu"] == null || string.IsNullOrEmpty(model["ChucVu"].ToString())) ? "" : model["ChucVu"].ToString());

                oEZCommand.CommandText = "UserProfile_Search_UyQuyen";
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
                        list.Add(Common.CreateItemFromRow<UserProfile>(row));
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



        public List<UserProfile> GetAll(ApplicationUser user)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<UserProfile> list = new List<UserProfile>();
            try
            {
                oEZCommand.CommandText = "UserProfile_GetAll";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;
                //oEZCommand.Parameters.AddRange(oEZParams);

                oEZAdapter.SelectCommand = oEZCommand;
                oEZAdapter.Fill(oEZDataTable);

                DataAccess.CloseConnection(oEZConn);


                if (oEZDataTable != null)
                {
                    foreach (DataRow row in oEZDataTable.Rows)
                    {
                        UserProfile t = Common.CreateItemFromRow<UserProfile>(row);
                        t.Code = t.UserName;

                        list.Add(t);
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



        public List<UserPrivilege> GetListUserPrivilege(ApplicationUser user)
        {
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            List<UserPrivilege> list = new List<UserPrivilege>();
            try
            {
                string SQLCmd = @"select * from UserPrivilege";                                   

                oEZCommand.CommandText = SQLCmd;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;

                oEZAdapter.SelectCommand = oEZCommand;
                oEZAdapter.Fill(oEZDataTable);

                DataAccess.CloseConnection(oEZConn);


                if (oEZDataTable != null)
                {
                    foreach (DataRow row in oEZDataTable.Rows)
                    {
                        UserPrivilege t = Common.CreateItemFromRow<UserPrivilege>(row);
                        
                        list.Add(t);                        
                    }
                }
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
                return null;
            }

            return list;
        }

    }
}