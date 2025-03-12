using BusinessObject.Models;

namespace Services.Interface
{
    public interface IChatService
    {
        Task<List<Chat>> GetChatsBetweenUsersAsync(int fromAccountId, int toAccountId);

        Task ChatAsync(Chat chat);
    }
}