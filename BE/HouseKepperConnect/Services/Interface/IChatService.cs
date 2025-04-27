using BusinessObject.Models;

namespace Services.Interface
{
    public interface IChatService
    {
        Task<List<Chat>> GetChatsBetweenUsersAsync(int fromAccountId, int toAccountId);
        Task<List<Chat>> GetChatUsersByUserAsync(int fromAccountId);

        Task ChatAsync(Chat chat);
    }
}