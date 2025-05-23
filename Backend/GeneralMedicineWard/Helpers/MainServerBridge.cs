using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DotnetAPI.Models;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.IdentityModel.Tokens;

namespace DotnetAPI.Helpers
{
    public class MainServerBridge
    {
        private readonly HttpClient _httpClient;

        public MainServerBridge(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://aleznauerdtc2.azurewebsites.net");
        }

        public async Task SyncMedication(Prescription med, string token)
        {
            _httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.PutAsJsonAsync("/Prescription/UpsertMedication", med);
            response.EnsureSuccessStatusCode();
        }

        public async Task<List<PatientComplete>> FetchPatients(int userId, bool isActive, string token)
        {
            _httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

            string endpoint = $"/PatientComplete/GetPatients/{userId}/{isActive.ToString().ToLower()}";
            var response = await _httpClient.GetAsync(endpoint);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<List<PatientComplete>>();
            return result ?? new List<PatientComplete>();
        }

        public async Task<List<Prescription>> RequestMedication(int medicationId, string token)
        {
            _httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

            string endpoint = $"/Prescription/GetMedicationByMedicationId/{medicationId}";
            var response = await _httpClient.GetAsync(endpoint);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<List<Prescription>>();
            return result ?? new List<Prescription>();
        }
        
    }

}