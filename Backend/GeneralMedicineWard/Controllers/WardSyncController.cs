
using DotnetAPI.Helpers;
using DotnetAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace DotnetAPI.Controllers;


[ApiController]
[Route("[controller]")]
public class WardSyncController : ControllerBase
{
    private readonly MainServerBridge _bridge;

    public WardSyncController(MainServerBridge bridge)
    {
        _bridge = bridge;
    }

    [HttpPost("push-medication")]
    public async Task<IActionResult> PushMedication([FromBody] Prescription med, [FromHeader(Name = "Authorization")] string authHeader)
    {
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            return Unauthorized("Missing or invalid Authorization header");

        var token = authHeader.Substring("Bearer ".Length);
        System.Console.WriteLine(token);
        await _bridge.SyncMedication(med, token);
        return Ok("Synced to main server.");
    }

    [HttpGet("get-patients/{userId}/{isActive}")]
    public async Task<IActionResult> GetPatients(
    int userId,
    bool isActive,
    [FromHeader(Name = "Authorization")] string authHeader)
    {
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            return Unauthorized("Missing or invalid Authorization header");

        var token = authHeader.Substring("Bearer ".Length);
        var patients = await _bridge.FetchPatients(userId, isActive, token);
        return Ok(patients);
    }
}
