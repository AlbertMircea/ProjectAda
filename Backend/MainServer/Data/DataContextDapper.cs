using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DotnetAPI.Data
{

    public class DataContextDapper
    {
        
        private string? _connectionString;
        public DataContextDapper(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection");;
        }
        public IEnumerable<T> LoadData<T>(string sql)
        {
            IDbConnection dbConnection = new SqlConnection(_connectionString);
            return dbConnection.Query<T>(sql);
        }

        public T LoadDataSingle<T>(string sql)
        {
            IDbConnection dbConnection = new SqlConnection(_connectionString);
            return dbConnection.QuerySingle<T>(sql);
        }

        public bool ExecuteSql(string sql)
        {
            IDbConnection dbConnection = new SqlConnection(_connectionString);
            return (dbConnection.Execute(sql)>0);
        }
        
        public int ExecuteSqlWithRowCount(string sql)
        {
            IDbConnection dbConnection = new SqlConnection(_connectionString);
            return dbConnection.Execute(sql);
        }

        public bool ExecuteSqlWithParameters(string sql, DynamicParameters parameters)
        {
            IDbConnection dbConnection = new SqlConnection(_connectionString);
            return dbConnection.Execute(sql, parameters)>0;
        }

        
        public IEnumerable<T> LoadDataWithParameters<T>(string sql, DynamicParameters parameters)
        {
            IDbConnection dbConnection = new SqlConnection(_connectionString);
            return dbConnection.Query<T>(sql,parameters);
        }

        public T LoadDataSingleWithParameters<T>(string sql,DynamicParameters parameters)
        {
            IDbConnection dbConnection = new SqlConnection(_connectionString);
            return dbConnection.QuerySingle<T>(sql,parameters);
        }

    }
}