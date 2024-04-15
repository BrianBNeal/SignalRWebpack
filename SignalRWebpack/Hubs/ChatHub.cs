using Microsoft.AspNetCore.SignalR;

namespace SignalRWebpack.Hubs;

//define what methods the Clients need to have, the names matching the string used by the client code
public interface IChatHubClient
{
    Task ReceiveMessageNotification(string user, string message);
    //this is a wrapper that calls SendAsync and passes in the wrapper method name as a string
}

public class ChatHub : Hub<IChatHubClient>
{
    public async Task NewMessageEndPoint(string user, string message) =>
        await Clients.All.ReceiveMessageNotification(user, message); //compare to NewMessageEndpoint below
    //SendAsync is unavailable in strongly typed hubs, always use the interface

    public override async Task OnConnectedAsync()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "My Group Name");
        await base.OnConnectedAsync();
    }
}

public class ChatHub2 : Hub //inherits without strong typing of client
{
    public async Task NewMessageEndPoint(string user, string message)
    => await Clients.All.SendAsync("ReceiveMessageNotification", user, message); //you have to pass a string for the method name yuck!

    public async Task SendMessageToCaller(string user, string message)
        => await Clients.Caller.SendAsync("ReceiveMessage", user, message);

    public async Task SendMessageToGroup(string user, string message)
        => await Clients.Group("My Group Name").SendAsync("ReceiveMessage", user, message);
}