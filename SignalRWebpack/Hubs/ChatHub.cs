using Microsoft.AspNetCore.SignalR;

namespace SignalRWebpack.Hubs;

public class ChatHub : Hub
{
    public async Task NewMessage(long username, string message) =>
        await Clients.All.SendAsync("messageReceived", username, message);

    public async Task UserTyping(long username) =>
        await Clients.Others.SendAsync("userTyping", username);
}
