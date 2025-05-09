using DotnetAPI.Data;
using DotnetAPI.Dtos;
using DotnetAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotnetAPI.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class UserCompleteController : ControllerBase
{
    DataContextDapper _dapper;
    public UserCompleteController(IConfiguration config)
    {
        _dapper = new DataContextDapper(config);
    }
    
    [HttpGet("GetUsers/{userId}/{isActive}")]
    public IEnumerable<UserComplete> GetUsers(int userId=0, bool isActive=false)
    {
        string sql = @"EXEC TutorialAppSchema.spUsers_Get";
        string parameters = "";
        if(userId != 0)
        {
            parameters += ", @UserId = " + userId.ToString();
        }
        
        parameters += ", @Active = " + isActive.ToString();

        if(parameters.Length > 0)
            sql += parameters.Substring(1);

        return _dapper.LoadData<UserComplete>(sql);
    }


    [HttpPut("UpsertUser")]
    public IActionResult UpsertUser(UserComplete user)
    {
        string sql = @" EXEC TutorialAppSchema.spUser_Upsert
                @FirstName = '" + user.FirstName + 
                "', @LastName = '" + user.LastName +
                "', @Email = '" + user.Email + 
                "', @Gender = '" + user.Gender + 
                "', @Active = '" + user.Active + 
                "', @JobTitle = '" + user.JobTitle + 
                "', @Department = '" + user.Department + 
                "', @Salary = '" + user.Salary + 
                "', @UserId = " + user.UserId;
        
        Console.WriteLine(sql);

        if (_dapper.ExecuteSql(sql))
        {
            return Ok();
        } 

        throw new Exception("Failed to Update User");
    }


    [HttpDelete("UserDelete/{userId}")]
    public IActionResult DeleteUser(int userId)
    {
        string sql = @"EXEC TutorialAppSchema.spUser_Delete @UserId =" + userId.ToString();
        
        if (_dapper.ExecuteSql(sql))
        {
            return Ok();
        } 

        throw new Exception("Failed to Delete User");
    }

}
