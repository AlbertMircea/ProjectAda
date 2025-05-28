using System.ComponentModel;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Dapper;
using DotnetAPI.Data;
using DotnetAPI.Dtos;
using DotnetAPI.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;

namespace DotnetAPI.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase{

    private readonly DataContextDapper _dapper;
    private readonly AuthHelper _authHelper;

    public AuthController(IConfiguration config)
    {
        _dapper = new DataContextDapper(config);
        _authHelper = new AuthHelper(config);
    }

    [AllowAnonymous]
    [HttpPost("Register")]
    public IActionResult Register(UserForRegistrationDto userForRegistration)
    {
        if(userForRegistration.Password == userForRegistration.PasswordConfirm)
        {
            string sql = "SELECT Email FROM TutorialAppSchema.Auth WHERE Email = '" + userForRegistration.Email + "'";
            IEnumerable<string> existingUsers = _dapper.LoadData<string>(sql);

            if(existingUsers.Count() == 0)
            {
                if(_authHelper.SetPassword(userForRegistration))
                    return Ok();
                throw new Exception("Failed to Add Patient!");
            }
            throw new Exception("Patient already exists!");
            
        }
        throw new Exception("Password do not match!");
    }

    [HttpPut("ResetPassword")]
    public IActionResult ResetPassword(UserForRegistrationDto userForSetPassword)
    {
        if(_authHelper.SetPassword(userForSetPassword))
        {
            return Ok();
        }
        
        throw new Exception("Failed to update password!");
    }
    
    [AllowAnonymous]
    [HttpGet("GetAuthenticatedUsers")]
    public  IEnumerable<User> GetAuthenticatedUsers()
    {
        string sql = "SELECT * FROM TutorialAppSchema.Auth";
        return _dapper.LoadData<User>(sql);
    }

    [HttpGet("GetUser/{userId}")]
    public User GetUser(int userId)
    {
        string sql = "SELECT * FROM TutorialAppSchema.Auth WHERE UserId = " + userId.ToString();
        return _dapper.LoadDataSingle<User>(sql);
    }


    [AllowAnonymous]
    [HttpPost("Login")]
    public IActionResult Login(UserForLoginDto userForLogin)
    {
        string sqlForHashAndSalt = @"EXEC TutorialAppSchema.spLoginConfirmation_Get 
                                        @Email = @EmailParam";

        DynamicParameters sqlParameters = new DynamicParameters();

        sqlParameters.Add("@EmailParam", userForLogin.Email, DbType.String);

        UserForLoginConfirmationDto userForConfirmation = _dapper
            .LoadDataSingleWithParameters<UserForLoginConfirmationDto>(sqlForHashAndSalt, sqlParameters);

        byte[] passwordHash = _authHelper.GetPasswordHash(userForLogin.Password, userForConfirmation.PasswordSalt);

        //if(passwordHash == userForConfirmation.PasswordHash) // won't work

        for(int index = 0; index<passwordHash.Length; index++)
        {
            if(passwordHash[index] != userForConfirmation.PasswordHash[index])
            {
                return StatusCode(401, "Incorrect password!");
            }
        }

        string userIdSql = "SELECT [UserId] FROM TutorialAppSchema.Auth where Email='" + userForLogin.Email + "'";

        int userId = _dapper.LoadDataSingle<int>(userIdSql);

        return Ok(new Dictionary<string,string>{
            {"token", _authHelper.CreateToken(userId)}
        });
    }

    [HttpGet("RefreshToken")]
    public IActionResult RefreshToken()
    {
        string userIdString = User.FindFirst("userId")?.Value + "";
        string userIdSql = "SELECT [UserId] FROM TutorialAppSchema.Auth where UserId='" + userIdString + "'";

        int userId = _dapper.LoadDataSingle<int>(userIdSql);

        return Ok(new Dictionary<string,string>{
            {"token", _authHelper.CreateToken(userId)}
            });

    }

}