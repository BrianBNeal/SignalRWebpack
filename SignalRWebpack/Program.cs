using SignalRWebpack.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

//bearer token auth is built in
//https://learn.microsoft.com/en-us/aspnet/core/signalr/authn-and-authz?view=aspnetcore-8.0#built-in-jwt-authentication
//builder.Services.AddAuthentication().AddJwtBearer()

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

//app.UseAuthentication();
//app.UseAuthorization();

app.MapHub<ChatHub>("/hub");

app.Run();
