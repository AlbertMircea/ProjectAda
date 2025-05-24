using Microsoft.AspNetCore.SignalR;

namespace DotnetAPI.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.User(user).SendAsync("ReceiveMessage", message);
        }
    }
}
