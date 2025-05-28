using DotnetAPI.Data;
using DotnetAPI.Dtos;
using DotnetAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotnetAPI.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class PatientCompleteController : ControllerBase
{
    DataContextDapper _dapper;
    public PatientCompleteController(IConfiguration config)
    {
        _dapper = new DataContextDapper(config);
    }

    [HttpGet("GetPatients/{userId}/{isActive}")]
    public IEnumerable<PatientComplete> GetPatients(int userId = 0, bool isActive = false)
    {
        string sql = @"EXEC TutorialAppSchema.spPatient_Get";
        string parameters = "";
        if (userId != 0)
        {
            parameters += ", @UserId = " + userId.ToString();
        }

        parameters += ", @Active = " + isActive.ToString();

        if (parameters.Length > 0)
            sql += parameters.Substring(1);

        return _dapper.LoadData<PatientComplete>(sql);
    }

    [HttpGet("GetPatient/{userId}")]
    public Patient GetPatient(int userId)
    {
        string sql = @"SELECT * FROM TutorialAppSchema.Patients WHERE UserId = " + userId.ToString();
        return _dapper.LoadDataSingle<Patient>(sql);
    }

    [HttpGet("GetOnlyPatients")]
    public IEnumerable<Patient> GetOnlyPatients()
    {
        string sql = @"SELECT * FROM TutorialAppSchema.Patients";
        return _dapper.LoadData<Patient>(sql);
    }


    [HttpPut("UpsertPatient")]
    public IActionResult UpsertUser(Patient patient)
    {
        string sql = @" EXEC TutorialAppSchema.spPatient_Upsert
                @FirstName = '" + patient.FirstName +
                "', @LastName = '" + patient.LastName +
                "', @Email = '" + patient.Email +
                "', @Gender = '" + patient.Gender +
                "', @Active = '" + patient.Active +
                "', @DoctorID = '" + patient.DoctorID +
                "', @Ward = '" + patient.Ward +
                "', @Room = '" + patient.Room +
                "', @UserId = " + patient.UserId;


        if (_dapper.ExecuteSql(sql))
        {
            return Ok();
        }

        throw new Exception("Failed to Update Patient");
    }

    
    [HttpDelete("PatientDelete/{userId}")]
    public IActionResult DeleteUser(int userId)
    {
        string sql = @"EXEC TutorialAppSchema.spPatient_Delete @UserId =" + userId.ToString();

        if (_dapper.ExecuteSql(sql))
        {
            return Ok();
        }

        throw new Exception("Failed to Delete Patient");
    }

}
