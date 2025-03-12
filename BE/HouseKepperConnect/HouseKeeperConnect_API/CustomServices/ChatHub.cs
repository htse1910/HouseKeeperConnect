using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace HouseKeeperConnect_API.CustomServices
{
    public class ChatHub : Hub
    {
        private static readonly ConcurrentDictionary<int, string> _connectedUsers = new();

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = _connectedUsers.FirstOrDefault(x => x.Value == Context.ConnectionId).Key;
            if (userId != 0)
            {
                _connectedUsers.TryRemove(userId, out _);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task ConnectUser(int userId)
        {
            if (userId <= 0) throw new ArgumentException("Invalid user ID.");

            _connectedUsers[userId] = Context.ConnectionId;
            await Clients.Caller.SendAsync("Connected", userId);
        }

        public async Task SendMessage(int fromAccountId, int toAccountId, string message)
        {
            if (string.IsNullOrWhiteSpace(message)) return;

            if (_connectedUsers.TryGetValue(toAccountId, out string toConnectionId))
            {
                await Clients.Client(toConnectionId).SendAsync("ReceiveMessage", fromAccountId, message);
            }
        }
    }
}
