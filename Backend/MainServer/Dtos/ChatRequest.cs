using Microsoft.Identity.Client;

namespace DotnetAPI.Dtos
{
    public class ChatRequest
    {
        public string Message { get; set; }
        public ChatRequest()
        {
            if (Message == null)
            {
                Message = "";
            }

        }

    }
}
