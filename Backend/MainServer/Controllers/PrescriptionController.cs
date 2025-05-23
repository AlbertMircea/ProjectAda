using DotnetAPI.Data;
using DotnetAPI.Dtos;
using DotnetAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotnetAPI.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class PrescriptionController : ControllerBase
{
    DataContextDapper _dapper;
    public PrescriptionController(IConfiguration config)
    {
        _dapper = new DataContextDapper(config);
    }

   
    [HttpPut("UpsertMedication")]
    public IActionResult UpsertMedication(Prescription medication)
    {
        string sql = @" EXEC TutorialAppSchema.spMedication_Upsert
                @Medication = '" + medication.Medication +
                "', @Dosage = '" + medication.Dosage +
                "', @Quantity = '" + medication.Quantity +
                "', @UserId = '" + medication.UserId +
                "', @MedicationId = '" + medication.MedicationId + "'";

        if (_dapper.ExecuteSql(sql))
        {
            return Ok();
        }

        throw new Exception("Failed to Update Medication");
    }

    [HttpGet("GetMedicationByUserId/{userId}")]
    public IEnumerable<Prescription> GetMedicationByUser(int userId = 0)
    {
        string sql = @"EXEC TutorialAppSchema.spMedication_Get ";
        string parameters = "";
        if (userId != 0)
        {
            parameters += " @UserId = " + userId.ToString();
        }

        if (parameters.Length > 0)
            sql += parameters.Substring(1);

        return _dapper.LoadData<Prescription>(sql);

        throw new Exception("Failed to Get Medications");
    }

    [HttpGet("GetMedicationByMedicationId/{medicationId}")]
    public IEnumerable<Prescription> GetMedicationByMedication(int medicationId = 0)
    {
        string sql = @"EXEC TutorialAppSchema.spMedication_Request ";
        string parameters = "";
        if (medicationId != 0)
        {
            parameters += " @MedicationId = " + medicationId.ToString();
        }

        if (parameters.Length > 0)
            sql += parameters.Substring(1);

        return _dapper.LoadData<Prescription>(sql);

        throw new Exception("Failed to Get Medications");
    }



    [HttpDelete("MedicationDelete/{medicationId}")]
    public IActionResult DeleteMedication(int medicationId)
    {
        string sql = @"EXEC TutorialAppSchema.spMedication_Delete @MedicationId =" + medicationId.ToString();

        if (_dapper.ExecuteSql(sql))
        {
            return Ok();
        }

        throw new Exception("Failed to Delete Patient");
    }

}
