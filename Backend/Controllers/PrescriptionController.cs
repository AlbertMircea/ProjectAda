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
