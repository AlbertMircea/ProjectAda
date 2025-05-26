using Microsoft.Identity.Client;

namespace DotnetAPI.Dtos
{
    public class StatusUpdateDto
    {
        public string Status { get; set; }
        public StatusUpdateDto()
        {
            if (Status == null)
            {
                Status = "";
            }

        }

    }
}
