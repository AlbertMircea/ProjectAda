using System.Data;
using Dapper;
using DotnetAPI.Data;
using DotnetAPI.Dtos;
using DotnetAPI.Hubs;
using DotnetAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace DotnetAPI.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class PrescriptionController : ControllerBase
{
    DataContextDapper _dapper;
    private readonly IHubContext<NotificationHub> _hubContext;

    public PrescriptionController(IConfiguration config, IHubContext<NotificationHub> hubContext)
    {
        _dapper = new DataContextDapper(config);
        _hubContext = hubContext;
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
        string sql = @"EXEC TutorialAppSchema.spMedication_GetByUserId ";
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
        string sql = @"EXEC TutorialAppSchema.spMedication_GetByMedicationId ";
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

    [HttpPut("UpsertMedicationRequest")]
    public async Task<IActionResult> UpsertMedicationRequestAsync(RequestPrescription request)
    {
        string sql = @" EXEC TutorialAppSchema.spMedicationRequest_Upsert
                @PatientId = '" + request.PatientId +
                "', @NurseId = '" + request.NurseId +
                "', @MedicationId = '" + request.MedicationId +
                "', @Quantity = '" + request.Quantity +
                "', @Status = '" + request.Status + "'";
        _dapper.ExecuteSql(sql);

        await _hubContext.Clients.All.SendAsync("ReceiveMessage", "New prescription received!");
        return Ok("Medication request upserted successfully.");

    }

    [HttpGet("GetAllMedicationRequests")]
    public IEnumerable<RequestPrescription> GetAllTransportRequests()
    {
        string sql = @"SELECT * FROM TutorialAppSchema.MedicationRequest";
        return _dapper.LoadData<RequestPrescription>(sql);

        throw new Exception("Failed to Get Medication Requests");
    }

    [HttpDelete("MedicationRequestDelete/{requestId}")]
    public IActionResult DeleteRequestMedication(int requestId)
    {
        string sql = @"EXEC TutorialAppSchema.spMedicationRequest_Delete @RequestId =" + requestId.ToString();

        if (_dapper.ExecuteSql(sql))
        {
            return Ok();
        }

        throw new Exception("Failed to Delete Requested Medication");
    }


}
