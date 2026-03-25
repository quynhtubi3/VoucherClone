using Voucher.cloud.Models.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Voucher.cloud.Context
{
    public static class DataAccess
    {
        public static SqlConnection CreateConnection(ApplicationUser user, IConfiguration configuration)
        {
            try
            {
                string connectionString = String.Format(configuration.GetConnectionString("TemplateConnection"), user.Server, user.Database);
               
                
                SqlConnection conn = new SqlConnection(connectionString);

                conn.Open();
                return conn;
            }
            catch (Exception ex)
            {
            }

            return null;
        }

        public static void CloseConnection(SqlConnection conn)
        {
            if (conn == null || conn.State == ConnectionState.Closed)
            {
                return;
            }
            try
            {
                conn.Close();
            }
            catch (Exception ex)
            {

            }
            return;
        }

        public static bool RunSQLCommand(ApplicationUser user, IConfiguration configuration, string SQLCmd)
        {
            SqlConnection oEZConn = CreateConnection(user, configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                oEZCommand.CommandText = SQLCmd;
                oEZCommand.CommandType = CommandType.Text;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;

                oEZCommand.ExecuteNonQuery();

                CloseConnection(oEZConn);
                return true;
            }
            catch (Exception ex)
            {
                CloseConnection(oEZConn);
                return false;
            }
        }

        public static int RunImportCommand(ApplicationUser user, IConfiguration configuration, string SQLCmd)
        {
            SqlConnection oEZConn = CreateConnection(user, configuration);
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                oEZCommand.CommandText = SQLCmd;
                oEZCommand.CommandType = CommandType.Text;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;
                oEZCommand.Parameters.Add("@retValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;

                oEZCommand.ExecuteNonQuery();

                CloseConnection(oEZConn);
                return (int)oEZCommand.Parameters["@retValue"].Value;
            }
            catch (Exception ex)
            {
                CloseConnection(oEZConn);
                return 0;
            }
        }

        public static DataTable GetTableSQLCommand(ApplicationUser user, IConfiguration configuration, string ps_SQLCommand)
        {
            SqlConnection oEZConn = CreateConnection(user, configuration);
            DataTable oEZTable = new DataTable();
            SqlDataAdapter oEZAdapter = new SqlDataAdapter();
            SqlCommand oEZCommand = new SqlCommand();

            try
            {
                oEZCommand.CommandText = ps_SQLCommand;
                oEZCommand.CommandType = CommandType.Text;
                oEZCommand.Connection = oEZConn;
                oEZCommand.CommandTimeout = 0;

                oEZAdapter.SelectCommand = oEZCommand;
                oEZAdapter.Fill(oEZTable);

                CloseConnection(oEZConn);
                return oEZTable;
            }
            catch (Exception ex)
            {
                CloseConnection(oEZConn);
                return null;
            }
        }
    }
}
