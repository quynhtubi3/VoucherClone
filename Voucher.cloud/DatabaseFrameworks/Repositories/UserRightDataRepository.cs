
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using System.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity;
using Voucher.cloud.DatabaseFrameworks.Interfaces;
using Voucher.cloud.Models.Identity;
using Voucher.cloud.Models;
using Voucher.cloud.Context;
using Voucher.cloud.Commons;

namespace Voucher.cloud.DatabaseFrameworks.Repositories
{
    public class UserRightDataRepository : IUserRightDataRepository
    {
        private readonly IConfiguration _configuration;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        public UserRightDataRepository(IConfiguration configuration, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
        {
            this._configuration = configuration;
            this._userManager = userManager;
            this._roleManager = roleManager;
        }

        public async Task<List<Menu>> GetAllMenu(ApplicationUser user)
        {
            List<Menu> menus = new List<Menu>();

            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[1];
                oEZParams[0] = new SqlParameter("p_UserId", user.Id);

                oEZCommand.CommandText = "Menu_Get";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.Parameters.AddRange(oEZParams);
                oEZCommand.CommandTimeout = 0;

                oEZAdapter.SelectCommand = oEZCommand;
                oEZAdapter.Fill(oEZDataTable);

                DataAccess.CloseConnection(oEZConn);

                foreach (DataRow row in oEZDataTable.Rows)
                {
                    Menu t = Common.CreateItemFromRow<Menu>(row);
                    menus.Add(t);

                    if (t.Id == "4874f1c1-6995-4acc-b8a9-622644eb7404")
                    //if (t.Id == "6e039f39-cb23-49bc-84f2-6703ce9eb45b")
                    {
                        Menu t2 = new Menu();
                        t2.Id = "1acd3efc-0dc4-4756-92a5-e7b28c340752";
                        t2.Type = "L";
                        t2.Bar = "-----";
                        t2.MenuRightType = t.MenuRightType;
                        t2.OrderId = t.OrderId + 1;
                        t2.ParentId = t.ParentId;

                        menus.Add(t2);
                    }
                }
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
            }

            return menus;
        }

        private async Task<string> GetRoleIdAsync(string userId)
        {
            string roleId = "";

            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                IList<string> roleNames = await _userManager.GetRolesAsync(user);
                if (roleNames.Count != 0)
                {
                    var role = await _roleManager.FindByNameAsync(roleNames[0]);
                    roleId = role != null ? role.Id : "";
                }
            }

            return roleId;
        }

        public async Task<object> GetAll(ApplicationUser user, string roleId, string userId)
        {
            List<DmRightModel> rights = new List<DmRightModel>();

            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();
            if (roleId == null)
            {
                roleId = await GetRoleIdAsync(userId);
            }
            try
            {
                SqlParameter[] oEZParams = new SqlParameter[2];
                oEZParams[0] = new SqlParameter("p_RoleId", roleId);
                oEZParams[1] = new SqlParameter("p_UserId", userId);

                oEZCommand.CommandText = "UserRights_GetAll";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.Parameters.AddRange(oEZParams);
                oEZCommand.CommandTimeout = 0;

                oEZAdapter.SelectCommand = oEZCommand;
                oEZAdapter.Fill(oEZDataTable);

                DataAccess.CloseConnection(oEZConn);

                foreach (DataRow row in oEZDataTable.Rows)
                {
                    rights.Add(Common.CreateItemFromRow<DmRightModel>(row));
                }
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
            }

            return rights;
        }

        public int Save(ApplicationUser user, List<UserRights> rows)
        {
            int success = 1;

            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            SqlTransaction oEZTran = oEZConn.BeginTransaction();

            foreach (var row in rows)
            {
                if (row.RowState == State.Modified)
                {
                    if (row.Right_1 && row.Right_2 && row.Right_3 && row.Right_4 && row.Right_5)
                    {
                        if (!this.DeleteRow(oEZConn, oEZTran, row))
                        {
                            success = -1;
                            break;
                        }
                    }
                    else
                    {
                        if (!this.SaveRow(oEZConn, oEZTran, row))
                        {
                            success = -1;
                            break;
                        }
                    }
                }
            }

            if (success == 1)
            {
                oEZTran.Commit();
            }
            else
            {
                oEZTran.Rollback();
            }

            DataAccess.CloseConnection(oEZConn);
            return success;
        }

        private bool SaveRow(SqlConnection conn, SqlTransaction tran, UserRights row)
        {
            SqlParameter[] oEZParams = new SqlParameter[10];

            oEZParams[0] = new SqlParameter("p_IsUser", row.IsUser);
            oEZParams[1] = new SqlParameter("p_UserId", row.UserId);
            oEZParams[2] = new SqlParameter("p_FuncType", row.FuncType);
            oEZParams[3] = new SqlParameter("p_FuncID", row.FuncId);
            oEZParams[4] = new SqlParameter("p_Right_1", row.Right_1);
            oEZParams[5] = new SqlParameter("p_Right_2", row.Right_2);
            oEZParams[6] = new SqlParameter("p_Right_3", row.Right_3);
            oEZParams[7] = new SqlParameter("p_Right_4", row.Right_4);
            oEZParams[8] = new SqlParameter("p_Right_5", row.Right_5);
            oEZParams[9] = new SqlParameter("p_Result", 0);

            oEZParams[9].Direction = ParameterDirection.Output;
            oEZParams[9].SqlDbType = SqlDbType.Int;

            SqlCommand oCommand = new SqlCommand();

            try
            {
                oCommand.CommandText = "UserRights_Save";
                oCommand.CommandType = CommandType.StoredProcedure;
                oCommand.Parameters.AddRange(oEZParams);
                oCommand.CommandTimeout = 0;
                oCommand.Connection = conn;
                oCommand.Transaction = tran;
                oCommand.ExecuteNonQuery();

                return (int)oEZParams[9].Value == 1;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        private bool DeleteRow(SqlConnection conn, SqlTransaction tran, UserRights row)
        {
            SqlParameter[] oEZParams = new SqlParameter[5];

            oEZParams[0] = new SqlParameter("p_IsUser", row.IsUser);
            oEZParams[1] = new SqlParameter("p_UserId", row.UserId);
            oEZParams[2] = new SqlParameter("p_FuncType", row.FuncType);
            oEZParams[3] = new SqlParameter("p_FuncID", row.FuncId);
            oEZParams[4] = new SqlParameter("p_Result", 0);

            oEZParams[4].Direction = ParameterDirection.Output;
            oEZParams[4].SqlDbType = SqlDbType.Int;

            SqlCommand oCommand = new SqlCommand();

            try
            {
                oCommand.CommandText = "UserRights_Delete";
                oCommand.CommandType = CommandType.StoredProcedure;
                oCommand.Parameters.AddRange(oEZParams);
                oCommand.CommandTimeout = 0;
                oCommand.Connection = conn;
                oCommand.Transaction = tran;
                oCommand.ExecuteNonQuery();

                return (int)oEZParams[4].Value == 1;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<object> getPrivilege(ApplicationUser user, string id, string type)
        {
            var roleId = await GetRoleIdAsync(user.Id);
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);

            SqlParameter[] oEZParams = new SqlParameter[4];
            oEZParams[0] = new SqlParameter("p_RoleId", roleId);
            oEZParams[1] = new SqlParameter("p_UserId", user.Id);
            oEZParams[2] = new SqlParameter("p_FuncID", id);
            oEZParams[3] = new SqlParameter("p_FuncType", type);

            SqlCommand oEZCommand = new SqlCommand();

            RightModel right = new RightModel();
            try
            {
                oEZCommand.CommandText = "UserRights_Get";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Parameters.AddRange(oEZParams);
                oEZCommand.Parameters.Add("p_Right_1", System.Data.SqlDbType.Bit).Direction = System.Data.ParameterDirection.Output;
                oEZCommand.Parameters.Add("p_Right_2", System.Data.SqlDbType.Bit).Direction = System.Data.ParameterDirection.Output;
                oEZCommand.Parameters.Add("p_Right_3", System.Data.SqlDbType.Bit).Direction = System.Data.ParameterDirection.Output;
                oEZCommand.Parameters.Add("p_Right_4", System.Data.SqlDbType.Bit).Direction = System.Data.ParameterDirection.Output;
                oEZCommand.Parameters.Add("p_Right_5", System.Data.SqlDbType.Bit).Direction = System.Data.ParameterDirection.Output;
                oEZCommand.CommandTimeout = 0;
                oEZCommand.Connection = oEZConn;

                oEZCommand.ExecuteNonQuery();
                DataAccess.CloseConnection(oEZConn);

                right.Right_1 = (bool)oEZCommand.Parameters["p_Right_1"].Value;
                right.Right_2 = (bool)oEZCommand.Parameters["p_Right_2"].Value;
                right.Right_3 = (bool)oEZCommand.Parameters["p_Right_3"].Value;
                right.Right_4 = (bool)oEZCommand.Parameters["p_Right_4"].Value;
                right.Right_5 = (bool)oEZCommand.Parameters["p_Right_5"].Value;
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
            }

            return right;
        }

        public async Task<bool> getAutoApprove(ApplicationUser user)
        {
            bool result = false;
            var roleId = await GetRoleIdAsync(user.Id);
            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            var funcid = await GetAutoApproveId(user);
            SqlParameter[] oEZParams = new SqlParameter[4];
            oEZParams[0] = new SqlParameter("p_RoleId", roleId);
            oEZParams[1] = new SqlParameter("p_UserId", user.Id);
            oEZParams[2] = new SqlParameter("p_FuncID", funcid);
            oEZParams[3] = new SqlParameter("p_FuncType", "I");

            SqlCommand oEZCommand = new SqlCommand();

            RightModel right = new RightModel();
            try
            {
                oEZCommand.CommandText = "UserRights_Get";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Parameters.AddRange(oEZParams);
                oEZCommand.Parameters.Add("p_Right_1", System.Data.SqlDbType.Bit).Direction = System.Data.ParameterDirection.Output;
                oEZCommand.Parameters.Add("p_Right_2", System.Data.SqlDbType.Bit).Direction = System.Data.ParameterDirection.Output;
                oEZCommand.Parameters.Add("p_Right_3", System.Data.SqlDbType.Bit).Direction = System.Data.ParameterDirection.Output;
                oEZCommand.Parameters.Add("p_Right_4", System.Data.SqlDbType.Bit).Direction = System.Data.ParameterDirection.Output;
                oEZCommand.Parameters.Add("p_Right_5", System.Data.SqlDbType.Bit).Direction = System.Data.ParameterDirection.Output;
                oEZCommand.CommandTimeout = 0;
                oEZCommand.Connection = oEZConn;

                oEZCommand.ExecuteNonQuery();
                DataAccess.CloseConnection(oEZConn);

                return (bool)oEZCommand.Parameters["p_Right_1"].Value;
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
            }

            return result;
        }

        public async Task<string> GetAutoApproveId(ApplicationUser user)
        {
            List<Menu> menus = new List<Menu>();

            SqlConnection oEZConn = DataAccess.CreateConnection(user, _configuration);
            DataTable oEZDataTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                SqlParameter[] oEZParams = new SqlParameter[1];
                oEZParams[0] = new SqlParameter("p_UserId", user.Id);

                oEZCommand.CommandText = "Menu_Get";
                oEZCommand.CommandType = CommandType.StoredProcedure;
                oEZCommand.Connection = oEZConn;
                oEZCommand.Parameters.AddRange(oEZParams);
                oEZCommand.CommandTimeout = 0;

                oEZAdapter.SelectCommand = oEZCommand;
                oEZAdapter.Fill(oEZDataTable);

                DataAccess.CloseConnection(oEZConn);

                foreach (DataRow row in oEZDataTable.Rows)
                {
                    menus.Add(Common.CreateItemFromRow<Menu>(row));
                }
            }
            catch (Exception ex)
            {
                DataAccess.CloseConnection(oEZConn);
            }

            return menus.Where(x=>x.Type.Equals("P")).FirstOrDefault().Id;
        }
    }
}